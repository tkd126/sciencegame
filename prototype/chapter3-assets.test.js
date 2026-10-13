const assert=require('node:assert/strict'),fs=require('node:fs'),{rooms}=require('./chapter3-story');
for(const room of Object.values(rooms))for(const name of [room.art,room.openArt].filter(Boolean)){
 assert.ok(fs.existsSync(__dirname+'/'+name),'missing chapter3 background '+name);
 const b=fs.readFileSync(__dirname+'/'+name);assert.equal(b.subarray(1,4).toString(),'PNG');
}
assert.notEqual(rooms.science.art,rooms.science.openArt);
for(const id of ['science','bench','infirmary','studio'])assert.match(rooms[id].art,/-cartoon-v2\.png$/,'3편 카툰 배경 연결');
assert.match(rooms.science.openArt,/-cartoon-v2\.png$/);
console.log('chapter3 background assets PASS');
