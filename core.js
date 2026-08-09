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


/* ================== DRAFT — NOT OWNER-APPROVED ==================
   Emitter list derived from the S2+ spec_table reflector pairing on the live
   product ("Smooth for SST20/SST40/SFT40/XPL HI/Osram; orange peel for
   219/519A/LH351D/B35AM/719A") plus the CCTs GC already sells on other Convoy
   listings. NO product listing was changed to produce this.
   Reflector is DERIVED from the emitter, never asked.
   ---- OWNER: confirm/trim this list and the CCTs before this goes live. ---- */
var EMITTERS=[
 {k:"519a", n:"Nichia 519A",  refl:"Orange peel", cri:"High CRI ~90", note:"The default crowd favourite. Neutral, natural colour.",
  ccts:["2700K","3000K","3500K","4000K","4500K","5000K","5700K"]},
 {k:"219b", n:"Nichia 219B",  refl:"Orange peel", cri:"Very high CRI ~92", note:"Rosy, best-in-class colour. Lower output.", ccts:["4500K"]},
 {k:"219c", n:"Nichia 219C",  refl:"Orange peel", cri:"High CRI ~90", note:"Neutral high-CRI, brighter than 219B.", ccts:["4000K","5000K"]},
 {k:"719a", n:"Nichia 719A",  refl:"Orange peel", cri:"Very high CRI ~93", note:"Modern high-CRI flooder.", ccts:["4000K","5000K"]},
 {k:"b35am",n:"Nichia B35AM", refl:"Orange peel", cri:"Ultra high CRI ~98", note:"Reference-grade colour. The connoisseur pick.", ccts:["4500K","5000K"]},
 {k:"lh351d",n:"Samsung LH351D",refl:"Orange peel",cri:"High CRI ~90", note:"Wide flood, strong output for the CRI.", ccts:["4000K","5000K"]},
 {k:"sst20",n:"Luminus SST-20",refl:"Smooth",     cri:"High CRI ~95", note:"High CRI with a tighter beam than the Nichias.", ccts:["4000K","6500K"]},
 {k:"sst40",n:"Luminus SST-40",refl:"Smooth",     cri:"Standard CRI ~70",note:"Brightest of the budget options. Output over colour.", ccts:["5000K","6500K"]},
 {k:"sft40",n:"Luminus SFT-40",refl:"Smooth",     cri:"Standard CRI ~70",note:"Throwier than SST-40 — reaches further.", ccts:["3000K","5000K","6500K"]},
 {k:"xplhi",n:"Cree XP-L HI", refl:"Smooth",      cri:"Standard CRI ~70",note:"Classic thrower emitter, tight hotspot.", ccts:["5000K","6500K"]},
 {k:"osram",n:"OSRAM W1 / W2", refl:"Smooth",     cri:"Low CRI ~70", note:"Maximum throw. Small, intense hotspot.", ccts:["6500K"]}
];

/* ---------------- rule engine ---------------- */
var S={host:null,em:null,cct:null,sw:null,led:null,btn:null};
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
  if(S.sw.id==="rubber")return "rubber";
  return false;
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
function isClear(name){ return name==="Clear Plastic" }
/* What the customer will actually SEE lit up. */
function glow(){
  if(!S.host)return null;
  if(S.host.v==="center"){
    return {k:"edge",t:"Edge glow only",
      d:"Your switch is pressed in at the factory, so the outer ring stays as it is. A new centre "+
        "button changes the look, but the light still comes from around the edge."};
  }
  if(!S.sw)return null;
  if(!S.sw.lit)return {k:"none",t:"No light",d:"The forward clicky is not illuminated. Nothing on the tail will glow."};
  if(S.sw.id==="rubber"){
    var rg=S.btn?rubberGlow(S.btn[0]):null;
    if(rg==="none")return {k:"none",t:"No glow",
      d:"That rubber button is opaque — it does not glow. Pick translucent or another colour if you "+
        "want to be able to find the light in the dark."};
    if(rg==="most")return {k:"double",t:"Brightest glow",
      d:"Translucent rubber passes the most light of any button. The easiest option to spot in a dark room."};
    if(rg==="some")return {k:"face",t:"Full face glow",
      d:"A coloured rubber button glows across its whole face, tinted to match. Darker colours pass "+
        "less light than translucent."};
    return {k:"face",t:"Full face glow",
      d:"Rubber diffuses the LED across the whole button — more light than the metal switch."};
  }
  if(!S.btn)return {k:"pick",t:"Pick a centre button",
    d:"The metal switch needs a centre button. Clear Plastic gives you Double Clear; anything else glows at the edge only."};
  if(isClear(S.btn[0]))return {k:"double",t:"DOUBLE CLEAR",
    d:"Clear outer ring and clear centre button — both light up. Because you are buying the metal "+
      "switch together with the light, this is the lit-up Double Clear."};
  return {k:"edge",t:"Edge glow only",
    d:"A "+S.btn[0]+" centre button blocks the middle, so you get glow around the edge — exactly like "+
      "the silver or black buttons."};
}
/* Everything currently in the build, in cart order. */
function lines(){
  var L=[];
  if(S.host){
    var pr=null;
    if(S.em){pr={"Emitter":S.em.n,"Colour temperature":S.cct||"—","Reflector":S.em.refl+" (matched to emitter)"};}
    L.push({n:"Convoy S2+ — "+S.host.n,p:S.host.p,vid:S.host.vid,h:S.host.h,sw:S.host.sw,
            oos:!!S.host.oos,props:pr,
            sub:S.em?(S.em.n+(S.cct?" · "+S.cct:"")+" · "+S.em.refl+" reflector"):null});
  }
  if(S.host&&S.host.v==="full"&&S.sw){
    var p=S.sw.p,vid=null;
    if(S.sw.cols.length){ if(S.led){p=S.led[3];vid=S.led[2];} }
    else vid="50172242526523";
    L.push({n:S.sw.n+(S.led?" — "+S.led[0]:""),p:p,vid:vid,h:S.sw.h,sw:null,
            pend:(S.sw.cols.length&&!S.led)});
  }
  if(S.btn){
    var fam=takesButton(),isBrass=S.btn[0]==="Brass";
    L.push({n:(fam==="rubber"?"Rubber button — ":"Centre button — ")+S.btn[0],
            p:isBrass?BRASSBTN.p:(fam==="rubber"?RUBBTN.p:BTN.p),vid:S.btn[2],
            h:isBrass?BRASSBTN.h:(fam==="rubber"?RUBBTN.h:BTN.h),sw:S.btn[1]});
  }
  return L;
}
function cartItems(){
  return lines().filter(function(l){return l.vid&&!l.oos}).map(function(l){
    var o={id:Number(l.vid),quantity:1}; if(l.props)o.properties=l.props; return o});
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
  if(S.host&&S.host.v==="full"&&!S.sw)return false;
  if(S.em&&!S.cct)return false;
  if(!S.em)return false;
  if(S.host&&S.host.v==="unknown")return false;
  if(S.host&&S.host.oos)return false;
  return true;
}
