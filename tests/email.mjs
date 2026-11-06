import test from 'node:test';
import assert from 'node:assert/strict';
import {deliverEmail,emailFailure} from '../lib/email.ts';
const env={GMAIL_CLIENT_ID:'test-client',GMAIL_CLIENT_SECRET:'private-secret',GMAIL_REFRESH_TOKEN:'private-token'};
test('Google token failures return actionable errors without leaking provider content',async()=>{
 for(const code of ['invalid_client','invalid_grant']){
 globalThis.fetch=async()=>Response.json({error:code,error_description:'private-token private-secret'},{status:400});
 await assert.rejects(()=>deliverEmail(env,'test@example.com','Test','Test'),e=>{assert.match(emailFailure(e),new RegExp(code));assert.doesNotMatch(emailFailure(e),/private-token|private-secret/);return true});
 }
});
test('Gmail permission failure explains scope and API checks',async()=>{
 let calls=0;globalThis.fetch=async()=>++calls===1?Response.json({access_token:'private-access'}):Response.json({error:{status:'PERMISSION_DENIED',message:'private-access'}},{status:403});
 await assert.rejects(()=>deliverEmail(env,'test@example.com','Test','Test'),e=>{assert.match(emailFailure(e),/gmail.send/);assert.doesNotMatch(emailFailure(e),/private-access/);return true});
});
test('Successful Gmail delivery refreshes the token then sends',async()=>{
 let calls=0;globalThis.fetch=async()=>++calls===1?Response.json({access_token:'test-access'}):Response.json({id:'message'});
 await deliverEmail(env,'test@example.com','Test','Test');assert.equal(calls,2);
});
