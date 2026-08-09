/* ---- shared UI: progressive steps, dim what is not available yet ---- */
var ICO={ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>'};
var R=document.getElementById(ROOT);
function el(t){var d=document.createElement('div');d.innerHTML=t;return d}
function step(n,title,state,note,inner){
  return '<section class="stp" data-s="'+state+'"><div class="sh"><span class="sn">'+
   (state==='done'?ICO.ok:state==='lock'?ICO.lock:n)+'</span><h3>'+title+'</h3>'+
   (note?'<span class="snote">'+note+'</span>':'')+'</div><div class="sb">'+inner+'</div></section>';
}
function hostBtn(h,extra){
  return '<button class="pick host'+(extra||'')+'" type="button" data-h="'+h.id+'" aria-pressed="'+
   (S.host&&S.host.id===h.id)+'"'+(h.oos?' data-oos="1"':'')+'>'+
   '<span class="chip" style="background:'+h.sw+'"></span>'+
   '<span class="pn">'+h.n+(h.oos?' <em>sold out</em>':'')+'</span>'+
   '<span class="pp">'+money(h.p)+'</span>'+
   '<span class="cap cap-'+h.v+'">'+(h.v==='full'?'Full switch':h.v==='center'?'Centre only':'Ask us')+'</span></button>';
}
function optBtn(cls,label,swatch,pressed,data,badge){
  return '<button class="pick '+cls+'" type="button" '+data+' aria-pressed="'+pressed+'">'+
   (swatch?'<span class="chip" style="background:'+swatch+'"></span>':'')+
   '<span class="pn">'+label+'</span>'+(badge||'')+'</button>';
}
function render(){
  var out='',h=S.host,g=glow();
  /* ---- 1. the light ---- */
  var groups=[];HOSTS.forEach(function(x){if(groups.indexOf(x.g)<0)groups.push(x.g)});
  var inner='';
  if(SKIN==='board'){
    inner='<div class="cols2">'+
     ['full','center'].map(function(v){
      var list=HOSTS.filter(function(x){return x.v===v});
      return '<div class="cw cw-'+v+'"><div class="cwh"><b>'+(v==='full'?'Whole switch swaps':'Centre button only')+
       '</b><span>'+canonCount(v)+'</span></div><div class="cwl">'+list.map(function(x){return hostBtn(x)}).join('')+
       '</div></div>'}).join('')+'</div>'+
     '<div class="cw cw-unknown"><div class="cwh"><b>Not documented</b><span>'+canonCount('unknown')+'</span></div>'+
     '<div class="cwl">'+HOSTS.filter(function(x){return x.v==='unknown'}).map(function(x){return hostBtn(x)}).join('')+'</div></div>';
  }else{
    inner=groups.map(function(gr){
      return '<div class="grp"><div class="grpt">'+gr+'</div><div class="pgrid">'+
       HOSTS.filter(function(x){return x.g===gr}).map(function(x){return hostBtn(x)}).join('')+'</div></div>'}).join('');
  }
  out+=step(1,'Pick your light',h?'done':'active',h?h.n:'Start here',
    '<p class="lede">Every answer below depends on this. <b>'+canonCount('full')+
    '</b> finishes let you change the whole tail switch; <b>'+canonCount('center')+
    '</b> are pressed in at the factory and only take a new centre button.</p>'+inner);

  /* ---- 2. the switch ---- */
  var s2state = !h?'lock':(h.v==='full'?(S.sw?'done':'active'):'lock');
  var s2note = !h?'Pick a light first':(h.v==='center'?'Not available on this finish':(S.sw?S.sw.n:''));
  var s2inner;
  if(!h){ s2inner='<p class="lede">Choose your light above and this unlocks.</p>' }
  else if(h.v==='center'){
    s2inner='<div class="msg msg-warn">'+ICO.warn+'<div><b>The '+h.n+' switch does not come out.</b>'+
     '<p>It is pressed into the tail cap at the factory. You cannot fit a different switch — but you '+
     '<b>can</b> still change the centre button in step 4.</p></div></div>';
  }else if(h.v==='unknown'){
    s2inner='<div class="msg msg-warn">'+ICO.warn+'<div><b>We have not verified the '+h.n+'.</b>'+
     '<p>It appears on neither compatibility list. Message us before buying a switch and we will open one.</p></div></div>';
  }else{
    s2inner='<div class="msg msg-rule">'+ICO.warn+'<div><b>Pick one — they are mutually exclusive.</b>'+
     '<p>There is no illuminated forward clicky. Momentary operation means giving up the glowing tail.</p></div></div>'+
     '<div class="pgrid pgrid-3">'+SWITCHES.map(function(sw){
       return '<button class="pick swc" type="button" data-sw="'+sw.id+'" aria-pressed="'+(S.sw&&S.sw.id===sw.id)+'">'+
        '<span class="swn">'+sw.n+'</span><span class="swp">'+money(sw.p)+'</span>'+
        '<span class="swt '+(sw.lit?'lit':'nolit')+'">'+(sw.lit?'Lights up':'No light')+'</span>'+
        '<span class="swd">'+sw.pitch+'</span><span class="swa">'+sw.act+'</span></button>'}).join('')+'</div>';
  }
  if(h&&h.v==='unknown')s2state='lock';
  out+=step(2,'Pick your switch',s2state,s2note,s2inner);

  /* ---- 3. LED colour ---- */
  var needLed = !!(h&&h.v==='full'&&S.sw&&S.sw.cols.length);
  var s3state = needLed?(S.led?'done':'active'):'lock';
  var s3note = needLed?(S.led?S.led[0]:'Choose a colour'):(S.sw&&!S.sw.lit?'Forward clicky has no LED':'Pick a switch first');
  var s3inner = needLed
    ? '<div class="pgrid pgrid-s">'+S.sw.cols.map(function(c){
        return optBtn('opt',c[0],c[1],(S.led&&S.led[0]===c[0]),'data-led="'+c[0]+'"',
          c[3]!==S.sw.p?'<span class="pp">'+money(c[3])+'</span>':'')}).join('')+'</div>'
    : '<p class="lede">'+(S.sw&&!S.sw.lit?'The forward clicky is not illuminated, so there is no LED colour to pick.'
        :'Pick an illuminated switch above and the colours unlock.')+'</p>';
  out+=step(3,'Pick the LED colour',s3state,s3note,s3inner);

  /* ---- 4. centre button ---- */
  var need=takesButton();
  var s4state = need?(S.btn?'done':'active'):'lock';
  var s4note = need?(S.btn?S.btn[0]:'Choose a button'):'Only the metal switch takes one';
  var s4inner;
  if(!need){
    s4inner='<p class="lede">'+(!h?'Pick a light first.':
      S.sw&&S.sw.id==='rubber'?'The rubber switch is one moulded piece — there is no separate centre button.':
      S.sw&&S.sw.id==='forward'?'The forward clicky has no illuminated centre button.':
      'Choose the metal illuminated switch above to unlock the centre buttons.')+'</p>';
  }else{
    var dc=canDoubleClear();
    s4inner=(dc?'<div class="msg msg-dc"><div><b>Double Clear is available on this build.</b>'+
      '<p>Pick <b>Clear Plastic</b> and you get a clear outer ring <i>and</i> a clear centre — both light up. '+
      'Any other colour blocks the middle and glows at the edge only, exactly like silver or black.</p></div></div>'
      :'<div class="msg msg-warn">'+ICO.warn+'<div><b>Centre button only.</b>'+
      '<p>The factory ring stays put on this finish, so you get glow around the edge whichever colour you pick. '+
      'Double Clear needs a finish that takes the whole switch.</p></div></div>')+
     '<div class="pgrid pgrid-s">'+BTN.cols.map(function(c){
       var isC=c[3]&&dc;
       return optBtn('opt'+(isC?' opt-star':''),c[0],c[1],(S.btn&&S.btn[0]===c[0]),
         'data-btn="'+c[0]+'"',isC?'<span class="star">Double Clear</span>':'')}).join('')+
       optBtn('opt',BRASSBTN.n,BRASSBTN.sw,(S.btn&&S.btn[0]==='Brass'),'data-btn="Brass"',
         '<span class="pp">'+money(BRASSBTN.p)+'</span>')+'</div>';
  }
  out+=step(4,'Pick the centre button',s4state,s4note,s4inner);

  /* ---- 5. result ---- */
  var L=lines(),rdy=ready();
  var res='';
  if(g)res+='<div class="glow glow-'+g.k+'"><div class="gt">'+g.t+'</div><p>'+g.d+'</p></div>';
  else res+='<p class="lede">Your result appears here as you build.</p>';
  if(L.length){
    res+='<div class="parts">'+L.map(function(l){
      return '<a class="part" href="'+purl(l.h)+'" target="_blank" rel="noopener">'+
       (l.sw?'<span class="chip" style="background:'+l.sw+'"></span>':'<span class="chip chip-x"></span>')+
       '<span class="pn">'+l.n+(l.pend?' <em>— choose a colour</em>':'')+(l.oos?' <em>— sold out</em>':'')+'</span>'+
       '<span class="pp">'+money(l.p)+'</span></a>'}).join('')+'</div>'+
     '<p class="fine">Emitter, reflector and lens are chosen on the S2+ product page — open the light above to pick them.</p>';
  }
  out+=step(5,'Your build',rdy?'done':(L.length?'active':'lock'),rdy?'Ready':'',res);
  R.innerHTML='<div class="steps">'+out+'</div>'+
    '<div class="bar'+(L.length?' on':'')+'"><div class="barin"><div class="bartxt">'+
    (rdy?'<b>'+L.length+' item'+(L.length>1?'s':'')+' ready</b><span>Total shown at checkout</span>'
        :'<b>Keep going</b><span>'+(!h?'Pick your light to start':'Finish the highlighted step')+'</span>')+
    '</div>'+(rdy?'<a class="cta" href="'+cartUrl()+'">Add to cart &rarr;</a>'
        :'<button class="cta" type="button" disabled>Add to cart</button>')+'</div></div>';
  wire();
}
function wire(){
  R.querySelectorAll('[data-h]').forEach(function(b){b.addEventListener('click',function(){
    var n=HOSTS.filter(function(x){return x.id===b.dataset.h})[0];
    S.host=(S.host&&S.host.id===n.id)?null:n; S.sw=null;S.led=null;S.btn=null; render();
    var nx=R.querySelector('.stp[data-s="active"]'); if(nx)nx.scrollIntoView({behavior:'smooth',block:'center'})})});
  R.querySelectorAll('[data-sw]').forEach(function(b){b.addEventListener('click',function(){
    var n=SWITCHES.filter(function(x){return x.id===b.dataset.sw})[0];
    S.sw=(S.sw&&S.sw.id===n.id)?null:n; S.led=null; if(!takesButton())S.btn=null; render();
    var nx=R.querySelector('.stp[data-s="active"]'); if(nx)nx.scrollIntoView({behavior:'smooth',block:'center'})})});
  R.querySelectorAll('[data-led]').forEach(function(b){b.addEventListener('click',function(){
    var c=S.sw.cols.filter(function(x){return x[0]===b.dataset.led})[0];
    S.led=(S.led&&S.led[0]===c[0])?null:c; render()})});
  R.querySelectorAll('[data-btn]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.dataset.btn,c;
    if(k==='Brass')c=['Brass',BRASSBTN.sw,BRASSBTN.vid,false];
    else c=BTN.cols.filter(function(x){return x[0]===k})[0];
    S.btn=(S.btn&&S.btn[0]===c[0])?null:c; render()})});
}
render();
