const assert=require('node:assert/strict');
const fs=require('node:fs');
const css=fs.readFileSync(__dirname+'/chapter3.css','utf8');
const image=css.match(/\.c3-world-inner>img\{([^}]+)\}/)[1];
// Absolute inline images otherwise inherit the centered static position
// from .experiment-panel, moving the picture half a canvas away from hotspots.
assert.match(image,/(?:^|;)inset:0(?:;|$)/);
assert.match(image,/(?:^|;)display:block(?:;|$)/);
console.log('chapter3 background origin regression PASS');
