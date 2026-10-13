(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./chapter3-state'):root.Chapter3State,root);if(typeof module==='object'&&module.exports)module.exports=api;else root.Chapter3View=api;})(typeof window!=='undefined'?window:globalThis,function(R,root){
 'use strict';
 function controller(activity,saved,onChange,onDone,clock={set:f=>setTimeout(f,1600),clear:id=>clearTimeout(id)}){
  let state=R.act(R.initial(saved),{type:'enter',target:activity}),disposed=false,timer=null,finished=false;
  return {get state(){return state;},send(type,target,value){
   if(disposed||finished)return;const before=state.step;state=R.act(state,{type,target,value});onChange(state);
   if(state.step==='running'&&before!=='running')timer=clock.set(()=>{if(disposed||finished)return;state=R.act(state,{type:'observed'});onChange(state);});
   if(state.done[activity]&&!finished){finished=true;onDone();}
  },dispose(){disposed=true;clock.clear(timer);}};
 }
 const escape=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const titles={measure:'컵에 남은 온도',contact:'따뜻해진 컵의 이유',conduction:'이어진 금속의 길',convection:'따뜻한 공기는 어디로 갈까',radiation:'빈자리가 따뜻한 이유',insulation:'차가움을 오래 지키는 포장',tape:'숨겨 둔 목소리'};
 const missions={measure:'컵의 물이 얼마나 따뜻한지 기록하자. 책상 위 도구를 어떻게 놓아야 물의 온도를 잴 수 있을까?',convection:'움직이는 종이 아래에 난방 장치가 있다. 데워진 공기가 방 안에서 움직일 길을 화살표로 예상해 보자.',radiation:'전등 때문에 빈자리의 금속판이 따뜻해졌을까? 빛을 가릴 때와 가리지 않을 때의 온도 변화를 비교하자.',insulation:'작은 방송실까지 냉찜질 팩을 차갑게 옮기자. 포장하지 않은 팩보다 온도가 덜 올라가는 포장을 만들어 보자.'};
 const roomFor={measure:'science',contact:'science',conduction:'bench',convection:'bench',radiation:'infirmary',insulation:'infirmary',tape:'studio'};
 const labels={notebook:'주운 수첩',handkerchief:'손수건',thermometer:'온도계',packing:'포장 재료',tape:'녹음테이프'};
 // Percent rectangles are traced against each generated background, not the viewport.
 const hotspots={science:[['thermometer','온도계',44,35,11,6],['cup','물이 든 컵',30,32,4,8],['bowl','큰 물그릇',34,31,10,9],['book','실험 공책',61,35,12,6]],bench:[['metal','굽은 금속판',21,37,21,11],['spiral','나선 종이',76,3,7,30],['window','열린 창문',61,1,10,34],['book','공책',49,42,14,6]],infirmary:[['lamp','전등과 금속판',37,24,9,21],['shield','가림판',31,29,8,17],['book','대여 기록',56,40,12,7],['packing','포장 재료',74,43,14,9]],studio:[['recorder','녹음기',53,45,12,8],['cooler','보냉 상자',80,48,12,13],['chair','담요가 놓인 빈 의자',41,49,14,30]]};
 const btn=(type,text,target='',value='',selected=false)=>`<button type="button" data-action="${type}" data-target="${target}" data-value="${value}"${selected?' aria-pressed="true"':''}>${text}</button>`;
 const range=(key,label,value,min,max,step=1)=>`<label class="c3-range">${label}<output>${value}</output><input aria-label="${label}" data-setting="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
 const svg=body=>`<svg viewBox="0 0 600 340" role="img" class="c3-diagram">${body}</svg>`;
 const text=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
 function cup(x,y,color,label){return `<path d="M${x} ${y}v125q50 20 100 0V${y}" fill="${color}" stroke="#405e63" stroke-width="5"/><ellipse cx="${x+50}" cy="${y}" rx="50" ry="10" fill="#edf4e9" stroke="#405e63" stroke-width="4"/>${text(x+50,y+75,label)}`;}
 function thermometerViews(){return `<div class="c3-eye-grid">${[['high','높은 곳에서',28,107],['level','나란한 높이에서',32,139],['low','낮은 곳에서',36,171]].map(([key,label,n,eyeY])=>`<figure><figcaption>${label}</figcaption><svg viewBox="0 0 220 270" role="img" aria-label="${label} 본 온도계 확대 그림"><rect x="78" y="15" width="120" height="232" rx="15" fill="#fff9e8" stroke="#405e63" stroke-width="3"/><path d="M90 235V139" stroke="#c64c45" stroke-width="9"/>${Array.from({length:11},(_,i)=>`<path d="M145 ${235-i*16}h${i%5?14:23}" stroke="#405e63" stroke-width="2"/>${i%5?'':text(182,241-i*16,20+i*2)}`).join('')}<ellipse cx="20" cy="${eyeY}" rx="16" ry="10" fill="white" stroke="#405e63" stroke-width="3"/><circle cx="24" cy="${eyeY}" r="6" fill="#405e63"/><path d="M35 ${eyeY}L145 ${235-(n-20)*8}" stroke="#b47630" stroke-width="3" stroke-dasharray="6 4"/>${text(85,260,'눈 → 액주 → 눈금')}</svg><label>보이는 눈금 (℃)<select aria-label="${label} 읽은 온도" data-setting="${key}"><option value="0">온도 선택</option>${[26,28,30,32,34,36,38].map(v=>`<option value="${v}">${v}℃</option>`).join('')}</select></label></figure>`).join('')}<p class="c3-eye-caption">같은 온도계를 옆에서 본 확대 모형입니다. 눈높이에 따라 액주 끝 너머로 보이는 눈금이 달라집니다. 점선 끝을 읽으세요. 작은 눈금 한 칸은 2℃입니다.</p></div>`;}
 function illustration(id,w,step){
  const result=step==='result'||step==='done';
  if(id==='measure'){
   const top=15+w.depth*1.25,level=result?R.models.temperature:12;
   return svg(`<rect x="0" y="270" width="600" height="70" fill="#a97e58"/>${cup(175,155,'#abd7d9','물')}<g transform="translate(210 ${top})"><rect x="-12" y="-5" width="26" height="160" rx="10" fill="#f9f2d8" stroke="#405e63" stroke-width="3"/><circle cy="148" r="15" fill="#c45c53"/><path d="M0 148V${140-level*2}" stroke="#c45c53" stroke-width="7"/>${Array.from({length:31},(_,i)=>`<path d="M7 ${140-i*4}h${i%5?6:14}" stroke="#405e63"/>${i%5?'':`<text x="30" y="${146-i*4}" font-size="13">${i*2}</text>`}`).join('')}</g>${text(435,105,'컵 속 물의 온도는?')}${text(435,145,'높이를 바꾸어 놓아 보자')}`);
  }
  if(id==='contact')return svg(`${cup(55,140,'#dfae88',result?'35℃':'48℃')}${cup(430,140,'#a8d3d9',result?'28℃':'18℃')}${text(105,110,'큰 물그릇')}${text(480,110,'작은 금속 컵')}<path d="M185 215H400" stroke="#809392" stroke-width="4" stroke-dasharray="8 8"/>${text(300,280,w.points.join(' → ').replace('warm','따뜻한 물').replace('cold','찬 물'))}${text(300,50,result?'두 물의 온도가 달라졌다':'어느 쪽 온도가 어떻게 달라질까?')}`);
  if(id==='conduction')return svg(`<path d="M95 230V80H465V230" fill="none" stroke="#526a6d" stroke-width="34"/><path d="M95 230V80H465V230" fill="none" stroke="${result?'#dbaa69':'#c4d2c9'}" stroke-width="24"/><rect x="55" y="252" width="80" height="35" rx="8" fill="#a4614d"/>${text(95,320,'교사 가열점')}${[['A',95,120],['B',280,80],['C',465,175]].map(([p,x,y])=>`<circle cx="${x}" cy="${y}" r="24" fill="${result?'#efbc61':'#faf1d6'}" stroke="#405e63" stroke-width="3"/>${text(x,y+7,p)}`).join('')}${text(300,40,result?'관찰: A → B → C':'연결된 금속판')}${text(330,280,'내 순서: '+w.points.join(' → '))}`);
  if(id==='convection')return svg(`<rect x="25" y="25" width="550" height="270" rx="8" fill="#eee8d5" stroke="#536d70" stroke-width="5"/><path d="M25 275H575" stroke="#a98054" stroke-width="20"/><rect x="75" y="220" width="95" height="45" rx="8" fill="#b87552"/>${[90,110,130,150].map(x=>`<path d="M${x} 230v25" stroke="#603f35" stroke-width="5"/>`).join('')}${text(120,315,'난방 장치')}${text(470,315,'장치에서 먼 쪽')}${text(300,55,'방 안의 공기 흐름')}${result?'<path class="c3-flow" d="M125 210V90H485V240H190" fill="none" stroke="#c86442" stroke-width="12" stroke-dasharray="16 10"/><path d="M110 110L125 85L140 110M460 75L490 90L460 105M470 220L485 245L500 220" fill="none" stroke="#c86442" stroke-width="6"/>':''}${text(120,180,result?'따뜻해져 올라감':'① ?')}${text(300,115,result?'옆으로 퍼짐':'② ?')}${text(480,185,result?'식어서 내려옴':'③ ?')}`);
  if(id==='radiation')return svg(`<defs><linearGradient id="c3-metal"><stop stop-color="#536c76"/><stop offset=".5" stop-color="#d0dde0"/><stop offset="1" stop-color="#607986"/></linearGradient></defs><rect x="0" y="278" width="600" height="62" fill="#ac805b"/><path d="M10 292H590" stroke="#73543f" stroke-width="4"/><ellipse cx="90" cy="275" rx="55" ry="10" fill="#536570"/><path d="M90 270V90L160 75" fill="none" stroke="#425c60" stroke-width="12"/><circle cx="90" cy="90" r="10" fill="#bdb49a"/><path d="M150 45L210 88L160 135Z" fill="#d4ac69" stroke="#755c39" stroke-width="4"/><ellipse cx="188" cy="110" rx="13" ry="22" fill="#fff3a8" transform="rotate(40 188 110)"/><path d="M200 110L${w.shield?'300 115V240':'475 170V240'}Z" fill="#ffdf84" opacity=".55"/>${w.shield?'<path d="M292 100L308 108V267L292 258Z" fill="#ad8d61" stroke="#654f3a" stroke-width="3"/><path d="M275 274H330" stroke="#654f3a" stroke-width="7"/>':''}<path d="M427 214L506 207L521 231L438 240Z" fill="url(#c3-metal)" stroke="#425c60" stroke-width="4"/><rect x="458" y="240" width="9" height="34" fill="#526a6d"/><path d="M431 275H496" stroke="#526a6d" stroke-width="7"/><rect x="432" y="153" width="89" height="43" rx="6" fill="#faf4dd" stroke="#526a6d" stroke-width="2"/>${text(477,182,result?(w.shield?'23℃':'31℃'):'20℃')}${text(90,320,'전등')}${text(300,70,w.shield?'빛을 막는 가림판':'가림판 없음')}${text(478,320,'금속판 + 온도 센서')}<path d="M160 300H400" stroke="#526a6d" stroke-width="2" stroke-dasharray="5 4"/>${text(285,326,'거리·시간은 같게')}`);
  if(id==='insulation'){
   const pack=(x,temp)=>`<rect x="${x}" y="125" width="110" height="125" rx="15" fill="#a8d5de" stroke="#446b78" stroke-width="4"/><path d="M${x+10} 137h90M${x+10} 239h90" stroke="#638f9b" stroke-width="3"/><path d="M${x+13} 155q40-18 80 0v60q-40 20-80 0Z" fill="#c6e8ea" opacity=".8"/>${text(x+55,185,'냉찜질 팩')}${text(x+55,217,temp+'℃')}`;
   return svg(`<rect y="278" width="600" height="62" fill="#ad835d"/>${text(140,45,'기준 · 포장 없음')}${text(435,45,'내 포장')}${pack(85,result?20:8)}<rect x="354" y="103" width="161" height="165" rx="18" fill="${({none:'#e6ddc7',cloth:'#c5b5c6',air:'#b7d1c3',metal:'#99aaad'})[w.material]}" stroke="#567075" stroke-width="${w.material==='none'?2:8}"/>${w.material==='air'?Array.from({length:7},(_,i)=>`<circle cx="365" cy="${120+i*20}" r="7" fill="#e3f1e9" stroke="#6e9b89"/><circle cx="504" cy="${120+i*20}" r="7" fill="#e3f1e9" stroke="#6e9b89"/>`).join(''):''}${pack(380,result?w.actual:8)}${w.lid?`<path d="M${w.gap?393:354} 99H515" stroke="#6d8582" stroke-width="14"/>`:'<path d="M350 91L415 60" stroke="#6d8582" stroke-width="9"/>'}${text(435,80,w.lid?(w.gap?'덮개 닫힘 · 틈 있음':'덮개 닫힘 · 틈 없음'):'덮개 열림')}${text(300,310,'같은 크기 · 처음 8℃ · 같은 장소와 시간')}`);
  }
  return svg(`<rect x="80" y="80" width="440" height="200" rx="18" fill="#526367" stroke="#263f46" stroke-width="8"/><rect x="150" y="110" width="280" height="100" rx="6" fill="#202e35"/>${w.inserted?'<circle cx="220" cy="160" r="29" fill="#bca883"/><circle cx="365" cy="160" r="29" fill="#bca883"/>':''}${text(300,250,w.rewound?'처음으로 되감았다':w.inserted?'테이프가 들어 있다':'테이프 넣는 곳')}`);
 }
 function mount(host,activity,onDone,saved,onChange=()=>{},sound=()=>{}){
  const room=root.Chapter3Story.rooms[roomFor[activity]];let open=false,notebook=false,selected='',tip='그림 속 물건을 살펴보자.',reduced=root.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  host.classList.add('c3-host');
  const c=controller(activity,saved,s=>{onChange(s);render();},onDone);
  function render(){
   const focused=host.querySelector(':focus'),focusKey=focused?.dataset.setting,scroll=host.querySelector('.c3-body')?.scrollTop||0;
   const s=c.state,w=s.work[activity],busy=s.step==='running';
   host.classList.toggle('c3-reduced',reduced);
   const spots=(hotspots[roomFor[activity]]||[]).map(([id,label,x,y,width,height])=>`<button class="c3-hotspot" type="button" data-inspect="${id}" aria-label="${label}" style="left:${x}%;top:${y}%;width:${width}%;height:${height}%"><span>${label}</span></button>`).join('');
   host.innerHTML=`<div class="c3-world"><div class="c3-world-inner"><img src="${room.art}" alt="${room.name} · 그림 속 물건을 조사할 수 있다">${spots}</div></div><div class="c3-tools"><b>${titles[activity]}</b>${btn('look','둘러보기')}${btn('notebook','수첩')}${btn('motion',reduced?'연출 줄임':'연출 줄이기')}</div><div class="c3-bag"><span>가방</span>${s.inventory.map(i=>btn('item',labels[i],i,'',selected===i)).join('')}</div><div class="c3-tip" role="status">소미 · ${escape(tip)}</div>`;
   if(notebook){host.insertAdjacentHTML('beforeend',`<section class="c3-work c3-notes"><header><h2>두 종류의 기록</h2>${btn('notebook','수첩 덮기')}</header><div class="c3-body"><h3>저절로 나타난 글 · 아직 확인하지 못함</h3>${s.notebook.map(n=>`<p>${escape(root.Chapter3Story.notebook[n])}</p>`).join('')}<h3>우리가 직접 관찰한 사실</h3>${Object.values(s.observations).map(t=>`<p>${escape(t)}</p>`).join('')||'<p>아직 관찰 기록이 없다.</p>'}</div></section>`);return;}
   if(!open)return;
   const phase={setup:'예상과 준비',running:'관찰 중',result:'결과와 비교',done:'기록 완료'}[s.step];
   let controls='';
   const group=(label,body)=>`<fieldset><legend>${label}</legend>${body}</fieldset>`;
   const choose=(key,options)=>options.map(([value,label])=>btn('answer',label,key,value,w[key]===value)).join('');
   if(activity==='measure')controls=s.step==='setup'?group('① 물의 온도를 잴 위치 정하기',range('depth','온도계 높이 조절',w.depth,0,100)):group('② 실제 온도는 어느 눈높이의 기록을 쓸까?',choose('eye',[['high','높은 곳'],['level','나란한 높이'],['low','낮은 곳']]));
   if(activity==='contact')controls=s.step==='setup'?group('예상 온도 · 정확한 계산보다 변화 방향',range('warm','따뜻한 물의 예상',w.warm,18,55)+range('cold','차가운 물의 예상',w.cold,10,48)):group('열이 나온 쪽 → 받은 쪽 순서로 누르기',btn('point','따뜻한 물','warm','',w.points.includes('warm'))+btn('point','차가운 물','cold','',w.points.includes('cold'))+btn('clear','연결 지우기'));
   if(activity==='conduction')controls=group(s.step==='setup'?'색 변화 예상 순서':'관찰과 비교하여 순서 고치기',['A','B','C'].map(p=>btn('point',`${p}${w.points.includes(p)?' · '+(w.points.indexOf(p)+1)+'번째':''}`,p,'',w.points.includes(p))).join('')+btn('clear','순서 지우기'));
   if(activity==='convection')controls=group('① 난방 장치 바로 위',choose('rise',[['up','↑ 위로'],['down','↓ 아래로']]))+group('② 천장에 도착한 공기',choose('across',[['left','← 장치 쪽으로'],['right','→ 방 반대쪽으로']]))+group('③ 장치에서 멀리 가 식은 공기',choose('sink',[['up','↑ 위로'],['down','↓ 아래로']]))+'<p>세 방향을 고른 뒤 관찰 시작을 누르세요. 결과를 보고 예상 화살표를 고칠 수 있어요.</p>';
   if(activity==='radiation')controls='<p class="c3-condition"><b>같게 둘 조건</b><br>같은 전등 · 같은 금속판 · 같은 거리 · 처음 20℃ · 같은 관찰 시간<br><b>바꿀 조건</b>: 빛 사이의 가림판</p>'+group('① 비교할 상태 설정',choose('shield',[[false,'가림판 없음'],[true,'가림판 있음']]))+group('② 가리면 온도가 올라가는 정도는?',choose('prediction',[['lower','더 작을 것 같다'],['same','같을 것 같다'],['higher','더 클 것 같다']]))+`<p class="c3-records">관찰 기록: 없음 ${w.records.includes(false)?'20 → 31℃':'아직 관찰 전'}<br>있음 ${w.records.includes(true)?'20 → 23℃':'아직 관찰 전'}</p>`+(w.records.length===2?group('③ 두 결과가 다른 이유',choose('explanation',[['light','빛으로 전달되는 열을 가려서'],['touch','전등이 금속판에 닿아서'],['cold','가림판이 차가움을 만들어서']])):'<p>각 상태에서 관찰 시작을 한 번씩 눌러 두 기록을 모으세요.</p>');
   if(activity==='insulation')controls='<p class="c3-condition"><b>목표</b>: 포장하지 않은 팩보다 덜 따뜻하게 유지하기<br><b>같은 조건</b>: 두 팩 모두 처음 8℃ · 같은 크기 · 같은 방 · 같은 시간</p>'+group('① 누르면 바로 포장됩니다',choose('material',[['none','포장 없음'],['cloth','천'],['air','공기층 포장재'],['metal','금속판']]))+group('② 덮개와 틈 설정',choose('lid',[[false,'덮개 열림'],[true,'덮개 닫힘']])+choose('gap',[[true,'틈 있음'],[false,'틈 없음']]))+group('③ 기준 팩보다 온도가 어떨까?',choose('compare',[['lower','더 낮을 것 같다'],['same','같을 것 같다'],['higher','더 높을 것 같다']]))+(s.step==='result'?group('④ 포장은 어떤 열의 이동을 줄였을까?',choose('explanation',[['in','따뜻한 바깥 → 차가운 팩'],['out','차가운 팩 → 따뜻한 바깥'],['create','포장재가 차가움을 만든다']])):'');
   if(activity==='tape')controls=group('가방의 녹음테이프 → 넣기 → 되감기 → 재생',btn('insert',w.inserted?'테이프 넣음 ✓':'테이프 넣기')+btn('rewind',w.rewound?'되감음 ✓':'처음으로 되감기')+btn('play','재생하기'));
   const canRun=activity!=='tape'&&s.step!=='done',canCheck=s.step==='result';
   const eyeView=activity==='measure'&&s.step==='result';
   host.insertAdjacentHTML('beforeend',`<section class="c3-work ${eyeView?'c3-measure-read':''}" role="dialog" aria-label="${titles[activity]}"><header><div><small>${phase}</small><h2>${titles[activity]}</h2></div>${btn('close','장면으로 돌아가기')}</header>${missions[activity]?`<p class="c3-mission">${missions[activity]}</p>`:''}<div class="c3-body"><div class="c3-illustration">${eyeView?thermometerViews():illustration(activity,w,s.step)}<p>관찰을 돕는 모형 · 가열은 선생님이 담당 · 수치는 비교용 예시</p></div><div class="c3-controls">${controls}</div></div><p class="c3-feedback" role="status">${escape(s.feedback||s.observations[activity]||'먼저 예상하거나 조건을 준비해 보자.')}</p><footer>${canRun?btn('run',busy?'관찰 중…':s.step==='result'?'같은 조건 다시 관찰':'관찰 시작'):''}${canCheck?btn('check',activity==='measure'?'온도 기록하기':activity==='tape'?'이어 듣기':'이 관찰로 확인하기'):''}</footer></section>`);
   if(eyeView)for(const key of ['high','level','low'])host.querySelector(`[data-setting="${key}"]`).value=String(w[key]);
   if(busy)host.querySelectorAll('.c3-controls button,.c3-controls input,footer button').forEach(el=>el.disabled=true);
   const body=host.querySelector('.c3-body');if(body)body.scrollTop=scroll;
   if(focusKey)host.querySelector(`[data-setting="${focusKey}"]`)?.focus({preventScroll:true});
  }
  function inspect(target){
   if(activity==='measure'&&target==='thermometer'){c.send('take','thermometer');selected='thermometer';tip='온도계를 챙겼어. 어디에 써 볼까?';}
   else if(activity==='measure'&&target==='cup'){if(!c.state.inventory.includes('thermometer'))tip='느낌 말고 숫자로 남기고 싶어. 쓸 만한 물건이 있을까?';else if(selected!=='thermometer')tip='가방에서 사용할 물건을 고른 뒤 컵을 눌러 보자.';else open=true;}
   else if((activity==='contact'&&target==='bowl')||(activity==='conduction'&&target==='metal')||(activity==='convection'&&['spiral','window'].includes(target))||(activity==='radiation'&&['lamp','shield'].includes(target))||(activity==='insulation'&&target==='packing')||(activity==='tape'&&target==='recorder'))open=true;
   else if(target==='book'){tip='현재 살피는 물건부터 확인하자. 수첩에는 우리가 본 것과 저절로 생긴 글을 따로 남길게.';}
   else tip='지금은 '+titles[activity]+'부터 확인해 보자. 관련 물건에 마우스를 올리면 이름이 보여.';
   sound('paper');render();
  }
  function click(e){
   const spot=e.target.closest('[data-inspect]');if(spot&&!open&&!notebook){inspect(spot.dataset.inspect);return;}
   const b=e.target.closest('[data-action]');if(!b)return;const {action,target,value}=b.dataset;
   if(action==='close'){open=false;render();return;}
   if(action==='look'){host.classList.toggle('c3-reveal');return;}
   if(action==='notebook'){notebook=!notebook;render();return;}
   if(action==='motion'){reduced=!reduced;render();return;}
   if(action==='item'){selected=target;tip=labels[target]+' 선택. 사용할 물건을 눌러 보자.';render();return;}
   if(action==='material'){selected=target;tip='포장에 놓으면 재료가 적용돼.';render();return;}
   if(action==='place'){if(['none','cloth','air','metal'].includes(selected))c.send('set','material',selected);return;}
   if(action==='select-shield'){selected='shield';tip='빛 사이의 놓기 버튼을 누르거나 가림판을 끌어 놓자.';render();return;}
   if(action==='toggle'){c.send('set',target,!c.state.work[activity][target]);return;}
   if(action==='answer'){c.send('set',target,value==='true'?true:value==='false'?false:value);return;}
   if(action==='run'&&c.state.step==='running')return;
   c.send(action,target,value);
  }
  function input(e){if(e.target.dataset.setting)c.send('set',e.target.dataset.setting,Number(e.target.value));}
  function drag(e){const el=e.target.closest('[data-drag]');if(el)e.dataTransfer.setData('text/plain',el.dataset.drag);}
  function over(e){if(e.target.closest('[data-drop]'))e.preventDefault();}
  function drop(e){const el=e.target.closest('[data-drop]');if(!el)return;e.preventDefault();const v=e.dataTransfer.getData('text/plain');if(el.dataset.drop==='packing'&&['none','cloth','air','metal'].includes(v))c.send('set','material',v);if(el.dataset.drop==='shield'&&v==='shield')c.send('set','shield',true);}
  host.addEventListener('click',click);host.addEventListener('change',input);host.addEventListener('dragstart',drag);host.addEventListener('dragover',over);host.addEventListener('drop',drop);render();
  return ()=>{c.dispose();host.removeEventListener('click',click);host.removeEventListener('change',input);host.removeEventListener('dragstart',drag);host.removeEventListener('dragover',over);host.removeEventListener('drop',drop);host.classList.remove('c3-host','c3-reduced','c3-reveal');};
 }
 return {controller,mount,illustration,hotspots};
});
