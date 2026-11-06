import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/app.js','utf8');
function setup(){let feedback;const body={append(el){el.host='body';feedback=el}},dialog={append(el){el.host='dialog';feedback=el}};const context=vm.createContext({document:{body,querySelector:()=>feedback,querySelectorAll:()=>[dialog],createElement:()=>({setAttribute(){},remove(){}})},setTimeout:()=>1,clearTimeout(){}});vm.runInContext("const $=s=>document.querySelector(s);"+source.slice(source.indexOf('function feedbackHost'),source.indexOf("document.addEventListener('click'")),context);return {context,getFeedback:()=>feedback}}
function button(){return {textContent:'Add employee',innerHTML:'Add employee',disabled:false,classList:{add(){},remove(){}},matches:()=>true,setAttribute(){},removeAttribute(){}}}
test('feedback is attached inside the active dialog',()=>{const {context,getFeedback}=setup();vm.runInContext("flash('Employee added successfully')",context);assert.equal(getFeedback().host,'dialog');assert.match(getFeedback().textContent,/Employee added successfully/)});
test('loading disables action, blocks duplicates, then restores original control',async()=>{const {context}=setup(),b=button();let finish,calls=0;const task=()=>{calls++;return new Promise(r=>finish=r)};const first=context.withLoading(b,task);assert.equal(b.disabled,true);assert.equal(b.textContent,'Updating team…');await context.withLoading(b,task);assert.equal(calls,1);finish();await first;assert.equal(b.disabled,false);assert.equal(b.innerHTML,'Add employee')});
test('failed actions restore controls and display a visible error',async()=>{const {context,getFeedback}=setup(),b=button();await context.withLoading(b,async()=>{throw Error('Please retry')});assert.equal(b.disabled,false);assert.equal(getFeedback().host,'dialog');assert.match(getFeedback().textContent,/Please retry/)});
