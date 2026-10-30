/* ===================== JOURNAL DE CAMPAGNE ===================== */
(()=>{
const $=s=>document.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const today=()=>new Date().toISOString().slice(0,10);
const blankJ=()=>({name:"",groupe:"",sessions:[],quetes:[],pnjs:[],saveId:null});
let J;try{J=JSON.parse(localStorage.getItem("dnd-journal"))}catch(e){}
if(!J||!Array.isArray(J.sessions))J=blankJ();
let list=null,showPrev=false,saveT=null,status="";
function persist(auto){try{localStorage.setItem("dnd-journal",JSON.stringify(J))}catch(e){}
  if(auto&&J.saveId){clearTimeout(saveT);status="modifications…";stat();saveT=setTimeout(()=>doSave(true),1500)}}
function stat(){const el=$("#jStatus");if(el)el.textContent=status}
async function doSave(silent){if(!J.name.trim()){if(!silent)toast("Donne un nom à la campagne");return}
  try{const r=await Store.save("journal",J.saveId,J.name,`${J.sessions.length} session(s) · ${J.quetes.filter(q=>!q.done).length} quête(s) en cours`,JSON.parse(JSON.stringify(J)));
    J.saveId=r.id;persist();status="✔ sauvegardé "+new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});stat();if(!silent)toast("Journal « "+J.name+" » sauvegardé")}
  catch(e){status="⚠ échec de la sauvegarde";stat();if(!silent)toast("Échec de la sauvegarde")}}
const ta=(path,val,ph,rows)=>`<textarea data-j="${path}" placeholder="${esc(ph)}" rows="${rows||3}">${esc(val||"")}</textarea>`;
function sessionCard(s,i){const n=J.sessions.length-i;
  return `<div class="card jsess"><div class="chead"><div class="row" style="align-items:flex-end;flex:1"><label class="f" style="max-width:90px"><span>Session</span><input type="text" value="n° ${n}" disabled></label>
     <label class="f" style="max-width:170px"><span>Date</span><input type="date" data-j="sessions.${i}.date" value="${esc(s.date)}"></label><label class="f"><span>Titre</span><input type="text" data-j="sessions.${i}.titre" value="${esc(s.titre)}" placeholder="ex. L'attaque du Vieux Port"></label></div>
     <button class="btn sec del" data-jdel="sessions.${i}" style="flex:0" title="Supprimer la session">✕</button></div>
   <label class="f"><span>Ce qui s'est passé</span>${ta(`sessions.${i}.resume`,s.resume,"Résumé de la session : où était le groupe, ce qu'il a fait, comment ça s'est terminé…",4)}</label>
   <div class="row"><label class="f"><span>PNJ rencontrés</span>${ta(`sessions.${i}.pnj`,s.pnj,"ex. Marek le passeur, la capitaine Ysolde…",2)}</label><label class="f"><span>Lieux</span>${ta(`sessions.${i}.lieux`,s.lieux,"ex. Taverne du Vieux Port, les égouts…",2)}</label></div>
   <div class="row"><label class="f"><span>Butin distribué</span>${ta(`sessions.${i}.butin`,s.butin,"ex. 120 po, potion de soins pour Kael…",2)}</label><label class="f" style="max-width:160px"><span>PX par joueur</span><input type="number" min="0" data-j="sessions.${i}.xp" value="${s.xp??""}"></label></div>
   <label class="f"><span>Notes du MJ (secrètes)</span>${ta(`sessions.${i}.mj`,s.mj,"Idées pour la suite, indices plantés, ce que les joueurs ignorent…",2)}</label></div>`}
let jpick=null,jcre=null;
function npcLinkHtml(p,i){if(p.ref)return `<div class="jlink"><span class="tag">🐺 fiche liée</span><button class="mini" data-jn="open:${i}">Ouvrir la fiche</button><button class="mini" data-jn="combat:${i}">⚔️ Au combat</button><button class="mini" data-jn="map:${i}">🗺️ Sur la carte</button><button class="mini" data-jn="unlink:${i}">Délier</button></div>`;
  const T0=window.PNJ?window.PNJ.TEMPLATES:{};
  return `<div class="jlink"><select data-jnbase="${i}" title="Profil de base">${["Roturier"].concat(Object.keys(T0)).map(k=>`<option ${p.base===k?"selected":""}>${esc(k)}</option>`).join("")}</select><button class="mini" data-jn="create:${i}">🐺 Créer sa fiche</button><button class="mini" data-jn="pick:${i}">Lier à une créature…</button></div>
   ${jpick===i?(jcre===null?`<div class="small">Chargement…</div>`:jcre.length?`<div class="jpickl">${jcre.map((c,k)=>`<button class="mini" data-jn="link:${i}:${k}">${esc(c.name)}</button>`).join("")}</div>`:`<div class="small">Aucune créature sauvegardée.</div>`):""}`}
async function npcData(p){const L=await Store.list("pnj");return L.find(c=>c.id===p.ref)}
function render(){const box=$("#journalPage");if(!box)return;
  const open=J.quetes.filter(q=>!q.done),done=J.quetes.filter(q=>q.done),totalXp=J.sessions.reduce((a,s)=>a+(+s.xp||0),0);
  let h=`<div class="mapbar"><div class="cbtns" style="justify-content:flex-start"><button class="btn" data-jm="save">💾 Sauvegarder</button><button class="btn sec" data-jm="list">🗂️ Mes campagnes</button><button class="btn sec" data-jm="new">Nouvelle campagne</button><span class="small" id="jStatus" style="align-self:center">${esc(status)}</span></div>
    <div class="cbtns"><button class="btn" data-jm="prev">📺 Précédemment…</button></div></div>`;
  if(list)h+=list==="loading"?`<div class="card small">Chargement…</div>`:!list.length?`<div class="card small">Aucune campagne sauvegardée.</div>`:
    `<div class="card"><h3>Mes campagnes</h3><div class="savelist">${list.map((c,i)=>`<div class="saveitem ${c.id===J.saveId?"cur":""}"><div><b>${esc(c.name)}</b><div class="small">${esc(c.summary||"")} · ${new Date(c.updated||0).toLocaleDateString("fr-FR")}</div></div><div class="saveact"><button class="btn sec" data-jload="${i}">Ouvrir</button><button class="btn sec del" data-jdelc="${i}">✕</button></div></div>`).join("")}</div></div>`;
  h+=`<div class="jgrid"><aside>
    <div class="card"><h3>Campagne</h3><label class="f"><span>Nom</span><input type="text" data-j="name" value="${esc(J.name)}" placeholder="ex. DnD REMS"></label>
      <label class="f"><span>Groupe de joueurs (facultatif)</span><input type="text" data-j="groupe" value="${esc(J.groupe)}" placeholder="nom d'un groupe sauvegardé"></label>
      <div class="small">${J.sessions.length} session(s) · ${totalXp} PX gagnés par joueur au total</div>${J.saveId?`<div class="small">Sauvegarde automatique activée.</div>`:`<div class="small">Sauvegarde une première fois pour activer la sauvegarde automatique.</div>`}</div>
    <div class="card"><h3>Quêtes en cours <span class="count">${open.length}</span></h3>
      ${J.quetes.map((q,i)=>q.done?"":`<div class="jq"><input type="checkbox" data-jq="${i}" title="Terminée"><input type="text" data-j="quetes.${i}.t" value="${esc(q.t)}" placeholder="Quête…"><button class="mini" data-jdel="quetes.${i}">✕</button></div>`).join("")}
      <div class="row" style="flex:0;margin-top:6px"><input type="text" id="jNewQ" placeholder="Nouvelle quête…"><button class="btn sec" data-jm="addQ" style="flex:0">+</button></div>
      ${done.length?`<details style="margin-top:8px"><summary class="small">${done.length} quête(s) terminée(s)</summary>${J.quetes.map((q,i)=>q.done?`<div class="jq done"><input type="checkbox" data-jq="${i}" checked><span>${esc(q.t)}</span></div>`:"").join("")}</details>`:""}</div>
    <div class="card"><h3>PNJ importants</h3>${J.pnjs.map((p,i)=>`<div class="jp"><input type="text" data-j="pnjs.${i}.nom" value="${esc(p.nom)}" placeholder="Nom"><button class="mini" data-jdel="pnjs.${i}">✕</button><textarea data-j="pnjs.${i}.desc" rows="2" placeholder="Qui c'est, ce qu'il veut…">${esc(p.desc)}</textarea>${npcLinkHtml(p,i)}</div>`).join("")}
      <button class="btn sec" data-jm="addP">+ Ajouter un PNJ</button></div>
   </aside><main>
    <div class="card"><div class="chead"><h2 style="margin:0">Sessions</h2><button class="btn" data-jm="addS">+ Nouvelle session</button></div>${J.sessions.length?"":`<p class="small">Aucune session. Clique sur « Nouvelle session » après (ou pendant) ta partie.</p>`}</div>
    ${J.sessions.map(sessionCard).join("")}
   </main></div>`;
  if(showPrev){const s=J.sessions[0];
    h+=`<div class="jprev" data-jm="closePrev"><div class="jprev-in"><div class="where" style="color:#d9b45a">${esc(J.name||"La campagne")}</div><h1>Précédemment…</h1>
      ${s?`<h2>${esc(s.titre||"Session "+J.sessions.length)}</h2><p class="jbig">${esc(s.resume||"(pas de résumé)").replace(/\n/g,"<br>")}</p>${s.lieux?`<p><b>Lieux :</b> ${esc(s.lieux)}</p>`:""}${s.pnj?`<p><b>Rencontres :</b> ${esc(s.pnj)}</p>`:""}`:`<p class="jbig">Aucune session enregistrée pour l'instant.</p>`}
      ${open.length?`<h3>Quêtes en cours</h3><ul>${open.map(q=>`<li>${esc(q.t)}</li>`).join("")}</ul>`:""}<div class="small" style="margin-top:20px;opacity:.6">Clique n'importe où pour fermer</div></div></div>`}
  box.innerHTML=h}
function setPath(p,v){const k=p.split(".");let o=J;for(let i=0;i<k.length-1;i++)o=o[k[i]];o[k[k.length-1]]=v}
document.addEventListener("input",e=>{const t=e.target;if(!t.closest||!t.closest("#journalPage")||!t.dataset.j)return;setPath(t.dataset.j,t.type==="number"?(t.value===""?null:+t.value):t.value);persist(true)});
document.addEventListener("change",e=>{const t=e.target;if(!t.closest||!t.closest("#journalPage"))return;
  if(t.dataset.jq!==undefined){J.quetes[+t.dataset.jq].done=t.checked;persist(true);render()}});
document.addEventListener("keydown",e=>{if(e.target.id==="jNewQ"&&e.key==="Enter"){e.preventDefault();document.querySelector('[data-jm="addQ"]').click()}
  if(e.key==="Escape"&&showPrev){showPrev=false;render()}});
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#journalPage"))return;let x;
  if(x=t.closest("[data-jm]")){const v=x.dataset.jm;
    if(v==="save")return doSave(false);
    if(v==="list"){if(list){list=null;render();return}list="loading";render();try{list=await Store.list("journal")}catch(err){list=[]}render()}
    if(v==="new"){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ? (pense à sauvegarder)";return}J=blankJ();status="";persist();render()}
    if(v==="addS"){J.sessions.unshift({id:uid(),date:today(),titre:"",resume:"",pnj:"",lieux:"",butin:"",xp:null,mj:""});persist(true);render()}
    if(v==="addQ"){const i=$("#jNewQ");const q=(i.value||"").trim();if(!q)return;J.quetes.push({id:uid(),t:q,done:false});persist(true);render()}
    if(v==="addP"){J.pnjs.push({id:uid(),nom:"",desc:""});persist(true);render()}
    if(v==="prev"){showPrev=true;render();try{const el=$(".jprev");el&&el.requestFullscreen&&await el.requestFullscreen()}catch(err){}}
    if(v==="closePrev"){showPrev=false;try{document.fullscreenElement&&document.exitFullscreen()}catch(err){}render()}
    return}
  if(x=t.closest("[data-jn]")){const [a,i,k]=x.dataset.jn.split(":");const p=J.pnjs[+i];if(!p)return;
    if(a==="pick"){jpick=jpick===+i?null:+i;jcre=null;render();if(jpick!==null){try{jcre=await Store.list("pnj")}catch(err){jcre=[]}render()}return}
    if(a==="link"){const c=jcre[+k];p.ref=c.id;if(!p.nom)p.nom=c.name;jpick=null;persist(true);render();toast("Fiche liée");return}
    if(a==="unlink"){p.ref=null;persist(true);render();return}
    if(a==="create"){const T0=window.PNJ.TEMPLATES,b=p.base&&T0[p.base]?p.base:null;
      const d=JSON.parse(JSON.stringify(b?T0[b]:{name:"",role:"neutre",size:"Moyenne (M)",type:"Humanoïde",align:"Neutre",ac:10,acTxt:"",hp:"2d8",speed:"9 m",cr:"0",ab:{FOR:10,DEX:10,CON:10,INT:10,SAG:10,CHA:10},saves:[],skills:{},senses:"",langs:"commun",traits:[],actions:[{n:"Gourdin",kind:"melee",ab:"FOR",range:"allonge 1,50 m",dice:"1d4",dtype:"contondants",extra:""}]}));
      d.name=p.nom||"PNJ sans nom";d.role=d.role||"neutre";if(p.desc)d.notes=p.desc;
      try{const r=await Store.save("pnj",null,d.name,`PNJ · ${b||"Roturier"}${J.name?" · "+J.name:""}`,d);p.ref=r.id;persist(true);render();toast("Fiche créée dans Ennemis & alliés")}catch(err){toast("Création impossible")}return}
    let c=null;try{c=await npcData(p)}catch(err){}if(!c){toast("Fiche introuvable (supprimée ?)");return}
    if(a==="open"){window.PNJ.load(c.data,c.id);location.hash="#pnj"}
    if(a==="combat"){if(typeof Combat!=="undefined")Combat.add(Combat.fromNpc(c.data,1,"avg"))}
    if(a==="map"){if(typeof Carte!=="undefined"){Carte.addTokens([{name:c.name,color:c.data.role==="allie"?"#2f6b3f":c.data.role==="neutre"?"#a8812f":"#9b2c1f",img:c.data.token||null,hp:Dice.avg(c.data.hp)||null,max:Dice.avg(c.data.hp)||null}])}}
    return}
  if(x=t.closest("[data-jdel]")){if(!x.dataset.ok&&x.dataset.jdel.startsWith("sessions")){x.dataset.ok=1;x.textContent="Sûr ?";return}const [k,i]=x.dataset.jdel.split(".");J[k].splice(+i,1);persist(true);render()}
  if(x=t.closest("[data-jload]")){const c=list[+x.dataset.jload];J=Object.assign(blankJ(),c.data,{saveId:c.id});list=null;status="";persist();render();toast("Campagne « "+c.name+" » ouverte")}
  if(x=t.closest("[data-jdelc]")){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ?";return}const c=list[+x.dataset.jdelc];await Store.remove(c.id,"journal");if(J.saveId===c.id)J.saveId=null;list=await Store.list("journal");render();toast("Campagne supprimée")}
});
document.addEventListener("change",e=>{if(e.target.dataset&&e.target.dataset.jnbase!==undefined){const p=J.pnjs[+e.target.dataset.jnbase];if(p){p.base=e.target.value;persist(true)}}});
document.addEventListener("view",e=>{if(e.detail==="journal")render()});
})();
