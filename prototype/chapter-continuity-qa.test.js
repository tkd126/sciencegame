const assert = require('node:assert/strict');
const fs = require('node:fs');
const R = require('./chapter2-v3-state');
const app = fs.readFileSync(require.resolve('./app'), 'utf8');
assert.ok(!app.includes('선생님도 하나를 기억하세요? 아까는 아무도 몰랐는데.'), '앞서 하나를 기억한 선생님의 대사와 모순되지 않아야 한다');
assert.ok(R.initial().dialogue.some(x => x.text.includes('선생님')), '1편에서 약속한 선생님 동행을 2편 도입에서 확인한다');
const notebook = fs.readFileSync(require.resolve('./chapter2-v3-state'), 'utf8');
assert.ok(!notebook.includes('이름은 없는데…… 첫 장에'), '표지와 첫 장을 구별해 모순되는 표현을 피한다');
console.log('1편과 2편 인물 기억·동행·수첩 표현 일치');
