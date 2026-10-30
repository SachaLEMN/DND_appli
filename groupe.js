/* ===================== GROUPE (partagé entre les joueurs) ===================== */
window.Groupe=(()=>{
const $=s=>document.querySelector(s);
let db=null,user=null,uid=null,col=null,docs=[],unsub=null,state="loading",isOwner=false;
let poll=null;
async function refreshApi(){try{const rows=await Store.api("groupe");docs=rows.map(r=>Object.assign(cardOf(r.data)||{},{id:r.id,updated:r.updated}));render()}catch(e){}}
const ready=(async()=>{try{await Store.ready;if(Store.mode==="api"){state="api";isOwner=true;await refreshApi();poll=setInterval(()=>{if(location.hash==="#groupe")refreshApi()},5000);return}
  if(!window.claude||typeof window.claude.use!=="function"){state="off";return}
  [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);if(!db||!user){state="off";return}
  uid=await user.id();try{isOwner=!!(await user.isOwner())}catch(e){}col=db.collection("groupe");state="on";
  unsub=col.onSnapshot(s=>{docs=s.docs.map(d=>Object.assign({id:d.id},d.data()));render()},err=>{state="off";render()})}
  catch(e){state="off"}finally{render()}})();
function cardOf(st){const keep=S;S=Object.assign(blank(),st);PB=pbFor(LV());let o=null;
  try{const r=R(),c=C();o={name:S.name||"Sans nom",player:S.player||"",race:S.race,cls:S.cls,sub:S.sub2||S.sub||"",level:LV(),ac:armorClass().v,hp:hp(),hpCur:S.play&&S.play.hp!=null?S.play.hp:hp(),
    initBonus:M("DEX"),pp:10+skillTotal("Perception"),pinv:10+skillTotal("Investigation"),pins:10+skillTotal("Intuition"),speed:r.spd,langs:languages().join(", "),
    saves:AB.map(a=>a+" "+sgn(saveBonus(a))).join(" · "),dc:spellInfo()?spellInfo().dc:null,token:S.token||null,cond:S.play?S.play.cond:[],updated:Date.now()}}catch(e){}
  S=keep;PB=pbFor(LV());return o}
async function share(){await ready;
  if(state==="api"){if(!S.race||!S.cls||!S.bg)return toast("Termine d'abord ton perso dans l'onglet Personnages");
    try{const r=await Store.save("perso",S.saveId,S.name,persoSummary(),JSON.parse(JSON.stringify(Object.assign({},S,{confirmReset:false}))));S.saveId=r.id;save();
      await Store.api("groupe_set",{id:r.id,actif:1});await refreshApi();toast("« "+(S.name||"Sans nom")+" » sauvegardé et ajouté au groupe !")}catch(e){toast("Erreur : "+e.message,4000)}return}
  if(state!=="on")return toast("Le groupe a besoin du stockage en ligne (page ouverte depuis claude.ai)");
  if(!S.race||!S.cls||!S.bg)return toast("Termine d'abord ton perso dans l'onglet Personnages");
  try{await col.doc(uid).set(cardOf(JSON.parse(JSON.stringify(S))));toast("Ton perso est partagé avec le groupe !")}catch(e){toast("Impossible de partager : demande au MJ un accès Contributeur à la page",4000)}}
async function removeDoc(id){if(state==="api"){await Store.api("groupe_set",{id,actif:0});await refreshApi();toast("Retiré du groupe (le perso reste sauvegardé)");return}try{await col.doc(id).delete();toast("Retiré du groupe")}catch(e){toast("Tu ne peux retirer que ton propre perso")}}
async function list(){await ready;return docs.map(d=>Object.assign({summary:`${d.race} · ${d.cls} ${d.level} · CA ${d.ac} · PV ${d.hpCur}/${d.hp}`},d))}
let gsv=null; // panneau des groupes sauvegardés : null | {mode:"save"} | {mode:"list",items}
function gsvHtml(){if(!gsv)return "";
  if(gsv.mode==="save")return `<div class="npcbox" style="margin-top:10px"><h3 style="margin:0 0 6px">Sauvegarder les ${docs.length} perso(s) du groupe</h3>
    <div class="small">${esc(docs.map(d=>d.name).join(", "))}</div><div class="row" style="align-items:flex-end;margin-top:6px"><label class="f"><span>Nom du groupe</span><input type="text" id="gName" placeholder="ex. Campagne du vendredi" value="${esc(gsv.name||"")}"></label>
    <button class="btn" id="gSaveOk" style="flex:0;margin-bottom:10px">Sauvegarder</button></div>${gsv.id?`<div class="small">Un groupe du même nom existe : il sera mis à jour.</div>`:""}</div>`;
  if(gsv.items===null)return `<p class="small" style="margin-top:10px">Chargement…</p>`;
  if(!gsv.items.length)return `<p class="small" style="margin-top:10px">Aucun groupe sauvegardé. Ajoute des persos au groupe puis clique sur « 💾 Sauvegarder ce groupe ».</p>`;
  return `<div class="savelist" style="margin-top:10px">${gsv.items.map((g,i)=>`<div class="saveitem"><div><b>${esc(g.name)}</b><div class="small">${esc(g.summary||"")} · ${new Date(g.updated||0).toLocaleDateString("fr-FR")}</div></div>
    <div class="saveact"><button class="btn sec" data-gload="${i}">${state==="api"?"Charger":"Voir"}</button><button class="btn sec" data-gfight="${i}" title="Envoyer au combat">⚔️</button><button class="btn sec del" data-gdelg="${i}">✕</button></div></div>`).join("")}</div>
    ${state==="api"?`<div class="small" style="margin-top:6px">« Charger » remplace le groupe affiché par celui-ci. Les persos restent dans ta base.</div>`:""}`}
async function listGroups(){gsv={mode:"list",items:null};render();try{gsv.items=await Store.list("groupe")}catch(e){gsv.items=[];toast("Impossible de lire les groupes")}render()}
function cardsToCombat(cards){Combat.add(cards.map(d=>({id:Math.random().toString(36).slice(2,9),name:d.name,kind:"pj",initBonus:d.initBonus||0,init:null,ac:d.ac,hp:d.hpCur??d.hp,max:d.hp,temp:0,cond:[],level:d.level||1,pp:d.pp})));location.hash="#combat"}
let pick=null; // null = fermé, [] = liste des persos sauvegardés
function pickHtml(){if(!pick)return "";if(pick==="loading")return `<p class="small" style="margin-top:10px">Chargement…</p>`;
  if(!pick.length)return `<p class="small" style="margin-top:10px">Aucun perso sauvegardé. Sauvegarde-les d'abord avec « 💾 Sauvegarder » dans l'onglet Personnages.</p>`;
  const inG=new Set(docs.map(d=>d.id));
  return `<div class="savelist" style="margin-top:10px">${pick.map((it,i)=>{const already=state==="api"&&inG.has(it.id);
    return `<div class="saveitem ${already?"cur":""}"><div><b>${esc(it.name)}</b><div class="small">${esc(it.summary||"")}</div></div><div class="saveact">${already?`<span class="small">✔ dans le groupe</span>`:`<button class="btn sec" data-gadd="${i}">Ajouter</button>`}</div></div>`}).join("")}
    ${state==="api"&&pick.some(it=>!inG.has(it.id))?`<button class="btn" id="gAddAll" style="align-self:flex-start">Tout ajouter</button>`:""}</div>
    ${state==="on"?`<div class="small" style="margin-top:6px">En ligne, chaque joueur a une seule place dans le groupe : ajouter un perso remplace celui que tu avais partagé.</div>`:""}`}
async function addSaved(it){
  if(state==="api"){await Store.api("groupe_set",{id:it.id,actif:1});await refreshApi();return}
  if(state==="on"){const card=cardOf(it.data);if(!card)throw new Error("perso incomplet");await col.doc(uid).set(card);return}
  throw new Error("Le groupe n'est pas disponible ici")}
function render(){const box=$("#groupePage");if(!box)return;
  let h=`<div class="card"><h2>La table</h2><div class="small">${state==="api"?"Les persos de ta base marqués « dans le groupe ». « Partager » sauvegarde le perso ouvert et l'ajoute ; la liste se met à jour toute seule toutes les 5 secondes (pratique sur la télé).":"Chaque joueur partage ici son perso."}`+` ${state==="api"?"":" Le MJ voit d'un coup d'œil la CA, les PV, les perceptions passives et les sauvegardes de tout le groupe."}</div>
   <div class="row" style="flex:0;margin-top:10px;flex-wrap:wrap"><button class="btn" id="gShare">📤 ${state==="api"?"Ajouter le perso ouvert au groupe":"Partager mon perso actuel"}</button><button class="btn sec" id="gPick">📂 Ajouter depuis mes persos sauvegardés</button><button class="btn sec" id="gSaveG">💾 Sauvegarder ce groupe</button><button class="btn sec" id="gListG">🗂️ Mes groupes</button><button class="btn sec" id="gCombat">⚔️ Ajouter tout le groupe au combat</button></div>${pickHtml()}${gsvHtml()}</div>`;
  if(state==="loading")h+=`<div class="card small">Connexion…</div>`;
  else if(state==="off")h+=`<div class="card"><p>Le groupe partagé a besoin du stockage en ligne : il marche quand la page est ouverte depuis claude.ai et partagée avec tes potes (accès Contributeur pour qu'ils puissent publier leur perso).</p></div>`;
  else if(!docs.length)h+=`<div class="card small">Personne n'a encore partagé de perso. Clique sur « Partager mon perso actuel » !</div>`;
  else{const tot=docs.length;h+=`<div class="gsum card"><b>${tot} aventurier${tot>1?"s":""}</b> · niveau moyen ${(docs.reduce((a,b)=>a+(b.level||1),0)/tot).toFixed(1)} · perception passive la plus haute : ${Math.max(...docs.map(d=>d.pp||10))}</div><div class="ggrid">`+
    docs.sort((a,b)=>(a.name||"").localeCompare(b.name||"")).map(d=>{const pct=Math.max(0,Math.min(100,100*(d.hpCur??d.hp)/Math.max(1,d.hp)));const mine=d.id===uid;
    return `<div class="card gcard ${mine?"mine":""}"><div class="chead" style="align-items:flex-start;flex-wrap:nowrap"><div><h3 style="margin:0">${esc(d.name)}</h3><div class="small">${esc(d.race)} · ${esc(d.cls)}${d.sub?" ("+esc(d.sub)+")":""} ${d.level}${d.player?" · joué par "+esc(d.player):""}</div></div>${mine||isOwner?`<button class="btn sec del" data-gdel="${esc(d.id)}" style="flex:0" title="Retirer">✕</button>`:""}</div>
     <div class="hpbar sm" style="margin:6px 0"><div style="width:${pct}%;background:${pct>50?"var(--amber)":pct>20?"var(--gold)":"var(--red)"}"></div><span>${d.hpCur??d.hp} / ${d.hp} PV</span></div>
     <div class="stat3"><div><small>CA</small><b>${d.ac}</b></div><div><small>Init.</small><b>${sgn(d.initBonus||0)}</b></div><div><small>Perc. passive</small><b>${d.pp}</b></div><div><small>Intuition pass.</small><b>${d.pins||"—"}</b></div>${d.dc?`<div><small>DD sorts</small><b>${d.dc}</b></div>`:""}</div>
     <div class="small" style="margin-top:6px"><b>Sauvegardes :</b> ${esc(d.saves||"")}<br><b>Langues :</b> ${esc(d.langs||"")}${d.cond&&d.cond.length?`<br><b>États :</b> ${esc(d.cond.join(", "))}`:""}</div>
     <div class="small" style="margin-top:4px;opacity:.7">Mis à jour le ${new Date(d.updated||0).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div></div>`}).join("")+`</div>`}
  box.innerHTML=h}
document.addEventListener("click",async e=>{const t=e.target;if(!t.closest||!t.closest("#groupePage"))return;
  if(t.id==="gShare")share();
  if(t.id==="gSaveG"){pick=null;if(gsv&&gsv.mode==="save"){gsv=null;render();return}if(!docs.length)return toast("Le groupe est vide : ajoute d'abord des persos");gsv={mode:"save"};render();setTimeout(()=>{const i=document.getElementById("gName");if(i)i.focus()},50)}
  if(t.id==="gSaveOk"){const name=(document.getElementById("gName").value||"").trim();if(!name)return toast("Donne un nom au groupe");
    try{const ex=(await Store.list("groupe")).find(g=>g.name.toLowerCase()===name.toLowerCase());
      const data={membres:docs.map(d=>({id:d.id,nom:d.name})),cartes:docs.map(d=>Object.assign({},d))};
      await Store.save("groupe",ex?ex.id:null,ex?ex.name:name,`${docs.length} perso(s) : ${docs.map(d=>d.name).join(", ")}`.slice(0,250),data);
      toast(ex?"Groupe « "+name+" » mis à jour":"Groupe « "+name+" » sauvegardé");listGroups()}catch(err){toast("Erreur : "+(err.message||err),3500)}}
  if(t.id==="gListG"){pick=null;if(gsv&&gsv.mode==="list"){gsv=null;render();return}listGroups()}
  if(t.dataset.gload!==undefined){const g=gsv.items[+t.dataset.gload];
    if(state==="api"){try{const r=await Store.api("groupe_charger",{ids:g.data.membres.map(m=>m.id)});await refreshApi();gsv=null;render();
      toast(`Groupe « ${g.name} » chargé : ${r.charges} perso(s)${r.charges<r.demandes?" ("+(r.demandes-r.charges)+" supprimé(s) de la base entre-temps)":""}`,3500)}catch(err){toast("Erreur : "+err.message,3500)}}
    else{const c=g.data.cartes||[];toast(`« ${g.name} » : ${c.map(x=>x.name+" (CA "+x.ac+", PV "+x.hp+")").join(" · ")}`,6000)}}
  if(t.dataset.gfight!==undefined){const g=gsv.items[+t.dataset.gfight];
    if(state==="api"){await Store.api("groupe_charger",{ids:g.data.membres.map(m=>m.id)});await refreshApi();cardsToCombat(docs)}else cardsToCombat(g.data.cartes||[])}
  if(t.dataset.gdelg!==undefined){if(!t.dataset.ok){t.dataset.ok=1;t.textContent="Sûr ?";return}const g=gsv.items[+t.dataset.gdelg];await Store.remove(g.id,"groupe");toast("Groupe supprimé (les persos restent sauvegardés)");listGroups()}
  if(t.id==="gPick"){gsv=null;if(pick){pick=null;render();return}if(state!=="api"&&state!=="on")return toast("Le groupe a besoin de la base XAMPP ou du stockage en ligne");
    pick="loading";render();try{pick=(await Store.list("perso")).filter(x=>x.data&&x.data.race&&x.data.cls&&x.data.bg)}catch(err){pick=[];toast("Impossible de lire tes sauvegardes")}render()}
  if(t.dataset.gadd!==undefined){const it=pick[+t.dataset.gadd];try{await addSaved(it);toast("« "+it.name+" » ajouté au groupe");render()}catch(err){toast(err.message||"Erreur",3500)}}
  if(t.id==="gAddAll"){const inG=new Set(docs.map(d=>d.id));let n=0;for(const it of pick){if(!inG.has(it.id)){try{await addSaved(it);n++}catch(err){}}}toast(n+" perso(s) ajouté(s) au groupe");render()}
  if(t.id==="gCombat"){const l=await list();if(!l.length)return toast("Le groupe est vide");
    Combat.add(l.map(d=>({id:Math.random().toString(36).slice(2,9),name:d.name,kind:"pj",initBonus:d.initBonus||0,init:null,ac:d.ac,hp:d.hpCur??d.hp,max:d.hp,temp:0,cond:[],level:d.level||1,pp:d.pp})));location.hash="#combat"}
  if(t.dataset.gdel){if(!t.dataset.ok){t.dataset.ok=1;t.textContent="Sûr ?";return}removeDoc(t.dataset.gdel)}});
document.addEventListener("view",e=>{if(e.detail==="groupe")render()});
return {list,share,ready};
})();
