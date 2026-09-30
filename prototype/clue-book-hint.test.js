const assert = require('node:assert/strict');
const fs = require('node:fs');
const source = fs.readFileSync(require.resolve('./clue-book'), 'utf8');
assert.ok(!source.includes('방송 짝'), '당번표는 짝 목록이 아니므로 짝을 찾으라는 힌트를 주지 않는다');
assert.ok(source.includes('남은 역할'), '오답 힌트는 촬영 역할을 하나씩 추리하도록 안내한다');
console.log('출석부 추리 힌트와 자료 일치 확인');
