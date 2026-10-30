/* ===================== ÉCRAN DU MJ + AMBIANCE SONORE (dans l'onglet Outils) ===================== */
(()=>{
const $=s=>document.querySelector(s);
/* ---------- Écran du MJ : aide-mémoire (résumés écrits pour ce site) ---------- */
const ECRAN={
 "Difficultés (DD)":`<table class="rec"><tr><th>Tâche</th><th>DD</th></tr><tr><td>Très facile</td><td>5</td></tr><tr><td>Facile</td><td>10</td></tr><tr><td>Moyenne</td><td>15</td></tr><tr><td>Difficile</td><td>20</td></tr><tr><td>Très difficile</td><td>25</td></tr><tr><td>Quasi impossible</td><td>30</td></tr></table>
   <p class="small">Test réussi si d20 + modificateur ≥ DD. Égalité = réussite. Avantage : 2d20, on garde le meilleur ; désavantage : le pire. Les deux s'annulent.</p>
   <p class="small"><b>Test passif</b> = 10 + modificateur (+5 avec avantage, −5 avec désavantage). <b>Test en groupe</b> : réussi si au moins la moitié du groupe réussit.</p>`,
 "États":`<ul class="tight small">
   <li><b>À terre</b> : ramper (déplacement ×2), désavantage aux attaques. Attaques contre lui : avantage à 1,50 m, désavantage plus loin. Se relever coûte la moitié du déplacement.</li>
   <li><b>Agrippé</b> : vitesse 0. Se libérer : action, Athlétisme ou Acrobaties contre l'Athlétisme de l'agrippeur.</li>
   <li><b>Assourdi</b> : n'entend rien, rate les tests basés sur l'ouïe.</li>
   <li><b>Aveuglé</b> : rate les tests basés sur la vue, désavantage aux attaques ; attaques contre lui avec avantage.</li>
   <li><b>Charmé</b> : ne peut pas attaquer le charmeur, qui a l'avantage aux tests sociaux contre lui.</li>
   <li><b>Effrayé</b> : désavantage aux tests et attaques tant qu'il voit la source ; ne peut pas s'en approcher.</li>
   <li><b>Empoisonné</b> : désavantage aux attaques et aux tests de caractéristique.</li>
   <li><b>Entravé</b> : vitesse 0, désavantage aux attaques et aux sauvegardes de DEX ; attaques contre lui avec avantage.</li>
   <li><b>Étourdi</b> : neutralisé, ne bouge pas, parle à peine ; rate les sauvegardes FOR et DEX ; attaques contre lui avec avantage.</li>
   <li><b>Inconscient</b> : neutralisé, à terre, lâche ce qu'il tient, rate FOR et DEX ; attaques avec avantage, critique si l'attaquant est à 1,50 m.</li>
   <li><b>Invisible</b> : avantage à ses attaques, désavantage aux attaques contre lui.</li>
   <li><b>Neutralisé</b> : ni action ni réaction.</li>
   <li><b>Paralysé</b> : neutralisé, ne bouge pas, rate FOR et DEX ; attaques avec avantage, critique à 1,50 m.</li>
   <li><b>Pétrifié</b> : changé en pierre, neutralisé, résistance à tous les dégâts.</li>
   <li><b>Épuisement</b> (6 niveaux) : 1 désavantage aux tests · 2 vitesse ÷2 · 3 désavantage attaques et sauvegardes · 4 PV max ÷2 · 5 vitesse 0 · 6 mort. Un repos long retire 1 niveau.</li></ul>`,
 "Actions en combat":`<ul class="tight small">
   <li><b>À son tour</b> : un déplacement (jusqu'à sa vitesse, fractionnable), une action, éventuellement une action bonus, et une interaction gratuite avec un objet.</li>
   <li><b>Actions</b> : Attaquer · Lancer un sort · Foncer (déplacement doublé) · Se désengager (pas d'attaque d'opportunité) · Esquiver (attaques contre toi avec désavantage, avantage aux sauvegardes DEX) · Aider (avantage à un allié) · Se cacher (Discrétion) · Se tenir prêt (réaction préparée) · Chercher · Utiliser un objet.</li>
   <li><b>Réaction</b> : une par round, par exemple une attaque d'opportunité quand un ennemi quitte ta portée.</li>
   <li><b>Combat à deux armes</b> : avec deux armes légères, attaque bonus avec la seconde, sans le modificateur aux dégâts (sauf si négatif).</li>
   <li><b>Agripper / Pousser</b> : remplace une attaque, Athlétisme contre Athlétisme ou Acrobaties de la cible (taille max une catégorie au-dessus).</li>
   <li><b>Critique</b> : 20 naturel, on double les dés de dégâts. 1 naturel : échec automatique.</li></ul>`,
 "Abri, vision, lumière":`<ul class="tight small">
   <li><b>Abri partiel</b> (muret, autre créature) : +2 CA et sauvegardes DEX. <b>Abri important</b> (meurtrière) : +5. <b>Abri total</b> : ciblage impossible.</li>
   <li><b>Zone faiblement éclairée</b> : désavantage à Perception (vue). <b>Zone obscure</b> : comme être aveuglé.</li>
   <li><b>Vision dans le noir</b> : voit dans le noir comme en lumière faible (en noir et blanc).</li>
   <li><b>Attaque à distance</b> : désavantage à longue portée et si un ennemi conscient est à 1,50 m de soi.</li></ul>`,
 "Chute, saut, souffle":`<ul class="tight small">
   <li><b>Chute</b> : 1d6 contondants par tranche de 3 m (max 20d6), on arrive à terre.</li>
   <li><b>Saut en longueur</b> : FOR en × 0,30 m avec 3 m d'élan (moitié sans élan). <b>En hauteur</b> : 3 + mod. FOR en × 0,30 m.</li>
   <li><b>Retenir son souffle</b> : 1 + mod. CON minutes (min. 30 s). Ensuite, mod. CON rounds avant de tomber à 0 PV.</li>
   <li><b>Voyage</b> : rapide 6 km/h (−5 Perception passive), normal 4,5 km/h, lent 3 km/h (peut se déplacer discrètement).</li>
   <li><b>Faim et soif</b> : 3 + mod. CON jours sans manger, puis épuisement ; ½ ration d'eau par jour = test CON DD 15 sinon épuisement.</li></ul>`,
 "Repos, 0 PV, mort":`<ul class="tight small">
   <li><b>Repos court</b> (1 h) : dépenser des dés de vie (dé + mod. CON chacun).</li>
   <li><b>Repos long</b> (8 h) : tous les PV, la moitié des dés de vie, les emplacements de sorts. Un seul par 24 h.</li>
   <li><b>À 0 PV</b> : inconscient. Jet contre la mort à chaque tour : 10+ réussite, moins = échec, 1 = deux échecs, 20 = revient à 1 PV. 3 réussites = stabilisé, 3 échecs = mort.</li>
   <li><b>Dégâts à 0 PV</b> : un échec (deux si critique). Mort instantanée si les dégâts restants ≥ PV max.</li>
   <li><b>Stabiliser</b> : action, Médecine DD 10 (ou trousse de soins).</li></ul>`
};
function ecranHtml(){return `<div class="card"><h2>🛡️ Écran du MJ</h2><div class="small">Aide-mémoire des règles 2014, résumées.</div>
  <div class="ecran">${Object.entries(ECRAN).map(([k,v],i)=>`<details ${i===0?"open":""}><summary>${k}</summary><div>${v}</div></details>`).join("")}</div></div>`}

/* ---------- Ambiance sonore ---------- */
const IDB={db:null,open(){return new Promise(ok=>{if(this.db)return ok(this.db);try{const r=indexedDB.open("dnd-sons",1);r.onupgradeneeded=()=>r.result.createObjectStore("sons",{keyPath:"id"});r.onsuccess=()=>{this.db=r.result;ok(this.db)};r.onerror=()=>ok(null)}catch(e){ok(null)}})},
  async all(){const db=await this.open();if(!db)return [];return new Promise(ok=>{const q=db.transaction("sons").objectStore("sons").getAll();q.onsuccess=()=>ok(q.result||[]);q.onerror=()=>ok([])})},
  async put(o){const db=await this.open();if(!db)throw new Error("stockage indisponible");return new Promise((ok,ko)=>{const tx=db.transaction("sons","readwrite");tx.objectStore("sons").put(o);tx.oncomplete=ok;tx.onerror=()=>ko(tx.error)})},
  async del(id){const db=await this.open();if(!db)return;return new Promise(ok=>{const tx=db.transaction("sons","readwrite");tx.objectStore("sons").delete(id);tx.oncomplete=ok})}};
let tracks=null; // [{id,name,cat,src,local}]
const players={}; // id -> {a:Audio,vol,loop}
let master=0.8;
async function loadTracks(){const out=[];
  if(Store.mode==="api"){try{(await Store.api("sons")).forEach(f=>out.push({id:"srv:"+f.chemin,name:f.nom,cat:f.categorie||"Divers",src:"sons/"+f.chemin.split("/").map(encodeURIComponent).join("/"),local:false}))}catch(e){}}
  (await IDB.all()).forEach(o=>out.push({id:o.id,name:o.name,cat:o.cat||"Mes sons",blob:o.blob,local:true}));
  tracks=out;renderSons()}
function P(t){let p=players[t.id];if(!p){const a=new Audio(t.src||URL.createObjectURL(t.blob));p=players[t.id]={a,vol:0.7,loop:/ambiance|musique|fond|taverne|for[eê]t|pluie|combat/i.test(t.cat+" "+t.name)};a.loop=p.loop;a.volume=p.vol*master;a.onended=()=>renderSons()}return p}
function sonsHtml(){
  let h=`<div class="card"><div class="chead"><h2 style="margin:0">🎵 Ambiance sonore</h2><div class="cbtns"><label class="small" style="display:flex;align-items:center;gap:6px">Volume général <input type="range" min="0" max="1" step="0.05" id="sMaster" value="${master}" style="width:120px"></label><button class="btn sec del" id="sStop">⏹ Tout arrêter</button></div></div>`;
  if(tracks===null)return h+`<p class="small">Chargement…</p></div>`;
  const cats={};tracks.forEach(t=>(cats[t.cat]=cats[t.cat]||[]).push(t));
  if(!tracks.length)h+=`<p class="small">Aucun son pour l'instant. Ajoute tes MP3 ci-dessous${Store.mode==="api"?" ou mets-les dans le dossier <b>dnd/sons/</b> (un sous-dossier par catégorie : sons/taverne/, sons/combat/…)":""}.</p>`;
  Object.entries(cats).forEach(([c,l])=>{h+=`<h3 style="margin-top:10px">${esc(c)}</h3><div class="sgrid">${l.map(t=>{const p=players[t.id],on=p&&!p.a.paused;
    return `<div class="strack ${on?"on":""}"><button class="btn ${on?"":"sec"} splay" data-sp="${esc(t.id)}">${on?"⏸":"▶"}</button><div class="sinfo"><b>${esc(t.name)}</b>
      <div class="srow"><input type="range" min="0" max="1" step="0.05" data-sv="${esc(t.id)}" value="${p?p.vol:0.7}" title="Volume"><label class="small" title="Boucle"><input type="checkbox" data-sl="${esc(t.id)}" ${(p?p.loop:/ambiance|musique|fond|taverne|for[eê]t|pluie|combat/i.test(t.cat+" "+t.name))?"checked":""}> 🔁</label>${t.local?`<button class="mini" data-sd="${esc(t.id)}" title="Retirer">✕</button>`:""}</div></div></div>`}).join("")}</div>`});
  h+=`<details style="margin-top:12px"><summary class="small" style="cursor:pointer">+ Ajouter des sons depuis ton PC</summary><div class="row" style="align-items:flex-end;margin-top:6px">
     <label class="f"><span>Catégorie</span><input type="text" id="sCat" placeholder="ex. Taverne, Combat, Effets" list="sCats"><datalist id="sCats">${Object.keys(cats).map(c=>`<option>${esc(c)}</option>`).join("")}</datalist></label>
     <label class="btn" style="flex:0;margin-bottom:10px;text-align:center;white-space:nowrap">📂 Choisir des fichiers<input type="file" id="sFiles" accept="audio/*" multiple hidden></label></div>
     <div class="small">Les sons ajoutés ici restent enregistrés dans ce navigateur. Les boucles (🔁) servent pour les ambiances, décoche pour les bruitages courts.</div></details></div>`;
  return h}
function renderSons(){const el=$("#sonsBox");if(el)el.innerHTML=sonsHtml()}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#sonsBox"))return;let x;
  if(x=t.closest("[data-sp]")){const tr=tracks.find(z=>z.id===x.dataset.sp);const p=P(tr);if(p.a.paused){try{p.a.currentTime=p.a.ended?0:p.a.currentTime;await p.a.play()}catch(err){toast("Lecture impossible : "+err.message)}}else p.a.pause();renderSons()}
  if(t.id==="sStop"){Object.values(players).forEach(p=>{p.a.pause();p.a.currentTime=0});renderSons()}
  if(x=t.closest("[data-sd]")){const id=x.dataset.sd;if(players[id]){players[id].a.pause();delete players[id]}await IDB.del(id);loadTracks()}});
document.addEventListener("input",e=>{const t=e.target;if(!t.closest||!t.closest("#sonsBox"))return;
  if(t.id==="sMaster"){master=+t.value;Object.values(players).forEach(p=>p.a.volume=p.vol*master)}
  if(t.dataset.sv){const tr=tracks.find(z=>z.id===t.dataset.sv);const p=P(tr);p.vol=+t.value;p.a.volume=p.vol*master}});
document.addEventListener("change",async e=>{const t=e.target;if(!t.closest||!t.closest("#sonsBox"))return;
  if(t.dataset.sl){const tr=tracks.find(z=>z.id===t.dataset.sl);const p=P(tr);p.loop=t.checked;p.a.loop=t.checked}
  if(t.id==="sFiles"&&t.files.length){const cat=($("#sCat").value||"").trim()||"Mes sons";let n=0;
    for(const f of t.files){try{await IDB.put({id:"loc:"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," "),cat,blob:f});n++}catch(err){toast("Impossible d'enregistrer "+f.name)}}
    toast(n+" son(s) ajouté(s)");loadTracks()}});
/* ---------- intégration dans l'onglet Outils ---------- */
function inject(){const box=$("#outilsPage");if(!box)return;if(!$("#sonsBox")){box.insertAdjacentHTML("afterbegin",`<div id="sonsBox"></div>`);box.insertAdjacentHTML("beforeend",`<div id="ecranBox">${ecranHtml()}</div>`)}
  renderSons();if(tracks===null)loadTracks()}
const mo=new MutationObserver(()=>{if(location.hash==="#outils"&&!$("#sonsBox"))inject()});
document.addEventListener("view",e=>{if(e.detail==="outils"){inject();const o=$("#outilsPage");if(o)mo.observe(o,{childList:true})}});
Store.onReady(()=>{tracks=null;if(location.hash==="#outils")loadTracks()});
})();
