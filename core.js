/* ---- Convoy S2+ Switch Finder :: shared data + rule engine ----
   Compatibility rules: gadgetconnections.com/pages/convoy-s2-faq
   Variant IDs + prices: live catalogue pull 2026-08-08
   Cart: Shopify permalink /cart/<variantId>:<qty>,...                        */
var SHOP="https://www.gadgetconnections.com";
var P=SHOP+"/products/";
/* verdict: full = whole tail switch swappable | center = centre button only (pressure-fit)
            unknown = undocumented                                            */
var HOSTS=[
{id:"black",n:"Black",g:"Anodized Aluminium",v:"full",sw:"#1e2124",h:"convoy-s2",vid:"51141102076219",p:24.99},
{id:"gray",n:"Gray",g:"Anodized Aluminium",v:"full",sw:"#7c8288",h:"convoy-s2",vid:"47947674779963",p:24.99},
{id:"golden",n:"Golden",g:"Anodized Aluminium",v:"full",sw:"#b8912f",h:"convoy-s2",vid:"49975222599995",p:24.99},
{id:"blue",n:"Blue",g:"Anodized Aluminium",v:"center",sw:"#20509a",h:"convoy-s2",vid:"51141094342971",p:24.99},
{id:"green",n:"Green",g:"Anodized Aluminium",v:"center",sw:"#1f6b3a",h:"convoy-s2",vid:"47309336248635",p:24.99},
{id:"red",n:"Red",g:"Anodized Aluminium",v:"center",sw:"#9c2420",h:"convoy-s2",vid:"47309336314171",p:24.99},
{id:"orange",n:"Orange",g:"Anodized Aluminium",v:"center",sw:"#c25a1c",h:"convoy-s2",vid:"47309336379707",p:24.99},
{id:"purple",n:"Purple",g:"Anodized Aluminium",v:"center",sw:"#5b3a8e",h:"convoy-s2",vid:"47309336445243",p:24.99},
{id:"tan",n:"Tan",g:"Anodized Aluminium",v:"center",sw:"#a58a63",h:"convoy-s2",vid:"47309336543547",p:24.99},
{id:"silver",n:"Silver",g:"Anodized Aluminium",v:"center",sw:"#adb3b8",h:"convoy-s2",vid:"47331665281339",p:24.99},
{id:"cyan",n:"Cyan",g:"Anodized Aluminium",v:"center",sw:"#1d8f9c",h:"convoy-s2",vid:"47947672912187",p:24.99},
{id:"mao",n:"MAO (Stone White)",g:"Specialty Metal",v:"full",sw:"#ddd8cf",h:"convoy-s2-mao-finish-micro-arc-oxidation-18650-flashlight",vid:"47828408631611",p:33.99},
{id:"brass",n:"Brass",g:"Specialty Metal",v:"full",sw:"#b08d3e",h:"convoy-s2-18650-brass-flashlight",vid:"49958612173115",p:41.99},
{id:"cu",n:"Copper (Litnit)",canon:"cu",g:"Specialty Metal",v:"full",sw:"#a5673c",h:"convoy-s2-18650-flashlight-litnit",vid:"47948816253243",p:59.99},
{id:"cugl",n:"Copper Glossy (unbranded)",canon:"cu",g:"Specialty Metal",v:"full",sw:"#bd7a45",h:"convoy-s2-18650-copper-glossy-cu-flashlight-litnit-copy",vid:"49958547783995",p:59.99},
{id:"tigl",n:"Ti Glossy",g:"Titanium",v:"full",sw:"#9aa0a6",h:"convoy-s2-18650-titanium-ti-flashlight",vid:"49958591103291",p:59.99},
{id:"tisw",n:"Ti Stone Washed",g:"Titanium",v:"full",sw:"#868d94",h:"convoy-s2-18650-titanium-ti-flashlight",vid:"49958591136059",p:59.99},
{id:"tigc",n:"Ti Gold Circuit",g:"Titanium",v:"full",sw:"#8d7a3f",h:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes",vid:"49975294361915",p:69.99},
{id:"timc",n:"Ti Multi-Color Circuit",g:"Titanium",v:"full",sw:"#5e6f8a",h:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes",vid:"49975294394683",p:69.99},
{id:"tisp",n:"Ti Multi-Color Spatter",g:"Titanium",v:"center",sw:"#6b6f7d",h:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes",vid:"49975294427451",p:69.99},
{id:"tigrc",n:"Ti Green Circuit (LE)",g:"Titanium",v:"center",sw:"#4d6b52",h:"convoy-s2-18650-titanium-ti-flashlight-green-circuit-limited-edition",vid:"50076839739707",p:69.99,oos:true},
{id:"tips",n:"Ti Purple Swirl",g:"Titanium",v:"unknown",sw:"#6d5a86",h:"convoy-s2-18650-titanium-ti-flashlight-purple-swirl",vid:"50711023190331",p:79.99}
];
var RGBSW="linear-gradient(135deg,#9c2420,#b8912f,#1f6b3a,#20509a,#5b3a8e)";
var SWITCHES=[
{id:"rubber",n:"Rubber Illuminated",h:"convoy-illuminated-tail-switch-button-rubber",p:3.99,lit:true,takesButton:false,
 pitch:"Rubber diffuses the LED, so the whole face glows. The brightest of the three.",
 act:"Reverse clicky — full click on, tap to change modes",
 cols:[["Orange","#c25a1c","47828135936315",3.99],["Blue","#20509a","47828135969083",3.99],["Green","#1f6b3a","47828136001851",3.99],["Red","#9c2420","47828136034619",3.99],["Purple","#5b3a8e","50601740108091",3.99],["Pink","#c96792","50601738961211",3.99],["White","#e8e8e6","50601739813179",3.99],["RGB Slow Fade",RGBSW,"47828136067387",4.99]]},
{id:"metal",n:"Metal Illuminated",h:"convoy-s2-illuminated-tail-switch-button",p:4.99,lit:true,takesButton:true,
 pitch:"Machined metal ring with a separate centre button you choose below. This is the one that can do Double Clear.",
 act:"Reverse clicky — full click on, tap to change modes",
 cols:[["Orange","#c25a1c","44909394493755",4.99],["Blue","#20509a","44909394526523",4.99],["Green","#1f6b3a","45259730878779",4.99],["Red","#9c2420","45259754471739",4.99],["Purple","#5b3a8e","50601834479931",4.99],["Pink","#c96792","50601833726267",4.99],["White","#e8e8e6","50601834086715",4.99],["RGB Slow Fade",RGBSW,"45259764072763",5.25]]},
{id:"forward",n:"Forward Clicky",h:"convoy-forward-clicky-switch-for-s2-full-pcb-assembly",p:1.99,lit:false,takesButton:false,
 pitch:"Momentary signalling without committing the light on. Cannot be illuminated — no illuminated forward clicky exists.",
 act:"Half-press for momentary on, full click to stay on",cols:[]}
];
/* Any metal button can be replaced with this product. "Clear Plastic" is the Double Clear part. */
var BTN={h:"convoy-black-button-for-metal-illuminated-switch",p:0.99,
 cols:[["Clear Plastic","#dfe4e6","50903798841659",true],["Silver Aluminum","#adb3b8","50903776100667",false],
 ["Black","#1e2124","50903776133435",false],["Blue","#20509a","50903776166203",false],["Cyan","#1d8f9c","50903776198971",false],
 ["Deep Green","#1f5b39","50903776231739",false],["Gray","#7c8288","50903776264507",false],["Orange","#c25a1c","50903776297275",false],
 ["Purple","#5b3a8e","50903776330043",false],["Red","#9c2420","50903776362811",false],["Tan","#a58a63","50903776395579",false]]};
var BRASSBTN={n:"Brass",h:"convoy-brass-button-for-metal-illuminated-switch",p:1.99,vid:"50709001404731",sw:"#b08d3e"};
var RUBBTN={h:"convoy-color-rubber-tail-cap-buttons-for-s2-c8-and-more",p:0.25,
 cols:[["Black","#1e2124","50300036677947"],["Orange","#c25a1c","50300036710715"],["Green (does NOT glow)","#1f6b3a","50300036743483"],["Blue (glow)","#20509a","50300036776251"],["Translucent / White","#e8e8e6","50300036809019"]]};




/* ===== Build options, transcribed from the live S2+ custom-build option set =====
   Read-only transcription. No listing, PDP or option template was modified.
   Value strings are kept verbatim so they read identically on a packing slip. */
var EM_GROUPS=[
 {g:"White · high CRI (Nichia 519a)", note:"The default all-rounder. Natural colour, warm to cool.",
  items:["519a - 1800K","519a - 2700K","519a - 3000K","519a - 3500K","519a - 4000K","519a - 4500K","519a - 5000K","519a - 5700K"]},
 {g:"White · thrower (SFT40)", note:"Tighter, further-reaching beam. Brighter, lower colour quality.",
  items:["SFT40 - 3000K","SFT40 - 5000K","SFT40 - 6500K"]},
 {g:"White · compact (SST20)", note:"High CRI with a tighter beam than the 519a.",
  items:["SST20 - 4000K","SST20 - 5000K"]},
 {g:"Single colour", note:"One fixed colour, not white. For signalling, night work and hunting.",
  items:["CSLNM1.TG (W1)","KB CSLNM1.14 (Blue)","KP CSLNM1.F1 (Green)","KY CSLNM1.FY (Orange)","KR CSLNM1.23 (Red)","SST-20-DR 660nm (Deep Red)"]},
 {g:"Infrared · night vision only", layout:"bar", note:"Invisible to the naked eye. Needs a NV device to be useful.",
  items:["IR 940nm (SST-10) 1 mode only = 100%","IR 850nm (SST-10) 1 mode only = 100%"]},
 {g:"Dealer's choice", layout:"center", note:"We pick something interesting from what is on the bench.",
  items:["Mystery - Never know what ya might get"]}
];
var REFLECTORS=["Default","OP - Orange Peel (More Spill)","SMO - Smooth (More Throw)"];
var OPTICS=["Default (Glass)","Flat 5°","Flat 10°","Flat 15°","Flat 20°","Flat 30°","Flat 45°","Flat 60°","Flat 85°",
"Matte 15°","Matte 30°","Matte 38°","Matte 45°","Matte 85°","Stripe 15°*60°","Stripe 25°*60°","Stripe 45°*60°",
"Bead 10°","Bead 15°","Bead 20°","Bead 25°","Bead 30°","Bead 38°","Bead 45°","Bead 60°","Bead 85°"];
var CLIPS=[
 {k:"press", n:"Pressure-fit clip", d:"Slides on. No tools, no marks, comes off just as easily.",
  h:"convoy-pocket-clip-for-s2-s2-m1-and-c8", vid:"45014025568571"},
 {k:"screw-black", n:"Screw-on — Black", d:"Bolts to the body. Will not rotate or slide off.",
  h:"convoy-pocket-clip-screw-on-for-s2-s3-and-c8", vid:"50299985920315"},
 {k:"screw-matte", n:"Screw-on — Stonewashed Stainless", d:"Matte steel. Bolts on, hides wear well.",
  h:"convoy-pocket-clip-screw-on-for-s2-s3-and-c8", vid:"50299985953083"},
 {k:"screw-shiny", n:"Screw-on — Stainless (Shiny)", d:"Polished steel. Bolts on, brightest finish.",
  h:"convoy-pocket-clip-screw-on-for-s2-s3-and-c8", vid:"50299985887547"},
 {k:"none", n:"No thanks", d:"No clip on this light.", h:null, vid:null}
];
var CONSENT="I understand that this item is non-returnable/non-refundable. Please double check your order for accuracy before placing it.";
function emGroupOf(v){for(var i=0;i<EM_GROUPS.length;i++){if(EM_GROUPS[i].items.indexOf(v)>-1)return EM_GROUPS[i]}return null}
function isIR(v){return !!v&&v.indexOf("IR ")===0}
function isColour(v){var g=emGroupOf(v);return !!g&&g.g==="Single colour"}
/* Which reflector we suggest for an emitter (customer may override). */
function suggestRefl(v){
  if(!v)return null;
  if(v.indexOf("519a")===0||v.indexOf("SST20")===0)return "OP - Orange Peel (More Spill)";
  if(v.indexOf("SFT40")===0||v.indexOf("CSLNM1")>-1)return "SMO - Smooth (More Throw)";
  return "Default";
}

/* Build identity — so a cart holding several lights can be told apart.
   Every line of one build carries the same "Build" property. */
function buildNo(){
  try{var n=parseInt(sessionStorage.getItem("gcS2BuildNo")||"1",10);return isNaN(n)?1:n}
  catch(e){return 1}
}
function bumpBuildNo(){try{sessionStorage.setItem("gcS2BuildNo",String(buildNo()+1))}catch(e){}}
function buildTag(){
  if(!S.host)return null;
  return S.nick?String(S.nick).trim():("Build "+buildNo());
}

/* ---------------- rule engine ---------------- */
var S={host:null,em:null,refl:null,optic:null,beamOK:false,clip:null,presslit:false,ack:false,sw:null,led:null,btn:null,nick:''};
function money(n){return "$"+n.toFixed(2)}
function purl(h){return P+h}
function canonCount(v){var s={},k;HOSTS.forEach(function(h){if(h.v===v)s[h.canon||h.id]=1});
  k=0;for(var x in s)k++;return k}
/* Does the CURRENT build take a separate centre button?
   - full host + metal illuminated switch  -> yes (ring + centre, Double Clear possible)
   - pressure-fit host                     -> yes, centre button ONLY
   - anything else                          -> no                                */
/* Which button family this build can swap:
   'metal'  = metal centre button (metal illuminated switch, or a pressure-fit host)
   'rubber' = coloured rubber tailcap button (rubber illuminated switch)
   false    = none (forward clicky, or nothing picked yet)                        */
function takesButton(){
  if(!S.host)return false;
  if(S.host.v==="center")return "metal";
  if(!S.sw)return false;
  if(S.sw.takesButton)return "metal";
  return "rubber";   /* rubber illuminated AND forward clicky both take a rubber tailcap button */
}
function btnSet(){return takesButton()==="rubber"?RUBBTN:BTN}
/* Rubber tailcap colours differ in how much light they pass. */
function rubberGlow(n){
  if(!n)return null;
  if(n.indexOf("does NOT glow")>-1)return "none";
  if(n.indexOf("Translucent")>-1)return "most";
  return "some";
}
function canDoubleClear(){ return !!(S.host&&S.host.v==="full"&&S.sw&&S.sw.takesButton) }
/* A pressure-fit light cannot swap its ring, but it CAN take the metal lit switch
   together with a clear centre button — bought as a pair — to get centre glow. */
function pressLitPair(){
  return !!(S.host&&S.host.v==="center"&&S.presslit);
}
function isClear(name){ return name==="Clear Plastic" }
/* What the customer will actually SEE lit up. */
function glow(){
  if(!S.host)return null;
  if(S.host.v==="center"){
    if(pressLitPair()){
      return {k:"ok",t:"Centre glows",
        d:"The metal lit switch and the clear centre button go in together as a pair, so the middle "+
          "of your tail lights up. The factory outer ring stays as it is."};
    }
    return {k:"ring",t:"Outer ring glows",
      d:"Your outer ring is pressed in at the factory and stays as it is, so the light comes from "+
        "around the edge. A new centre button changes the look. The clear outer ring is not an "+
        "option on this finish &mdash; it only comes as part of the metal lit switch, which this "+
        "light cannot take."};
  }
  if(!S.sw)return null;
  if(!S.sw.lit)return {k:"none",t:"No light",d:"The forward clicky is not illuminated. Nothing on the tail will glow."};
  if(S.sw.id==="rubber"){
    var rg=S.btn?rubberGlow(S.btn[0]):null;
    if(rg==="none")return {k:"warn",t:"No glow",
      d:"That rubber button is opaque &mdash; it does not glow. Pick translucent or another colour if "+
        "you want to be able to find the light in the dark."};
    if(rg==="most")return {k:"ok",t:"Brightest glow",
      d:"Translucent rubber passes the most light of any button. The easiest option to spot in a dark room."};
    return {k:"ok",t:"Full face glow",
      d:"Rubber diffuses the LED across the whole button, tinted to match. Darker colours pass less light."};
  }
  if(!S.btn)return {k:"pick",t:"Pick a centre button",
    d:"The metal lit switch brings a clear outer ring with it. Pair it with a clear centre for Double "+
      "Clear, or with any other colour to keep the glow at the edge."};
  if(isClear(S.btn[0]))return {k:"ok",t:"Double Clear",
    d:"Clear outer ring plus clear centre &mdash; the whole tail lights, middle included."};
  return {k:"ok",t:"Outer ring glows",
    d:"The clear outer ring comes with the metal lit switch, and a "+S.btn[0]+" centre keeps the "+
      "middle solid &mdash; so the glow sits in a ring around the button. This is the single outer "+
      "clear look, and it is a normal way to run the light."};
}
/* Everything currently in the build, in cart order. */
function lines(){
  var L=[],BT=buildTag();
  if(S.host){
    var pr={};
    if(BT)pr["Build name"]=BT;
    if(S.em){
      pr["Emitter"]=S.em;
      pr["Reflector"]=S.refl||"Default";
      pr["Optic / lens"]=S.optic||"Default (Glass)";
    }
    var fit=[];
    if(S.sw)fit.push(S.sw.n+(S.led?" ("+S.led[0]+")":""));
    if(S.btn)fit.push(S.btn[0]+" button");
    if(fit.length)pr["Please fit"]=fit.join(" + ");
    if(S.ack)pr["Agreed"]="Non-returnable custom build";
    L.push({role:"The light",n:"Convoy S2+ - "+S.host.n,p:S.host.p,vid:S.host.vid,h:S.host.h,
            sw:S.host.sw,oos:!!S.host.oos,props:pr,
            sub:S.em?(S.em+" · "+(S.refl||"Default")+" · "+(S.optic||"Default (Glass)")):null});
  }
  if(pressLitPair()&&S.sw){
    var pv=S.led?S.led[2]:null;
    L.push({role:"Tail switch",n:S.sw.n+(S.led?" — "+S.led[0]:""),p:S.led?S.led[3]:S.sw.p,vid:pv,
            h:S.sw.h,sw:null,pend:!S.led});
  }
  if(S.host&&S.host.v==="full"&&S.sw){
    var p=S.sw.p,vid=null;
    if(S.sw.cols.length){ if(S.led){p=S.led[3];vid=S.led[2];} }
    else vid="50172242526523";
    L.push({role:"Tail switch",n:S.sw.n+(S.led?" — "+S.led[0]:""),p:p,vid:vid,h:S.sw.h,sw:null,
            pend:(S.sw.cols.length&&!S.led)});
  }
  if(S.clip&&S.clip.vid){
    L.push({role:"Pocket clip",n:S.clip.n,p:0.99,vid:S.clip.vid,h:S.clip.h,sw:null});
  }
  if(S.btn){
    var fam=takesButton(),isBrass=S.btn[0]==="Brass";
    L.push({role:(fam==="rubber"?"Rubber tail button":"Centre button"),n:(fam==="rubber"?"Rubber button — ":"Centre button — ")+S.btn[0],
            p:isBrass?BRASSBTN.p:(fam==="rubber"?RUBBTN.p:BTN.p),vid:S.btn[2],
            h:isBrass?BRASSBTN.h:(fam==="rubber"?RUBBTN.h:BTN.h),sw:S.btn[1]});
  }
  return L;
}
function goesWith(){
  if(!S.host)return null;
  return S.host.n+" S2+"+(S.em?" ("+S.em+")":"");
}
function cartItems(){
  var tag=buildTag();
  return lines().filter(function(l){return l.vid&&!l.oos}).map(function(l){
    var p=l.props?JSON.parse(JSON.stringify(l.props)):{};
    if(l.role!=="The light"){                    /* accessory lines: one relationship line, one part */
      var gw=goesWith();
      p["For"]=(tag?tag+" — ":"")+(gw||"this build");
      if(l.role)p["Part"]=l.role;
    }
    var o={id:Number(l.vid),quantity:1};
    if(Object.keys(p).length)o.properties=p;
    return o});
}
function cartUrl(){
  if(!ready())return null;
  var v=lines().filter(function(l){return l.vid&&!l.oos}).map(function(l){return l.vid+":1"});
  return v.length?SHOP+"/cart/"+v.join(","):null;
}
/* Build is ready to buy when nothing is still pending a choice. */
function ready(){
  var L=lines(); if(!L.length)return false;
  for(var i=0;i<L.length;i++){ if(L[i].pend||!L[i].vid)return false }
  if(S.host&&S.host.v==="full"&&!S.sw)return false;   /* full hosts must resolve the switch step */
  if(!S.em)return false;
  if(!S.refl)return false;
  if(!S.optic)return false;
  if(!S.clip)return false;   /* 'No thanks' counts as answered */
  if(!S.ack)return false;
  if(S.host&&S.host.oos)return false;
  return true;
}
