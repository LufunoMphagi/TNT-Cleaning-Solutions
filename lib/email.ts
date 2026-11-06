import {Buffer} from 'node:buffer';
export class EmailDeliveryError extends Error {}
export function emailFailure(error:unknown){return error instanceof EmailDeliveryError?error.message:'Email provider connection failed. Retry shortly; if this continues, check the hosting connection.'}
async function providerFailure(response:Response,stage:string){
 const data:any=await response.json().catch(()=>({}));
 const code=typeof data.error==='string'?data.error:data.error?.status;
 const reasons=(data.error?.errors||[]).map((x:any)=>x.reason);
 let help='Check the Google project, Gmail API and sender authorisation.';
 if(code==='invalid_client')help='The OAuth client ID or secret is incorrect or does not match. Replace the matching client credentials in hosting settings and redeploy.';
 if(code==='invalid_grant')help='The refresh token is expired, revoked or does not match this OAuth client. Generate a new token using the same client and TNT Gmail account, save it and redeploy.';
 if(code==='unauthorized_client')help='This OAuth client is not authorised for this token. Generate the token using your own matching web OAuth client.';
 if(response.status===403)help='Enable Gmail API in the OAuth client project and authorise the gmail.send scope. Check Google account and project restrictions.';
 if(response.status===429||reasons.includes('rateLimitExceeded')||reasons.includes('dailyLimitExceeded'))help='Google email quota or rate limit reached. Wait before retrying.';
 const safeCode=['invalid_client','invalid_grant','unauthorized_client','invalid_request','PERMISSION_DENIED','UNAUTHENTICATED','RESOURCE_EXHAUSTED'].includes(code)?' '+code:'';
 return new EmailDeliveryError(`${stage} (HTTP ${response.status}${safeCode}). ${help}`);
}
export function emailReady(e:any){return !!((e.GMAIL_CLIENT_ID&&e.GMAIL_CLIENT_SECRET&&e.GMAIL_REFRESH_TOKEN)||(e.RESEND_API_KEY&&e.EMAIL_FROM))}
export async function deliverEmail(e:any,recipient:string,subject:string,message:string){
 if(e.GMAIL_CLIENT_ID&&e.GMAIL_CLIENT_SECRET&&e.GMAIL_REFRESH_TOKEN){
  const token=await fetch('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:e.GMAIL_CLIENT_ID,client_secret:e.GMAIL_CLIENT_SECRET,refresh_token:e.GMAIL_REFRESH_TOKEN,grant_type:'refresh_token'})});
  if(!token.ok)throw await providerFailure(token,'Gmail authorisation failed');const data:any=await token.json();if(!data.access_token)throw new EmailDeliveryError('Google did not return an access token. Reauthorise the TNT Gmail connection.');
  const from=e.GMAIL_FROM||'cleaningsolutionstnt@gmail.com';
  const raw=['From: TNT Cleaning Solutions <'+from+'>','To: '+recipient,'Subject: =?UTF-8?B?'+Buffer.from(subject.replace(/[\r\n]/g,' ')).toString('base64')+'?=','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',Buffer.from(message).toString('base64')].join('\r\n');
  const response=await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:'Bearer '+data.access_token,'Content-Type':'application/json'},body:JSON.stringify({raw:Buffer.from(raw).toString('base64url')})});
  if(!response.ok)throw await providerFailure(response,'Gmail delivery failed');return;
 }
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+e.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:e.EMAIL_FROM,to:[recipient],subject,text:message})});if(!response.ok)throw Error('Email delivery failed');
}
