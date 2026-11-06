import {Buffer} from 'node:buffer';
export function emailReady(e:any){return !!((e.GMAIL_CLIENT_ID&&e.GMAIL_CLIENT_SECRET&&e.GMAIL_REFRESH_TOKEN)||(e.RESEND_API_KEY&&e.EMAIL_FROM))}
export async function deliverEmail(e:any,recipient:string,subject:string,message:string){
 if(e.GMAIL_CLIENT_ID&&e.GMAIL_CLIENT_SECRET&&e.GMAIL_REFRESH_TOKEN){
  const token=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:e.GMAIL_CLIENT_ID,client_secret:e.GMAIL_CLIENT_SECRET,refresh_token:e.GMAIL_REFRESH_TOKEN,grant_type:'refresh_token'})});
  if(!token.ok)throw Error('Gmail authorisation failed');const data:any=await token.json();if(!data.access_token)throw Error('Gmail access unavailable');
  const from=e.GMAIL_FROM||'cleaningsolutionstnt@gmail.com';
  const raw=['From: TNT Cleaning Solutions <'+from+'>','To: '+recipient,'Subject: =?UTF-8?B?'+Buffer.from(subject.replace(/[\r\n]/g,' ')).toString('base64')+'?=','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',Buffer.from(message).toString('base64')].join('\r\n');
  const response=await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:'Bearer '+data.access_token,'Content-Type':'application/json'},body:JSON.stringify({raw:Buffer.from(raw).toString('base64url')})});
  if(!response.ok)throw Error('Gmail delivery failed');return;
 }
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+e.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:e.EMAIL_FROM,to:[recipient],subject,text:message})});if(!response.ok)throw Error('Email delivery failed');
}
