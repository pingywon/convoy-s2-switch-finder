/* ---- shared UI: progressive steps, dim what is not available yet ---- */
var ICO={ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>'};
var R=document.getElementById(ROOT);
/* Off the store there is no cart to post to. A page that sets window.S2_DEMO shows what
   would have been sent instead of sending it. */
var DEMO=!!window.S2_DEMO;
/* Scroll so the section HEADER (number + title) is at the top of the viewport,
   never mid-way through its options — landing mid-list makes people miss steps. */
function goTo(node){
  if(!node)return;
  var y=node.getBoundingClientRect().top+(window.pageYOffset||document.documentElement.scrollTop)-84;
  try{window.scrollTo({top:y<0?0:y,behavior:"smooth"})}catch(e){window.scrollTo(0,y<0?0:y)}
  node.classList.add("justmoved");
  setTimeout(function(){node.classList.remove("justmoved")},1400);
}
function stepEl(n){return R.querySelector('.stp[data-n="'+n+'"]')}
function e_(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function a_(s){return e_(s).replace(/"/g,'&quot;')}
function cartSig(){return JSON.stringify(cartItems())}
/* Demo copy only: the lines the store's cart would have received, as the bench reads them. */
function demoOut(){
  var L=lines().filter(function(l){return l.vid&&!l.oos}),C=cartItems();
  return '<div class="demoout" style="margin-top:16px"><div class="msg msg-plain"><div><b>Demo copy &mdash; nothing was added.</b>'+
    '<p>On gadgetconnections.com this button puts the lines below in the cart. Each one carries the '+
    'build tag <b>'+e_(buildTag()||'')+'</b>, so every part stays with its light.</p></div></div>'+
    '<div class="parts">'+C.map(function(it,i){
      var p=it.properties||{},rows=[];
      for(var k in p){if(k.charAt(0)!=='_')rows.push(e_(k)+': '+e_(p[k]))}
      return '<div class="part"><span class="chip chip-x"></span><span class="pn">'+e_(L[i].n)+
        '<span class="psub">'+rows.join('<br>')+'</span></span></div>'}).join('')+'</div></div>';
}
function el(t){var d=document.createElement('div');d.innerHTML=t;return d}
function step(n,title,state,note,inner){
  return '<section class="stp" data-s="'+state+'" data-n="'+n+'"><div class="sh"><span class="sn">'+
   (state==='done'?ICO.ok:state==='lock'?ICO.lock:n)+'</span><h3>'+title+'</h3>'+
   (note?'<span class="snote">'+note+'</span>':'')+'</div><div class="sb">'+inner+'</div></section>';
}
function hostBtn(h,extra){
  return '<button class="pick host'+(extra||'')+'" type="button" data-h="'+h.id+'" aria-pressed="'+
   (S.host&&S.host.id===h.id)+'"'+(h.oos?' data-oos="1"':'')+'>'+
   '<span class="chip" style="background:'+h.sw+'"></span>'+
   '<span class="pn">'+h.n+(h.oos?' <em>sold out</em>':'')+'</span>'+
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


  /* ---- 2. emitter (real option set) ---- */
  var e2state=!h?'lock':(S.em?'done':'active');
  var e2note=!h?'Pick a light first':(S.em||'Choose an emitter');
  var e2inner;
  if(!h){e2inner='<p class="lede">Choose your light above and this unlocks.</p>'}
  else{
    e2inner='<div class="msg msg-rule">'+ICO.warn+'<div><b>This is what the light actually looks like.</b>'+
     '<p>The emitter sets colour and beam. Most people want a white one &mdash; the 519a group is the '+
     'safe pick. The others are for specific jobs.</p></div></div>'+
     EM_GROUPS.map(function(gr){
      return '<div class="grp"><div class="grpt">'+gr.g+'</div>'+
       '<p class="lede" style="margin-bottom:10px">'+gr.note+'</p>'+
       '<div class="pgrid'+(gr.layout==='bar'?' pgrid-bar':(gr.layout==='center'?' pgrid-center':''))+'">'+
       gr.items.map(function(v){
         var badge = isIR(v)?'<span class="star star-off">One mode only</span>':
                     (v.indexOf('Mystery')===0?'<span class="star star-off">Surprise</span>':'');
         return optBtn('opt',v,null,(S.em===v),'data-em="'+v.replace(/"/g,'&quot;')+'"',badge)}).join('')+
       '</div></div>'}).join('');
    if(isIR(S.em))e2inner+='<div class="msg msg-warn">'+ICO.warn+'<div><b>Infrared is invisible.</b>'+
      '<p>You will see nothing by eye &mdash; it only works through night-vision gear, and it runs at '+
      '100% output with no other modes.</p></div></div>';
    else if(isColour(S.em))e2inner+='<div class="msg msg-rule">'+ICO.warn+'<div><b>This is a single-colour emitter.</b>'+
      '<p>It only puts out that colour &mdash; it will not work as a general white flashlight.</p></div></div>';
  }
  out+=step(2,'Pick the emitter',e2state,e2note,e2inner);

  /* ---- 3. beam shaping: reflector + optic ---- */
  var b3state=!S.em?'lock':((S.refl&&S.optic)?'done':'active');
  var b3note=!S.em?'Pick an emitter first':(S.refl.split(' - ')[0]+' · '+S.optic);
  var b3inner;
  if(!S.em){b3inner='<p class="lede">Pick an emitter and this unlocks.</p>'}
  else{
    var sug=suggestRefl(S.em);
    b3inner='<div class="lbl">Reflector</div><p class="lede" style="margin-bottom:10px">'+
      'We suggest <b>'+sug+'</b> for the '+S.em+', but it is your call.</p><div class="pgrid">'+
      REFLECTORS.map(function(r){return optBtn('opt'+(r===sug?' opt-star':''),r,null,(S.refl===r),
        'data-refl="'+r.replace(/"/g,'&quot;')+'"',r===sug?'<span class="star">Suggested</span>':'')}).join('')+'</div>'+
      '<div class="lbl">Optic / lens</div>'+
      '<p class="lede" style="margin-bottom:10px">Glass is the standard. The angled optics trade throw for a '+
      'wider, softer flood &mdash; only pick one if you know you want it.</p><div class="pgrid pgrid-s">'+
      OPTICS.map(function(o,i){
        var hide=(i>0&&!S.showOptics)?' style="display:none"':'';
        return '<span'+hide+' class="opticwrap">'+optBtn('opt'+(i===0?' opt-star':''),o,null,(S.optic===o),
          'data-optic="'+o.replace(/"/g,'&quot;')+'"',i===0?'<span class="star">Standard</span>':'')+'</span>'}).join('')+
      '</div>'+
      '<button class="acc" type="button" id="moreoptics" aria-expanded="'+(S.showOptics?'true':'false')+'">'+
        '<span class="accchev">'+(S.showOptics?'▾':'▸')+'</span>'+
        '<span class="acctxt">'+(S.showOptics?'Hide the other optics':'Show all '+OPTICS.length+' optics')+'</span>'+
        '<span class="accsub">'+(S.showOptics?'Collapse back to the standard glass lens':'Flat, Matte, Stripe and Bead angles — optional')+'</span>'+
      '</button>'+
      (S.beamOK?'':'<div class="confirmrow"><p>We have already picked sensible defaults. '+
        'Change them if you want, then continue.</p>'+
        '<button class="btn go" type="button" id="beamok">These look good &rarr;</button></div>');
  }
  out+=step(3,'Shape the beam',b3state,b3note,b3inner);

  /* ---- 3. the switch ---- */
  /* A locked step ignores the mouse. On a pressed-in finish the ring stays, but this step
     holds the optional centre-glow pair, so it must stay open. */
  var s2state = (!h||!S.em||!S.refl||!S.optic)?'lock':(h.v==='full'?(S.sw?'done':'active'):
                (h.v==='center'?(S.presslit?'done':'open'):'lock'));
  var s2note = !h?'Pick a light first':(h.v==='center'?(S.presslit?'Centre glow added':'Ring stays · centre glow optional'):(S.sw?S.sw.n:''));
  var s2inner;
  if(!h){ s2inner='<p class="lede">Choose your light above and this unlocks.</p>' }
  else if(!S.em||!S.refl||!S.optic){ s2inner='<p class="lede">Pick your emitter and beam first.</p>' }
  else if(h.v==='center'){
    s2inner='<div class="msg msg-plain"><div><b>The '+h.n+' outer ring does not come out.</b>'+
     '<p>It is pressed into the tail cap at the factory, so you cannot fit a different ring. You '+
     '<b>can</b> still change the centre button below.</p></div></div>'+
     '<button class="pick swc pairopt" type="button" id="presslit" aria-pressed="'+S.presslit+'">'+
       '<span class="tailviz '+(S.presslit?'tv-both':'tv-off')+'" aria-hidden="true">'+
       '<span class="tv-halo"></span><span class="tv-btn"></span></span>'+
       '<span class="swn">Add centre glow</span>'+
       '<span class="swt lit">Metal lit switch + clear centre</span>'+
       '<span class="swd">Your ring stays as it is, but the metal lit switch and a clear centre '+
       'button go in together and light the middle of the tail. They only work as a pair, so we '+
       'add both.</span>'+
       '<span class="swa">'+(S.presslit?'Added — pick a colour below':'Optional')+'</span></button>';
  }else if(h.v==='unknown'){
    s2inner='<div class="msg msg-warn">'+ICO.warn+'<div><b>We have not verified the '+h.n+'.</b>'+
     '<p>It appears on neither compatibility list. Message us before buying a switch and we will open one.</p></div></div>';
  }else{
    s2inner='<div class="msg msg-rule">'+ICO.warn+'<div><b>Pick one — they are mutually exclusive.</b>'+
     '<p>There is no illuminated forward clicky. Momentary operation means giving up the glowing tail.</p></div></div>'+
     '<div class="pgrid pgrid-3">'+SWITCHES.map(function(sw){
       /* live preview: shows how THIS switch actually lights, in the chosen colour */
       var lc=(S.sw&&S.sw.id===sw.id&&S.led)?S.led[1]:'#7fe9c4';
       var mode=sw.id==='rubber'?'face':(sw.id==='metal'?((S.sw&&S.sw.id==='metal'&&S.btn&&isClear(S.btn[0]))?'both':'ring'):'off');
       var viz='<span class="tailviz tv-'+mode+'" aria-hidden="true">'+
               '<span class="tv-halo"></span><span class="tv-btn"></span></span>';
       return '<button class="pick swc lit-'+mode+'" type="button" data-sw="'+sw.id+'" style="--ledc:'+lc+'" aria-pressed="'+(S.sw&&S.sw.id===sw.id)+'">'+
        viz+'<span class="swn">'+sw.n+'</span>'+
        '<span class="swt '+(sw.lit?'lit':'nolit')+'">'+(sw.lit?'Lights up':'No light')+'</span>'+
        '<span class="swd">'+sw.pitch+'</span><span class="swa">'+sw.act+'</span></button>'}).join('')+'</div>';
  }
  if(h&&h.v==='unknown')s2state='lock';
  out+=step(4,'Pick your switch',s2state,s2note,s2inner);

  /* ---- 5. button (metal centre, or coloured rubber tailcap) ---- */
  var fam=takesButton();
  var s4state = fam?(S.btn?'done':'active'):'lock';
  var s4title = fam==='rubber'?'Pick the rubber button':'Pick the centre button';
  var s4note = fam?(S.btn?S.btn[0]:'Optional'):'Not available on this build';
  var s4inner;
  if(!fam){
    s4inner='<p class="lede">'+(!h?'Pick a light first.':
      S.sw&&S.sw.id==='forward'?'The forward clicky has no illuminated button to swap.':
      'Pick a switch above and the buttons unlock.')+'</p>';
  }else if(fam==='rubber'){
    s4inner='<div class="msg msg-plain"><div><b>Optional &mdash; your switch already ships with a button.</b>'+
     '<p>These swap the rubber tailcap for a different colour, and they sit straight over the '+
     'illuminated rubber switch &mdash; including a coloured one, so you can stack a colour on a '+
     'colour. What changes is how much light gets through: <b>Translucent / White</b> passes the '+
     'most, and <b>Green does not glow at all</b>.</p></div></div>'+
     '<div class="pgrid pgrid-s">'+RUBBTN.cols.map(function(c){
       var g=rubberGlow(c[0]);
       return optBtn('opt'+(g==='most'?' opt-star':''),c[0],c[1],(S.btn&&S.btn[0]===c[0]),
         'data-btn="'+c[0]+'"',
         g==='most'?'<span class="star">Brightest</span>':
         g==='none'?'<span class="star star-off">No glow</span>':'')}).join('')+'</div>';
  }else{
    var dc=canDoubleClear(),isCenter=h&&h.v==='center';
    s4inner=(dc?'<div class="msg msg-plain"><div><b>Two looks, both normal.</b>'+
      '<p>The metal lit switch brings a <b>clear outer ring</b> with it. Pair it with the '+
      '<b>Clear Plastic</b> centre and the middle lights too &mdash; that is Double Clear. Any other '+
      'colour keeps the centre solid so the glow sits in a ring around it. Pick whichever you prefer.</p></div></div>'
      :isCenter?'<div class="msg msg-plain"><div><b>Cosmetic swap, or add a glow.</b>'+
      '<p>Your outer ring is pressed in at the factory and already glows on its own &mdash; that does '+
      'not change no matter which colour you pick here, this is just a cosmetic swap. Want the '+
      '<b>centre</b> to glow too? Pick <b>Clear Plastic</b> below (or use the &ldquo;Add centre '+
      'glow&rdquo; button above) and we pair it with the metal lit switch for you &mdash; that pairing '+
      'is required, a clear centre alone will not light up.</p></div></div>'
      :'<div class="msg msg-plain"><div><b>Centre button only on this finish.</b>'+
      '<p>Your outer ring is pressed in at the factory and stays put, so the glow sits around the edge '+
      'whichever colour you choose. The clear outer ring only comes as part of the metal lit switch, '+
      'which this light cannot take.</p></div></div>')+
     '<div class="pgrid pgrid-s">'+BTN.cols.map(function(c){
       var isC=c[3]&&(dc||isCenter),
           tip=dc?'Clear lets the centre light up as well as the ring.'
               :'Clear pairs with the metal lit switch so the centre lights up.';
       return optBtn('opt'+(isC?' hastip':''),c[0],c[1],(S.btn&&S.btn[0]===c[0]),
         'data-btn="'+c[0]+'"'+(isC?' data-tip="'+tip+'" title="'+tip+'"':''),'')}).join('')+
       optBtn('opt',BRASSBTN.n,BRASSBTN.sw,(S.btn&&S.btn[0]==='Brass'),'data-btn="Brass"','')+'</div>';
  }
  out+=step(5,s4title,s4state,s4note,s4inner);

  /* ---- 6. LED colour ---- */
  var needLed = !!(S.sw&&S.sw.cols.length&&(h&&(h.v==='full'||pressLitPair())));
  var s3state = needLed?(S.led?'done':'active'):'lock';
  var s3note = needLed?(S.led?S.led[0]:'Choose a colour'):(S.sw&&!S.sw.lit?'Forward clicky has no LED':'Pick a switch first');
  var s3inner = needLed
    ? '<div class="msg msg-rule">'+ICO.warn+'<div><b>This glow is for finding the light in the dark.</b>'+
      '<p>The lit tail is a locator, not a light source &mdash; it marks where the flashlight is on a '+
      'bedside table or in a bag. It does not light the room. Some colours read brighter than others: '+
      'white and translucent show most, deeper colours least.</p></div></div>'+
      '<div class="pgrid pgrid-s">'+S.sw.cols.map(function(c){
        return '<button class="pick opt ledopt" type="button" data-led="'+c[0]+'" aria-pressed="'+
          (S.led&&S.led[0]===c[0])+'" style="--ledc:'+c[1]+'">'+
          '<span class="leddot"></span><span class="pn">'+c[0]+'</span></button>'}).join('')+'</div>'
    : '<p class="lede">'+(S.sw&&!S.sw.lit?'The forward clicky is not illuminated, so there is no LED colour to pick.'
        :'Pick an illuminated switch above and the colours unlock.')+'</p>';
  out+=step(6,'Pick the LED colour',s3state,s3note,s3inner);

  /* ---- pocket clip ---- */
  var c7state=!h?'lock':(S.clip?'done':'active');
  var c7note=!h?'Pick a light first':(S.clip?S.clip.n:'Choose one, or decline');
  var c7inner;
  if(!h){c7inner='<p class="lede">Choose your light above and this unlocks.</p>'}
  else{
    c7inner='<div class="msg msg-plain"><div><b>Clips to the body, so every finish can take one.</b>'+
     '<p>Pressure-fit slides on and off with no tools and no marks. Screw-on bolts down and will not '+
     'rotate or slide, but it is a permanent fitting.</p></div></div><div class="pgrid">'+
     CLIPS.map(function(cl){
       return '<button class="pick clipopt'+(cl.k==='none'?' clipno':'')+'" type="button" data-clip="'+cl.k+'" aria-pressed="'+
        (S.clip&&S.clip.k===cl.k)+'"><span class="pn"><b>'+cl.n+'</b><span class="clipd">'+cl.d+'</span></span></button>'
     }).join('')+'</div>';
  }
  out+=step(7,'Add a pocket clip',c7state,c7note,c7inner);

  /* ---- 5. result ---- */
  var L=lines(),rdy=ready();
  var res='';
  if(g)res+='<div class="glow glow-'+g.k+'"><div class="gt">'+g.t+'</div><p>'+g.d+'</p></div>';
  else res+='<p class="lede">Your result appears here as you build.</p>';
  if(L.length){
    res+='<div class="parts">'+L.map(function(l){
      return '<a class="part" href="'+purl(l.h)+'" target="_blank" rel="noopener">'+
       (l.sw?'<span class="chip" style="background:'+l.sw+'"></span>':'<span class="chip chip-x"></span>')+
       '<span class="pn">'+l.n+(l.pend?' <em>— choose a colour</em>':'')+(l.oos?' <em>— sold out</em>':'')+
       (l.sub?'<span class="psub">'+l.sub+'</span>':'')+'</span>'+
       '</a>'}).join('')+'</div>'+
     (S.sw?'<div class="msg msg-dc"><div><b>We will fit the '+S.sw.n+' for you.</b>'+
       '<p>Because the switch is on the same order, it ships installed &mdash; you do not have to do it yourself.</p></div></div>':'')+
     '<div class="ackwrap'+(S.ack?' on':'')+'">'+
       '<div class="ackhead">'+(S.ack?'✓ Acknowledged':'⚠ Read this before you order')+'</div>'+
       '<label class="ackbox"><input type="checkbox" id="ack"'+(S.ack?' checked':'')+'>'+
       '<span>'+CONSENT+'</span></label></div>'+
     '<div class="nickrow"><label for="nick2">Name this build <em>(optional — helps if you are ordering more than one)</em></label>'+
       '<input type="text" class="nickin" id="nick2" maxlength="40" placeholder="e.g. Dad\'s light" value="'+
       a_(S.nick||'')+'"></div>'+
     '<div class="buildtag"><b>Tagged as:</b> <i class="tagv" style="font-style:normal">'+e_(buildTag()||'—')+'</i>'+
       '<span>Every part above carries this tag, so we know which switch and button belong to which light.</span></div>';
    var cm=(S.cartMsg&&S.cartMsg.sig===cartSig())?S.cartMsg.k:null;
    if(cm==='err')res+='<div class="msg msg-warn carterr" role="alert" style="margin-top:16px">'+ICO.warn+
      '<div><b>Not added &mdash; the cart did not answer.</b><p>Nothing was added and nothing was charged. '+
      'Press Add to cart again. If it keeps happening, message us and we will put the order together with you.</p></div></div>';
    if(cm==='demo')res+=demoOut();
  }
  out+=step(8,'Your build',rdy?'done':(L.length?'active':'lock'),rdy?'Ready':'',res);
  var intro='<div class="namebox"><label for="nick">Name this build</label>'+
    '<p>Call it anything &mdash; it just keeps every part of this light together, so we know which '+
    'switch and button belong to which. Really useful if you are ordering more than one custom light.</p>'+
    '<input type="text" class="nickin" id="nick" maxlength="40" placeholder="e.g. Dad&apos;s light" value="'+
    a_(S.nick||'')+'">'+
    '</div>';
  R.innerHTML=intro+'<div class="steps">'+out+'</div>'+
    '<p class="s2ver" style="margin:22px 0 0;text-align:center;font-family:var(--mono);font-size:12.5px;'+
    'color:var(--ink3)">Switch Finder v'+VER+(DEMO?' &middot; demo copy':'')+'</p>'+
    '<div class="bar'+(L.length?' on':'')+'"><div class="barin"><div class="bartxt">'+
    (rdy?'<b>'+L.length+' item'+(L.length>1?'s':'')+' ready</b><span>Total shown at checkout</span>'
        :'<b>Keep going</b><span>'+(!h?'Pick your light to start':'Finish the highlighted step')+'</span>')+
    '</div>'+(rdy?'<button class="cta" type="button" id="addcart">Add to cart &rarr;</button>'
        :'<button class="cta" type="button" disabled>Add to cart</button>')+'</div></div>';
  wire();
  var ac=document.getElementById('addcart');
  if(ac)ac.addEventListener('click',function(){
    if(DEMO){S.cartMsg={k:'demo',sig:cartSig()};render();goTo(R.querySelector('.demoout'));return}
    ac.disabled=true;ac.textContent='Adding…';
    fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({items:cartItems()})})
      .then(function(r){if(!r.ok)throw 0;bumpBuildNo();window.location='/cart'})
      .catch(function(){
        /* No permalink fallback: a permalink cannot carry the build note, and a custom
           build that arrives without its note is worse than no order. Say so; let them retry. */
        S.cartMsg={k:'err',sig:cartSig()};render();goTo(R.querySelector('.carterr'))});
  });
}
function wire(){
  R.querySelectorAll('[data-h]').forEach(function(b){b.addEventListener('click',function(){
    var n=HOSTS.filter(function(x){return x.id===b.dataset.h})[0];
    S.host=(S.host&&S.host.id===n.id)?null:n;
    S.em=null;S.refl=null;S.optic=null;S.beamOK=false;S.clip=null;S.presslit=false;S.ack=false;S.sw=null;S.led=null;S.btn=null;
    render(); if(S.host)goTo(stepEl(2))})});
  R.querySelectorAll('[data-em]').forEach(function(b){b.addEventListener('click',function(){
    var v=b.dataset.em;
    if(S.em===v){S.em=null;S.refl=null;S.optic=null;}
    else{S.em=v;S.refl=suggestRefl(v);S.optic=OPTICS[0];}
    render(); if(S.em)goTo(stepEl(3))})});   /* land ON the beam step, not past it */
  R.querySelectorAll('[data-refl]').forEach(function(b){b.addEventListener('click',function(){
    S.refl=b.dataset.refl; render()})});
  R.querySelectorAll('[data-optic]').forEach(function(b){b.addEventListener('click',function(){
    S.optic=b.dataset.optic; render()})});
  var mo=document.getElementById('moreoptics');
  if(mo)mo.addEventListener('click',function(){S.showOptics=!S.showOptics;render();goTo(stepEl(3))});
  var pl=document.getElementById('presslit');
  if(pl)pl.addEventListener('click',function(){
    S.presslit=!S.presslit;
    if(S.presslit){ S.sw=SWITCHES.filter(function(s){return s.id==='metal'})[0];
                    S.btn=BTN.cols.filter(function(c){return c[0]==='Clear Plastic'})[0]; }
    else { S.sw=null;S.led=null;S.btn=null; }
    render(); goTo(stepEl(S.presslit?6:4))});
  R.querySelectorAll('[data-clip]').forEach(function(b){b.addEventListener('click',function(){
    var cl=CLIPS.filter(function(x){return x.k===b.dataset.clip})[0];
    S.clip=(S.clip&&S.clip.k===cl.k)?null:cl; render(); if(S.clip)goTo(stepEl(8))})});
  /* The name is asked twice (top of page, and beside the build). Both boxes are one value. */
  var nks=R.querySelectorAll('.nickin');
  nks.forEach(function(nk){nk.addEventListener('input',function(){
    S.nick=nk.value;
    nks.forEach(function(o){if(o!==nk)o.value=nk.value});
    var tv=R.querySelector('.tagv'); if(tv)tv.textContent=buildTag()||'—'})});
  var ak=document.getElementById('ack');
  if(ak)ak.addEventListener('change',function(){S.ack=ak.checked;render()});
  R.querySelectorAll('[data-sw]').forEach(function(b){b.addEventListener('click',function(){
    var n=SWITCHES.filter(function(x){return x.id===b.dataset.sw})[0],was=takesButton();
    S.sw=(S.sw&&S.sw.id===n.id)?null:n; S.led=null;
    /* Metal centre buttons and rubber tailcap buttons are different parts. A button picked
       for one family must not ride along when the switch changes to the other. */
    if(takesButton()!==was)S.btn=null;
    render();
    var nx=R.querySelector('.stp[data-s="active"]'); if(nx)nx.scrollIntoView({behavior:'smooth',block:'center'})})});
  R.querySelectorAll('[data-led]').forEach(function(b){b.addEventListener('click',function(){
    var c=S.sw.cols.filter(function(x){return x[0]===b.dataset.led})[0];
    S.led=(S.led&&S.led[0]===c[0])?null:c; render(); if(S.led)goTo(stepEl(7))})});
  R.querySelectorAll('[data-btn]').forEach(function(b){b.addEventListener('click',function(){
    var k=b.dataset.btn,c;
    if(k==='Brass')c=['Brass',BRASSBTN.sw,BRASSBTN.vid,false];
    else c=btnSet().cols.filter(function(x){return x[0]===k})[0];
    S.btn=(S.btn&&S.btn[0]===c[0])?null:c;
    /* Centre glow on a pressed-in finish is a PAIR: metal lit switch + Clear Plastic centre.
       Keep the two locked together whichever side the customer changes, so the build can
       never promise a glow it will not deliver (a solid button blocks the light). */
    if(S.host&&S.host.v==='center'){
      if(S.btn&&isClear(S.btn[0])){S.presslit=true;S.sw=SWITCHES.filter(function(s){return s.id==='metal'})[0]}
      else{S.presslit=false;S.sw=null;S.led=null}
    }
    render();
    if(S.btn)goTo(stepEl(S.sw&&S.sw.cols.length?6:7))})});
}
render();
