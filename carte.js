/* ===================== CARTE : grille, jetons, brouillard, mesure ===================== */
const Carte=(()=>{
const $=s=>document.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const COLORS={pj:"#3a6ea5",ennemi:"#9b2c1f",allie:"#2f6b3f",neutre:"#a8812f"};
const blankMap=()=>({name:"",img:null,w:1600,h:1100,grid:{size:50,ox:0,oy:0,show:true,color:"#000000",alpha:0.25},tokens:[],shapes:[],fog:{on:false,rev:[]},saveId:null});
let M_;try{M_=JSON.parse(localStorage.getItem("dnd-carte"))}catch(e){}
if(!M_||!M_.grid)M_=blankMap();
let V={s:0.6,x:20,y:20};             // vue : zoom et décalage
let folders=[],mapOpenF=null,lib=null,libOpenF=null,tool="move",sel=null,player=false,drag=null,measure=null,imgEl=null,saves=null,hover=null,shape=null,shapeColor="#e0662f",mapIndex=null,rollMsg=null,rollT=null;
const imgCache={};
const TV=location.hash==="#ecran";          // fenêtre « écran joueurs » (télé)
const QS=new URLSearchParams(location.search),ME=TV?QS.get("moi"):null,MYNAME=QS.get("nom")||"";   // carte affichée dans la fiche téléphone d'un joueur
let pmoves=true;try{pmoves=localStorage.getItem("dnd-pmoves")!=="0"}catch(e){}
const ME_TOOLS=[["move","✋ Bouger"],["draw","✏️ Dessin libre"],["line","➖ Ligne"],["circle","⭕ Sphère"],["cone","🔺 Cône"],["cube","⬛ Cube"],["measure","📏 Règle"]];
const SHAPE_TYPES=["draw","line","circle","cone","cube"];
let tvMoves=false,pending=null,userView=false,pdrag=null,meTool="move",meSel=null,meStroke=null,myStrokes=[];
const mine=t=>!!ME&&!!t&&!!t.pj&&(t.pid?t.pid===ME:(!!MYNAME&&t.name===MYNAME));
let liveCombat=null,follow=false;try{follow=localStorage.getItem("dnd-tv-follow")==="1"}catch(e){}
const onMap=()=>TV||location.hash==="#carte";
function persist(){if(TV)return;M_.ts=Date.now();try{updateExplored()}catch(e){}try{localStorage.setItem("dnd-carte",JSON.stringify(M_))}catch(e){try{localStorage.setItem("dnd-carte",JSON.stringify(Object.assign({},M_,{img:null})))}catch(e2){}}}
function loadImg(src,cb){if(!src)return null;if(imgCache[src])return imgCache[src];const i=new Image();i.onload=()=>{cb&&cb()};i.src=src;imgCache[src]=i;return i}

/* ---------- images : compression pour la base ---------- */
function maxBytes(){return Store.mode==="cloud"?170000:Store.mode==="api"?650000:1200000}
function compress(file,maxSide,limit){return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{
  let w=im.naturalWidth,h=im.naturalHeight;const k=Math.min(1,maxSide/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);
  const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,w,h);x.drawImage(im,0,0,w,h);
  let q=0.85,url=c.toDataURL("image/jpeg",q);while(url.length>limit&&q>0.35){q-=0.1;url=c.toDataURL("image/jpeg",q)}
  while(url.length>limit&&w>400){w=Math.round(w*0.8);h=Math.round(h*0.8);c.width=w;c.height=h;x.drawImage(im,0,0,w,h);url=c.toDataURL("image/jpeg",0.6)}
  ok({url,w,h})};im.onerror=ko;im.src=fr.result};fr.onerror=ko;fr.readAsDataURL(file)})}
function tokenImage(file){return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const S0=128,c=document.createElement("canvas");c.width=c.height=S0;const x=c.getContext("2d");
  const m=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-m)/2,(im.naturalHeight-m)/2,m,m,0,0,S0,S0);ok(c.toDataURL("image/jpeg",0.85))};im.onerror=ko;im.src=fr.result};fr.readAsDataURL(file)})}

/* ---------- géométrie ---------- */
const G=()=>M_.grid;
const cellOf=(x,y)=>[Math.floor((x-G().ox)/G().size),Math.floor((y-G().oy)/G().size)];
const toMap=(cx,cy)=>[(cx-V.x)/V.s,(cy-V.y)/V.s];
function snap(t){const g=G(),n=t.size||1;const [c,r]=cellOf(t.x-(n-1)*g.size/2,t.y-(n-1)*g.size/2);t.x=g.ox+c*g.size+n*g.size/2;t.y=g.oy+r*g.size+n*g.size/2}
function tokenAt(x,y){const vis=M_.tokens.filter(t=>!(player&&t.hidden));for(let i=vis.length-1;i>=0;i--){const t=vis[i];const R=(t.size||1)*G().size/2;if((x-t.x)**2+(y-t.y)**2<=R*R)return t}return null}
function combatInfo(){if(TV)return liveCombat||{list:[],current:null};try{return Combat.state()}catch(e){return {list:[],current:null}}}

/* ---------- dessin ---------- */
function draw(){draw0();live()}
function draw0(){const cv=$("#mapCanvas");if(!cv)return;const box=cv.parentElement;const dpr=window.devicePixelRatio||1;
  const W=box.clientWidth,H=box.clientHeight;if(cv.width!==W*dpr||cv.height!==H*dpr){cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px"}
  const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.fillStyle="#2a2419";x.fillRect(0,0,W,H);
  x.save();x.translate(V.x,V.y);x.scale(V.s,V.s);
  // fond
  if(M_.img){const im=loadImg(M_.img,draw);if(im&&im.complete)x.drawImage(im,0,0,M_.w,M_.h)}
  else{x.fillStyle="#efe6cf";x.fillRect(0,0,M_.w,M_.h);}
  // grille
  const g=G();if(g.show){x.strokeStyle=g.color;x.globalAlpha=g.alpha;x.lineWidth=1/V.s;x.beginPath();
    for(let gx=g.ox%g.size;gx<=M_.w;gx+=g.size){x.moveTo(gx,0);x.lineTo(gx,M_.h)}for(let gy=g.oy%g.size;gy<=M_.h;gy+=g.size){x.moveTo(0,gy);x.lineTo(M_.w,gy)}x.stroke();x.globalAlpha=1}
  // formes (zones de sorts, dessins)
  (M_.shapes||[]).concat(shape?[shape]:[],meStroke?[meStroke]:[]).forEach(sh=>drawShape(x,sh));
  // jetons
  const ci=combatInfo();const byId={};ci.list.forEach(e=>byId[e.id]=e);const sg=sight();
  M_.tokens.forEach(t=>{if(player&&t.hidden)return;if(player&&sg&&!t.pj&&!visible(sg,t.x,t.y))return;const R=(t.size||1)*g.size/2,ce=t.ref?byId[t.ref]:null;
    x.globalAlpha=t.hidden?0.45:1;
    if(ME&&mine(t)){x.save();x.beginPath();x.arc(t.x,t.y,R+9,0,7);if(meSel===t.id){x.setLineDash([]);x.lineWidth=5/V.s;x.strokeStyle="#f3c64f";x.shadowColor="#f3c64f";x.shadowBlur=12}else{x.setLineDash([6/V.s,4/V.s]);x.lineWidth=3/V.s;x.strokeStyle=tvMoves?"#f3c64f":"rgba(243,198,79,.4)"}x.stroke();x.restore()}
    if(ci.current&&t.ref===ci.current){x.beginPath();x.arc(t.x,t.y,R+6,0,7);x.fillStyle="rgba(240,200,80,.85)";x.fill()}
    x.beginPath();x.arc(t.x,t.y,R-1,0,7);x.fillStyle=t.color||"#555";x.fill();
    const im=t.img?loadImg(t.img,draw):null;if(im&&im.complete){x.save();x.beginPath();x.arc(t.x,t.y,R-4,0,7);x.clip();x.drawImage(im,t.x-R+4,t.y-R+4,2*R-8,2*R-8);x.restore()}
    else{x.fillStyle="#fff";x.font=`bold ${Math.round(R*0.8)}px Georgia`;x.textAlign="center";x.textBaseline="middle";x.fillText((t.name||"?").split(/\s+/).map(w=>w[0]).join("").slice(0,2).toUpperCase(),t.x,t.y+1)}
    x.lineWidth=sel===t.id?4:2;x.strokeStyle=sel===t.id?"#f3c64f":"#1b1408";x.beginPath();x.arc(t.x,t.y,R-1,0,7);x.stroke();
    const hp=ce?ce.hp:t.hp,mx=ce?ce.max:t.max;if(mx){const w=2*R*0.9,p=Math.max(0,Math.min(1,hp/mx));x.fillStyle="#1b1408";x.fillRect(t.x-w/2,t.y+R+2,w,6);x.fillStyle=p>.5?"#4f9a5e":p>.2?"#d4a73a":"#c0402c";x.fillRect(t.x-w/2,t.y+R+2,w*p,6);if(hp<=0){x.strokeStyle="#c0402c";x.lineWidth=4;x.beginPath();x.moveTo(t.x-R*.6,t.y-R*.6);x.lineTo(t.x+R*.6,t.y+R*.6);x.moveTo(t.x+R*.6,t.y-R*.6);x.lineTo(t.x-R*.6,t.y+R*.6);x.stroke()}}
    if(V.s*R>14||sel===t.id){x.font="bold 13px Georgia";x.textAlign="center";x.textBaseline="top";const lb=t.name||"";const tw=x.measureText(lb).width;x.fillStyle="rgba(27,20,8,.75)";x.fillRect(t.x-tw/2-4,t.y+R+10,tw+8,17);x.fillStyle="#fff";x.fillText(lb,t.x,t.y+R+12)}
    x.globalAlpha=1});
  drawVision(x,sg);
  if(pdrag&&pdrag.t){const t=pdrag.t,R=(t.size||1)*g.size/2;x.save();x.globalAlpha=.85;x.beginPath();x.arc(t.x,t.y,R-1,0,7);x.fillStyle=t.color||"#3a6ea5";x.fill();   // jeton en cours de glisser, visible même dans le noir
    const im=t.img?loadImg(t.img,draw0):null;if(im&&im.complete){x.beginPath();x.arc(t.x,t.y,R-4,0,7);x.clip();x.drawImage(im,t.x-R+4,t.y-R+4,2*R-8,2*R-8)}x.restore();
    x.beginPath();x.arc(t.x,t.y,R+9,0,7);x.setLineDash([6/V.s,4/V.s]);x.lineWidth=3/V.s;x.strokeStyle="#f3c64f";x.stroke();x.setLineDash([])}
  // brouillard
  if(M_.fog.on){const rev=new Set(M_.fog.rev);x.fillStyle=player?"#0b0906":"rgba(11,9,6,.55)";
    const c0=Math.floor(-g.ox/g.size)-1,r0=Math.floor(-g.oy/g.size)-1,c1=Math.ceil((M_.w-g.ox)/g.size),r1=Math.ceil((M_.h-g.oy)/g.size);
    for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)if(!rev.has(c+","+r))x.fillRect(g.ox+c*g.size,g.oy+r*g.size,g.size+0.5,g.size+0.5)}
  // mesure
  if(measure){x.strokeStyle="#f3c64f";x.lineWidth=3/V.s;x.setLineDash([10/V.s,6/V.s]);x.beginPath();x.moveTo(measure.x0,measure.y0);x.lineTo(measure.x1,measure.y1);x.stroke();x.setLineDash([]);
    const [a,b]=cellOf(measure.x0,measure.y0),[c,d]=cellOf(measure.x1,measure.y1);const n=Math.max(Math.abs(a-c),Math.abs(b-d));
    const lb=`${n} case${n>1?"s":""} · ${(n*1.5).toLocaleString("fr-FR")} m`;x.font=`bold ${16/V.s}px Georgia`;x.textAlign="left";x.textBaseline="bottom";const tw=x.measureText(lb).width;
    x.fillStyle="rgba(27,20,8,.85)";x.fillRect(measure.x1+8/V.s,measure.y1-26/V.s,tw+12/V.s,24/V.s);x.fillStyle="#f3c64f";x.fillText(lb,measure.x1+14/V.s,measure.y1-6/V.s)}
  drawWalls(x);drawPings(x);
  x.restore();overlays()}

function shapeInfo(sh){const g=G(),dx=sh.x1-sh.x0,dy=sh.y1-sh.y0,L=Math.hypot(dx,dy),m=v=>Math.round(v/g.size*1.5*2)/2;
  if(sh.type==="circle")return {lb:`rayon ${m(L).toLocaleString("fr-FR")} m`,L};if(sh.type==="cone")return {lb:`cône ${m(L).toLocaleString("fr-FR")} m`,L};
  if(sh.type==="line")return {lb:`ligne ${m(L).toLocaleString("fr-FR")} m`,L};if(sh.type==="cube"){const a=Math.max(Math.abs(dx),Math.abs(dy));return {lb:`cube ${m(a).toLocaleString("fr-FR")} m`,L:a}}return {lb:"",L}}
function drawShape(x,sh){const g=G();x.save();x.strokeStyle=sh.color;x.fillStyle=sh.color;x.lineWidth=3/V.s;x.lineJoin="round";x.lineCap="round";
  const dx=sh.x1-sh.x0,dy=sh.y1-sh.y0,L=Math.hypot(dx,dy);
  if(sh.type==="draw"){x.lineWidth=4/V.s;x.beginPath();(sh.pts||[]).forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();x.restore();return}
  x.globalAlpha=0.28;x.beginPath();
  if(sh.type==="circle")x.arc(sh.x0,sh.y0,L,0,7);
  if(sh.type==="cone"&&L>0){const ux=dx/L,uy=dy/L,px=-uy,py=ux;x.moveTo(sh.x0,sh.y0);x.lineTo(sh.x1+px*L/2,sh.y1+py*L/2);x.lineTo(sh.x1-px*L/2,sh.y1-py*L/2);x.closePath()}
  if(sh.type==="line"&&L>0){const w=g.size/2,ux=dx/L,uy=dy/L,px=-uy*w,py=ux*w;x.moveTo(sh.x0+px,sh.y0+py);x.lineTo(sh.x1+px,sh.y1+py);x.lineTo(sh.x1-px,sh.y1-py);x.lineTo(sh.x0-px,sh.y0-py);x.closePath()}
  if(sh.type==="cube"){const a=Math.max(Math.abs(dx),Math.abs(dy));x.rect(dx<0?sh.x0-a:sh.x0,dy<0?sh.y0-a:sh.y0,a,a)}
  x.fill();x.globalAlpha=0.9;x.stroke();x.globalAlpha=1;
  const lb=shapeInfo(sh).lb;if(lb&&L>2){x.font=`bold ${14/V.s}px Georgia`;x.textAlign="center";x.textBaseline="middle";const tw=x.measureText(lb).width;
    const lx=sh.type==="circle"?sh.x0:(sh.x0+sh.x1)/2,ly=sh.type==="circle"?sh.y0:(sh.y0+sh.y1)/2;x.fillStyle="rgba(27,20,8,.8)";x.fillRect(lx-tw/2-5/V.s,ly-11/V.s,tw+10/V.s,22/V.s);x.fillStyle="#fff";x.fillText(lb,lx,ly)}
  x.restore()}
function initOrder(){const ci=combatInfo();return [...ci.list].sort((a,b)=>(b.init??-99)-(a.init??-99)||(b.initBonus-a.initBonus))}
function overlays(){const st=document.querySelector(".mapstage");if(!st)return;
  let bar=st.querySelector("#initBar");if(!bar){bar=document.createElement("div");bar.id="initBar";st.appendChild(bar)}
  const ci=combatInfo();const hiddenRefs=new Set(M_.tokens.filter(t=>t.hidden&&t.ref).map(t=>t.ref));
  const o=initOrder().filter(e=>!(player&&hiddenRefs.has(e.id)));
  bar.innerHTML=ci.current&&o.length?`<span class="ib-r">Round ${ci.round}</span>`+o.map(e=>`<span class="ib ${e.kind} ${e.id===ci.current?"on":""} ${e.hp<=0?"ko":""}">${esc(e.name)}</span>`).join(""):"";
  bar.hidden=!bar.innerHTML;
  let rb=st.querySelector("#rollBig");if(!rb){rb=document.createElement("div");rb.id="rollBig";st.appendChild(rb)}
  rb.textContent=rollMsg||"";rb.hidden=!rollMsg}
/* ---------- panneau de contrôle ---------- */
function tokenPanel(){const t=M_.tokens.find(z=>z.id===sel);if(!t)return `<div class="small">Clique sur un jeton pour le modifier. Glisse-le pour le déplacer (il s'aimante à la grille).</div>`;
  const ce=t.ref?combatInfo().list.find(e=>e.id===t.ref):null;
  return `<div class="npcbox"><label class="f"><span>Nom</span><input type="text" data-tk="name" value="${esc(t.name)}"></label>
   <div class="row"><label class="f"><span>Taille</span><select data-tk="size">${[[1,"M / P (1 case)"],[2,"G (2×2)"],[3,"TG (3×3)"],[4,"Gig (4×4)"]].map(([v,l])=>`<option value="${v}" ${(t.size||1)==v?"selected":""}>${l}</option>`).join("")}</select></label>
   <label class="f" style="max-width:80px"><span>Couleur</span><input type="color" data-tk="color" value="${t.color||"#555555"}" style="height:38px;padding:2px"></label></div>
   ${ce?`<div class="small">Lié au combat : ${ce.hp} / ${ce.max} PV (modifie les PV dans l'onglet Combat).</div>`:`<div class="row"><label class="f"><span>PV</span><input type="number" data-tk="hp" value="${t.hp??""}"></label><label class="f"><span>PV max</span><input type="number" data-tk="max" value="${t.max??""}"></label></div>`}
   <label class="chk" style="margin:6px 0"><label class="${t.hidden?"sel":""}"><input type="checkbox" data-tk="hidden" ${t.hidden?"checked":""}> Caché aux joueurs</label><label class="${t.pj?"sel":""}"><input type="checkbox" data-tk="pj" ${t.pj?"checked":""}> Personnage joueur</label></label>${t.pj?`<div class="small">📱 ${t.pid?"Lié à sa fiche : le joueur peut le déplacer depuis son téléphone.":"Pas lié à une fiche : le téléphone le reconnaît s'il porte exactement le nom du perso."}</div>`:""}
   <div class="row"><label class="f"><span>💡 Lumière vive (m)</span><input type="number" min="0" step="1.5" data-tk="light" value="${t.light||""}" placeholder="torche 6" title="Rayon de lumière vive ; la lumière faible va deux fois plus loin (torche : 6 m vive + 6 m faible)"></label><label class="f"><span>👁️ Vision noir (m)</span><input type="number" min="0" step="1.5" data-tk="dv" value="${t.dv||""}" placeholder="0"></label></div>
   <div class="npcbox" style="margin:6px 0;padding:8px"><div class="small"><b>🚪 Porte / passage</b> : ce jeton mène vers une autre carte</div>
     ${mapIndex===null?`<button class="mini" data-m="loadIndex">Choisir la carte de destination…</button>`:`<select data-tk="link"><option value="">— aucune —</option>${mapIndex.filter(m=>m.id!==M_.saveId).map(m=>`<option value="${esc(m.id)}" ${t.link===m.id?"selected":""}>${esc(m.name)}</option>`).join("")}</select>`}
     ${t.link?`<div class="chk" style="margin-top:6px"><label class="${t.carry!==false?"sel":""}"><input type="checkbox" data-tk="carry" ${t.carry!==false?"checked":""}> Emmener les PJ</label><button class="btn sm" data-m="goLink">Passer la porte ➜</button></div>`:""}</div>
   <div class="row" style="flex:0"><label class="btn sec" style="text-align:center">🖼️ Image<input type="file" accept="image/*" data-tkimg="1" hidden></label>${t.img?`<button class="btn sec" data-tm="noimg">Sans image</button>`:""}<button class="btn sec del" data-tm="del">Retirer</button></div>
   <div class="row" style="align-items:flex-end;margin-top:6px"><label class="f"><span>📥 Ranger dans la bibliothèque (dossier)</span><input type="text" id="libFolder" list="libFolders" placeholder="ex. Gobelins, PNJ de la ville…"><datalist id="libFolders">${libFolders().map(f=>`<option value="${esc(f)}">`).join("")}</datalist></label><button class="btn sec" data-tm="tolib" style="flex:0;margin-bottom:10px">Ranger</button></div></div>`}
function libFolders(){return Array.isArray(lib)?[...new Set(lib.map(x=>x.data&&x.data.folder).filter(Boolean))].sort():[]}
function libHtml(){if(!lib)return "";if(lib==="loading")return `<div class="small">Chargement…</div>`;
  if(!lib.length)return `<div class="small" style="margin-top:6px">Bibliothèque vide : sélectionne un jeton et clique « Ranger » pour le garder pour plus tard.</div>`;
  const by={};lib.forEach((it,i)=>{const f=(it.data&&it.data.folder)||"Divers";(by[f]=by[f]||[]).push([it,i])});
  return `<div class="libbox">${Object.keys(by).sort().map(f=>`<details open data-k="lib:${esc(f)}"><summary>📁 ${esc(f)}</summary><div class="libgrid">${by[f].map(([it,i])=>`<div class="libtok"><button data-libadd="${i}" title="Poser sur la carte">${it.data.img?`<img src="${it.data.img}" alt="">`:`<span style="background:${esc(it.data.color||"#555")}">${esc((it.name||"?").slice(0,2).toUpperCase())}</span>`}</button><small>${esc(it.name)}</small><button class="mini del" data-libdel="${i}">✕</button></div>`).join("")}</div></details>`).join("")}</div>`}
/* ---------- grille en nombre de cases (toujours complètes) ---------- */
function gInfo(c,r){const st=stretch(c,r);return `1 case = ${(Math.round(G().size*10)/10).toLocaleString("fr-FR")} px${st?` · image étirée de ${st} % pour garder des cases carrées`:""}`}
function gridCount(){const g=G();return [Math.max(1,Math.round((M_.w-g.ox)/g.size)),Math.max(1,Math.round((M_.h-g.oy)/g.size))]}
function stretch(c,r){if(!M_.img||!M_.ih)return 0;const p=Math.round(Math.abs(M_.h/M_.ih-1)*100);return p>=1?p:0}
function fitGrid(c,r){const g=G();c=Math.max(1,Math.min(300,c|0));r=Math.max(1,Math.min(300,r|0));g.ox=0;g.oy=0;
  if(M_.img){M_.iw=M_.iw||M_.w;M_.ih=M_.ih||M_.h;M_.w=M_.iw;g.size=M_.w/c;M_.h=Math.round(r*g.size*100)/100}   // la largeur de l'image fixe la taille d'une case
  else{M_.w=c*g.size;M_.h=r*g.size}                                                                            // grille vide : la carte s'agrandit
  M_.tokens.forEach(t=>{t.x=Math.min(t.x,M_.w-1);t.y=Math.min(t.y,M_.h-1);snap(t)})}
function sideHtml(){const g=G();
  return `<div class="card"><h3>Carte</h3>
    <label class="f"><span>Nom de la carte</span><input type="text" id="mapName" value="${esc(M_.name)}" placeholder="ex. Taverne du Vieux Port"></label>
    <label class="f"><span>📁 Dossier</span><input type="text" id="mapFolder" list="mapFolders" value="${esc(M_.folder||"")}" placeholder="ex. Donjons, Tavernes, Forêt…"><datalist id="mapFolders">${folders.map(f=>`<option value="${esc(f)}">`).join("")}</datalist></label>
    <div class="row" style="flex:0;flex-wrap:wrap"><label class="btn sec" style="text-align:center">🖼️ Image de fond<input type="file" accept="image/*" id="mapImg" hidden></label><button class="btn sec" data-m="fit">Ajuster</button></div>
    <div class="small" style="margin-top:4px">L'image est compressée automatiquement pour la sauvegarde.</div></div>
   <div class="card"><h3>Outils</h3><div class="chk">${[["move","✋ Déplacer"],["measure","📏 Mesurer"],["reveal","🔦 Révéler"],["hide","🌫️ Cacher"],["circle","⭕ Sphère"],["cone","🔺 Cône"],["line","➖ Ligne"],["cube","⬛ Cube"],["draw","✏️ Dessin"],["wall","🧱 Mur"],["door","🚪 Porte"],["wallx","🧹 Gomme murs"],["ping","📍 Montrer"]].map(([k,l])=>`<label class="${tool===k?"sel":""}"><input type="radio" name="mtool" value="${k}" ${tool===k?"checked":""}>${l}</label>`).join("")}</div>
    <div class="chk" style="margin-top:8px"><label class="${M_.fog.on?"sel":""}"><input type="checkbox" id="mapFog" ${M_.fog.on?"checked":""}> Brouillard de guerre</label><button class="mini" data-m="fogall">Tout cacher</button><button class="mini" data-m="fognone">Tout révéler</button></div>
    <div class="chk" style="margin-top:8px;align-items:center"><span class="small">Couleur des formes</span><input type="color" id="mapShapeCol" value="${shapeColor}" style="width:44px;height:32px;padding:2px">${(M_.shapes||[]).length?`<button class="mini" data-m="undoShape">↶ Annuler</button><button class="mini" data-m="clearShapes">Effacer les formes</button>`:""}</div>
    <div class="small" style="margin-top:4px">Molette = zoom · glisser le fond = se déplacer · Révéler/Cacher : glisse sur les cases · Sphère : glisse depuis le centre · Cône/Ligne : depuis le lanceur.</div></div>
   <div class="card"><h3>Dés (affichés en grand)</h3><div class="chk">${[4,6,8,10,12,20].map(d=>`<button class="mini" data-mdie="${d}">d${d}</button>`).join("")}<button class="mini" data-mdie="adv">d20 avantage</button><button class="mini" data-mdie="dis">d20 désav.</button></div>
    <div class="small" style="margin-top:4px">Les jets faits dans les autres onglets (fiche En partie, combat, outils) s'affichent aussi sur la carte.</div></div>
   <div class="card"><h3>Grille</h3>${(()=>{const [c,r]=gridCount();const st=stretch(c,r);return `<div class="row"><label class="f"><span>Cases en largeur</span><input type="number" min="1" max="300" id="gCols" value="${c}"></label><label class="f"><span>Cases en hauteur</span><input type="number" min="1" max="300" id="gRows" value="${r}"></label></div>
    <div class="small" id="gInfo" style="margin:-4px 0 6px">${gInfo(c,r)}</div>`})()}
    <details class="small" data-k="gfine"><summary style="cursor:pointer">Réglage fin (taille en px, décalage)</summary><div class="row"><label class="f"><span>Taille d'une case (px)</span><input type="number" min="10" max="300" step="0.1" data-g="size" value="${Math.round(g.size*10)/10}"></label></div>
    <div class="row"><label class="f"><span>Décalage X</span><input type="number" data-g="ox" value="${g.ox}"></label><label class="f"><span>Décalage Y</span><input type="number" data-g="oy" value="${g.oy}"></label></div></details>
    <div class="chk"><label class="${g.show?"sel":""}"><input type="checkbox" data-g="show" ${g.show?"checked":""}> Afficher</label><input type="color" data-g="color" value="${g.color}" title="Couleur" style="width:44px;height:32px;padding:2px"><input type="range" min="0.05" max="1" step="0.05" data-g="alpha" value="${g.alpha}" title="Opacité" style="width:110px"></div>
    <div class="small">1 case = 1,50 m. Compte les cases dessinées sur ta carte et mets les mêmes nombres : la grille tombe pile, sans case coupée.</div></div>
   ${visionCard()}
   <div class="card"><h3>Jetons</h3><div class="cbtns" style="justify-content:flex-start"><button class="btn sec" data-m="addCombat">⚔️ Depuis le combat</button><button class="btn sec" data-m="addGroup">👥 Le groupe</button><button class="btn sec" data-m="addMe">🛡️ Mon perso</button><button class="btn sec" data-m="lib">🎭 Bibliothèque</button></div>${libHtml()}
    <div class="row" style="margin-top:8px;align-items:flex-end"><label class="f"><span>Créature</span><select id="mapTpl"><option value="">— modèle —</option>${Object.keys(window.PNJ.TEMPLATES).map(k=>`<option>${esc(k)}</option>`).join("")}</select></label><label class="f" style="max-width:70px"><span>Nb</span><input type="number" id="mapQty" value="1" min="1" max="20"></label><button class="btn sec" data-m="addTpl" style="flex:0;margin-bottom:10px">+</button></div>
    <div class="row" style="align-items:flex-end"><label class="f"><span>Jeton libre</span><input type="text" id="mapFree" placeholder="ex. Coffre, PNJ…"></label><button class="btn sec" data-m="addFree" style="flex:0;margin-bottom:10px">+</button></div>
    ${M_.tokens.length?`<button class="mini" data-m="clearTok">Retirer tous les jetons</button>`:""}
    <div id="tokPanel" style="margin-top:8px">${tokenPanel()}</div></div>`}
function render(){const box=$("#cartePage");if(!box)return;if(!TV&&location.hash==="#carte")mapSeen=true;
  // on garde la position : défilement de la page et du panneau, sections dépliées
  const sy=window.scrollY,side=box.querySelector(".mapside"),ss=side?side.scrollTop:0;
  const opened=new Set([...box.querySelectorAll("details[data-k]")].filter(d=>d.open).map(d=>d.dataset.k)),closed=new Set([...box.querySelectorAll("details[data-k]")].filter(d=>!d.open).map(d=>d.dataset.k));
  box.style.minHeight=box.offsetHeight+"px";
  box.innerHTML=`<div class="mapbar"><div class="cbtns" style="justify-content:flex-start"><button class="btn" data-m="save">💾 Sauvegarder la carte</button><button class="btn sec" data-m="list">🗂️ Mes cartes</button><button class="btn sec" data-m="new">Nouvelle carte</button></div>
     <div class="cbtns"><button class="btn sec" data-m="zoomout">−</button><button class="btn sec" data-m="zoomin">+</button><button class="btn" data-m="player">📺 Vue joueurs</button></div></div>
    <div class="card livebox"><button class="btn" data-m="openTv">🖥️ Ouvrir l'écran TV</button><div class="chk"><label class="${follow?"sel":""}"><input type="checkbox" id="mapFollow" ${follow?"checked":""}> La TV suit mon cadrage</label></div><label class="btn sec">🖼️ Montrer une image<input type="file" accept="image/*" id="showImgIn" hidden></label>${show?`<button class="btn sec del" data-m="hideShow">✕ Retirer l'image de la TV</button>`:""}${showHist.length?`<span class="showhist">${showHist.map((h,i)=>`<img src="${h.img}" data-showh="${i}" title="Remontrer ${esc(h.name)}" class="${show&&show.k===h.k?"on":""}">`).join("")}</span>`:""}<div class="chk"><label class="${pmoves?"sel":""}" title="Les joueurs déplacent leur jeton depuis leur téléphone (#joueur). Décoche pour les soirs où tu gères tout (Discord)."><input type="checkbox" id="mapPmoves" ${pmoves?"checked":""}> 📱 Les joueurs bougent leur jeton et dessinent</label></div><span class="small"><span class="livedot ${tvSeen()?"on":""}" id="liveDot"></span><span id="liveTxt">${tvSeen()?"Écran TV connecté":"Aucun écran TV ouvert"}</span>${Store.mode==="api"?` · autre appareil du réseau : <code>${esc(tvUrl())}</code>${/^(localhost|127\.)/.test(location.hostname)?" (remplace "+esc(location.hostname)+" par l'adresse IP de ton PC, ipconfig)":""}`:""}</span></div>
    <div id="mapSaves">${savesHtml()}</div>
    <div class="mapwrap ${player?"player":""}"><aside class="mapside">${sideHtml()}</aside><div class="mapstage"><canvas id="mapCanvas"></canvas>${player&&!TV?`<button class="btn exitplayer" data-m="player">✕ Quitter la vue joueurs</button>`:""}${TV&&ME?`<div id="tvHelp" class="mehelp"><span class="metools"><select id="meToolSel" title="Outil">${ME_TOOLS.map(([k,l])=>`<option value="${k}" ${meTool===k?"selected":""}>${l}</option>`).join("")}</select><button class="btn sec sm" data-m="meErase" title="Effacer mes dessins">🧽</button></span><button class="btn sec sm" data-m="tvZoom:0.8">−</button><button class="btn sec sm" data-m="tvZoom:1.25">+</button><button class="btn sec sm" data-m="tvRecenter">🎯 Recentrer</button><span id="meTxt">${meHint()}</span></div>${tvGot?"":`<div id="tvWait">En attente de la carte du MJ…</div>`}`:""}${TV&&!ME?`<div id="tvHelp"><button class="btn" data-m="tvFull">⛶ Plein écran</button><span>Cette fenêtre suit la carte du MJ en direct.</span></div>${tvGot?"":`<div id="tvWait">En attente de la carte du MJ…<br><span class="small">Ouvre l'onglet Carte sur l'écran du MJ.</span></div>`}`:""}</div></div>`;
  box.querySelectorAll("details[data-k]").forEach(d=>{if(opened.has(d.dataset.k))d.open=true;else if(closed.has(d.dataset.k))d.open=false});
  const side2=box.querySelector(".mapside");if(side2)side2.scrollTop=ss;window.scrollTo(0,sy);box.style.minHeight="";
  requestAnimationFrame(draw)}
function refreshTokPanel(){const p=$("#tokPanel");if(p)p.innerHTML=tokenPanel()}
function savesHtml(){if(!saves)return "";if(saves==="loading")return `<div class="card small">Chargement…</div>`;
  if(!saves.length)return `<div class="card small">Aucune carte sauvegardée.</div>`;
  const by={};saves.forEach((s,i)=>{const f=(s.data&&s.data.folder)||"Sans dossier";(by[f]=by[f]||[]).push([s,i])});
  const keys=Object.keys(by).sort((a,b)=>a==="Sans dossier"?1:b==="Sans dossier"?-1:a.localeCompare(b,"fr"));
  return `<div class="card"><h3>Mes cartes</h3>${keys.map(f=>`<details class="mfold" ${keys.length<2||mapOpenF===f?"open":""} data-mf="${esc(f)}" data-k="mf:${esc(f)}"><summary>📁 ${esc(f)} <span class="small">(${by[f].length})</span></summary><div class="savelist">${by[f].map(([s,i])=>`<div class="saveitem ${s.id===M_.saveId?"cur":""}"><div><b>${esc(s.name)}</b><div class="small">${esc(s.summary||"")} · ${new Date(s.updated||0).toLocaleDateString("fr-FR")}</div></div><div class="saveact"><button class="btn sec" data-mload="${i}">Ouvrir</button><button class="btn sec del" data-mdel="${i}">✕</button></div></div>`).join("")}</div></details>`).join("")}</div>`}

/* ---------- ajout de jetons ---------- */
function occupied(){const g=G(),o=new Set();M_.tokens.forEach(t=>{const n=t.size||1;const [c,r]=cellOf(t.x-(n-1)*g.size/2,t.y-(n-1)*g.size/2);for(let i=0;i<n;i++)for(let j=0;j<n;j++)o.add((c+i)+","+(r+j))});return o}
function placeFree(tk,ox,oy){const g=G(),n=tk.size||1,occ=occupied();const st=$("#mapCanvas");
  const [cx,cy]=ox!=null?[ox,oy]:st?toMap(st.clientWidth/2,st.clientHeight/2):[M_.w/2,M_.h/2];const [c0,r0]=cellOf(cx,cy);
  const fits=(c,r)=>{for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(occ.has((c+i)+","+(r+j)))return false;return true};
  for(let rad=0;rad<40;rad++)for(let dc=-rad;dc<=rad;dc++)for(let dr=-rad;dr<=rad;dr++){if(Math.max(Math.abs(dc),Math.abs(dr))!==rad)continue;const c=c0+dc,r=r0+dr;
    if(fits(c,r)){tk.x=g.ox+c*g.size+n*g.size/2;tk.y=g.oy+r*g.size+n*g.size/2;return}}
  tk.x=cx;tk.y=cy;snap(tk)}
function addTokens(list){list.forEach(t=>{const tk=Object.assign({id:uid(),x:0,y:0,size:1,color:"#555555"},t);placeFree(tk);M_.tokens.push(tk)});persist();render();toast(list.length+" jeton(s) ajouté(s)")}
const sizeOf=s=>/Grande/.test(s||"")?2:/Très grande/.test(s||"")?3:/Gigan/.test(s||"")?4:1;

/* ---------- murs, portes, lignes de vue et lumières ---------- */
const VIS=()=>{M_.vision=M_.vision||{on:false,dark:false};M_.walls=M_.walls||[];return M_.vision};
const m2px=m=>(m||0)/1.5*G().size;
function dvOfRace(r){const R0=(typeof RACES!=="undefined"&&RACES[r])||null;const t=R0&&(R0.traits||[]).join(" ");const m=t&&t.match(/Vision dans le noir (\d+)/);return m?+m[1]:0}
function segs(){const s=[[0,0,M_.w,0],[M_.w,0,M_.w,M_.h],[M_.w,M_.h,0,M_.h],[0,M_.h,0,0]];(M_.walls||[]).forEach(w=>{if(!(w.door&&w.open))s.push([w.a[0],w.a[1],w.b[0],w.b[1]])});return s}
function losPoly(ox,oy,S){const angs=[];S.forEach(s=>{for(const [px,py] of [[s[0],s[1]],[s[2],s[3]]]){const a=Math.atan2(py-oy,px-ox);angs.push(a-1e-4,a,a+1e-4)}});
  const pts=[];angs.forEach(a=>{const dx=Math.cos(a),dy=Math.sin(a);let best=Infinity;
    for(const s of S){const sx=s[2]-s[0],sy=s[3]-s[1],den=dx*sy-dy*sx;if(Math.abs(den)<1e-9)continue;const qx=s[0]-ox,qy=s[1]-oy;const t=(qx*sy-qy*sx)/den,u=(qx*dy-qy*dx)/den;if(t>=0&&u>=-1e-9&&u<=1+1e-9&&t<best)best=t}
    if(best<Infinity)pts.push([ox+dx*best,oy+dy*best,a])});
  pts.sort((p,q)=>p[2]-q[2]);return pts}
function inPoly(x,y,P){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
// qui voit quoi : PJ (avec leur portée) + sources de lumière
function sight(){const v=VIS();if(!v.on)return null;const S=segs();
  const ex=t=>t.vx??t.x,ey=t=>t.vy??t.y;   // pendant un glisser, on voit depuis la case de départ
  // sur le téléphone d'un joueur : seulement ce que voit SON perso (la télé, elle, montre tout le groupe)
  let pjs=M_.tokens.filter(t=>t.pj&&!t.hidden);if(ME&&pjs.some(mine))pjs=pjs.filter(mine);
  const eyes=pjs.map(t=>({x:ex(t),y:ey(t),dv:m2px(t.dv||0),poly:losPoly(ex(t),ey(t),S)}));
  // lumière : rayon = lumière vive, puis autant de lumière faible (torche 6 m = 6 m vive + 6 m faible)
  const lights=v.dark?M_.tokens.filter(t=>(t.light||0)>0&&!(t.hidden&&!t.pj)).map(t=>({x:ex(t),y:ey(t),r:m2px(t.light),poly:losPoly(ex(t),ey(t),S)})):[];
  return {dark:!!v.dark,eyes,lights}}
const litAt=(sg,x,y)=>sg.lights.some(l=>Math.hypot(x-l.x,y-l.y)<=2*l.r&&inPoly(x,y,l.poly));
function visible(sg,x,y){if(!sg)return true;return sg.eyes.some(e=>inPoly(x,y,e.poly)&&(!sg.dark||Math.hypot(x-e.x,y-e.y)<=e.dv||litAt(sg,x,y)))}
function updateExplored(){const sg=sight();if(!sg)return;const g=G(),set=new Set(M_.explored||[]);const n0=set.size;
  const c1=Math.ceil((M_.w-g.ox)/g.size),r1=Math.ceil((M_.h-g.oy)/g.size);
  for(let c=Math.floor(-g.ox/g.size);c<=c1;c++)for(let r=Math.floor(-g.oy/g.size);r<=r1;r++){const k=c+","+r;if(set.has(k))continue;if(visible(sg,g.ox+(c+.5)*g.size,g.oy+(r+.5)*g.size))set.add(k)}
  if(set.size!==n0)M_.explored=[...set]}
let maskC=null,grayC=null;
function drawVision(x,sg){if(!sg)return;const k=Math.min(1,2200/Math.max(M_.w,M_.h));maskC=maskC||document.createElement("canvas");grayC=grayC||document.createElement("canvas");
  const W=Math.ceil(M_.w*k),H=Math.ceil(M_.h*k);[maskC,grayC].forEach(c=>{if(c.width!==W||c.height!==H){c.width=W;c.height=H}});
  const g=G(),path=(c,P)=>{c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()};
  // dégradé circulaire : opaque jusqu'à « plein », puis s'efface jusqu'à « r » (avec un palier « mid » pour la lumière faible)
  const disc=(c,cx,cy,r,full,mid)=>{if(r<=0)return;const gr=c.createRadialGradient(cx,cy,0,cx,cy,r);gr.addColorStop(0,"rgba(0,0,0,1)");gr.addColorStop(Math.min(.99,full/r),"rgba(0,0,0,1)");
    if(mid)gr.addColorStop(Math.min(.995,(full+(r-full)*.6)/r),`rgba(0,0,0,${mid})`);gr.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=gr;c.beginPath();c.arc(cx,cy,r,0,7);c.fill()};
  const lit=(c,e,mid)=>sg.lights.forEach(l=>{c.save();path(c,l.poly);c.clip();disc(c,l.x,l.y,2*l.r,l.r,mid);c.restore()});
  // 1) le noir : rien, zones déjà vues (sombres), vision dans le noir (pénombre), lumière (vive puis faible)
  const m=maskC.getContext("2d");m.setTransform(1,0,0,1,0,0);m.globalCompositeOperation="source-over";m.clearRect(0,0,W,H);m.fillStyle="#07060a";m.fillRect(0,0,W,H);
  m.setTransform(k,0,0,k,0,0);m.globalCompositeOperation="destination-out";
  m.fillStyle="rgba(0,0,0,.42)";(M_.explored||[]).forEach(q=>{const [c,r]=q.split(",").map(Number);m.fillRect(g.ox+c*g.size,g.oy+r*g.size,g.size+.5,g.size+.5)});
  sg.eyes.forEach(e=>{if(!e.poly.length)return;m.save();path(m,e.poly);m.clip();
    if(!sg.dark){m.fillStyle="#000";m.fillRect(0,0,M_.w,M_.h)}
    else{if(e.dv>0){m.globalAlpha=.68;disc(m,e.x,e.y,e.dv,e.dv*.85);m.globalAlpha=1}lit(m,e,.72)}
    m.restore()});
  // 2) la vision dans le noir voit en noir et blanc : on désature ce qui n'est vu QUE grâce à elle (vue joueurs)
  if(sg.dark&&player&&sg.eyes.some(e=>e.dv>0)){const q=grayC.getContext("2d");q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation="source-over";q.clearRect(0,0,W,H);q.setTransform(k,0,0,k,0,0);
    sg.eyes.forEach(e=>{if(!e.poly.length||e.dv<=0)return;q.save();path(q,e.poly);q.clip();q.fillStyle="#808080";q.beginPath();q.arc(e.x,e.y,e.dv,0,7);q.fill();q.restore()});
    q.globalCompositeOperation="destination-out";sg.eyes.forEach(e=>{if(!e.poly.length)return;q.save();path(q,e.poly);q.clip();lit(q,e,0);q.restore()});
    x.save();x.globalCompositeOperation="saturation";x.drawImage(grayC,0,0,M_.w,M_.h);x.restore()}
  x.save();x.globalAlpha=player?1:0.45;x.drawImage(maskC,0,0,M_.w,M_.h);x.restore()}
function drawWalls(x){if(player||!(M_.walls||[]).length&&!wallDraft)return;x.save();x.lineCap="round";
  (M_.walls||[]).concat(wallDraft?[wallDraft]:[]).forEach(w=>{x.lineWidth=(w.door?7:5)/V.s;x.strokeStyle=w.door?(w.open?"rgba(90,200,110,.9)":"#e0892f"):"rgba(80,160,255,.9)";
    if(w.door&&w.open)x.setLineDash([8/V.s,6/V.s]);x.beginPath();x.moveTo(w.a[0],w.a[1]);x.lineTo(w.b[0],w.b[1]);x.stroke();x.setLineDash([])});x.restore()}
let wallDraft=null;
const corner=(x,y,free)=>{if(free)return [Math.round(x),Math.round(y)];const g=G();return [g.ox+Math.round((x-g.ox)/g.size)*g.size,g.oy+Math.round((y-g.oy)/g.size)*g.size]};
function segDist(px,py,w){const [ax,ay]=w.a,[bx,by]=w.b,dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy;const t=L?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/L)):0;return Math.hypot(px-ax-t*dx,py-ay-t*dy)}
function wallAt(x,y,doorOnly){const lim=10/V.s;let best=null,bd=lim;(M_.walls||[]).forEach(w=>{if(doorOnly&&!w.door)return;const d=segDist(x,y,w);if(d<bd){bd=d;best=w}});return best}
function visionCard(){const v=VIS();const nw=M_.walls.length;
  return `<div class="card"><h3>Vision et lumière</h3>
   <div class="chk"><label class="${v.on?"sel":""}"><input type="checkbox" id="visOn" ${v.on?"checked":""}> Lignes de vue (les murs bloquent la vue)</label>
   <label class="${v.dark?"sel":""}"><input type="checkbox" id="visDark" ${v.dark?"checked":""}> Obscurité (on ne voit qu'avec lumière / vision dans le noir)</label></div>
   ${v.dark?`<div class="small" style="margin-bottom:4px">💡 Lumière (torche…) = en couleur, vive puis faible jusqu'au double du rayon. 👁️ Vision dans le noir = en gris et plus sombre. Sur la télé on voit ce que voit tout le groupe ; sur le téléphone, chacun ne voit que ce que voit son perso.</div>`:""}
   <div class="small">Outils 🧱 Mur et 🚪 Porte : glisse d'un coin de case à l'autre (Maj = sans aimant). En mode ✋, clique une porte pour l'ouvrir ou la fermer. ${nw} segment${nw>1?"s":""}.</div>
   <div class="cbtns" style="justify-content:flex-start;margin-top:6px">${nw?`<button class="mini" data-m="wallUndo">↶ Dernier mur</button><button class="mini" data-m="wallClear">Effacer les murs</button>`:""}${(M_.explored||[]).length?`<button class="mini" data-m="exploReset">Oublier les zones explorées</button>`:""}</div></div>`}

/* ---------- ping et image montrée aux joueurs ---------- */
let pings=[],pingLoopOn=false,show=null,showHist=[];
function addPing(x,y,id){pings.push({id:id||uid(),x,y,t:Date.now()});if(!pingLoopOn){pingLoopOn=true;const loop=()=>{pings=pings.filter(p=>Date.now()-p.t<2200);(TV?draw0:draw)();if(pings.length)requestAnimationFrame(loop);else pingLoopOn=false};requestAnimationFrame(loop)}}
function drawPings(x){const now=Date.now();pings.forEach(p=>{const a=(now-p.t)/2200;if(a>=1)return;for(let i=0;i<3;i++){const b=(a*1.6-i*0.25);if(b<0||b>1)continue;
  x.beginPath();x.arc(p.x,p.y,10/V.s+b*G().size*1.6,0,7);x.lineWidth=(5-b*3)/V.s*1.6;x.strokeStyle=`rgba(243,198,79,${1-b})`;x.stroke()}
  x.beginPath();x.arc(p.x,p.y,6/V.s,0,7);x.fillStyle=`rgba(243,198,79,${1-a})`;x.fill()})}
function showOverlay(){let o=document.getElementById("tvShow");if(!show||!show.img){if(o)o.remove();return}
  if(!o){o=document.createElement("div");o.id="tvShow";document.body.appendChild(o)}if(o.dataset.k!==show.k){o.dataset.k=show.k;o.innerHTML=`<img src="${show.img}" alt="">${show.name?`<div class="cap">${esc(show.name)}</div>`:""}`}}

/* ---------- événements ---------- */
let painting=null;
function paintCell(x,y){const [c,r]=cellOf(x,y),k=c+","+r;const set=new Set(M_.fog.rev);if(tool==="reveal")set.add(k);else set.delete(k);M_.fog.rev=[...set]}
document.addEventListener("pointerdown",e=>{const cv=e.target;if(cv.id!=="mapCanvas")return;if(TV){if(ME)meDown(e,cv);return}cv.setPointerCapture(e.pointerId);const r=cv.getBoundingClientRect();const [mx,my]=toMap(e.clientX-r.left,e.clientY-r.top);
  if(tool==="measure"){measure={x0:mx,y0:my,x1:mx,y1:my};return}
  if(tool==="ping"){addPing(mx,my);live();return}
  if(tool==="wall"||tool==="door"){const c=corner(mx,my,e.shiftKey);VIS();wallDraft={a:c,b:c.slice(),door:tool==="door"};return}
  if(tool==="wallx"){const w=wallAt(mx,my);if(w){M_.walls=M_.walls.filter(z=>z!==w);persist();render()}return}
  if(["circle","cone","line","cube","draw"].includes(tool)){shape={type:tool,x0:mx,y0:my,x1:mx,y1:my,color:shapeColor,pts:tool==="draw"?[[mx,my]]:undefined};return}
  if((tool==="reveal"||tool==="hide")&&!player){if(!M_.fog.on){M_.fog.on=true;render()}painting=true;paintCell(mx,my);draw();return}
  const t=tokenAt(mx,my);if(t&&!(player&&false)){sel=t.id;t.vx=t.x;t.vy=t.y;drag={t,dx:mx-t.x,dy:my-t.y,moved:false};refreshTokPanel();draw();return}
  if(tool==="move"){const d=wallAt(mx,my,true);if(d){d.open=!d.open;persist();draw();toast(d.open?"Porte ouverte":"Porte fermée",1200);return}}
  sel=null;refreshTokPanel();drag={pan:true,sx:e.clientX,sy:e.clientY,vx:V.x,vy:V.y};draw()});
document.addEventListener("pointermove",e=>{const cv=$("#mapCanvas");if(!cv||(!drag&&!measure&&!painting&&!shape&&!wallDraft))return;const r=cv.getBoundingClientRect();const [mx,my]=toMap(e.clientX-r.left,e.clientY-r.top);
  if(wallDraft){wallDraft.b=corner(mx,my,e.shiftKey);draw();return}
  if(measure){measure.x1=mx;measure.y1=my;draw();return}
  if(shape){shape.x1=mx;shape.y1=my;if(shape.pts)shape.pts.push([Math.round(mx),Math.round(my)]);draw();return}
  if(painting){paintCell(mx,my);draw();return}
  if(drag&&drag.pan){V.x=drag.vx+(e.clientX-drag.sx);V.y=drag.vy+(e.clientY-drag.sy);draw();return}
  if(drag&&drag.t){drag.t.x=mx-drag.dx;drag.t.y=my-drag.dy;drag.moved=true;draw()}});
document.addEventListener("pointerup",e=>{if(wallDraft){const w=wallDraft;wallDraft=null;if(w.a[0]!==w.b[0]||w.a[1]!==w.b[1]){M_.walls.push(w);persist()}render();return}
  if(measure){measure=null;draw()}
  if(shape){const ok=shape.type==="draw"?shape.pts.length>2:Math.hypot(shape.x1-shape.x0,shape.y1-shape.y0)>4;if(ok){M_.shapes=M_.shapes||[];M_.shapes.push(shape);persist()}shape=null;render()}if(painting){painting=null;persist()}
  if(drag&&drag.t){delete drag.t.vx;delete drag.t.vy;if(drag.moved)snap(drag.t);persist();draw()}drag=null});
document.addEventListener("wheel",e=>{if(e.target.id!=="mapCanvas"||(TV&&!ME))return;if(ME)userView=true;e.preventDefault();const r=e.target.getBoundingClientRect();const cx=e.clientX-r.left,cy=e.clientY-r.top;
  const k=Math.exp(-e.deltaY*0.0015);const ns=Math.max(0.1,Math.min(5,V.s*k));V.x=cx-(cx-V.x)*ns/V.s;V.y=cy-(cy-V.y)*ns/V.s;V.s=ns;draw()},{passive:false});
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#cartePage"))return;let x;
  if(x=t.closest("[data-m]")){const v=x.dataset.m;
    if(v==="fit"){const st=$(".mapstage");const s=Math.min(st.clientWidth/M_.w,st.clientHeight/M_.h)*0.98;V={s,x:(st.clientWidth-M_.w*s)/2,y:(st.clientHeight-M_.h*s)/2};draw()}
    if(v==="zoomin"||v==="zoomout"){const st=$(".mapstage");const cx=st.clientWidth/2,cy=st.clientHeight/2,ns=Math.max(0.1,Math.min(5,V.s*(v==="zoomin"?1.25:0.8)));V.x=cx-(cx-V.x)*ns/V.s;V.y=cy-(cy-V.y)*ns/V.s;V.s=ns;draw()}
    if(v==="player"){player=!player;sel=null;render();if(player){const el=$(".mapwrap");try{el.requestFullscreen&&await el.requestFullscreen()}catch(err){}setTimeout(()=>{const b=document.querySelector("[data-m=fit]");if(b)b.click();else{const st=$(".mapstage");const k=Math.min(st.clientWidth/M_.w,st.clientHeight/M_.h)*0.98;V={s:k,x:(st.clientWidth-M_.w*k)/2,y:(st.clientHeight-M_.h*k)/2};draw()}},120)}else{try{document.fullscreenElement&&document.exitFullscreen()}catch(err){}}}
    if(v==="lib"){if(lib){lib=null;render();return}lib="loading";render();try{lib=await Store.list("jeton")}catch(err){lib=[]}render();return}
    if(v==="wallUndo"){M_.walls.pop();persist();render()}
    if(v==="wallClear"){if(x.dataset.ok){M_.walls=[];persist();render()}else{x.dataset.ok=1;x.textContent="Sûr ? Re-clique"}}
    if(v==="exploReset"){M_.explored=[];persist();render()}
    if(v==="undoShape"){const i=M_.shapes.map(z=>!!z.owner).lastIndexOf(false);if(i>=0)M_.shapes.splice(i,1);else{const z=M_.shapes.pop();if(z&&z.id)M_.clearedIds=(M_.clearedIds||[]).concat([z.id]).slice(-300)}persist();render()}
    if(v==="clearShapes"){M_.clearedIds=(M_.clearedIds||[]).concat(M_.shapes.filter(z=>z.owner&&z.id).map(z=>z.id)).slice(-300);M_.shapes=[];persist();render()}
    if(v==="goLink"){await followLink();return}
    if(v==="fogall"){M_.fog.on=true;M_.fog.rev=[];persist();render()}
    if(v==="fognone"){M_.fog.rev=[];M_.fog.on=false;persist();render()}
    if(v==="addCombat"){const l=combatInfo().list;if(!l.length)return toast("Le combat est vide");const have=new Set(M_.tokens.map(z=>z.ref));
      addTokens(l.filter(c=>!have.has(c.id)).map(c=>({pj:c.kind==="pj",name:c.name,ref:c.id,color:COLORS[c.kind]||"#555",size:c.npc?sizeOf(c.npc.size):1,img:c.npc&&c.npc.token||c.token||null})))}
    if(v==="addGroup"){const g=window.Groupe?await window.Groupe.list():[];if(!g.length)return toast("Le groupe est vide");addTokens(g.map(d=>({pj:true,pid:Store.mode==="api"&&/^db/.test(d.id||"")?d.id:null,dv:dvOfRace(d.race||(d.data&&d.data.race)),name:d.name,color:COLORS.pj,img:d.token||null,hp:d.hpCur??d.hp,max:d.hp})))}
    if(v==="addMe"){if(!S.race||!S.cls)return toast("Crée d'abord un perso");addTokens([{pj:true,pid:S.saveId||null,dv:dvOfRace(S.race),name:S.name||"Mon perso",color:COLORS.pj,img:S.token||null,hp:S.play&&S.play.hp!=null?S.play.hp:hp(),max:hp()}])}
    if(v==="addTpl"){const k=$("#mapTpl").value;if(!k)return toast("Choisis un modèle");const d=window.PNJ.TEMPLATES[k],n=Math.max(1,Math.min(20,+$("#mapQty").value||1)),hpv=Dice.avg(d.hp)||1;
      addTokens(Array.from({length:n},(_,i)=>({name:d.name+(n>1?" "+(i+1):""),color:COLORS[d.role]||COLORS.ennemi,size:sizeOf(d.size),hp:hpv,max:hpv,img:d.token||null})))}
    if(v==="addFree"){const n=$("#mapFree").value.trim()||"Jeton";addTokens([{name:n,color:"#7a6a4a"}])}
    if(v==="clearTok"){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ?";return}M_.tokens=[];sel=null;persist();render()}
    if(v==="save"){M_.name=($("#mapName")||{}).value||M_.name;try{const r=await Store.save("carte",M_.saveId,M_.name||"Carte sans nom",`${M_.folder?"📁 "+M_.folder+" · ":""}${M_.tokens.length} jeton(s)${M_.fog.on?" · brouillard":""}${(M_.walls||[]).length?" · murs":""}`,JSON.parse(JSON.stringify(M_)));M_.saveId=r.id;persist();
      toast(r.where==="api"?"Carte sauvegardée dans la base !":r.where==="cloud"?"Carte sauvegardée en ligne !":"Carte sauvegardée sur cet appareil");if(saves)openSaves()}
      catch(err){toast("Échec de la sauvegarde : image trop lourde ? "+(err.message||""),5000)}}
    if(v==="list"){if(saves){saves=null;render();return}openSaves()}
    if(v==="new"){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ? (la carte en cours sera effacée)";return}M_=blankMap();sel=null;persist();render()}
    if(v==="loadIndex"){try{mapIndex=(await Store.list("carte")).map(m=>({id:m.id,name:m.name}))}catch(err){mapIndex=[]}if(!mapIndex.length)toast("Sauvegarde d'abord d'autres cartes");refreshTokPanel()}
    if(v==="unused")return}
  if(x=t.closest("[data-mdie]")){const d=x.dataset.mdie;if(d==="adv"||d==="dis"){const r=Dice.d20(d);publicRoll(`d20 ${d==="adv"?"avantage":"désavantage"} : ${r.v}  (${r.txt.replace(/ \(.*\)/,"")})`)}else{const r=Dice.roll("1d"+d);publicRoll(`d${d} : ${r.tot}`)}return}
  if(x=t.closest("[data-libadd]")){const it=lib[+x.dataset.libadd];const d=Object.assign({},it.data);delete d.folder;addTokens([d]);return}
  if(x=t.closest("[data-libdel]")){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ?";return}const it=lib[+x.dataset.libdel];await Store.remove(it.id,"jeton");lib=await Store.list("jeton");render();return}
  if(x=t.closest("[data-tm]")){const tk=M_.tokens.find(z=>z.id===sel);if(!tk)return;if(x.dataset.tm==="del"){M_.tokens=M_.tokens.filter(z=>z.id!==sel);sel=null}if(x.dataset.tm==="noimg")tk.img=null;
    if(x.dataset.tm==="tolib"){const f=(($("#libFolder")||{}).value||"").trim()||"Divers";const d={name:tk.name,img:tk.img||null,color:tk.color,size:tk.size||1,pj:!!tk.pj,dv:tk.dv||0,light:tk.light||0,hp:tk.hp??null,max:tk.max??null,folder:f};
      try{await Store.save("jeton",null,tk.name||"Jeton",`📁 ${f}`,d);toast(`« ${tk.name} » rangé dans ${f}`);if(lib&&lib!=="loading")lib=await Store.list("jeton");render()}catch(err){toast("Rangement impossible")}return}persist();refreshTokPanel();draw()}
  if(x=t.closest("[data-mload]")){const it=saves[+x.dataset.mload];M_=Object.assign(blankMap(),it.data,{saveId:it.id});sel=null;saves=null;persist();render();setTimeout(()=>{const b=document.querySelector("[data-m=fit]");b&&b.click()},60);toast("Carte « "+it.name+" » ouverte")}
  if(x=t.closest("[data-mdel]")){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ?";return}const it=saves[+x.dataset.mdel];await Store.remove(it.id,"carte");if(M_.saveId===it.id)M_.saveId=null;openSaves();toast("Carte supprimée")}
});
async function followLink(){const tk=M_.tokens.find(z=>z.id===sel);if(!tk||!tk.link)return;
  try{if(M_.saveId||M_.name){const r=await Store.save("carte",M_.saveId,M_.name||"Carte sans nom",`${M_.tokens.length} jeton(s)`,JSON.parse(JSON.stringify(M_)));M_.saveId=r.id}}catch(e){}
  const all=await Store.list("carte");const dest=all.find(m=>m.id===tk.link);if(!dest)return toast("Carte de destination introuvable");
  const carry=tk.carry!==false?M_.tokens.filter(z=>z.pj):[];const from=M_.name;
  M_=Object.assign(blankMap(),dest.data,{saveId:dest.id});M_.tokens=M_.tokens.filter(z=>!carry.some(c=>(c.ref&&c.ref===z.ref)||c.name===z.name));
  const back=M_.tokens.find(z=>z.link&&all.find(m=>m.id===z.link&&m.name===from));sel=null;persist();render();
  setTimeout(()=>{const b=document.querySelector("[data-m=fit]");b&&b.click();carry.forEach(c=>{const n=Object.assign({},c);placeFree(n,back?back.x:null,back?back.y:null);M_.tokens.push(n)});persist();draw();toast("Arrivée : "+(M_.name||"nouvelle carte")+(carry.length?" · "+carry.length+" PJ":""),3000)},80)}
async function openSaves(){saves="loading";render();try{saves=await Store.list("carte")}catch(e){saves=[]}folders=[...new Set(saves.map(x=>x.data&&x.data.folder).filter(Boolean))].sort();render()}
document.addEventListener("change",async e=>{const t=e.target;if(!t.closest||!t.closest("#cartePage"))return;
  if(t.id==="mapImg"&&t.files[0]){try{const big=Store.mode==="api";const r=await compress(t.files[0],big?4096:2400,big?6000000:maxBytes());
    if(big){try{const u=await Store.api("upload",{data:r.url});r.url=u.url}catch(err){const r2=await compress(t.files[0],2400,maxBytes());Object.assign(r,r2)}}
    M_.img=r.url;M_.w=r.w;M_.h=r.h;M_.iw=r.w;M_.ih=r.h;{const [c,rw]=gridCount();fitGrid(c,rw)}persist();render();setTimeout(()=>{const b=document.querySelector("[data-m=fit]");b&&b.click()},80);toast(/^uploads\//.test(r.url)?`Carte chargée en pleine qualité (${r.w}×${r.h}, rangée dans dnd/uploads)`:`Carte chargée (${r.w}×${r.h}, ${Math.round(r.url.length/1024)} Ko)`)}catch(err){toast("Image illisible")}}
  if(t.dataset.tkimg&&t.files[0]){const tk=M_.tokens.find(z=>z.id===sel);if(tk){tk.img=await tokenImage(t.files[0]);persist();refreshTokPanel();draw()}}
  if(t.name==="mtool"){tool=t.value;render()}
  if(t.id==="mapShapeCol"){shapeColor=t.value}
  if(t.id==="visOn"){VIS().on=t.checked;persist();render()}
  if(t.id==="visDark"){VIS().dark=t.checked;persist();render()}
  if(t.id==="gCols"||t.id==="gRows"){const c=+($("#gCols")||{}).value||1,r=+($("#gRows")||{}).value||1;fitGrid(c,r);persist();const gi=$("#gInfo");if(gi)gi.textContent=gInfo(c,r);const fs=document.querySelector('[data-g="size"]');if(fs)fs.value=Math.round(G().size*10)/10;["ox","oy"].forEach(k=>{const el=document.querySelector(`[data-g="${k}"]`);if(el)el.value=0});const b=document.querySelector("[data-m=fit]");b?b.click():draw()}
  if(t.id==="mapFog"){M_.fog.on=t.checked;persist();render()}
  if(t.dataset.g){const k=t.dataset.g;G()[k]=k==="show"?t.checked:k==="color"?t.value:+t.value;if(k==="size")G().size=Math.max(10,G().size);persist();draw();if(k==="show")render()}
  if(t.dataset.tk){const tk=M_.tokens.find(z=>z.id===sel);if(!tk)return;const k=t.dataset.tk;tk[k]=(k==="hidden"||k==="carry"||k==="pj")?t.checked:k==="size"?+t.value:(k==="light"||k==="dv")?(+t.value||0):(k==="hp"||k==="max")?(t.value===""?null:+t.value):t.value;if(k==="size")snap(tk);persist();draw();if(k==="hidden"||k==="link"||k==="carry"||k==="pj")refreshTokPanel()}});
document.addEventListener("input",e=>{const t=e.target;if(!t.closest||!t.closest("#cartePage"))return;
  if(t.id==="mapName"){M_.name=t.value;persist()}
  if(t.id==="mapFolder"){M_.folder=t.value.trim();persist()}
  if(t.dataset.g&&t.type!=="checkbox"){const k=t.dataset.g;G()[k]=k==="color"?t.value:+t.value||(k==="size"?50:0);if(k==="size")G().size=Math.max(10,G().size);draw()}
  if(t.dataset.tk==="name"){const tk=M_.tokens.find(z=>z.id===sel);if(tk){tk.name=t.value;persist();draw()}}});
window.addEventListener("resize",()=>{if(TV)tvFit(true);if(onMap())draw()});
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&player&&!TV){player=false;render()}else draw()});
document.addEventListener("combatchange",()=>{if(onMap())draw();else live()});
document.addEventListener("publicroll",e=>{rollMsg=e.detail;rollAt=Date.now();clearTimeout(rollT);rollT=setTimeout(()=>{rollMsg=null;if(onMap())overlays()},5000);if(onMap())overlays()});
document.addEventListener("keydown",e=>{if(location.hash!=="#carte"||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if((e.key==="Delete"||e.key==="Backspace")&&sel){M_.tokens=M_.tokens.filter(z=>z.id!==sel);sel=null;persist();render()}
  if(e.key==="Escape"&&player&&!TV){player=false;render()}});
document.addEventListener("view",e=>{if(e.detail==="ecran"){tvStart();return}if(document.body.classList.contains("tvmode")){location.reload();return}if(e.detail==="carte"){render();setTimeout(()=>{if(V.s===0.6&&V.x===20){const b=document.querySelector("[data-m=fit]");b&&b.click()}},60)}});
/* ---------- écran TV synchronisé (2e fenêtre ou autre appareil) ---------- */
// Même PC : BroadcastChannel (instantané). Autre appareil du réseau (XAMPP) : la base, clé « carte_live ».
const chan=("BroadcastChannel" in window)?new BroadcastChannel("dnd-live"):null;
let rollAt=0,liveRaf=0,apiT=null,sentImg=null,tvGot=false,tvSeq=0,tvTs=0,tvImg=null,tvImgK="",tvRollAt=0,tvFitKey="",tvPing=0,tvPoll=null;
const imgKey=s=>s?s.length+":"+s.slice(-48):"";
function tvUrl(){return location.href.split("#")[0]+"#ecran"}
function tvSeen(){return Date.now()-tvPing<6000}
function camera(){const st=$(".mapstage");if(!st||!st.clientWidth)return null;const [x0,y0]=toMap(0,0),[x1,y1]=toMap(st.clientWidth,st.clientHeight);return {x0,y0,x1,y1}}
let sentShow=null,apiShow=null;
function packet(withImg,withShow){const m=Object.assign({},M_);delete m.img;
  return {t:"state",seq:Date.now(),map:m,imgK:imgKey(M_.img),img:withImg?M_.img:undefined,combat:combatInfo(),cam:follow&&onMap()&&!player?camera():null,
    measure,shape,roll:rollMsg,rollAt,pings:pings.filter(p=>Date.now()-p.t<2000).map(p=>({id:p.id,x:p.x,y:p.y})),showK:show?show.k:"",show:withShow?(show||null):undefined,moves:pmoves}}
let mapSeen=false;   // seule une fenêtre qui a ouvert l'onglet Carte diffuse (pas la fiche téléphone, pas un onglet Combat seul)
function live(force){if(TV||!mapSeen||document.body.classList.contains("phonemode"))return;
  if(chan&&!liveRaf)liveRaf=requestAnimationFrame(()=>{liveRaf=0;const k=imgKey(M_.img);const sk=show?show.k:"";chan.postMessage(packet(force||k!==sentImg,force||sk!==sentShow));sentImg=k;sentShow=sk});
  if(Store.mode==="api"){clearTimeout(apiT);apiT=setTimeout(pushApi,450)}}
let apiImg=null;
async function pushApi(){try{const k=imgKey(M_.img);if(k!==apiImg){await Store.api("etat",{k,img:M_.img||null},"&cle=carte_img");apiImg=k}
  const sk=show?show.k:"";if(sk!==apiShow){await Store.api("etat",show||{k:""},"&cle=carte_show");apiShow=sk}
  const p=packet(false,false);p.measure=null;p.shape=null;await Store.api("etat",p,"&cle=carte_live")}catch(e){}}
// côté MJ : la TV se signale, on lui répond avec tout (image comprise)
if(chan&&!TV)chan.onmessage=e=>{const d=e.data||{};if(d.t==="hello"||d.t==="ping"){const was=tvSeen();tvPing=Date.now();if(d.t==="hello"){sentImg=null;live(true)}if(!was)liveStatus()}};
function liveStatus(){const d=$("#liveDot"),t=$("#liveTxt");if(!d)return;const on=tvSeen();d.classList.toggle("on",on);t.textContent=on?"Écran TV connecté":"Aucun écran TV ouvert"}
if(!TV)setInterval(liveStatus,3000);
// un autre onglet MJ a modifié la carte : on se met à jour (évite qu'un vieil onglet écrase la TV)
window.addEventListener("storage",e=>{if(TV||e.key!=="dnd-carte"||!e.newValue)return;try{const m=JSON.parse(e.newValue);if(m&&m.grid&&(m.ts||0)>(M_.ts||0)){M_=m;if(onMap())render()}}catch(err){}});
document.addEventListener("change",e=>{if(e.target.id==="mapFollow"){follow=e.target.checked;try{localStorage.setItem("dnd-tv-follow",follow?"1":"0")}catch(err){}e.target.parentElement.classList.toggle("sel",follow);live()}});
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-m]");if(!b||!b.closest("#cartePage"))return;
  if(b.dataset.m==="openTv"){const w=window.open(tvUrl(),"dnd-ecran-tv","popup=yes,width=1280,height=720");
    if(!w)toast("Fenêtre bloquée : ouvre cette adresse dans un nouvel onglet → "+tvUrl(),7000);else toast("Glisse la nouvelle fenêtre sur la télé puis clique « Plein écran »",5000)}
  if(b.dataset.m==="tvFull"){try{await document.documentElement.requestFullscreen()}catch(err){}}});

document.addEventListener("change",async e=>{if(e.target.id!=="showImgIn"||!e.target.files[0])return;const f=e.target.files[0];
  try{const r=await compress(f,1920,Store.mode==="cloud"?170000:900000);show={k:uid(),img:r.url,name:f.name.replace(/\.[^.]+$/,"")};showHist=[show].concat(showHist.filter(h=>h.k!==show.k)).slice(0,8);render();live(true);toast("Image envoyée sur l'écran TV")}catch(err){toast("Image illisible")}});
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#cartePage"))return;
  if(t.dataset.m==="hideShow"){show=null;render();live(true)}
  if(t.dataset.showh!==undefined){const h=showHist[+t.dataset.showh];show=show&&show.k===h.k?null:h;render();live(true)}});
/* ---------- déplacements depuis les téléphones des joueurs ---------- */
function crossWall(ax,ay,bx,by){const cr=(px,py,qx,qy,rx,ry)=>(qx-px)*(ry-py)-(qy-py)*(rx-px);
  return (M_.walls||[]).some(w=>{if(w.door&&w.open)return false;const [cx,cy]=w.a,[dx,dy]=w.b;
    const d1=cr(cx,cy,dx,dy,ax,ay),d2=cr(cx,cy,dx,dy,bx,by),d3=cr(ax,ay,bx,by,cx,cy),d4=cr(ax,ay,bx,by,dx,dy);return ((d1>0)!==(d2>0))&&((d3>0)!==(d4>0))&&d1!==0&&d2!==0})}
document.addEventListener("change",e=>{if(e.target.id==="mapPmoves"){pmoves=e.target.checked;try{localStorage.setItem("dnd-pmoves",pmoves?"1":"0")}catch(err){}e.target.parentElement.classList.toggle("sel",pmoves);live();toast(pmoves?"Les joueurs peuvent déplacer leur jeton":"Toi seul déplaces les jetons",2000)}});
const lastMv={};let mvInit=false;
async function pollMoves(){if(TV||Store.mode!=="api")return;let all;try{all=await Store.api("etats",null,"&prefixe=deplace_")}catch(e){return}if(!all)return;
  let changed=false;Object.entries(all).forEach(([k,v])=>{const pid=k.slice(8);if(!v||!v.at)return;if(!mvInit||lastMv[pid]===undefined&&v.at<Date.now()-15000){lastMv[pid]=Math.max(lastMv[pid]||0,v.at);return}
    if(v.at<=(lastMv[pid]||0))return;lastMv[pid]=v.at;if(!pmoves)return;
    const t=M_.tokens.find(z=>z.id===v.tok&&z.pj&&(z.pid?z.pid===pid:z.name===v.nom));if(!t||(drag&&drag.t===t))return;
    const nx=Math.max(0,Math.min(M_.w,+v.x)),ny=Math.max(0,Math.min(M_.h,+v.y));if(!isFinite(nx)||!isFinite(ny))return;
    if(VIS().on&&crossWall(t.x,t.y,nx,ny)){toast(`${t.name} : bloqué par un mur`,1800);changed=true;return}
    t.x=nx;t.y=ny;snap(t);changed=true});
  mvInit=true;let shapesChanged=false;
  try{const dz=await Store.api("etats",null,"&prefixe=dessin_");const cl=new Set(M_.clearedIds||[]);const strokes=[];
    if(pmoves&&dz)Object.entries(dz).forEach(([k,v])=>{(v&&Array.isArray(v.strokes)?v.strokes:[]).slice(-40).forEach(z=>{if(!z||!z.id||cl.has(z.id)||z.map!==(M_.saveId||"tmp")||!SHAPE_TYPES.includes(z.type))return;const n=v=>Math.round(+v||0);
      if(z.type==="draw"?Array.isArray(z.pts):true)strokes.push({id:String(z.id),map:z.map,type:z.type,pts:z.type==="draw"?z.pts.slice(0,500):undefined,x0:n(z.x0),y0:n(z.y0),x1:n(z.x1),y1:n(z.y1),color:/^#[0-9a-f]{3,8}$/i.test(z.color||"")?z.color:"#e0662f",owner:k.slice(7)})})});
    const sig=strokes.map(z=>z.id).join(",");const cur=(M_.shapes||[]).filter(z=>z.owner).map(z=>z.id).join(",");
    if(pmoves&&sig!==cur){M_.shapes=(M_.shapes||[]).filter(z=>!z.owner).concat(strokes);changed=true;shapesChanged=true}}catch(e){}
  if(changed){persist();if(onMap()){if(shapesChanged&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||""))render();else draw()}else live()}}
Promise.resolve(Store.ready).then(()=>{if(!TV&&Store.mode==="api")setInterval(pollMoves,900)});
function meHint(){if(meTool==="measure")return "Glisse pour mesurer une distance";if(!tvMoves)return "Le MJ a la main sur la carte";if(meTool==="draw")return "Dessine avec ton doigt";if(SHAPE_TYPES.includes(meTool))return "Glisse depuis le point de départ (zone de sort)";return meSel?"Touche la case où aller (ou glisse ton jeton)":"Touche ton jeton puis une case, ou fais-le glisser"}
function meHintUpd(){const mt=$("#meTxt");if(mt)mt.textContent=meHint()}
function myTok(){return M_.tokens.find(z=>mine(z))}
function sendStrokes(){Store.api("etat",{strokes:myStrokes},"&cle=dessin_"+ME).catch(()=>toast("Dessin non envoyé"))}
async function sendMove(t,ox,oy){snap(t);
  if(VIS().on&&crossWall(ox,oy,t.x,t.y)){t.x=ox;t.y=oy;draw0();toast("Un mur te bloque le passage",1800);return}
  if(t.x===ox&&t.y===oy){draw0();return}
  pending={id:t.id,x:t.x,y:t.y,until:Date.now()+6000};meSel=null;meHintUpd();draw0();
  try{await Store.api("etat",{tok:t.id,x:t.x,y:t.y,nom:t.name,at:Date.now()},"&cle=deplace_"+ME)}catch(err){toast("Déplacement non envoyé")}}
function meDown(e,cv){cv.setPointerCapture(e.pointerId);const r=cv.getBoundingClientRect();const [mx,my]=toMap(e.clientX-r.left,e.clientY-r.top);
  if(meTool==="measure"){measure={x0:mx,y0:my,x1:mx,y1:my};pdrag={measure:true};draw0();return}
  if(SHAPE_TYPES.includes(meTool)&&tvMoves){const mt=myTok(),base={id:uid(),type:meTool,color:(mt&&mt.color)||"#e0662f",owner:ME,map:M_.saveId||"tmp"};
    meStroke=meTool==="draw"?Object.assign(base,{pts:[[Math.round(mx),Math.round(my)]]}):Object.assign(base,{x0:Math.round(mx),y0:Math.round(my),x1:Math.round(mx),y1:Math.round(my)});pdrag={draw:true};return}
  const t=tokenAt(mx,my);if(t&&mine(t)&&tvMoves){t.vx=t.x;t.vy=t.y;pdrag={t,dx:mx-t.x,dy:my-t.y,ox:t.x,oy:t.y,sx:e.clientX,sy:e.clientY,moved:false};return}
  pdrag={pan:true,sx:e.clientX,sy:e.clientY,vx:V.x,vy:V.y,mx,my,moved:false}}
document.addEventListener("pointermove",e=>{if(!ME||!pdrag)return;const cv=$("#mapCanvas");const r=cv.getBoundingClientRect();const [mx,my]=toMap(e.clientX-r.left,e.clientY-r.top);
  if(pdrag.measure){measure.x1=mx;measure.y1=my;draw0();return}
  if(pdrag.draw){if(meStroke.type!=="draw"){meStroke.x1=Math.round(mx);meStroke.y1=Math.round(my);draw0();return}const p=meStroke.pts[meStroke.pts.length-1];if(Math.hypot(mx-p[0],my-p[1])>3/V.s&&meStroke.pts.length<500)meStroke.pts.push([Math.round(mx),Math.round(my)]);draw0();return}
  const far=Math.abs(e.clientX-pdrag.sx)+Math.abs(e.clientY-pdrag.sy)>6;if(far)pdrag.moved=true;
  if(pdrag.pan){if(pdrag.moved){V.x=pdrag.vx+(e.clientX-pdrag.sx);V.y=pdrag.vy+(e.clientY-pdrag.sy);userView=true;draw0()}return}
  if(pdrag.moved){pdrag.t.x=mx-pdrag.dx;pdrag.t.y=my-pdrag.dy;draw0()}});
document.addEventListener("pointerup",async()=>{if(!ME||!pdrag)return;const d=pdrag;pdrag=null;
  if(d.measure){setTimeout(()=>{if(!pdrag){measure=null;draw0()}},1500);return}
  if(d.draw){const st=meStroke;meStroke=null;if(st&&(st.type==="draw"?st.pts.length>2:Math.hypot(st.x1-st.x0,st.y1-st.y0)>4)){myStrokes=myStrokes.concat([st]).slice(-40);M_.shapes=(M_.shapes||[]).concat([st]);sendStrokes()}draw0();return}
  if(d.pan){if(!d.moved&&meSel&&tvMoves){const t=M_.tokens.find(z=>z.id===meSel);if(t){const ox=t.x,oy=t.y;t.x=d.mx;t.y=d.my;await sendMove(t,ox,oy)}}return}
  const t=d.t;delete t.vx;delete t.vy;
  if(!d.moved){t.x=d.ox;t.y=d.oy;meSel=meSel===t.id?null:t.id;meHintUpd();draw0();return}   // simple touche : on sélectionne le jeton
  await sendMove(t,d.ox,d.oy)});
document.addEventListener("change",e=>{if(!ME||e.target.id!=="meToolSel")return;meTool=e.target.value;meSel=null;meHintUpd();draw0()});
document.addEventListener("click",e=>{if(!ME)return;const b=e.target.closest&&e.target.closest("[data-m]");if(!b)return;const m=b.dataset.m;
  if(m==="tvRecenter"){userView=false;tvFit(true);draw0()}
  if(m.startsWith("meTool:")){meTool=m.split(":")[1];meSel=null;document.querySelectorAll("[data-m^='meTool:']").forEach(z=>z.classList.toggle("sec",z.dataset.m!==m));meHintUpd();draw0()}
  if(m==="meErase"){if(!myStrokes.length)return toast("Tu n'as rien dessiné",1500);const ids=new Set(myStrokes.map(z=>z.id));myStrokes=[];M_.shapes=(M_.shapes||[]).filter(z=>!ids.has(z.id));sendStrokes();draw0();toast("Tes dessins sont effacés",1500)}
  if(m.startsWith("tvZoom:")){const k=+m.split(":")[1],st=$(".mapstage"),cx=st.clientWidth/2,cy=st.clientHeight/2,ns=Math.max(0.1,Math.min(5,V.s*k));V.x=cx-(cx-V.x)*ns/V.s;V.y=cy-(cy-V.y)*ns/V.s;V.s=ns;userView=true;draw0()}});
// côté TV
function tvFit(force){const st=$(".mapstage");if(!st||!st.clientWidth)return;if(userView&&!force)return;const c=tvCam;const key=c?[c.x0,c.y0,c.x1,c.y1].map(Math.round).join(","):"all:"+M_.w+"x"+M_.h;
  if(!force&&key===tvFitKey)return;tvFitKey=key;const W=st.clientWidth,H=st.clientHeight;
  const r=c||{x0:0,y0:0,x1:M_.w,y1:M_.h};const s=Math.min(W/(r.x1-r.x0),H/(r.y1-r.y0))*(c?1:0.98);
  V={s,x:W/2-(r.x0+r.x1)/2*s,y:H/2-(r.y0+r.y1)/2*s}}
let tvCam=null;
function tvApply(d){if(!d||!d.map||!(d.seq>tvSeq))return;if((d.map.ts||0)<tvTs)return;
  tvSeq=d.seq;tvTs=d.map.ts||0;if(d.img!==undefined&&d.img!==null){tvImg=d.img;tvImgK=d.imgK}else if(!d.imgK){tvImg=null;tvImgK=""}
  M_=Object.assign(blankMap(),d.map,{img:d.imgK&&d.imgK===tvImgK?tvImg:null});
  if(pdrag&&pdrag.t){const i=M_.tokens.findIndex(z=>z.id===pdrag.t.id);if(i>=0)M_.tokens[i]=pdrag.t}   // le jeton qu'on glisse ne saute pas en arrière
  if(ME){const cl=new Set(M_.clearedIds||[]),mk=M_.saveId||"tmp";const n=myStrokes.length;myStrokes=myStrokes.filter(z=>!cl.has(z.id)&&z.map===mk);if(myStrokes.length!==n)sendStrokes();
    const have=new Set((M_.shapes||[]).map(z=>z.id));M_.shapes=(M_.shapes||[]).concat(myStrokes.filter(z=>!have.has(z.id)))}
  tvMoves=!!d.moves;if(pending){const pt=M_.tokens.find(z=>z.id===pending.id);if(!pt||Date.now()>pending.until||(Math.abs(pt.x-pending.x)<1&&Math.abs(pt.y-pending.y)<1))pending=null;else{pt.x=pending.x;pt.y=pending.y}}
  liveCombat=d.combat||null;if(!(pdrag&&pdrag.measure))measure=d.measure||null;shape=d.shape||null;tvCam=d.cam||null;
  if(d.roll&&d.rollAt&&d.rollAt!==tvRollAt){tvRollAt=d.rollAt;rollMsg=d.roll;clearTimeout(rollT);rollT=setTimeout(()=>{rollMsg=null;overlays()},5000)}
  (d.pings||[]).forEach(p=>{if(!tvPings.has(p.id)){tvPings.add(p.id);addPing(p.x,p.y,p.id)}});
  if(d.show!==undefined){show=d.show&&d.show.img?d.show:null;showOverlay()}else if((d.showK||"")!==(show?show.k:"")){if(!d.showK){show=null;showOverlay()}else tvNeedShow(d.showK)}
  if(!tvGot){tvGot=true;const w=$("#tvWait");w&&w.remove()}
  if(d.imgK&&d.imgK!==tvImgK)tvNeedImg(d.imgK);
  const mt=$("#meTxt");if(mt)mt.textContent=meHint();
  tvFit(false);draw0()}
const tvPings=new Set();
async function tvNeedShow(k){if(chan)chan.postMessage({t:"hello"});if(Store.mode==="api"){try{const r=await Store.api("etat",null,"&cle=carte_show");if(r&&r.k===k){show=r;showOverlay()}}catch(e){}}}
async function tvNeedImg(k){if(chan)chan.postMessage({t:"hello"});
  if(Store.mode==="api"){try{const r=await Store.api("etat",null,"&cle=carte_img");if(r&&r.k===k){tvImg=r.img;tvImgK=k;M_.img=r.img;draw0()}}catch(e){}}}
function tvStart(){if(document.body.classList.contains("tvmode"))return;document.body.classList.add("tvmode");player=true;sel=null;tool="move";render();
  if(chan){chan.onmessage=e=>tvApply(e.data);chan.postMessage({t:"hello"});setInterval(()=>chan.postMessage({t:"ping"}),2500)}
  Promise.resolve(Store.ready).then(()=>{if(Store.mode!=="api")return;const poll=async()=>{try{tvApply(await Store.api("etat",null,"&cle=carte_live"))}catch(e){}};poll();tvPoll=setInterval(poll,1000)});
  let hT;const help=()=>{const h=$("#tvHelp");if(!h||ME)return;h.classList.remove("off");document.body.style.cursor="";clearTimeout(hT);hT=setTimeout(()=>{h.classList.add("off");document.body.style.cursor="none"},3500)};
  document.addEventListener("mousemove",help);help();
  document.addEventListener("fullscreenchange",()=>setTimeout(()=>{tvFit(true);draw0()},60))}
return {toScreen:(x,y)=>[x*V.s+V.x,y*V.s+V.y],addTokens,load:(data,id)=>{M_=Object.assign(blankMap(),JSON.parse(JSON.stringify(data)),{saveId:id||null});sel=null;persist();if(onMap())render()},render,draw,select:id=>{sel=id;refreshTokPanel();draw()},get map(){return M_}};
})();
