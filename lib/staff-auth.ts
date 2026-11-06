export const staffEmail='cleaningsolutionstnt@gmail.com';
const cookieName='__Host-tnt_staff';
const encoder=new TextEncoder();
export function authReady(e:any){return typeof e.ADMIN_PASSWORD==='string'&&e.ADMIN_PASSWORD.length>=16&&e.ADMIN_PASSWORD.length<=512}
async function key(secret:string){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])}
async function signature(secret:string,text:string){return crypto.subtle.sign('HMAC',await key(secret),encoder.encode(text))}
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('')}
export async function passwordMatches(secret:string,input:string){return crypto.subtle.verify('HMAC',await key(input),await signature(secret,'TNT password verification'),encoder.encode('TNT password verification'))}
export async function sessionKey(secret:string,token:string){return hex(await signature(secret,token))}
function tokenFrom(req:Request){return (req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||''}
async function schema(e:any){await e.DB.batch([e.DB.prepare('CREATE TABLE IF NOT EXISTS staff_sessions (id TEXT PRIMARY KEY, expires INTEGER NOT NULL)'),e.DB.prepare('CREATE TABLE IF NOT EXISTS staff_login_limits (id TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires INTEGER NOT NULL)')])}
export async function isStaff(req:Request,e:any){if(!authReady(e))return false;const token=tokenFrom(req);if(!/^[a-f0-9]{64}$/.test(token))return false;await schema(e);const row=await e.DB.prepare('SELECT expires FROM staff_sessions WHERE id=?').bind(await sessionKey(e.ADMIN_PASSWORD,token)).first();return !!row&&row.expires>Date.now()}
const reply=(data:any,status=200,cookie?:string)=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
export async function staffAuth(req:Request,e:any){
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 if(req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Invalid request origin'},403);
 if(!authReady(e))return reply({error:'Staff sign-in setup is pending. Please contact the website owner.'},503);
 await schema(e);const now=Date.now();await e.DB.batch([e.DB.prepare('DELETE FROM staff_sessions WHERE expires<=?').bind(now),e.DB.prepare('DELETE FROM staff_login_limits WHERE expires<=?').bind(now)]);
 if(new URL(req.url).pathname.endsWith('/logout')){const token=tokenFrom(req);if(token)await e.DB.prepare('DELETE FROM staff_sessions WHERE id=?').bind(await sessionKey(e.ADMIN_PASSWORD,token)).run();return reply({ok:true},200,`${cookieName}=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0`)}
 if(!new URL(req.url).pathname.endsWith('/login'))return reply({error:'Not found'},404);
 // Count attempts atomically before checking credentials. IP addresses are never stored in plaintext.
 const ip=req.headers.get('cf-connecting-ip')||'unknown';
 const scope=await sessionKey(e.ADMIN_PASSWORD,'login:'+ip);
 for(const [id,max] of [[scope,10],['all',200]] as const){const row=await e.DB.prepare('INSERT INTO staff_login_limits (id,attempts,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=attempts+1 RETURNING attempts').bind(id,now+15*60*1000).first();if(row.attempts>max)return reply({error:'Too many sign-in attempts. Please wait 15 minutes before trying again.'},429)}
 if(Number(req.headers.get('content-length')||0)>4096)return reply({error:'Invalid sign-in details'},400);
 const raw=await req.text();if(raw.length>4096)return reply({error:'Invalid sign-in details'},400);
 let data:any;try{data=JSON.parse(raw)}catch{return reply({error:'Invalid sign-in details'},400)}
 const password=typeof data.password==='string'?data.password:'';
 if(!password||password.length>512)return reply({error:'Email or password is incorrect.'},401);
 const matches=await passwordMatches(e.ADMIN_PASSWORD,password);
 if(typeof data.email!=='string'||data.email.trim().toLowerCase()!==staffEmail||!matches)return reply({error:'Email or password is incorrect.'},401);
 const token=hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
 await e.DB.prepare('INSERT INTO staff_sessions (id,expires) VALUES (?,?)').bind(await sessionKey(e.ADMIN_PASSWORD,token),now+8*60*60*1000).run();
 return reply({ok:true},200,`${cookieName}=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800`);
}
