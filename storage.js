/* ===================== SAUVEGARDES =====================
   En ligne (stockage privé de la page, par personne) quand il est disponible,
   sinon dans ce navigateur (localStorage). */
const Store=(()=>{
  const LKEY="dnd-saves";
  let mode="local",col=null;const listeners=[];
  const localAll=()=>{try{return JSON.parse(localStorage.getItem(LKEY)||"[]")}catch(e){return []}};
  const localPut=a=>{try{localStorage.setItem(LKEY,JSON.stringify(a));return true}catch(e){return false}};
  const newId=k=>k+"_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const API="api/";
  async function api(a,body,qs,again){const r=await fetch(API+"?a="+a+(qs||""),body?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{});
    const j=await r.json().catch(()=>null);
    if(r.status===401&&!again&&a!=="login"){await login();return api(a,body,qs,true)}
    if(!r.ok)throw new Error(j&&j.erreur||("HTTP "+r.status));return j}
  // mot de passe du site (si MOT_DE_PASSE est rempli dans api/config.php)
  let loginP=null;
  function login(){if(loginP)return loginP;loginP=new Promise(ok=>{const show=()=>{let o=document.getElementById("loginBox");if(!o){o=document.createElement("div");o.id="loginBox";document.body.appendChild(o)}
      o.innerHTML=`<form class="card"><h2>🔒 Connexion</h2><p class="small">Ce site est protégé par un mot de passe (réglé par le MJ dans api/config.php).</p><input type="password" id="loginPw" autocomplete="current-password" placeholder="Mot de passe"><div class="err" id="loginErr"></div><button class="btn" type="submit">Entrer</button></form>`;
      const f=o.querySelector("form");setTimeout(()=>o.querySelector("input").focus(),50);
      f.onsubmit=async e=>{e.preventDefault();const r=await fetch(API+"?a=login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mdp:o.querySelector("input").value})}).catch(()=>null);
        if(r&&r.ok){o.remove();loginP=null;ok()}else{o.querySelector("#loginErr").textContent="Mot de passe incorrect";o.querySelector("input").select()}}};
    if(document.body)show();else document.addEventListener("DOMContentLoaded",show)});return loginP}
  const ready=(async()=>{
    try{
      // 1) site servi par XAMPP avec la base MariaDB ?
      if(/^https?:$/.test(location.protocol)&&!/claude|anthropic/.test(location.hostname)){
        try{const ctl=new AbortController();setTimeout(()=>ctl.abort(),2500);const r=await fetch(API+"?a=ping",{signal:ctl.signal});const j=await r.json();if(j&&j.ok){if(j.auth===false)await login();mode="api";return}}catch(e){}}
      // 2) stockage en ligne de claude.ai
      if(!window.claude||typeof window.claude.use!=="function")return;
      const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
      if(!db||!user)return;const uid=await user.id();if(!uid)return;
      col=db.collection("data/users/"+uid);mode="cloud";
    }catch(e){mode="local"}
    finally{listeners.forEach(f=>f())}
  })();
  async function list(kind){await ready;
    if(mode==="api")return (await api("list",null,"&kind="+kind)).map(x=>Object.assign({where:"api"},x));
    let out=localAll().filter(x=>x.kind===kind).map(x=>Object.assign({where:"local"},x));
    if(mode==="cloud"){try{const snap=await col.where("kind","==",kind).get();
      out=snap.docs.map(d=>Object.assign({id:d.id,where:"cloud"},d.data())).concat(out)}catch(e){}}
    return out.sort((a,b)=>(b.updated||0)-(a.updated||0))}
  async function save(kind,id,name,summary,data){await ready;
    const rec={kind,name:name||"Sans nom",summary:summary||"",data,updated:Date.now()};
    if(mode==="api"){const r=await api("save",{kind,id:id&&id.startsWith("db")?id:null,name:rec.name,summary:rec.summary,data});return {id:r.id,where:"api"}}
    if(mode==="cloud"){try{const ref=col.doc(id&&!id.startsWith("loc")?id:newId(kind));await ref.set(rec);return {id:ref.id,where:"cloud"}}catch(e){/* repli local */}}
    const all=localAll();const lid=id&&id.startsWith("loc")?id:"loc"+newId(kind);
    const i=all.findIndex(x=>x.id===lid);const r=Object.assign({id:lid},rec);if(i>=0)all[i]=r;else all.push(r);
    if(!localPut(all))throw new Error("Stockage indisponible");return {id:lid,where:"local"}}
  async function remove(id,kind){await ready;
    if(id.startsWith("db")){await api("delete",{kind,id});return}
    if(id.startsWith("loc")){localPut(localAll().filter(x=>x.id!==id));return}
    if(mode==="cloud")await col.doc(id).delete()}
  const exportCode=obj=>btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const importCode=code=>JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  return {ready,list,save,remove,exportCode,importCode,api,get mode(){return mode},onReady:f=>listeners.push(f)};
})();
function savesPanel(kind,items,curId,label){
  const where=Store.mode==="api"?"Sauvegardés dans ta base MariaDB (XAMPP) : visibles et modifiables aussi dans phpMyAdmin.":Store.mode==="cloud"?"Sauvegardés en ligne sur ton compte : tu les retrouves sur n'importe quel appareil.":"Sauvegardés dans ce navigateur (pas encore de stockage en ligne ici).";
  let h=`<div class="card saves"><h2>📂 Mes ${label}</h2><div class="small">${where}</div>`;
  if(items===null)h+=`<p class="small">Chargement…</p>`;
  else if(!items.length)h+=`<p class="small">Aucune sauvegarde pour l'instant. Clique sur « 💾 Sauvegarder » quand tu as fini (ou même à moitié).</p>`;
  else{h+=`<div class="savelist">`;items.forEach(it=>{const d=new Date(it.updated||0);
    h+=`<div class="saveitem ${it.id===curId?"cur":""}"><div><b>${esc(it.name)}</b><div class="small">${esc(it.summary)} · ${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}${it.where==="local"&&Store.mode==="cloud"?" · sur cet appareil":""}</div></div>
    <div class="saveact"><button class="btn sec" data-sload="${esc(it.id)}">Ouvrir</button><button class="btn sec" data-scode="${esc(it.id)}" title="Code à envoyer à un pote">Code</button><button class="btn sec del" data-sdel="${esc(it.id)}">✕</button></div></div>`});h+=`</div>`}
  h+=`<details style="margin-top:10px"><summary class="small" style="cursor:pointer">Importer un code de sauvegarde</summary><div class="small">Colle ici le code qu'un pote t'a envoyé (bouton « Code »).</div><textarea id="importBox" placeholder="Colle le code…"></textarea><button class="btn sec" id="importBtn" style="margin-top:6px">Importer</button></details>
  <div id="codeOut"></div></div>`;
  return h}

/* ===================== DÉS (commun à toutes les pages) ===================== */
function publicRoll(t){document.dispatchEvent(new CustomEvent("publicroll",{detail:t}))}
const Dice={
  roll(f){const s=String(f||"").replace(/\s/g,"").toLowerCase();let tot=0,parts=[],ok=false;
    for(const t of s.match(/[+-]?[^+-]+/g)||[]){const m=t.match(/^([+-]?)(\d*)d(\d+)$/);
      if(m){const n=Math.min(100,+(m[2]||1)),d=+m[3];const r=[];for(let i=0;i<n;i++)r.push(1+Math.floor(Math.random()*d));const v=r.reduce((a,b)=>a+b,0);tot+=(m[1]==="-"?-v:v);parts.push((m[1]==="-"?"-":"")+"["+r.join(", ")+"]");ok=true}
      else if(/^[+-]?\d+$/.test(t)){tot+=+t;parts.push(t);ok=true}}
    return ok?{tot,txt:parts.join(" ")}:null},
  d20(mode){const a=1+Math.floor(Math.random()*20),b=1+Math.floor(Math.random()*20);
    if(mode==="adv")return {v:Math.max(a,b),txt:`${a} / ${b} (avantage)`};if(mode==="dis")return {v:Math.min(a,b),txt:`${a} / ${b} (désavantage)`};return {v:a,txt:String(a)}},
  avg(f){const s=String(f||"").replace(/\s/g,"");let tot=0,ok=false;for(const t of s.match(/[+-]?[^+-]+/g)||[]){const m=t.match(/^([+-]?)(\d*)d(\d+)$/i);
    if(m){tot+=(m[1]==="-"?-1:1)*(+(m[2]||1))*(+m[3]+1)/2;ok=true}else if(/^[+-]?\d+$/.test(t)){tot+=+t;ok=true}else return null}return ok?Math.floor(tot):null}
};

/* ---------- thème du site (forêt / château) ---------- */
(()=>{const lab=t=>t==="chateau"?"🌲 Thème forêt":"🏰 Thème château";
  const apply=t=>{document.documentElement.dataset.theme=t;const b=document.getElementById("themeBtn");if(b)b.textContent=lab(t)};
  const cur=()=>document.documentElement.dataset.theme||"foret";
  document.addEventListener("DOMContentLoaded",()=>apply(cur()));
  document.addEventListener("click",e=>{if(e.target.id!=="themeBtn")return;const t=cur()==="chateau"?"foret":"chateau";apply(t);try{localStorage.setItem("dnd-theme",t)}catch(err){}if(typeof Carte!=="undefined")Carte.draw()});
  window.addEventListener("storage",e=>{if(e.key==="dnd-theme"&&e.newValue)apply(e.newValue)});   // l'écran TV suit aussi
})();
