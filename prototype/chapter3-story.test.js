const assert=require('node:assert/strict'),fs=require('node:fs');
assert.ok(fs.existsSync(__dirname+'/chapter3-story.js'),'chapter3 story must be registered');
const S=require('./chapter3-story'),scenes=S.build();
assert.equal(scenes['chapter3-start'].time,'낮 12:10');
let choices=0;
for(const [id,s] of Object.entries(scenes)){
 assert.ok(!s.chars.includes('hana')&&!s.chars.some(c=>c.includes('silhouette')),id);
 for(const next of [s.next,...(s.choices||[]).map(c=>c.branch)])assert.ok(next==='chapter3-end'||scenes[next],id+' -> '+next);
 if(s.choices){choices++;for(const c of s.choices){let n=c.branch,visited=new Set();while(n!==s.next){assert.ok(!visited.has(n),'branch loop');visited.add(n);n=scenes[n].next;} }}
}
assert.ok(choices>=4);
for(const kind of ['measure','contact','conduction','convection','radiation','insulation','tape'])assert.ok(Object.values(scenes).some(s=>s.activity===kind));
for(const scene of Object.values(S.previewScenes))assert.ok(scenes[scene]);
assert.ok(Object.values(scenes).some(s=>s.line.includes('바깥 밑면')));
console.log('chapter3 story: all destinations, branch convergence, no Hana sprite PASS');
