const assert = require('node:assert/strict');
const fs = require('node:fs');
assert.ok(fs.existsSync(__dirname+'/chapter3-state.js'), 'chapter3 heat interaction rules must exist');
const R = require('./chapter3-state');
const act=(s,type,target,value)=>R.act(s,{type,target,value});
const enter=id=>act(R.initial(),'enter',id);
const set=(s,key,value)=>act(s,'set',key,value);
const observe=s=>act(act(s,'run'),'observed');

let s=enter('measure');
assert.equal(act(s,'run').step,'setup','cannot measure without immersed bulb');
s=set(s,'depth',50);s=observe(s);
assert.equal(s.step,'result');
assert.equal(act(set(s,'reading',12),'check').done.measure,undefined);
s=set(set(set(set(s,'high',28),'level',32),'low',36),'eye','level');s=act(s,'check');assert.equal(s.done.measure,true);
assert.ok(s.observations.measure);
const prior=JSON.stringify(s);act(s,'unknown');assert.equal(JSON.stringify(s),prior,'pure reducer');

s=enter('contact');s=set(set(s,'warm',35),'cold',28);s=observe(s);
s=act(s,'point','cold');s=act(s,'point','warm');assert.equal(act(s,'check').done.contact,undefined);
s=act(s,'clear');s=act(s,'point','warm');s=act(s,'point','cold');s=act(s,'check');assert.equal(s.done.contact,true);

s=enter('conduction');for(const p of ['C','A','B'])s=act(s,'point',p);
s=observe(s);assert.deepEqual(s.work.conduction.actual,['A','B','C'],'wrong prediction must not change physics');
assert.equal(act(s,'check').done.conduction,undefined);
s=act(s,'clear');for(const p of ['A','B','C'])s=act(s,'point',p);s=act(s,'check');assert.equal(s.done.conduction,true);

s=enter('convection');assert.equal(observe(s).step,'setup');
s=set(set(set(s,'rise','down'),'across','left'),'sink','up');s=observe(s);
assert.equal(s.step,'result','wrong prediction still permits observation');
assert.equal(act(s,'check').done.convection,undefined);
s=set(set(set(s,'rise','up'),'across','right'),'sink','down');
s=act(s,'check');assert.equal(s.done.convection,true);

s=enter('radiation');s=set(s,'prediction','higher');s=observe(s);assert.equal(act(s,'check').done.radiation,undefined);
s=set(s,'shield',true);s=observe(s);assert.equal(act(s,'check').done.radiation,undefined);
s=set(s,'explanation','light');s=act(s,'check');assert.equal(s.done.radiation,true);

for(const material of ['cloth','air']){
 s=enter('insulation');s=set(set(set(set(s,'material',material),'lid',true),'gap',false),'prediction',12);
 s=set(s,'compare','higher');s=observe(s);s=set(s,'explanation','in');s=act(s,'check');assert.equal(s.done.insulation,true);
}
s=enter('insulation');s=set(s,'material','metal');s=set(s,'compare','lower');s=observe(s);
assert.equal(act(s,'check').done.insulation,undefined);
s=act(s,'retry');s=set(set(set(s,'material','air'),'lid',true),'gap',false);s=observe(s);s=set(s,'explanation','in');s=act(s,'check');assert.equal(s.done.insulation,true);

s=enter('measure');s=set(s,'depth',50);s=act(s,'run');assert.equal(s.step,'running');
const running=s;assert.deepEqual(act(running,'run'),running,'double run is inert');
s=R.initial(JSON.parse(JSON.stringify(s)));assert.equal(s.step,'setup','interrupted observation must be repeated');
assert.equal(act(s,'observed').step,'setup','stale timer cannot complete an idle experiment');
s=set(s,'depth',NaN);assert.equal(s.work.measure.depth,0);
s=set(s,'depth',999);assert.equal(s.work.measure.depth,0);
assert.equal(R.initial({activity:'bogus',step:'bad',work:null}).activity,'measure');
s=R.initial({activity:'measure',step:'done',done:{measure:false},inventory:['bogus'],work:{measure:{depth:'x'}}});
assert.equal(s.step,'setup');assert.deepEqual(s.inventory,[]);
s=R.initial({activity:'measure',step:'setup',done:{contact:true},inventory:['thermometer'],notebook:['warning']});
s=act(s,'enter','radiation');assert.equal(s.done.contact,true);assert.deepEqual(s.inventory,['thermometer']);
console.log('chapter3 state: measurement, six activities, wrong predictions, retries, malformed saves PASS');
