(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Chapter3Story=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const rooms={
  editing:{art:'assets/chapter2-v3/coast-room.png',name:'편집실'},
  corridor:{art:'assets/corridor-morning-v1.png',name:'과학실로 이어진 복도'},
  science:{art:'assets/chapter3/science-room-cartoon-v2.png',openArt:'assets/chapter3/science-room-open-cartoon-v2.png',name:'과학실'},
  bench:{art:'assets/chapter3/science-bench-cartoon-v2.png',name:'과학실 옆 실험대'},
  infirmary:{art:'assets/chapter3/infirmary-cartoon-v2.png',name:'보건실'},
  studio:{art:'assets/chapter3/small-studio-cartoon-v2.png',name:'작은 방송실'}
 };
 const previewScenes={start:'chapter3-start',measure:'c3-measure-intro',bench:'c3-bench-intro',infirmary:'c3-infirmary',studio:'c3-studio'};
 const notebook={warning:'찾으러 와 줘서 고마워. 그런데 지금 뒤돌아보지는 마.',echo:'아까 대답한 건 내가 아니야.',studio:'작은 방송실. 불이 켜진 자리에서 기다릴게.',stop:'재생을 멈춰.'};
 function build(){
  const s={};
  function line(id,speaker,text,next,room='science',extra={}){s[id]={label:'3편 · '+rooms[room].name,date:'1999년 12월 28일',time:'낮 12:10',mode:'past',chapter3Room:room,chars:['taeo','somi'],active:speaker==='태오'?'taeo':speaker==='1999년 담임'?'teacher':'somi',speaker,line:text,next,...extra};}
  function chain(prefix,rows,next,room,extra={}){rows.forEach(([who,text],i)=>line(prefix+(i||''),who,text,i===rows.length-1?next:prefix+(i+1),room,extra));}
  function branch(id,question,next,options,room){line(id,'소미',question,next,room,{choices:options.map((o,i)=>({text:o[0],branch:id+'-'+i}))});options.forEach((o,i)=>chain(id+'-'+i,o.slice(1),next,room));}
  function lab(id,activity,next,room){line(id,'소미','주변 물건을 살펴보자. 먼저 확인할 것이 있으면 수첩에 적어 둘게.',next,room,{experiment:'chapter3',activity,chars:[]});}
  chain('chapter3-start',[
   ['소미','수첩에 또 글씨가 생겼어. “찾으러 와 줘서 고마워. 그런데 지금 뒤돌아보지는 마.”'],
   ['태오','……방금 의자 끄는 소리, 들었지? 소미야. 너 내 옆에 있지?'],
   ['소미','응. 여기 있어. …잠깐. 뒤에서도 방금 “응”이라고 했어.']
  ],'c3-first-choice','editing',{chapter3Note:'warning'});
  branch('c3-first-choice','고개를 돌리기 전에, 어떻게 확인할까?','c3-teacher-arrives',[
   ['모니터에 비친 뒤쪽을 살핀다.',['태오','의자만 보여. 그런데 아까보다 가까이 와 있지 않아?'],['소미','내가 본 위치도 적어 둘게. 화면이랑 실제 방이 같은지 아직 몰라.']],
   ['소미의 소매를 잡는다.',['소미','나도 네 손 잡고 있을게. 같이 있자.'],['태오','그럼 뒤에서 대답한 건 누구야……?']],
   ['문밖의 선생님을 부른다.',['태오','선생님! 저희 여기 있어요!'],['소미','복도에서 발소리가 들려. 이번에는 문이 열리는 것도 같이 보자.']]
  ],'editing');
  chain('c3-teacher-arrives',[
   ['1999년 담임','많이 놀랐구나. 선생님이 왔다. 너희는 함께 있으렴.'],
   ['소미','저 의자에 손수건이 있어요. 조금 전에는 없었는데요.'],
   ['1999년 담임','과학실에서 쓰던 손수건과 같구나. 옆 반 선생님께 수색을 부탁하고, 우리도 함께 확인해 보자.']
  ],'c3-walk','editing',{chars:['teacher','somi'],chapter3Take:'handkerchief'});
  chain('c3-walk',[
   ['태오','복도 끝 과학실이지? 혼자 먼저 가지 마.'],
   ['소미','응. 하나를 찾으러 온 거지만…… 방금 목소리까지 하나라고 정하지는 말자.'],
   ['1999년 담임','과학실 문은 열려 있구나. 오늘 수업 도구가 아직 남아 있다. 뜨거운 물건은 선생님이 살펴보마.']
  ],'c3-measure-intro','corridor');
  chain('c3-measure-intro',[
   ['태오','물이 든 컵이 있네. 아직 따뜻하면, 방금까지 누가 있었던 거잖아?'],
   ['소미','정말 따뜻한지 어떻게 확인하지? 느낌 말고 기록으로 남기고 싶어.']
  ],'c3-measure','science');
  lab('c3-measure','measure','c3-measure-after','science');
  chain('c3-measure-after',[
   ['소미','32℃. 느낌 말고 온도로 적었어.'],
   ['1999년 담임','잘 읽었구나. 다만 누가 언제 놓았는지는 이것만으로 알 수 없단다.'],
   ['태오','이 큰 그릇 안에 컵 자국이 있어. 따뜻한 물에 담가 뒀던 걸까?'],
   ['소미','공책에도 “기다리니까 덜 차가워졌다”라고 적혀 있어. 같은 방법으로 확인해 보자.']
  ],'c3-contact','science',{chars:['teacher','somi']});
  lab('c3-contact','contact','c3-contact-after','science');
  chain('c3-contact-after',[
   ['소미','따뜻한 쪽은 식고 차가운 쪽은 따뜻해졌어. 높은 온도에서 낮은 온도로 열이 이동했네.'],
   ['태오','그럼 컵이 따뜻하다고 방금 누가 있었다는 건 아니구나.'],
   ['소미','……공책 마지막 줄 봐. “아직 따뜻하면, 방금까지 누가 있었던 거잖아?”'],
   ['태오','그거 방금 내가 한 말인데. 누가 적었어?']
  ],'c3-bench-intro','science');
  line('c3-bench-intro','소미','옆 실험대 그림자가 움직여. 선생님, 여기 수업 도구부터 같이 봐 주세요.','c3-order','bench');
  // Each order has its own brief path, both converge after both observations.
  line('c3-order','소미','혼자 가지 말고 같이 살펴보자. 어디부터 볼까?','c3-bench-after','bench',{choices:[
   {text:'움직이는 종이부터 살펴본다.',branch:'c3-air-first'},
   {text:'손수건 옆 금속판부터 살펴본다.',branch:'c3-metal-first'}
  ]});
  chain('c3-air-first',[['태오','저거 사람 머리처럼 보였어.'],['소미','종이네. 무엇 때문에 움직이는지 확인해 보자.']],'c3-air-a','bench');
  lab('c3-air-a','convection','c3-metal-next','bench');
  chain('c3-metal-next',[['태오','종이는 멈췄네. 옆에 있는 판도 보자.'],['소미','굽은 금속판이야. 수업에서 썼던 색 표시가 남아 있어.']],'c3-metal-b','bench');
  lab('c3-metal-b','conduction','c3-bench-after','bench');
  chain('c3-metal-first',[['태오','판 끝에도 색이 변했어. 불은 저쪽인데?'],['소미','어떻게 이어져 있는지 따라가 보자.']],'c3-metal-a','bench');
  lab('c3-metal-a','conduction','c3-air-next','bench');
  chain('c3-air-next',[['소미','금속으로 이어진 길을 따라 변했네.'],['태오','그럼 저 종이는? 손도 안 댔는데 움직이잖아.']],'c3-air-b','bench');
  lab('c3-air-b','convection','c3-bench-after','bench');
  chain('c3-bench-after',[
   ['태오','금속판도 종이도 이유가 있었네. 나 혼자 괜히 놀랐잖아.'],
   ['소미','태오야. 종이는 멈췄어. 그런데 벽의 그림자는…… 방금 한 번 더 움직였어.'],
   ['태오','수첩 덮어. 지금 또 글씨가 생기고 있어.'],
   ['소미','“아까 대답한 건 내가 아니야.” ……누가 쓴 말이지?']
  ],'c3-door-intro','bench',{chapter3Note:'echo'});
  chain('c3-door-intro',[
   ['1999년 담임','더 혼자 살피지는 말자. 선생님이 문 앞에서 관리 선생님을 부를 테니 바로 뒤로 오렴.'],
   ['태오','선생님 나가시자마자 문이 닫혔어. 어? 손잡이가 헛돌아.'],
   ['소미','문밖에서 “창가 쪽으로 나오너라”라고 하셨어. 그런데 방송에서는……'],
   ['태오','“과학실 안에 그대로 있어라. 지금 올라가고 있다.” 같은 목소리잖아.']
  ],'c3-door-choice','science');
  branch('c3-door-choice','목소리만 듣고 움직이지 말자. 무엇을 확인할까?','c3-door-open',[
   ['문밖에 조금 전 일을 물어본다.',['태오','선생님, 아까 컵 온도가 얼마였어요?'],['소미','……대답이 없어. 손잡이에서도 손 뗀 것 같아.']],
   ['대답하지 않고 친구와 기다린다.',['소미','내 옆에 있어. 밖에 발소리가 몇 개인지 들어 보자.'],['태오','아무도 걸어오지 않았는데 문 바로 앞에서 말했어.']],
   ['안전한 출입구가 더 있는지 살핀다.',['태오','창밖은 높은데. 여기로 나가면 안 되겠다.'],['소미','맞아. 창문으로 나가지 말고 선생님을 기다리자.']]
  ],'science');
  chain('c3-door-open',[
   ['1999년 담임','이제 열리는구나. 관리 선생님이 손잡이를 고쳐 주셨다. 다친 곳은 없니?'],
   ['소미','조금 전에 문밖에서 말씀하셨어요? 방송도 하셨고요?'],
   ['1999년 담임','아니. 선생님은 관리실에 다녀왔다. 이제 보건실로 함께 가자. 이 손수건의 대여 기록을 확인해 보마.']
  ],'c3-infirmary-walk','science',{chapter3Open:true,chars:['teacher','somi']});
  line('c3-infirmary-walk','태오','계단 내려가서 왼쪽 보건실. 선생님이 바로 앞에 계신 거 계속 보고 있어.','c3-infirmary','corridor');
  chain('c3-infirmary',[
   ['소미','커튼 뒤에 누가 앉아 있는 것 같아.'],
   ['1999년 담임','선생님과 같이 확인하자. ……의자에 걸린 담요로구나.'],
   ['태오','옆 물건은 따뜻하네. 여긴 정말 누가 있었던 걸까?'],
   ['소미','전등 불빛을 받고 있어. 닿아 있지 않아도 따뜻해질 수 있을까?']
  ],'c3-radiation','infirmary');
  lab('c3-radiation','radiation','c3-radiation-after','infirmary');
  chain('c3-radiation-after',[
   ['소미','빛을 가리니 온도가 덜 올라갔어. 닿지 않아도 빛으로 열이 전달되는구나.'],
   ['태오','따뜻한 자리만 따라가면 엉뚱한 데로 가겠네.'],
   ['1999년 담임','대여 기록을 찾았다. 담요와 보냉 상자를 작은 방송실에 빌려 주었구나. 보건 선생님이 그쪽도 확인해 달라고 하셨다.'],
   ['소미','수첩에도 똑같은 곳이 적혀 있어. “작은 방송실. 불이 켜진 자리에서 기다릴게.” 누가 우리를 보고 있는 것 같아.']
  ],'c3-insulation-intro','infirmary',{chapter3Note:'studio'});
  chain('c3-insulation-intro',[
   ['1999년 담임','상자를 가져올 때 이 냉찜질 팩도 함께 옮기자꾸나. 차가운 상태가 오래가도록 포장할 수 있겠니?'],
   ['태오','따뜻하게 싸면 안 되는 거 아니에요? 차가워야 하는데.'],
   ['소미','포장재가 열을 만드는 건 아니잖아. 같은 조건으로 비교해 보자.']
  ],'c3-insulation','infirmary');
  lab('c3-insulation','insulation','c3-insulation-after','infirmary');
  chain('c3-insulation-after',[
   ['소미','포장한 쪽이 덜 따뜻해졌어. 바깥에서 열이 들어오는 걸 줄인 거네.'],
   ['태오','보온도 보냉도 열이 오가는 걸 줄이는 거구나. 자, 이번에는 같이 가자.'],
   ['1999년 담임','잘 챙겼구나. 작은 방송실은 이 복도 바로 끝이다. 문이 열려 있으니 선생님이 먼저 살펴보마.']
  ],'c3-studio','corridor',{chapter3Take:'packing'});
  chain('c3-studio',[
   ['태오','불은 켜져 있는데…… 의자만 있어.'],
   ['소미','담요랑 보냉 상자도 있어. 대여 기록에 있던 물건이 맞아.'],
   ['1999년 담임','상자는 비어 있구나. 냉찜질 팩을 넣기 전에 바닥도 살펴보자.'],
   ['태오','상자 바깥 밑면에 봉투가 붙어 있어요. 테이프예요!'],
   ['소미','차갑게 보관한 게 아니라 밑에 숨긴 거였네. 선생님, 녹음기로 확인해도 될까요?'],
   ['1999년 담임','젖거나 상한 곳은 없구나. 선생님과 함께 들어 보자.']
  ],'c3-tape','studio',{chapter3Take:'tape'});
  lab('c3-tape','tape','c3-recording','studio');
  chain('c3-recording',[
   ['소미','녹음에서 그 목소리가 들려. “수첩을 보고 여기까지 왔어?”'],
   ['태오','……우리가 올 줄 알았나 봐.'],
   ['소미','“그러면 거기에 적히는 말을 전부 믿으면 안 돼.” 잠깐. 수첩에 글씨가 생겼어. “재생을 멈춰.”']
  ],'c3-listen-choice','studio',{chapter3Note:'stop',chapter3Caption:'녹음 자막 · 실제 성우 음성이 아닌 자막 연출'});
  branch('c3-listen-choice','녹음과 수첩이 서로 다른 말을 해. 어떻게 할까?','c3-last-recording',[
   ['수첩을 덮고 녹음을 끝까지 듣는다.',['태오','아직 녹음도 믿는 건 아니지?'],['소미','응. 끝까지 듣고 둘을 비교하자는 거야.']],
   ['잠시 멈추고 선생님께 수첩을 보여 드린다.',['태오','우리가 쓰지도 않았는데 글씨가 생겨요.'],['소미','선생님도 보셨어. 이제 함께 남은 부분을 들어 보자.']],
   ['서로 떨어지지 않기로 하고 다시 재생한다.',['태오','내 이름 불러도 바로 가지 않을게.'],['소미','여기 있는 얼굴을 보고 이야기하자. 내가 옆에 있을게.']]
  ],'studio');
  chain('c3-last-recording',[
   ['소미','마지막 말이야. “나는 너희 이름을 몰라. 내 목소리로 너희 이름을 부르면…… 대답하지 마.”'],
   ['태오','……소미야. 방금 문밖에서 내 이름 불렀어?'],
   ['소미','아니. 녹음은 이미 끝났어.'],
   ['태오','그런데 문밖에서 또…… “태오야.”']
  ],'chapter3-end','studio',{chapter3Caption:'재생 종료 · 문밖에서 같은 목소리',chars:['taeo','somi']});
  return s;
 }
 return {build,rooms,previewScenes,notebook};
});
