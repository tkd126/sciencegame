const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('./room'), 'utf8');
function box(id) {
  const match = source.match(new RegExp("\\['" + id + "','[^']+',([\\d.]+),([\\d.]+),([\\d.]+),([\\d.]+)"));
  assert.ok(match, id + ' 영역이 있어야 한다');
  return match.slice(1).map(Number);
}
const [x,y,w,h] = box('equipment');
const [cx,cy,cw,ch] = box('cables');
assert.ok(x+w <= cx || cx+cw <= x || y+h <= cy || cy+ch <= y,
  '필수 장비 상자를 장식 연결선이 가리지 않아야 한다');
console.log('방송실 장비 상자와 연결선 클릭 영역 분리 확인');
