// Convoy S2+ tail-switch compatibility data
// Compatibility source: https://www.gadgetconnections.com/pages/convoy-s2-faq
// Pricing / stock / variants: live Shopify pull 2026-08-08
const BASE = "https://www.gadgetconnections.com/products/";

const HOSTS = [
  // --- Anodized aluminium ---
  {id:"black",  name:"Black",        group:"Anodized Aluminium", verdict:"yes", sw:"#1e2124", handle:"convoy-s2", variant:"Black",  price:24.99, stock:58},
  {id:"gray",   name:"Gray",         group:"Anodized Aluminium", verdict:"yes", sw:"#7c8288", handle:"convoy-s2", variant:"Gray",   price:24.99, stock:5},
  {id:"golden", name:"Golden",       group:"Anodized Aluminium", verdict:"yes", sw:"#b8912f", handle:"convoy-s2", variant:"Golden", price:24.99, stock:17},
  {id:"blue",   name:"Blue",         group:"Anodized Aluminium", verdict:"no",  sw:"#20509a", handle:"convoy-s2", variant:"Blue",   price:24.99, stock:17},
  {id:"green",  name:"Green",        group:"Anodized Aluminium", verdict:"no",  sw:"#1f6b3a", handle:"convoy-s2", variant:"Green",  price:24.99, stock:10},
  {id:"red",    name:"Red",          group:"Anodized Aluminium", verdict:"no",  sw:"#9c2420", handle:"convoy-s2", variant:"Red",    price:24.99, stock:8},
  {id:"orange", name:"Orange",       group:"Anodized Aluminium", verdict:"no",  sw:"#c25a1c", handle:"convoy-s2", variant:"Orange", price:24.99, stock:16},
  {id:"purple", name:"Purple",       group:"Anodized Aluminium", verdict:"no",  sw:"#5b3a8e", handle:"convoy-s2", variant:"Purple", price:24.99, stock:6},
  {id:"tan",    name:"Tan",          group:"Anodized Aluminium", verdict:"no",  sw:"#a58a63", handle:"convoy-s2", variant:"Tan",    price:24.99, stock:7},
  {id:"silver", name:"Silver",       group:"Anodized Aluminium", verdict:"no",  sw:"#adb3b8", handle:"convoy-s2", variant:"Silver", price:24.99, stock:4},
  {id:"cyan",   name:"Cyan",         group:"Anodized Aluminium", verdict:"no",  sw:"#1d8f9c", handle:"convoy-s2", variant:"Cyan",   price:24.99, stock:3},
  // --- Specialty metals ---
  {id:"mao",    name:"MAO (Stone White)", group:"Specialty Metal", verdict:"yes", sw:"#ddd8cf", handle:"convoy-s2-mao-finish-micro-arc-oxidation-18650-flashlight", variant:null, price:33.99, stock:6},
  {id:"brass",  name:"Brass",        group:"Specialty Metal", verdict:"yes", sw:"#b08d3e", handle:"convoy-s2-18650-brass-flashlight", variant:null, price:41.99, stock:8},
  {id:"cu",     name:"Copper (Litnit)", group:"Specialty Metal", verdict:"yes", sw:"#a5673c", handle:"convoy-s2-18650-flashlight-litnit", variant:null, price:59.99, stock:3},
  {id:"cugl",   name:"Copper Glossy (unbranded)", group:"Specialty Metal", verdict:"yes", sw:"#bd7a45", handle:"convoy-s2-18650-copper-glossy-cu-flashlight-litnit-copy", variant:null, price:59.99, stock:3},
  // --- Titanium ---
  {id:"ti-gl",  name:"Ti Glossy",    group:"Titanium", verdict:"yes", sw:"#9aa0a6", handle:"convoy-s2-18650-titanium-ti-flashlight", variant:"Glossy", price:59.99, stock:5},
  {id:"ti-sw",  name:"Ti Stone Washed", group:"Titanium", verdict:"yes", sw:"#868d94", handle:"convoy-s2-18650-titanium-ti-flashlight", variant:"Stone Washed", price:59.99, stock:6},
  {id:"ti-gc",  name:"Ti Gold Circuit", group:"Titanium", verdict:"yes", sw:"#8d7a3f", handle:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes", variant:"Gold Circuit", price:69.99, stock:1},
  {id:"ti-mc",  name:"Ti Multi-Color Circuit", group:"Titanium", verdict:"yes", sw:"#5e6f8a", handle:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes", variant:"Multi-Color Circuit", price:69.99, stock:4},
  {id:"ti-sp",  name:"Ti Multi-Color Spatter", group:"Titanium", verdict:"no", sw:"#6b6f7d", handle:"convoy-s2-18650-titanium-ti-flashlight-specialty-finishes", variant:"Multi-Color Spatter", price:69.99, stock:3},
  {id:"ti-grc", name:"Ti Green Circuit (LE)", group:"Titanium", verdict:"no", sw:"#4d6b52", handle:"convoy-s2-18650-titanium-ti-flashlight-green-circuit-limited-edition", variant:null, price:69.99, stock:0},
  {id:"ti-ps",  name:"Ti Purple Swirl", group:"Titanium", verdict:"unknown", sw:"#6d5a86", handle:"convoy-s2-18650-titanium-ti-flashlight-purple-swirl", variant:null, price:79.99, stock:1}
];

const SWITCHES = [
  {id:"rubber", name:"Rubber Illuminated", handle:"convoy-illuminated-tail-switch-button-rubber",
   price:3.99, priceNote:"RGB $4.99", stock:196, lit:true,
   pitch:"Brightest glow. Rubber diffuses the LED, so it shows noticeably more light than the metal version.",
   action:"Reverse clicky — full click on, tap to change modes",
   colors:[["Orange","#c25a1c",27],["Blue","#20509a",31],["Green","#1f6b3a",32],["Red","#9c2420",25],["Purple","#5b3a8e",16],["Pink","#c96792",19],["White","#e8e8e6",20],["RGB Slow Fade","linear-gradient(135deg,#9c2420,#b8912f,#1f6b3a,#20509a,#5b3a8e)",26]]},
  {id:"metal", name:"Metal Illuminated", handle:"convoy-s2-illuminated-tail-switch-button",
   price:4.99, priceNote:"RGB $5.25", stock:198, lit:true,
   pitch:"Machined metal ring with a swappable centre button. Dimmer glow than rubber, but a harder, more tactile press.",
   action:"Reverse clicky — full click on, tap to change modes",
   colors:[["Orange","#c25a1c",37],["Blue","#20509a",28],["Green","#1f6b3a",27],["Red","#9c2420",15],["Purple","#5b3a8e",12],["Pink","#c96792",17],["White","#e8e8e6",37],["RGB Slow Fade","linear-gradient(135deg,#9c2420,#b8912f,#1f6b3a,#20509a,#5b3a8e)",25]]},
  {id:"forward", name:"Forward Clicky", handle:"convoy-forward-clicky-switch-for-s2-full-pcb-assembly",
   price:1.99, priceNote:"full PCB assembly", stock:36, lit:false,
   pitch:"Momentary signalling without committing the light on. Cannot be illuminated — no illuminated forward clicky exists.",
   action:"Half-press for momentary on, full click to stay on",
   colors:[]}
];

const METAL_BUTTONS = {
  handle:"convoy-black-button-for-metal-illuminated-switch", price:0.99,
  colors:[["Silver Aluminum","#adb3b8",38],["Black","#1e2124",35],["Clear Plastic","#dfe4e6",38],["Blue","#20509a",37],["Cyan","#1d8f9c",38],["Deep Green","#1f5b39",39],["Gray","#7c8288",38],["Orange","#c25a1c",39],["Purple","#5b3a8e",38],["Red","#9c2420",36],["Tan","#a58a63",37]]
};
const BRASS_BUTTON = {handle:"convoy-brass-button-for-metal-illuminated-switch", price:1.99, stock:30, name:"Brass", sw:"#b08d3e"};
const PLAIN_BUTTONS = {handle:"convoy-color-rubber-tail-cap-buttons-for-s2-c8-and-more", price:0.25,
  colors:[["Black","#1e2124",33],["Orange","#c25a1c",42],["Green (does NOT glow)","#1f6b3a",40],["Blue (glow)","#20509a",31],["Translucent / White","#e8e8e6",21]]};
