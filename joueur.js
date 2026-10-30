/* ===================== Fiche joueur sur téléphone (#joueur) =====================
   Le joueur ouvre http://IP-du-PC/dnd/#joueur, choisit son perso et joue avec sa fiche.
   PV, états et jets remontent chez le MJ (combat, carte, écran TV) ; les dégâts du MJ redescendent. */
(()=>{
const $=s=>document.querySelector(s);
const PHONE=()=>document.body.classList.contains("phonemode");
let pid=null,list=[],liveT=null,saveT=null,lastSent="",lastDm=0,lastLocal=0,pollT=null;

// sur le téléphone, la fiche ne remplace pas le perso en cours du navigateur
const _save=window.save;window.save=function(){if(PHONE())return;return _save.apply(this,arguments)};

function bar(){let b=$("#phoneBar");if(!b){b=document.createElement("div");b.id="phoneBar";document.body.appendChild(b)}
  b.innerHTML=`<span class="pbname">🛡️ <b>${esc(S.name||"Mon perso")}</b> <span class="small" id="phoneSync">· synchronisé</span></span><span class="pbtabs"><button class="btn sm ${view==="fiche"?"":"sec"}" data-ph="fiche">📋 Fiche</button><button class="btn sm ${view==="carte"?"":"sec"}" data-ph="carte">🗺️ Carte</button><button class="btn sec sm" data-ph="change" title="Changer de perso">⇄</button></span>`}
let view="fiche";
function showView(v){view=v;const map=mapFrame();map.hidden=v!=="carte";$("#viewPersos").hidden=v==="carte";document.body.classList.toggle("phonemap",v==="carte");bar();if(v==="fiche")window.scrollTo(0,0)}
function mapFrame(){let f=$("#phoneMap");if(!f){f=document.createElement("div");f.id="phoneMap";f.hidden=true;
    f.innerHTML=`<iframe title="Carte" src="${location.pathname}?moi=${encodeURIComponent(pid)}&nom=${encodeURIComponent(S.name||"")}#ecran"></iframe>`;document.body.appendChild(f)}return f}
async function picker(){const box=$("#joueurPage");if(!box)return;
  $("#viewPersos").hidden=true;$("#viewJoueur").hidden=false;const b=$("#phoneBar");if(b)b.remove();const pm=$("#phoneMap");if(pm)pm.remove();document.body.classList.remove("phonemap");
  if(Store.mode!=="api"){box.innerHTML=`<div class="card"><h2>Fiche joueur</h2><p>Cette page sert aux joueurs sur leur téléphone. Elle a besoin de la version <b>XAMPP</b> : ouvre <code>http://IP-du-PC-du-MJ/dnd/#joueur</code> depuis un appareil branché sur la même box.</p></div>`;return}
  box.innerHTML=`<div class="card"><h2>Qui joues-tu ?</h2><p class="small">Chargement des persos…</p></div>`;
  try{list=await Store.list("perso")}catch(e){list=[]}
  box.innerHTML=`<div class="card"><h2>Qui joues-tu ?</h2><div class="pjpick">${list.map((p,i)=>`<button class="pjbtn" data-ph="pick" data-i="${i}">${p.data&&p.data.token?`<img src="${p.data.token}" alt="">`:`<span class="ico">🛡️</span>`}<span><b>${esc(p.name)}</b><small>${esc(p.summary||"")}</small></span></button>`).join("")||`<p>Aucun perso dans la base. Le MJ doit d'abord les sauvegarder.</p>`}</div></div>`}
function open(p){S=Object.assign(blank(),p.data,{saveId:p.id,step:9,confirmReset:false});pid=p.id;lastSent="";lastDm=Date.now();
  try{localStorage.setItem("dnd-joueur",p.id)}catch(e){}
  const old=$("#phoneMap");if(old)old.remove();view="fiche";
  $("#viewJoueur").hidden=true;$("#viewPersos").hidden=false;bar();render();window.scrollTo(0,0);
  clearInterval(pollT);pollT=setInterval(poll,2000)}
function state(){const p=S.play||{};return {name:S.name,hp:p.hp,temp:p.temp||0,max:hp(),cond:p.cond||[],death:p.death||null}}
function changed(){if(!PHONE()||!pid)return;lastLocal=Date.now();const s=$("#phoneSync");if(s)s.textContent="· envoi…";
  clearTimeout(liveT);liveT=setTimeout(async()=>{const st=state(),j=JSON.stringify(st);if(j!==lastSent){try{await Store.api("etat",Object.assign(st,{at:Date.now()}),"&cle=pj_"+pid);lastSent=j}catch(e){}}const s2=$("#phoneSync");if(s2)s2.textContent="· synchronisé"},400);
  saveDb()}
function saveDb(){clearTimeout(saveT);saveT=setTimeout(()=>{Store.save("perso",pid,S.name,persoSummary(),JSON.parse(JSON.stringify(Object.assign({},S,{confirmReset:false,step:9})))).catch(()=>{})},2500)}
async function poll(){if(!PHONE()||!pid)return;try{const r=await Store.api("etat",null,"&cle=pjdm_"+pid);
  if(r&&r.at>lastDm&&r.at>lastLocal){lastDm=r.at;P();S.play.hp=Math.max(0,Math.min(hp(),r.hp));S.play.temp=r.temp||0;lastSent=JSON.stringify(state());render();toast(`Le MJ a mis tes PV à ${S.play.hp}`,2500);saveDb()}}catch(e){}}
function start(){document.body.classList.add("phonemode");document.title="Ma fiche — D&D 5e";
  Promise.resolve(Store.ready).then(async()=>{const id=(()=>{try{return localStorage.getItem("dnd-joueur")}catch(e){return null}})();
    if(Store.mode==="api"&&id){try{list=await Store.list("perso")}catch(e){}const p=list.find(x=>x.id===id);if(p)return open(p)}picker()})}

document.addEventListener("view",e=>{if(e.detail==="joueur")start();else if(PHONE())location.reload()});   // on quitte la fiche : retour au site normal
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("[data-ph]");
  if(t){if(t.dataset.ph==="pick")open(list[+t.dataset.i]);if(t.dataset.ph==="fiche"||t.dataset.ph==="carte")showView(t.dataset.ph);if(t.dataset.ph==="change"){pid=null;clearInterval(pollT);try{localStorage.removeItem("dnd-joueur")}catch(err){}picker()}return}
  if(PHONE()&&e.target.closest&&e.target.closest("#page"))setTimeout(changed,0)});
["change","input"].forEach(ev=>document.addEventListener(ev,e=>{if(PHONE()&&e.target.closest&&e.target.closest("#page"))setTimeout(changed,0)}));
// gros résultat de dé sur le téléphone (le petit message du haut était caché par la barre)
let popT=null;
function rollPop(txt){let o=$("#rollPop");if(!o){o=document.createElement("div");o.id="rollPop";o.onclick=()=>o.classList.remove("on");document.body.appendChild(o)}
  const t=txt.replace(/^[^·]*·\s*/,"");const i=t.indexOf(" : ");const lab=i>0?t.slice(0,i):"Jet",rest=i>0?t.slice(i+3):t;const m=rest.match(/[+-]?\d+/);
  const crit=/20 naturel|CRITIQUE|: 20 !/.test(t),fail=/1 naturel/.test(t);
  o.className="on"+(crit?" crit":fail?" fail":"");o.innerHTML=`<div class="rp-l">🎲 ${esc(lab)}</div><div class="rp-n">${m?esc(m[0]):"🎲"}</div><div class="rp-d">${esc(rest)}</div><div class="rp-x">touche pour fermer</div>`;
  const ts=$("#toast");if(ts)ts.style.display="none";   // le gros résultat remplace le petit message
  clearTimeout(popT);popT=setTimeout(()=>o.classList.remove("on"),6000)}
document.addEventListener("publicroll",e=>{if(PHONE())rollPop(e.detail)});
document.addEventListener("publicroll",e=>{if(PHONE()&&pid&&Store.mode==="api")Store.api("etat",{t:e.detail,at:Date.now()},"&cle=jet").catch(()=>{})});

/* ---------- côté MJ : on reçoit les jets et les PV des téléphones ---------- */
let lastJet=null;const seen={};
async function dmPoll(){if(PHONE()||location.hash==="#ecran"||Store.mode!=="api")return;
  try{const j=await Store.api("etat",null,"&cle=jet");if(j&&j.at){if(lastJet===null)lastJet=j.at;else if(j.at>lastJet){lastJet=j.at;publicRoll("📱 "+j.t)}}else if(lastJet===null)lastJet=0}catch(e){}
  if(typeof Combat==="undefined")return;const linked=Combat.state().list.filter(x=>x.pid);if(!linked.length)return;
  const ids=[...new Set(linked.map(x=>x.pid))];const got={};
  await Promise.all(ids.map(async id=>{try{const r=await Store.api("etat",null,"&cle=pj_"+id);if(r&&r.at&&r.at>(seen[id]||0))got[id]=r}catch(e){}}));
  if(!Object.keys(got).length)return;
  Combat.patch(K=>{K.list.forEach(x=>{const r=got[x.pid];if(!r)return;x.hp=r.hp;x.temp=r.temp||0;x.max=r.max||x.max;x.cond=(r.cond||[]).slice()})});
  Object.entries(got).forEach(([id,r])=>seen[id]=r.at)}
Promise.resolve(Store.ready).then(()=>{if(Store.mode==="api")setInterval(dmPoll,2000)});
})();
