(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var fmt=function(n){return '₹'+Math.round(n).toLocaleString('en-IN')};
var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};

/* ---------- data ---------- */
var COUPONS={
  ZAIKA50:{min:199,label:'50% off up to ₹100',disc:function(s){return Math.min(100,Math.round(s*.5))}},
  NEWBITE:{min:249,label:'₹75 off your first order',disc:function(){return 75}},
  FREEDEL:{min:299,label:'Free delivery',free:true}
};
var R=[
 {id:1,name:'Punjab Tandoor House',cu:'North Indian',e:'🍛',g:['#FF6B3D','#FFB020'],rt:4.5,t:28,cost:450,veg:0,off:'ZAIKA50',menu:[['Butter Chicken',329,0,'🍗'],['Paneer Tikka Masala',289,1,'🧀'],['Dal Makhani',219,1,'🥘'],['Garlic Naan',49,1,'🥖'],['Jeera Rice',129,1,'🍚'],['Sweet Lassi',89,1,'🥛']]},
 {id:2,name:'Slice Society',cu:'Pizza',e:'🍕',g:['#E8344B','#FF8A5B'],rt:4.3,t:32,cost:500,veg:0,off:'FREEDEL',menu:[['Margherita',249,1,'🍕'],['Farmhouse Pizza',329,1,'🍕'],['Pepperoni Pizza',369,0,'🍕'],['Garlic Bread',119,1,'🥖'],['Choco Lava Cake',99,1,'🍰']]},
 {id:3,name:'Smash Station',cu:'Burgers',e:'🍔',g:['#FFB020','#FF6B3D'],rt:4.2,t:25,cost:350,veg:0,off:null,menu:[['Double Smash Burger',249,0,'🍔'],['Aloo Tikki Burger',129,1,'🍔'],['Peri Peri Fries',109,1,'🍟'],['Chicken Wings',229,0,'🍗'],['Oreo Shake',149,1,'🥤']]},
 {id:4,name:'Dum Pukht Biryani Co.',cu:'Biryani',e:'🍚',g:['#F59E0B','#DC2626'],rt:4.6,t:38,cost:550,veg:0,off:'NEWBITE',menu:[['Chicken Dum Biryani',319,0,'🍗'],['Veg Dum Biryani',239,1,'🥗'],['Mutton Biryani',429,0,'🍖'],['Boondi Raita',59,1,'🥣'],['Gulab Jamun',79,1,'🍮']]},
 {id:5,name:'Wok This Way',cu:'Chinese',e:'🥡',g:['#0E96AD','#12915F'],rt:3.9,t:34,cost:400,veg:0,off:'ZAIKA50',menu:[['Hakka Noodles',189,1,'🍜'],['Chilli Paneer',229,1,'🌶️'],['Chicken Manchurian',259,0,'🍗'],['Veg Fried Rice',169,1,'🍚'],['Spring Rolls',149,1,'🥟']]},
 {id:6,name:'Dosa Junction',cu:'South Indian',e:'🥞',g:['#12915F','#A3D977'],rt:4.4,t:24,cost:250,veg:1,off:null,menu:[['Masala Dosa',119,1,'🥞'],['Idli Sambar',89,1,'🥣'],['Medu Vada',79,1,'🍩'],['Filter Coffee',49,1,'☕'],['Rava Upma',99,1,'🥣']]},
 {id:7,name:'Sweet Tooth Lab',cu:'Desserts',e:'🍰',g:['#FF7AA8','#FFB020'],rt:4.7,t:22,cost:300,veg:1,off:'FREEDEL',menu:[['Brownie Sundae',169,1,'🍨'],['Rasmalai',129,1,'🍮'],['Nutella Waffle',189,1,'🧇'],['Jalebi with Rabri',119,1,'🍯'],['Cold Coffee',129,1,'☕']]},
 {id:8,name:'Green Bowl Kitchen',cu:'Healthy',e:'🥗',g:['#12915F','#0E96AD'],rt:4.3,t:27,cost:420,veg:1,off:'NEWBITE',menu:[['Quinoa Power Bowl',279,1,'🥗'],['Hummus Wrap',199,1,'🌯'],['Fruit Yogurt Parfait',149,1,'🍓'],['Cold Pressed Juice',129,1,'🧃'],['Paneer Protein Salad',229,1,'🥙']]},
 {id:9,name:'Roll Mandi',cu:'Rolls',e:'🌯',g:['#F97316','#E8344B'],rt:3.9,t:26,cost:280,veg:0,off:null,menu:[['Chicken Kathi Roll',149,0,'🌯'],['Paneer Tikka Roll',139,1,'🌯'],['Egg Roll',99,0,'🥚'],['Veg Seekh Roll',129,1,'🌯'],['Masala Chai',29,1,'☕']]},
 {id:10,name:'Thali Ghar',cu:'Thali',e:'🍱',g:['#FFB020','#12915F'],rt:4.5,t:30,cost:320,veg:1,off:'ZAIKA50',menu:[['Punjabi Veg Thali',229,1,'🍱'],['Rajma Chawal',159,1,'🍛'],['Chole Bhature',149,1,'🥙'],['Kadhi Pakora',139,1,'🥘'],['Sweet Lassi',79,1,'🥛']]},
 {id:11,name:'Chaat Corner',cu:'Street Food',e:'🥔',g:['#EC4899','#FFB020'],rt:4.2,t:21,cost:200,veg:1,off:null,menu:[['Pani Puri',79,1,'🥟'],['Aloo Tikki Chaat',99,1,'🥔'],['Dahi Bhalla',109,1,'🥣'],['Samosa Chaat',99,1,'🥟'],['Pav Bhaji',149,1,'🍞']]},
 {id:12,name:'Momo Mahal',cu:'Momos',e:'🥟',g:['#0E96AD','#6B5BD6'],rt:4.1,t:29,cost:260,veg:0,off:null,menu:[['Steamed Veg Momos',99,1,'🥟'],['Chicken Fried Momos',139,0,'🥟'],['Tandoori Momos',159,0,'🥟'],['Schezwan Dip',29,1,'🌶️'],['Hot and Sour Soup',119,1,'🍲']]}
];
var CUE={'North Indian':'🍛','Pizza':'🍕','Burgers':'🍔','Biryani':'🍚','Chinese':'🥡','South Indian':'🥞','Desserts':'🍰','Healthy':'🥗','Rolls':'🌯','Thali':'🍱','Street Food':'🥔','Momos':'🥟'};
var byId=function(id){return R.filter(function(r){return r.id===id})[0]};

var S={cu:'All',q:'',veg:false,r4:false,fast:false,offers:false,fav:false,sort:'rel',favs:{},cart:{rid:null,items:{}},coupon:null,cmsg:'',order:null};
try{var sv=localStorage.getItem('ck-favs');if(sv)S.favs=JSON.parse(sv)||{}}catch(e){}
function saveFavs(){try{localStorage.setItem('ck-favs',JSON.stringify(S.favs))}catch(e){}}

/* ---------- toast & layers ---------- */
var toastT;
function toast(msg){var t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},2600)}
var LAYERS=['menuLayer','cartLayer','checkoutLayer','trackLayer'];
function show(id){LAYERS.forEach(function(l){$('#'+l).hidden=true});$('#'+id).hidden=false;$('#scrim').hidden=false}
function closeAll(){LAYERS.forEach(function(l){$('#'+l).hidden=true});$('#scrim').hidden=true}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});

/* ---------- offers & chips ---------- */
function renderOffers(){
  var codes=['ZAIKA50','NEWBITE','FREEDEL'];
  var h=codes.map(function(c){return '<button class="offer" type="button" data-act="copy" data-code="'+c+'"><h3>'+COUPONS[c].label+'</h3><span class="code">'+c+'</span><small>Min order '+fmt(COUPONS[c].min)+'. Tap to copy.</small></button>'}).join('');
  h+='<div class="offer"><h3>Free delivery above ₹499</h3><span class="code">AUTO</span><small>Applied at checkout, no code needed.</small></div>';
  $('#offers').innerHTML=h;
}
function renderChips(){
  var list=['All'].concat(Object.keys(CUE));
  $('#chips').innerHTML=list.map(function(c){return '<button class="chip" type="button" data-act="chip" data-cu="'+c+'" aria-pressed="'+(S.cu===c)+'"><i>'+(c==='All'?'🍽️':CUE[c])+'</i>'+c+'</button>'}).join('');
}

/* ---------- restaurant grid ---------- */
function filtered(){
  var q=S.q.trim().toLowerCase();
  var L=R.filter(function(r){
    if(S.cu!=='All'&&r.cu!==S.cu)return false;
    if(S.veg&&!r.veg)return false;
    if(S.r4&&r.rt<4)return false;
    if(S.fast&&r.t>30)return false;
    if(S.offers&&!r.off)return false;
    if(S.fav&&!S.favs[r.id])return false;
    if(q){var hay=(r.name+' '+r.cu+' '+r.menu.map(function(m){return m[0]}).join(' ')).toLowerCase();if(hay.indexOf(q)<0)return false}
    return true;
  });
  if(S.sort==='rating')L.sort(function(a,b){return b.rt-a.rt});
  if(S.sort==='time')L.sort(function(a,b){return a.t-b.t});
  if(S.sort==='cost')L.sort(function(a,b){return a.cost-b.cost});
  return L;
}
function renderGrid(){
  var L=filtered();
  $('#count').textContent=L.length+(L.length===1?' kitchen':' kitchens');
  if(!L.length){$('#grid').innerHTML='<div class="empty"><h3>No kitchens match</h3><p>Try clearing a filter or searching for something else.</p></div>';return}
  $('#grid').innerHTML=L.map(function(r){
    return '<article class="rcard"><div class="rart" style="background:linear-gradient(135deg,'+r.g[0]+','+r.g[1]+')">'+
      (r.off?'<span class="ribbon">'+r.off+' · '+COUPONS[r.off].label+'</span>':'')+
      '<button class="heart" type="button" data-act="fav" data-id="'+r.id+'" aria-pressed="'+!!S.favs[r.id]+'" aria-label="Favourite '+esc(r.name)+'">'+(S.favs[r.id]?'♥':'♡')+'</button>'+
      '<span>'+r.e+'</span></div>'+
      '<button class="rbody" type="button" data-act="open" data-id="'+r.id+'" style="border:0;background:none;text-align:left;cursor:pointer">'+
      '<div class="rtop"><h3>'+esc(r.name)+'</h3><span class="rate">★ '+r.rt+'</span></div>'+
      '<div class="rmeta"><span>'+r.cu+'</span><span>'+r.t+' min</span><span class="num">'+fmt(r.cost)+' for two</span></div>'+
      '<div class="rmeta"><span class="vdot'+(r.veg?'':' nv')+'" aria-hidden="true"></span><span>'+(r.veg?'Pure veg':'Veg and non-veg')+'</span></div></button></article>';
  }).join('');
}

/* ---------- menu ---------- */
function renderMenu(rid){
  var r=byId(rid);
  var inCart=S.cart.rid===rid?S.cart.items:{};
  var items=r.menu.map(function(m,i){
    var q=inCart[i]||0;
    return '<div class="item"><div class="em">'+m[3]+'</div><div><h4><span class="vdot'+(m[2]?'':' nv')+'" aria-hidden="true"></span>'+esc(m[0])+'</h4><div class="pr num">'+fmt(m[1])+'</div></div>'+
      (q?'<div class="step"><button type="button" data-act="dec" data-r="'+rid+'" data-i="'+i+'" aria-label="Remove one '+esc(m[0])+'">−</button><span class="num">'+q+'</span><button type="button" data-act="add" data-r="'+rid+'" data-i="'+i+'" aria-label="Add one '+esc(m[0])+'">+</button></div>'
         :'<button class="add" type="button" data-act="add" data-r="'+rid+'" data-i="'+i+'">Add</button>')+'</div>';
  }).join('');
  var b=bill();
  $('#menuLayer').innerHTML='<div class="lhead" style="background:linear-gradient(rgba(0,0,0,.32),rgba(0,0,0,.32)),linear-gradient(135deg,'+r.g[0]+','+r.g[1]+')"><div class="lhead-t"><span class="big">'+r.e+'</span><div><h2>'+esc(r.name)+'</h2><p>'+r.cu+' · ★ '+r.rt+' · '+r.t+' min · '+fmt(r.cost)+' for two</p></div></div><button class="x" type="button" data-act="close" aria-label="Close menu">✕</button></div>'+
    '<div class="lbody">'+items+'</div>'+
    '<div class="lfoot"><span class="note">'+(b&&b.n?b.n+' item'+(b.n>1?'s':'')+' · '+fmt(b.sub):'Add dishes to start an order')+'</span><button class="btn" type="button" data-act="cart"'+(b&&b.n?'':' disabled')+'>View cart</button></div>';
  $('#menuLayer').dataset.rid=rid;
  show('menuLayer');
}
function refreshMenu(){var m=$('#menuLayer');if(!m.hidden&&m.dataset.rid){var sc=$('.lbody',m).scrollTop;renderMenu(+m.dataset.rid);$('.lbody',m).scrollTop=sc}}

/* ---------- cart ---------- */
function bill(){
  if(!S.cart.rid)return null;
  var r=byId(S.cart.rid),sub=0,n=0;
  Object.keys(S.cart.items).forEach(function(i){var q=S.cart.items[i];sub+=r.menu[i][1]*q;n+=q});
  if(!n)return null;
  var disc=0,free=false,msg='',ok=false;
  if(S.coupon){var d=COUPONS[S.coupon];if(sub<d.min){msg='Add '+fmt(d.min-sub)+' more to use '+S.coupon+'.'}else{disc=d.disc?d.disc(sub):0;free=!!d.free;ok=true}}
  var del=(sub>=499||free)?0:30,fee=5,gst=Math.round((sub-disc)*.05);
  return {r:r,sub:sub,n:n,disc:disc,del:del,fee:fee,gst:gst,total:sub-disc+del+fee+gst,msg:msg,ok:ok,free:free};
}
function updateBadge(){
  var b=bill();
  $('#cartCount').textContent=b?b.n:0;
  $('#cartTotal').textContent=b?fmt(b.total):'';
}
function addItem(rid,i){
  if(S.cart.rid&&S.cart.rid!==rid){S.cart={rid:rid,items:{}};S.coupon=null;S.cmsg='';toast('Cart switched to '+byId(rid).name)}
  S.cart.rid=rid;S.cart.items[i]=(S.cart.items[i]||0)+1;afterCart();
}
function decItem(rid,i){
  if(!S.cart.items[i])return;
  S.cart.items[i]--;if(S.cart.items[i]<=0)delete S.cart.items[i];
  if(!Object.keys(S.cart.items).length){S.cart={rid:null,items:{}};S.coupon=null;S.cmsg=''}
  afterCart();
}
function afterCart(){updateBadge();refreshMenu();if(!$('#cartLayer').hidden)renderCart()}
function renderCart(){
  var b=bill(),h='<div class="dhead"><h2>Your cart</h2><button class="x" type="button" data-act="close" aria-label="Close cart">✕</button></div>';
  if(!b){
    h+='<div class="lbody"><div class="empty" style="margin-top:16px"><h3>Your cart is empty</h3><p>Pick a kitchen and add a dish or two.</p></div></div><div class="lfoot"><button class="btn" type="button" data-act="close">Browse kitchens</button></div>';
    $('#cartLayer').innerHTML=h;show('cartLayer');return;
  }
  var r=b.r;
  h+='<div class="lbody"><p class="note" style="margin-top:12px">From <b>'+esc(r.name)+'</b></p>';
  h+=Object.keys(S.cart.items).map(function(i){var m=r.menu[i],q=S.cart.items[i];
    return '<div class="item"><div class="em">'+m[3]+'</div><div><h4><span class="vdot'+(m[2]?'':' nv')+'" aria-hidden="true"></span>'+esc(m[0])+'</h4><div class="pr num">'+fmt(m[1]*q)+'</div></div><div class="step"><button type="button" data-act="dec" data-r="'+r.id+'" data-i="'+i+'" aria-label="Remove one">−</button><span class="num">'+q+'</span><button type="button" data-act="add" data-r="'+r.id+'" data-i="'+i+'" aria-label="Add one">+</button></div></div>'}).join('');
  h+='<form class="coupon" id="couponForm"><input id="couponIn" placeholder="Coupon code" aria-label="Coupon code" value="'+(S.coupon||'')+'"><button class="btn ghost" type="submit">Apply</button></form>';
  h+='<p class="note '+(b.ok?'ok':(S.cmsg||b.msg?'bad':''))+'">'+(b.ok?S.coupon+' applied: '+COUPONS[S.coupon].label:(b.msg||S.cmsg||'Try ZAIKA50, NEWBITE or FREEDEL.'))+'</p>';
  h+='<div class="bill num"><div><span>Item total</span><span>'+fmt(b.sub)+'</span></div>'+
     (b.disc?'<div class="sav"><span>Coupon discount</span><span>−'+fmt(b.disc)+'</span></div>':'')+
     '<div><span>Delivery</span><span>'+(b.del?fmt(b.del):'Free')+'</span></div>'+
     '<div><span>Platform fee</span><span>'+fmt(b.fee)+'</span></div>'+
     '<div><span>GST (5%)</span><span>'+fmt(b.gst)+'</span></div>'+
     '<div class="tot"><span>To pay</span><span>'+fmt(b.total)+'</span></div></div>';
  if(b.sub<499&&!b.free)h+='<p class="note">Add '+fmt(499-b.sub)+' more for free delivery.</p>';
  h+='</div><div class="lfoot"><span class="num" style="font-weight:800;font-size:18px">'+fmt(b.total)+'</span><button class="btn" type="button" data-act="checkout">Checkout</button></div>';
  $('#cartLayer').innerHTML=h;show('cartLayer');
}
document.addEventListener('submit',function(e){
  if(e.target.id==='couponForm'){
    e.preventDefault();
    var v=$('#couponIn').value.trim().toUpperCase();
    if(!v){S.coupon=null;S.cmsg=''}
    else if(COUPONS[v]){S.coupon=v;S.cmsg=''}
    else{S.coupon=null;S.cmsg='That code is not valid. Try ZAIKA50, NEWBITE or FREEDEL.'}
    updateBadge();renderCart();
  }
  if(e.target.id==='checkoutForm'){
    e.preventDefault();placeOrder();
  }
  if(e.target.id==='searchForm'){
    e.preventDefault();S.q=$('#q').value;renderGrid();$('#grid').scrollIntoView({behavior:'smooth',block:'start'});
  }
});

/* ---------- checkout & tracking ---------- */
function renderCheckout(){
  var b=bill();if(!b){renderCart();return}
  $('#checkoutLayer').innerHTML='<div class="dhead"><h2>Checkout</h2><button class="x" type="button" data-act="close" aria-label="Close checkout">✕</button></div>'+
   '<form id="checkoutForm" class="lbody form" novalidate>'+
   '<label>Full name<input id="cName" autocomplete="name" placeholder="Aarav Sharma"></label>'+
   '<label>Phone<input id="cPhone" inputmode="tel" placeholder="98765 43210"></label>'+
   '<label>Delivery address<textarea id="cAddr" rows="2" placeholder="House no, street, landmark ('+esc($('#area').value)+')"></textarea></label>'+
   '<div><p style="font-weight:500;font-size:13.5px;margin-bottom:6px">Payment</p><div class="pay"><label><input type="radio" name="pay" value="UPI" checked> UPI</label><label><input type="radio" name="pay" value="Card"> Card</label><label><input type="radio" name="pay" value="Cash"> Cash</label></div></div>'+
   '<p class="note bad" id="cErr" hidden></p>'+
   '<p class="note">Demo only. No payment is taken and no food is sent.</p>'+
   '<button class="btn" type="submit">Place order · '+fmt(b.total)+'</button></form>';
  show('checkoutLayer');
}
var trackT;
function placeOrder(){
  var n=$('#cName').value.trim(),a=$('#cAddr').value.trim(),err=$('#cErr');
  if(!n||!a){err.textContent='Enter your name and delivery address to continue.';err.hidden=false;return}
  var b=bill(),pay=($('input[name=pay]:checked')||{}).value||'UPI';
  S.order={id:'CK-'+(10000+Math.floor(Math.random()*89999)),name:b.r.name,total:b.total,pay:pay,stage:0,addr:a};
  S.cart={rid:null,items:{}};S.coupon=null;S.cmsg='';updateBadge();
  renderTrack();clearInterval(trackT);
  trackT=setInterval(function(){S.order.stage++;renderTrack();if(S.order.stage>=3)clearInterval(trackT)},3500);
}
function renderTrack(){
  var o=S.order,steps=['Order placed','Kitchen is preparing','Rider is on the way','Delivered'];
  var eta=['Estimated 30 min','About 25 min','About 10 min','Enjoy your meal!'][o.stage];
  $('#trackLayer').innerHTML='<div class="dhead"><h2>Order '+o.id+'</h2><button class="x" type="button" data-act="close" aria-label="Close tracking">✕</button></div>'+
   '<div class="lbody"><p style="margin:14px 0 4px;font-weight:700;font-size:18px">'+eta+'</p><p class="note">'+esc(o.name)+' · '+fmt(o.total)+' · '+o.pay+'</p>'+
   '<div class="track" style="margin-top:18px">'+steps.map(function(s,i){return '<div class="tstep '+(i<o.stage||o.stage===3?'done':(i===o.stage?'now':''))+'"><span class="tdot">'+(i<o.stage||o.stage===3?'✓':'')+'</span><span>'+s+'</span></div>'}).join('')+'</div></div>'+
   '<div class="lfoot"><span class="note">Demo tracker, updates every few seconds.</span><button class="btn" type="button" data-act="close">'+(o.stage===3?'Order again':'Keep browsing')+'</button></div>';
  show('trackLayer');
}

/* ---------- events ---------- */
document.addEventListener('click',function(e){
  var go=e.target.closest('[data-go]');
  if(go){e.preventDefault();var t=document.getElementById(go.dataset.go);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});return}
  var b=e.target.closest('[data-act]');
  if(!b){
    var tg=e.target.closest('.tog');
    if(tg){var f=tg.dataset.f;S[f]=!S[f];tg.setAttribute('aria-pressed',S[f]);renderGrid()}
    var xc=e.target.closest('.xlt td[data-f]');
    if(xc)selectCell(xc);
    return;
  }
  var a=b.dataset.act;
  if(a==='close'){closeAll()}
  else if(a==='chip'){S.cu=b.dataset.cu;renderChips();renderGrid()}
  else if(a==='fav'){var id=+b.dataset.id;if(S.favs[id])delete S.favs[id];else S.favs[id]=1;saveFavs();renderGrid()}
  else if(a==='open'){renderMenu(+b.dataset.id)}
  else if(a==='add'){addItem(+b.dataset.r,+b.dataset.i)}
  else if(a==='dec'){decItem(+b.dataset.r,+b.dataset.i)}
  else if(a==='cart'){renderCart()}
  else if(a==='checkout'){renderCheckout()}
  else if(a==='copy'){var c=b.dataset.code;try{navigator.clipboard.writeText(c).then(function(){toast(c+' copied')},function(){toast('Code: '+c)})}catch(x){toast('Code: '+c)}}
  else if(a==='sql'){curQ=+b.dataset.q;renderSql()}
  else if(a==='pri'){curPri=b.dataset.p;renderReq()}
});
$('#sort').addEventListener('change',function(e){S.sort=e.target.value;renderGrid()});
$('#q').addEventListener('input',function(e){S.q=e.target.value;renderGrid()});

/* ---------- sample orders ---------- */
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var rand=rng(2026),DAYS=28,N=640,START=new Date(2026,8,16);
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var dayLabel=function(i){var d=new Date(2026,8,16+i);return d.getDate()+' '+MON[d.getMonth()]};
var POP=[1.4,1.2,1,1.6,.8,.9,.7,.6,.7,.9,.6,.7],POPSUM=POP.reduce(function(a,b){return a+b},0);
function pickRest(){var x=rand()*POPSUM,i=0;while(x>POP[i]){x-=POP[i];i++}return R[i]}
var O=[];
while(O.length<N){
  var day=Math.floor(Math.pow(rand(),.75)*DAYS),wd=new Date(2026,8,16+day).getDay();
  if(!(wd===0||wd===6||rand()<.75))continue;
  var r=pickRest(),u=rand(),status=u<.93?'delivered':(u<.98?'cancelled':'refunded');
  var amt=Math.round((r.cost*.7+rand()*r.cost*.6)/5)*5;
  var mins=Math.max(14,Math.round(r.t+(rand()-.3)*16+(rand()<.1?12:0)));
  O.push({id:O.length+1,day:day,wk:Math.floor(day/7),cust:1+Math.floor(Math.pow(rand(),1.6)*190),rest:r.name,cu:r.cu,amt:amt,mins:mins,status:status});
}
var DEL=O.filter(function(o){return o.status==='delivered'});
var sum=function(a,f){return a.reduce(function(s,x){return s+f(x)},0)};

/* ---------- tools overview ---------- */
var TOOLS=[
 ['Elicitation','Interviews, surveys, workshops, observation','Stakeholder input shaped the stories below.','req'],
 ['Documentation','BRD, FRD, user stories, acceptance criteria. Jira and Confluence.','See the Requirements section.','req'],
 ['Process modelling','BPMN flowcharts, UML, swimlanes. Lucidchart or Visio.','Order lifecycle diagram.','process'],
 ['Data modelling','ER diagrams, data dictionary','Entity relationship diagram.','process'],
 ['SQL','Joins, aggregates, window functions','Four weekly business questions.','sql'],
 ['Excel','Pivot tables, SUMIFS, conditional formatting','Weekly revenue pivot.','excel'],
 ['Power BI and Tableau','KPIs, funnels, cohorts, drill-down','Performance dashboard.','dashboard'],
 ['Prototyping and UAT','Figma wireframes, Postman API checks, test cases','The storefront above is the working prototype.','store']
];
function renderTools(){
  $('#tools').innerHTML=TOOLS.map(function(t){return '<a class="tool" href="#'+t[3]+'" data-go="'+t[3]+'"><b>'+t[0]+'</b><h3>'+t[1]+'</h3><p>'+t[2]+'</p></a>'}).join('');
}

/* ---------- dashboard ---------- */
function pct(a,b){return b?Math.round(a/b*1000)/10:0}
function renderKpis(){
  var gmv=sum(DEL,function(o){return o.amt}),aov=gmv/DEL.length;
  var h1=DEL.filter(function(o){return o.day<14}),h2=DEL.filter(function(o){return o.day>=14});
  var g1=sum(h1,function(o){return o.amt}),g2=sum(h2,function(o){return o.amt});
  var o1=O.filter(function(o){return o.day<14}).length,o2=O.length-o1;
  var avgMin=sum(DEL,function(o){return o.mins})/DEL.length,onTime=pct(DEL.filter(function(o){return o.mins<=35}).length,DEL.length);
  var cancel=pct(O.filter(function(o){return o.status!=='delivered'}).length,O.length);
  var cc={};O.forEach(function(o){cc[o.cust]=(cc[o.cust]||0)+1});
  var custs=Object.keys(cc),rep=custs.filter(function(c){return cc[c]>=2}).length;
  var dg=Math.round((g2/g1-1)*100),dgo=Math.round((o2/o1-1)*100);
  var K=[
   ['Delivered revenue',fmt(gmv),(dg>=0?'▲ ':'▼ ')+Math.abs(dg)+'% vs prior 14 days',dg>=0?'up':'down'],
   ['Orders',O.length.toLocaleString('en-IN'),(dgo>=0?'▲ ':'▼ ')+Math.abs(dgo)+'% vs prior 14 days',dgo>=0?'up':'down'],
   ['Average order value',fmt(aov),'delivered orders','flat'],
   ['Avg delivery time',avgMin.toFixed(1)+' min',onTime+'% within 35 min',onTime>=80?'up':'down'],
   ['Cancel and refund rate',cancel+'%','of all orders',cancel<=7?'up':'down'],
   ['Repeat customers',pct(rep,custs.length)+'%',rep+' of '+custs.length+' customers','flat']
  ];
  $('#kpis').innerHTML=K.map(function(k){return '<div class="kpi"><small>'+k[0]+'</small><strong class="num">'+k[1]+'</strong><span class="pill '+k[3]+'">'+k[2]+'</span></div>'}).join('');
}
function niceStep(x){var p=Math.pow(10,Math.floor(Math.log10(x))),f=x/p;return (f<=1?1:f<=2?2:f<=5?5:10)*p}
function renderGmv(){
  var v=[];for(var i=0;i<DAYS;i++)v.push(0);
  DEL.forEach(function(o){v[o.day]+=o.amt});
  var W=640,H=250,p={l:52,r:20,t:20,b:30},max=Math.max.apply(null,v),step=niceStep(max/4),top=step*Math.ceil(max/step);
  var x=function(i){return p.l+(W-p.l-p.r)*i/(DAYS-1)},y=function(val){return p.t+(H-p.t-p.b)*(1-val/top)};
  var g='',k;
  for(k=0;k<=top/step;k++){var yy=y(k*step);g+='<line class="gl" x1="'+p.l+'" x2="'+(W-p.r)+'" y1="'+yy+'" y2="'+yy+'"/><text x="'+(p.l-8)+'" y="'+(yy+4)+'" text-anchor="end">'+(k*step>=1000?(k*step/1000)+'k':k*step)+'</text>'}
  var xl='';for(var i2=0;i2<DAYS;i2+=4)xl+='<text x="'+x(i2)+'" y="'+(H-8)+'" text-anchor="middle">'+dayLabel(i2)+'</text>';
  xl+='<text x="'+x(DAYS-1)+'" y="'+(H-8)+'" text-anchor="end">'+dayLabel(DAYS-1)+'</text>';
  var d=v.map(function(val,i){return (i?'L':'M')+x(i).toFixed(1)+' '+y(val).toFixed(1)}).join(' ');
  var area=d+' L'+x(DAYS-1)+' '+y(0)+' L'+x(0)+' '+y(0)+' Z';
  var li=v.length-1,peak=v.indexOf(max);
  $('#gmv').innerHTML='<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Line chart of daily delivered revenue in rupees">'+g+xl+'<path class="ar" d="'+area+'"/><path class="ln" d="'+d+'"/>'+
   '<circle class="dot" cx="'+x(li)+'" cy="'+y(v[li])+'" r="6"/><text class="lbl" x="'+(x(li)-10)+'" y="'+(y(v[li])-12)+'" text-anchor="end">'+fmt(v[li])+'</text>'+
   (peak!==li?'<circle class="dot" cx="'+x(peak)+'" cy="'+y(max)+'" r="5"/><text class="lbl" x="'+x(peak)+'" y="'+(y(max)-12)+'" text-anchor="middle">Peak '+fmt(max)+'</text>':'')+'</svg>';
}
function renderCuisine(){
  var m={};DEL.forEach(function(o){m[o.cu]=(m[o.cu]||0)+o.amt});
  var rows=Object.keys(m).map(function(k){return [k,m[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,8),mx=rows[0][1];
  $('#cuisBars').innerHTML=rows.map(function(r){return '<div class="hbar"><span>'+r[0]+'</span><span class="tr"><span class="fl" style="display:block;width:'+Math.round(r[1]/mx*100)+'%"></span></span><span class="num">'+fmt(r[1])+'</span></div>'}).join('');
}
function renderFunnel(){
  var st=[['Sessions',9800],['Searched or browsed',6900],['Viewed a menu',4300],['Added to cart',1900],['Reached checkout',980],['Placed order',O.length]];
  $('#funnel').innerHTML=st.map(function(s,i){var w=Math.round(s[1]/st[0][1]*100);
    return '<div class="hbar" style="grid-template-columns:120px minmax(0,1fr) 92px"><span>'+s[0]+'</span><span class="tr"><span class="fl" style="display:block;width:'+w+'%;opacity:'+(1-i*.1)+'"></span></span><span class="num">'+s[1].toLocaleString('en-IN')+(i?' · '+Math.round(s[1]/st[i-1][1]*100)+'%':'')+'</span></div>'}).join('')+
    '<p class="note">Percent shows how many carried on from the step above. Biggest drop: menu view to cart.</p>';
}
function renderCohort(){
  var first={};O.forEach(function(o){if(first[o.cust]===undefined||o.wk<first[o.cust])first[o.cust]=o.wk});
  var act={};O.forEach(function(o){act[o.cust+'-'+o.wk]=1});
  var h='<table class="cohort"><tr><th></th><th>Customers</th><th>Week 0</th><th>Week 1</th><th>Week 2</th><th>Week 3</th></tr>';
  for(var w=0;w<4;w++){
    var cs=Object.keys(first).filter(function(c){return first[c]===w});
    h+='<tr><td class="lab">Joined '+dayLabel(w*7)+'</td><td>'+cs.length+'</td>';
    for(var k=0;k<4;k++){
      if(w+k>3){h+='<td style="background:transparent"></td>';continue}
      var n=cs.filter(function(c){return act[c+'-'+(w+k)]}).length,pc=Math.round(n/cs.length*100);
      h+='<td style="--v:'+(k===0?85:Math.min(85,pc*2.2))+'">'+pc+'%</td>';
    }
    h+='</tr>';
  }
  $('#cohort').innerHTML=h+'</table>';
}
function renderHist(){
  var lab=['Under 20','20–25','25–30','30–35','35–40','40–45','45+'],c=lab.map(function(){return 0});
  DEL.forEach(function(o){var i=o.mins<20?0:o.mins<25?1:o.mins<30?2:o.mins<35?3:o.mins<40?4:o.mins<45?5:6;c[i]++});
  var mx=Math.max.apply(null,c);
  $('#hist').innerHTML=lab.map(function(l,i){return '<div class="'+(i>=4?'late':'')+'"><b class="num">'+c[i]+'</b><i style="height:'+Math.max(4,Math.round(c[i]/mx*120))+'px"></i><span>'+l+'</span></div>'}).join('');
}

/* ---------- SQL ---------- */
var Q=[
 {n:'Top cuisines',sql:"SELECT cuisine,\n       COUNT(*)        AS orders,\n       SUM(amount)     AS revenue,\n       ROUND(AVG(amount)) AS aov\nFROM orders\nWHERE status = 'delivered'\nGROUP BY cuisine\nORDER BY revenue DESC\nLIMIT 5;",
  run:function(){var m={};DEL.forEach(function(o){var a=m[o.cu]||(m[o.cu]={n:0,s:0});a.n++;a.s+=o.amt});
    var rows=Object.keys(m).map(function(k){return [k,m[k].n,m[k].s,Math.round(m[k].s/m[k].n)]}).sort(function(a,b){return b[2]-a[2]}).slice(0,5);
    return {cols:['cuisine','orders','revenue','aov'],rows:rows.map(function(r){return [r[0],r[1],fmt(r[2]),fmt(r[3])]})}}},
 {n:'Repeat customers',sql:"SELECT COUNT(*)                                   AS customers,\n       COUNT(*) FILTER (WHERE order_count >= 2)   AS repeat_customers,\n       ROUND(100.0 * COUNT(*) FILTER (WHERE order_count >= 2)\n             / COUNT(*), 1)                       AS repeat_rate_pct\nFROM (SELECT customer_id, COUNT(*) AS order_count\n      FROM orders\n      GROUP BY customer_id) c;",
  run:function(){var cc={};O.forEach(function(o){cc[o.cust]=(cc[o.cust]||0)+1});var ks=Object.keys(cc),rp=ks.filter(function(k){return cc[k]>=2}).length;
    return {cols:['customers','repeat_customers','repeat_rate_pct'],rows:[[ks.length,rp,pct(rp,ks.length)]]}}},
 {n:'Late deliveries',sql:"SELECT restaurant,\n       COUNT(*)                                        AS delivered,\n       ROUND(AVG(delivery_min), 1)                     AS avg_min,\n       ROUND(100.0 * SUM(CASE WHEN delivery_min > 35\n                              THEN 1 ELSE 0 END)\n             / COUNT(*), 1)                            AS late_pct\nFROM orders\nWHERE status = 'delivered'\nGROUP BY restaurant\nORDER BY late_pct DESC\nLIMIT 5;",
  run:function(){var m={};DEL.forEach(function(o){var a=m[o.rest]||(m[o.rest]={n:0,s:0,l:0});a.n++;a.s+=o.mins;if(o.mins>35)a.l++});
    var rows=Object.keys(m).map(function(k){return [k,m[k].n,(m[k].s/m[k].n).toFixed(1),pct(m[k].l,m[k].n)]}).sort(function(a,b){return b[3]-a[3]}).slice(0,5);
    return {cols:['restaurant','delivered','avg_min','late_pct'],rows:rows}}},
 {n:'Weekly trend',sql:"SELECT week,\n       COUNT(*)                                   AS orders,\n       ROUND(AVG(amount) FILTER (WHERE status = 'delivered')) AS aov,\n       ROUND(100.0 * COUNT(*) FILTER (WHERE status <> 'delivered')\n             / COUNT(*), 1)                       AS cancel_pct\nFROM orders\nGROUP BY week\nORDER BY week;",
  run:function(){var rows=[];for(var w=0;w<4;w++){var a=O.filter(function(o){return o.wk===w}),d=a.filter(function(o){return o.status==='delivered'});
    rows.push(['Week '+(w+1),a.length,fmt(sum(d,function(o){return o.amt})/d.length),pct(a.length-d.length,a.length)])}
    return {cols:['week','orders','aov','cancel_pct'],rows:rows}}}
];
var curQ=0;
var KW=/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|AS|COUNT|SUM|AVG|ROUND|FILTER|CASE|WHEN|THEN|ELSE|END|DESC)\b/g;
function renderSql(){
  $('#qpills').innerHTML=Q.map(function(q,i){return '<button class="qbtn" type="button" data-act="sql" data-q="'+i+'" aria-pressed="'+(i===curQ)+'">'+q.n+'</button>'}).join('');
  $('#qtext').innerHTML=esc(Q[curQ].sql).replace(KW,'<span class="k">$1</span>');
  var r=Q[curQ].run();
  $('#qres').innerHTML='<table><thead><tr>'+r.cols.map(function(c,i){return '<th class="'+(i?'r':'')+'">'+c+'</th>'}).join('')+'</tr></thead><tbody>'+r.rows.map(function(row){return '<tr>'+row.map(function(c,i){return '<td class="'+(i?'r':'')+'">'+c+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>';
}

/* ---------- Excel pivot ---------- */
var XL={};
function renderExcel(){
  var cus=Object.keys(CUE),L='ABCDEFG',tot=[0,0,0,0],grand=0,mx=0,data={};
  cus.forEach(function(c){data[c]=[0,0,0,0];DEL.forEach(function(o){if(o.cu===c)data[c][o.wk]+=o.amt})});
  cus.forEach(function(c){data[c].forEach(function(v){mx=Math.max(mx,v)});data[c].forEach(function(v,i){tot[i]+=v});grand+=sum(data[c],function(v){return v})});
  var h='<table class="xlt"><tr><th></th>'+L.split('').map(function(l){return '<th>'+l+'</th>'}).join('')+'</tr>';
  h+='<tr class="h"><th>1</th><td class="t" data-f="Cuisine" data-ref="A1">Cuisine</td>'+['Week 1','Week 2','Week 3','Week 4'].map(function(w,i){return '<td data-ref="'+L[i+1]+'1" data-f="Week '+(i+1)+'">'+w+'</td>'}).join('')+'<td data-ref="F1" data-f="Total">Total</td><td data-ref="G1" data-f="Share">Share</td></tr>';
  cus.forEach(function(c,ri){
    var row=ri+2,rt=sum(data[c],function(v){return v});
    h+='<tr><th>'+row+'</th><td class="t" data-ref="A'+row+'" data-f="'+c+'">'+c+'</td>';
    data[c].forEach(function(v,i){var col=L[i+1];
      h+='<td data-ref="'+col+row+'" data-f="=SUMIFS(Orders!$F:$F,Orders!$D:$D,$A'+row+',Orders!$H:$H,'+col+'$1,Orders!$I:$I,&quot;delivered&quot;)" style="background:color-mix(in srgb,var(--leaf) '+Math.round(v/mx*55)+'%,var(--surface))">'+fmt(v)+'</td>'});
    h+='<td data-ref="F'+row+'" data-f="=SUM(B'+row+':E'+row+')">'+fmt(rt)+'</td><td data-ref="G'+row+'" data-f="=F'+row+'/$F$'+(cus.length+2)+'">'+Math.round(rt/grand*1000)/10+'%</td></tr>';
  });
  var tr=cus.length+2;
  h+='<tr class="tot"><th>'+tr+'</th><td class="t" data-ref="A'+tr+'" data-f="Total">Total</td>'+tot.map(function(v,i){var col=L[i+1];return '<td data-ref="'+col+tr+'" data-f="=SUM('+col+'2:'+col+(tr-1)+')">'+fmt(v)+'</td>'}).join('')+'<td data-ref="F'+tr+'" data-f="=SUM(F2:F'+(tr-1)+')">'+fmt(grand)+'</td><td data-ref="G'+tr+'" data-f="=SUM(G2:G'+(tr-1)+')">100%</td></tr></table>';
  $('#xl').innerHTML=h;
  var first=$('.xlt td[data-ref="B2"]');if(first)selectCell(first);
}
function selectCell(td){
  $$('.xlt td.sel').forEach(function(x){x.classList.remove('sel')});
  td.classList.add('sel');$('#nameBox').textContent=td.dataset.ref;$('#fText').textContent=td.dataset.f;
}

/* ---------- requirements ---------- */
var STORIES=[
 ['FR-01','Customer','search kitchens and dishes by name or cuisine','I find food in a few seconds','Must',['Results update as I type','An empty state suggests clearing filters'],'Approved'],
 ['FR-02','Customer','filter by pure veg, rating, delivery time and offers','I only see kitchens that suit me','Must',['Filters combine with search','Result count is always shown'],'Approved'],
 ['FR-03','Customer','add dishes and change quantities in a cart','I can see my total before I pay','Must',['Cart holds one kitchen at a time','Total updates on every change'],'Approved'],
 ['FR-04','Customer','apply a coupon code','I save money on my order','Should',['Invalid codes explain why','Discount shown as its own bill line'],'In UAT'],
 ['FR-05','Customer','pay by UPI, card or cash on delivery','I can use the method I trust','Must',['Address and name are required','Failed payment returns me to the cart'],'In UAT'],
 ['FR-06','Customer','track my order live','I know when to expect the rider','Should',['Four stages: placed, preparing, on the way, delivered','ETA updates at each stage'],'Approved'],
 ['FR-07','Customer','save favourite kitchens','I can reorder faster','Could',['Heart toggle on each card','Favourites filter available'],'Draft'],
 ['FR-08','Restaurant partner','mark dishes out of stock','customers never order what I cannot cook','Should',['Change reflects within one minute','Customers see "Unavailable" label'],'Draft'],
 ['FR-09','Rider','accept a nearby delivery task','I earn without long waits','Must',['Task shows pickup, drop and payout','Auto-reassign after 60 seconds'],'Approved'],
 ['FR-10','Operations manager','see delivery time and cancellation KPIs','I can fix bottlenecks early','Should',['Dashboard filters by kitchen and week','Late orders are over 35 minutes'],'In UAT'],
 ['FR-11','Customer','split a group bill between friends','nobody pays for everyone','Won’t',['Parked for release 2','Needs payment-gateway review'],'Backlog']
];
var curPri='All';
function renderReq(){
  var ps=['All','Must','Should','Could','Won’t'];
  $('#rpills').innerHTML=ps.map(function(p){return '<button class="qbtn" type="button" data-act="pri" data-p="'+p+'" aria-pressed="'+(p===curPri)+'">'+p+'</button>'}).join('');
  $('#stories').innerHTML=STORIES.filter(function(s){return curPri==='All'||s[4]===curPri}).map(function(s){
    return '<article class="story"><div class="row"><span class="id">'+s[0]+'</span><span class="pri '+s[4].replace('’','')+'">'+s[4]+'</span><span class="st">'+s[6]+'</span></div>'+
     '<p>As a <b>'+s[1]+'</b>, I want to '+s[2]+' so that '+s[3]+'.</p><ul>'+s[5].map(function(a){return '<li>'+a+'</li>'}).join('')+'</ul></article>'}).join('');
}

/* ---------- boot ---------- */
renderOffers();renderChips();renderGrid();updateBadge();
renderTools();renderKpis();renderGmv();renderCuisine();renderFunnel();renderCohort();renderHist();renderSql();renderExcel();renderReq();
})();
