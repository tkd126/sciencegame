(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Chapter3State=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const ids=['measure','contact','conduction','convection','radiation','insulation','tape'];
 const items=['notebook','handkerchief','thermometer','packing','tape'];
 const models={temperature:32,contact:{warm:48,cold:18,afterWarm:35,afterCold:28},conduction:['A','B','C'],radiation:{bare:31,shielded:23},insulation:{start:8,reference:20}};
 const defaults={measure:{depth:0,reading:20,high:0,level:0,low:0,eye:''},contact:{warm:48,cold:18,points:[]},conduction:{points:[],actual:[]},convection:{window:false,heater:true,records:[],controlled:false,points:[],rise:'',across:'',sink:''},radiation:{shield:false,records:[],prediction:'',explanation:''},insulation:{material:'none',lid:false,gap:true,prediction:20,compare:'',explanation:'',actual:null},tape:{inserted:false,rewound:false}};
 const clone=x=>JSON.parse(JSON.stringify(x));
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
 const number=(v,min,max,fallback)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:fallback;
 function cleanWork(id,raw){
  const d=clone(defaults[id]),r=object(raw);
  for(const k of Object.keys(d)){
   if(typeof d[k]==='boolean')d[k]=typeof r[k]==='boolean'?r[k]:d[k];
   else if(typeof d[k]==='number')d[k]=number(r[k],0,100,d[k]);
  }
  if(id==='measure'){d.depth=number(r.depth,0,100,0);d.reading=number(r.reading,0,60,20);}
  const choices={measure:{eye:['high','level','low']},convection:{rise:['up','down'],across:['left','right'],sink:['up','down']},radiation:{prediction:['lower','same','higher'],explanation:['light','touch','cold']},insulation:{compare:['lower','same','higher'],explanation:['in','out','create']}};
  for(const [key,allowed] of Object.entries(choices[id]||{}))d[key]=allowed.includes(r[key])?r[key]:'';
  if('points' in d){const allowed=id==='contact'?['warm','cold']:id==='conduction'?['A','B','C']:['bottom','middle','top'];d.points=Array.isArray(r.points)?r.points.filter((p,i,a)=>allowed.includes(p)&&a.indexOf(p)===i).slice(0,allowed.length):[];}
  if(id==='conduction')d.actual=Array.isArray(r.actual)&&r.actual.join()==='A,B,C'?['A','B','C']:[];
  if(id==='convection'){
   d.records=Array.isArray(r.records)?r.records.filter(v=>v&&typeof v.window==='boolean'&&typeof v.heater==='boolean').slice(-12).map(v=>({window:v.window,heater:v.heater})):[];
   d.controlled=d.records.some((a,i)=>d.records.slice(i+1).some(b=>a.window===b.window&&a.heater!==b.heater));
  }
  if(id==='radiation')d.records=Array.isArray(r.records)?[...new Set(r.records.filter(v=>typeof v==='boolean'))]:[];
  if(id==='insulation'){d.material=['none','cloth','air','metal'].includes(r.material)?r.material:'none';d.actual=r.actual===null?null:number(r.actual,8,25,null);}
  return d;
 }
 function initial(saved){
  const r=object(saved),activity=ids.includes(r.activity)?r.activity:'measure';
  const s={version:1,activity,step:'setup',seen:{},inventory:[],predictions:{},observations:{},choices:{},notebook:[],done:{},work:{},complete:false,feedback:''};
  for(const id of ids){s.work[id]=cleanWork(id,object(r.work)[id]);if(object(r.done)[id]===true)s.done[id]=true;if(typeof object(r.observations)[id]==='string')s.observations[id]=r.observations[id].slice(0,600);}
  s.inventory=Array.isArray(r.inventory)?[...new Set(r.inventory.filter(x=>items.includes(x)))]:[];
  s.notebook=Array.isArray(r.notebook)?[...new Set(r.notebook.filter(x=>['warning','echo','studio','stop'].includes(x)))]:[];
  for(const [k,v] of Object.entries(object(r.seen)))if(/^[a-z-]{1,40}$/.test(k)&&v===true)s.seen[k]=true;
  for(const [k,v] of Object.entries(object(r.choices)))if(/^[a-z-]{1,40}$/.test(k)&&['0','1','2'].includes(String(v)))s.choices[k]=String(v);
  if(r.step==='result'&&s.observations[activity])s.step='result';
  if(s.done[activity])s.step='done';
  s.complete=s.done.tape===true;
  return s;
 }
 function preview(section){const s=initial();s.inventory=['notebook','handkerchief','thermometer'];s.notebook=['warning'];if(['bench','infirmary','studio'].includes(section)){s.done.measure=true;s.done.contact=true;}if(['infirmary','studio'].includes(section)){s.done.conduction=true;s.done.convection=true;}if(section==='studio'){s.done.radiation=true;s.done.insulation=true;s.inventory.push('packing');}return s;}
 function act(state,e){
  const s=clone(state),id=s.activity,w=s.work[id];
  if(e.type==='enter'&&ids.includes(e.target)){s.activity=e.target;s.step=s.done[e.target]?'done':s.observations[e.target]?'result':'setup';s.feedback='';return s;}
  if(e.type==='take'&&items.includes(e.target)){if(!s.inventory.includes(e.target))s.inventory.push(e.target);return s;}
  if(e.type==='note'&&['warning','echo','studio','stop'].includes(e.target)){if(!s.notebook.includes(e.target))s.notebook.push(e.target);return s;}
  if(e.type==='choice'&&/^[a-z-]{1,40}$/.test(e.target)&&['0','1','2'].includes(String(e.value))){s.choices[e.target]=String(e.value);return s;}
  if(s.step==='running'&&e.type!=='observed')return s;
  if(s.step==='done')return s;
  if(e.type==='set'&&Object.hasOwn(defaults[id],e.target)&&!['actual','records','controlled','points'].includes(e.target)){
   s.work[id]=cleanWork(id,{...w,[e.target]:e.value});
   if(['shield','material','lid','gap','depth'].includes(e.target)){s.step='setup';delete s.observations[id];}s.feedback='';return s;
  }
  if(e.type==='point'&&Array.isArray(w.points)){
   const allowed=id==='contact'?['warm','cold']:id==='conduction'?['A','B','C']:['bottom','middle','top'];
   if(allowed.includes(e.target)&&!w.points.includes(e.target))w.points.push(e.target);s.feedback='';return s;
  }
  if(e.type==='clear'&&w.points){w.points=[];s.feedback='';return s;}
  if(e.type==='retry'){s.step='setup';s.feedback='';return s;}
  if(e.type==='run'){
   if(id==='measure'&&(w.depth<35||w.depth>70)){s.feedback='액체샘이 물속에 잠기되 컵 바닥에는 닿지 않도록 높이를 조절해 보자.';return s;}
   if(id==='conduction'&&w.points.length!==3){s.feedback='세 위치를 변화가 생길 것 같은 순서대로 짚어 보자.';return s;}
   if(id==='convection'&&(!w.rise||!w.across||!w.sink)){s.feedback='그림의 ① ② ③ 화살표를 눌러 공기가 움직일 방향을 모두 예상해 보자.';return s;}
   if(id==='radiation'&&!w.prediction){s.feedback='가림판을 놓으면 금속판의 온도는 어떻게 달라질까? 먼저 예상해 보자. 예상이 달라도 실험할 수 있어.';return s;}
   if(id==='insulation'&&!w.compare){s.feedback='포장을 정한 뒤, 포장하지 않은 팩과 비교한 온도를 예상해 보자. 정확한 숫자는 몰라도 괜찮아.';return s;}
   if(id==='tape'){s.feedback='테이프를 넣고 처음으로 되감아 보자.';return s;}
   s.step='running';s.feedback='관찰 중… 실제 가열과 장치 조작은 선생님이 맡아요.';return s;
  }
  if(e.type==='observed'&&s.step==='running'){
   s.step='result';
   const texts={measure:'액주가 멈췄다. 세 눈높이에서 끝이 가리키는 눈금을 각각 읽고, 실제 온도를 기록할 눈높이를 골라 보자.',contact:'따뜻한 물 48 → 35℃, 차가운 물 18 → 28℃. 열이 이동한 쪽을 연결하자.',conduction:'가열점에 가까운 A, 연결된 B, 끝의 C 순서로 변했다.',convection:'데워진 공기가 위로 올라가 천장을 따라 퍼지고, 식은 공기가 내려온다. 공기가 이동하면서 열도 함께 옮겨진다. 예상 화살표를 관찰 결과와 비교해 고쳐 보자.',radiation:w.shield?'가림판 있음: 20 → 23℃. 가림판은 온도를 낮춘 것이 아니라 온도가 올라가는 정도를 줄였다.':'가림판 없음: 20 → 31℃. 이제 빛 사이에 가림판을 놓고 같은 시간 동안 비교해 보자.'};
   if(id==='conduction')w.actual=['A','B','C'];
   if(id==='convection'){w.records.push({window:w.window,heater:w.heater});w.records=w.records.slice(-12);w.controlled=w.records.some((a,i)=>w.records.slice(i+1).some(b=>a.window===b.window&&a.heater!==b.heater));}
   if(id==='radiation'&&!w.records.includes(w.shield))w.records.push(w.shield);
   if(id==='insulation'){w.actual=['air','cloth'].includes(w.material)?(w.lid&&!w.gap?12:17):21;texts.insulation=`처음은 두 팩 모두 8℃. 같은 시간이 지난 뒤 기준 20℃, 내 포장 ${w.actual}℃. (비교용 모형)`;}
   s.observations[id]=texts[id];s.feedback=texts[id];return s;
  }
  if(id==='tape'){
   if(e.type==='insert'&&s.inventory.includes('tape'))w.inserted=true;
   if(e.type==='rewind'&&w.inserted)w.rewound=true;
   if(e.type==='play'&&w.inserted&&w.rewound){s.done.tape=true;s.complete=true;s.step='done';}
   return s;
  }
  if(e.type==='check'&&s.step==='result'){
   const correct={measure:w.high===28&&w.level===32&&w.low===36&&w.eye==='level',contact:w.points?.join()==='warm,cold',conduction:w.points?.join()==='A,B,C',convection:w.rise==='up'&&w.across==='right'&&w.sink==='down',radiation:w.records?.includes(false)&&w.records?.includes(true)&&w.explanation==='light',insulation:w.actual<models.insulation.reference&&w.explanation==='in'};
   const hints={measure:'작은 눈금 한 칸은 2℃야. 각 그림의 점선 끝과 눈금을 비교하고, 액주 끝과 나란한 눈높이를 찾아보자.',contact:'온도가 내려간 쪽에서 올라간 쪽으로 연결해 볼까?',conduction:'색이 변한 순서를 보자. 가까워 보여도 금속으로 이어진 길을 따라가야 해.',convection:'관찰 그림의 공기 흐름과 내 화살표가 같은지 비교해 보자. 데워진 공기는 어디로 갔지?',radiation:(w.records?.length||0)<2?'가림판이 없을 때와 있을 때를 모두 관찰해야 비교할 수 있어.':'전등과 금속판은 서로 닿지 않았어. 가림판으로 무엇을 막았는지 생각해 보자.',insulation:w.actual>=20?'포장한 팩이 기준보다 덜 따뜻해지지 않았어. 재료나 덮개·틈을 바꾸고 다시 관찰해 보자.':'바깥 공기는 팩보다 따뜻해. 열이 어느 쪽에서 들어오는 걸 줄였을까?'};
   if(correct[id]){s.done[id]=true;s.step='done';s.feedback='관찰 기록을 수첩에 남겼다.';}else s.feedback=hints[id];
  }
  return s;
 }
 return {initial,act,preview,models,ids};
});
