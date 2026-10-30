/* ===================== ADMIN : base, sauvegarde complète, contenu, création maison ===================== */
const Maison=(()=>{
  let M={sorts:[],objets:[],monstres:[]},applied=false;
  const norm=m=>Object.assign({sorts:[],objets:[],monstres:[]},m||{});
  async function load(){if(Store.mode==="api"){try{M=norm(await Store.api("etat",null,"&cle=maison"))}catch(e){}}else{try{M=norm(JSON.parse(localStorage.getItem("dnd-maison")))}catch(e){M=norm()}}return M}
  async function store(){if(Store.mode==="api")await Store.api("etat",M,"&cle=maison");else localStorage.setItem("dnd-maison",JSON.stringify(M))}
  // injecte le contenu maison dans les listes du site (sorts par classe et niveau, objets, modèles de créatures)
  function inject(){const lists={0:CANT,1:LVL1,2:LVL2,3:LVL3,4:typeof LVL4!=="undefined"?LVL4:null,5:typeof LVL5!=="undefined"?LVL5:null};
    M.sorts.forEach(s=>{const n=+s.niveau;SP[s.nom]=[s.ecole+(s.mots?" · "+s.mots:"")+" · maison",s.desc];if(typeof SPELL_LV!=="undefined")SPELL_LV[s.nom]=n;
      (s.classes||[]).forEach(c=>{const tgt=(n===1&&(c==="Paladin"||c==="Rôdeur")&&typeof LVL1X!=="undefined")?LVL1X:lists[n];if(!tgt)return;tgt[c]=tgt[c]||[];if(!tgt[c].includes(s.nom))tgt[c].push(s.nom)})});
    M.objets.forEach(o=>{if(!OBJETS.some(x=>x.nom===o.nom))OBJETS.push(OBJ(o.nom,o.type,o.rarete,o.harmo,o.effet,o.mods))});
    if(window.PNJ)M.monstres.forEach(m=>{window.PNJ.TEMPLATES[m.nom]=m.data});applied=true}
  async function apply(){await load();inject()}
  Store.onReady(async()=>{if(Store.mode!=="api"){await apply();try{render()}catch(e){}}});
  return {apply,load,store,get data(){return M},inject};
})();

(()=>{
const $=s=>document.querySelector(s);
const KINDS=[["perso","Personnages"],["pnj","Ennemis & alliés"],["carte","Cartes"],["jeton","Bibliothèque de jetons"],["journal","Journaux"],["groupe","Groupes sauvegardés"],["rencontre","Rencontres préparées"]];
const TNAME={personnages:"Personnages",creatures:"Créatures",groupes:"Groupes",cartes:"Cartes",journaux:"Journaux",jetons:"Jetons",rencontres:"Rencontres",etat:"État (combat, écran TV…)",sorts:"Sorts (référence)",objets_magiques:"Objets magiques (référence)",modeles_creatures:"Modèles de créatures (référence)"};
const ECOLES=["Abjuration","Divination","Enchantement","Évocation","Illusion","Invocation","Nécromancie","Transmutation"];
let st=null,kind="perso",rows=null,selIds=new Set(),msg="",busy=false,impMode="ajouter",withFiles=true,creas=null;
const ko=n=>n>=1048576?(n/1048576).toFixed(1).replace(".",",")+" Mo":Math.max(1,Math.round(n/1024))+" Ko";
function render(){const box=$("#adminPage");if(!box)return;const api=Store.mode==="api";const M=Maison.data;
  let h=`<div class="card"><h2>Base de données</h2>`;
  if(api){if(!st)h+=`<p class="small">Chargement…</p>`;else{
    h+=`<div class="admgrid">${Object.entries(st.tables).map(([t,n])=>`<div class="adm"><small>${esc(TNAME[t]||t)}</small><b>${n===null?"—":n}</b></div>`).join("")}</div>
     <p class="small">Taille de la base : <b>${ko(st.taille)}</b> · images en fichiers (dnd/uploads) : <b>${st.uploads.fichiers}</b> (${ko(st.uploads.octets)}) · PHP ${esc(st.php)} · envoi max ${esc(st.limites.post_max_size)} · max_allowed_packet ${ko(st.limites.max_allowed_packet)}</p>
     ${st.images_en_base?`<div class="hint">🖼️ <b>${st.images_en_base} carte(s)</b> ont encore leur image dans la base. Les sortir en fichiers allège la base et les sauvegardes. <button class="btn sm" data-ad="migrer" ${busy?"disabled":""}>Sortir les images vers dnd/uploads</button></div>`:""}`}}
  else h+=`<p>Tu es en mode <b>${Store.mode==="cloud"?"en ligne (claude.ai)":"local (ce navigateur)"}</b>. La page complète (stats, nettoyage, images en fichiers) sert surtout avec la version XAMPP / serveur, mais l'export et l'import marchent aussi ici.</p>`;
  h+=`<h3 style="margin-top:12px">Sauvegarde complète</h3><div class="cbtns" style="justify-content:flex-start;align-items:center">
     <button class="btn" data-ad="export" ${busy?"disabled":""}>⬇️ Tout exporter dans un fichier</button>${api?`<div class="chk" style="flex:0"><label class="${withFiles?"sel":""}"><input type="checkbox" id="adFiles" ${withFiles?"checked":""}> avec les images (dnd/uploads)</label></div>`:""}</div>
   <div class="cbtns" style="justify-content:flex-start;align-items:center;margin-top:8px"><label class="btn sec">⬆️ Importer une sauvegarde<input type="file" accept=".json,application/json" id="adImport" hidden></label>
     <div class="chk" style="flex:0"><label class="${impMode==="ajouter"?"sel":""}"><input type="radio" name="adMode" value="ajouter" ${impMode==="ajouter"?"checked":""}> Ajouter à l'existant</label><label class="${impMode==="remplacer"?"sel":""}"><input type="radio" name="adMode" value="remplacer" ${impMode==="remplacer"?"checked":""}> Tout remplacer</label></div></div>
   ${impMode==="remplacer"?`<div class="small" style="color:var(--red)">⚠ « Tout remplacer » efface d'abord tes persos, créatures, cartes, journaux… (les sorts et objets de référence ne bougent pas). Exporte avant !</div>`:""}
   ${msg?`<div class="hint">${msg}</div>`:""}</div>`;
  // contenu
  h+=`<div class="card"><h2>Contenu</h2><div class="chk">${KINDS.map(([k,l])=>`<label class="${kind===k?"sel":""}"><input type="radio" name="adKind" value="${k}" ${kind===k?"checked":""}>${l}</label>`).join("")}</div>
   ${rows===null?`<p class="small">Chargement…</p>`:!rows.length?`<p class="small">Rien ici.</p>`:`<div class="admrows"><table><tr><th><input type="checkbox" id="adAll" ${selIds.size===rows.length?"checked":""}></th><th>Nom</th><th>Résumé</th><th>Taille</th><th>Modifié</th></tr>
     ${rows.map(r=>`<tr><td><input type="checkbox" data-adsel="${esc(r.id)}" ${selIds.has(r.id)?"checked":""}></td><td><b>${esc(r.name)}</b></td><td class="small">${esc(r.summary||"")}</td><td class="small">${r.size?ko(r.size):"—"}</td><td class="small">${r.updated?new Date(r.updated).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"}):""}</td></tr>`).join("")}</table></div>
     <div class="cbtns" style="justify-content:flex-start;margin-top:8px"><button class="btn sec del" data-ad="delsel" ${selIds.size?"":"disabled"}>🗑️ Supprimer la sélection (${selIds.size})</button></div>`}</div>`;
  // création maison
  const cls=Object.keys(CLASSES);
  h+=`<div class="card"><h2>Création maison</h2><p class="small">Tes sorts, objets et monstres maison apparaissent ensuite partout dans le site (créateur, butin, combat…). Ils sont gardés à part : une réimportation de dnd.sql ne les efface pas.</p>
   <div class="grid2"><div class="npcbox"><h3>✨ Nouveau sort</h3>
     <div class="row"><label class="f"><span>Nom</span><input type="text" id="hsNom"></label><label class="f" style="max-width:110px"><span>Niveau</span><select id="hsLv">${[0,1,2,3,4,5].map(n=>`<option value="${n}">${n?n:"tour de magie"}</option>`).join("")}</select></label></div>
     <div class="row"><label class="f"><span>École</span><select id="hsEc">${ECOLES.map(e=>`<option>${e}</option>`).join("")}</select></label><label class="f"><span>Mots-clés</span><input type="text" id="hsMots" placeholder="ex. rituel, concentration"></label></div>
     <div class="small">Classes</div><div class="chk">${cls.map(c=>`<label><input type="checkbox" data-hscls="${esc(c)}">${esc(c)}</label>`).join("")}</div>
     <label class="f"><span>Description courte</span><textarea id="hsDesc" rows="2" placeholder="ex. Cône de 4,50 m, 3d6 froid (sauvegarde CON)."></textarea></label>
     <button class="btn" data-ad="addSort">Ajouter le sort</button></div>
    <div class="npcbox"><h3>💍 Nouvel objet magique</h3>
     <div class="row"><label class="f"><span>Nom</span><input type="text" id="hoNom"></label><label class="f"><span>Type</span><select id="hoType">${["Arme","Armure","Anneau","Amulette","Baguette","Bâton","Cape","Potion","Parchemin","Objet merveilleux"].map(t=>`<option>${t}</option>`).join("")}</select></label></div>
     <div class="row"><label class="f"><span>Rareté</span><select id="hoRar">${["commune","peu commune","rare","très rare","légendaire"].map(t=>`<option>${t}</option>`).join("")}</select></label><div class="chk" style="flex:1;align-self:flex-end"><label><input type="checkbox" id="hoHarmo"> Harmonisation</label></div></div>
     <label class="f"><span>Effet</span><textarea id="hoEff" rows="2"></textarea></label>
     <div class="row"><label class="f"><span>CA +</span><input type="number" id="hoAc" min="0" max="5" value="0"></label><label class="f"><span>Sauvegardes +</span><input type="number" id="hoSv" min="0" max="5" value="0"></label><label class="f"><span>Arme +</span><input type="number" id="hoWp" min="0" max="5" value="0"></label><label class="f"><span>Soins (potion)</span><input type="text" id="hoHeal" placeholder="ex. 2d4+2"></label></div>
     <button class="btn" data-ad="addObj">Ajouter l'objet</button></div>
    <div class="npcbox"><h3>🐉 Monstre maison → modèle</h3><p class="small">Crée-le dans « Ennemis & alliés » et sauvegarde-le, puis ajoute-le ici : il rejoint la liste des modèles (combat, carte, rencontres…).</p>
     ${creas===null?`<button class="btn sec" data-ad="loadCreas">Choisir parmi mes créatures…</button>`:creas.length?`<div class="row"><select id="hmCrea">${creas.map((c,i)=>`<option value="${i}">${esc(c.name)}</option>`).join("")}</select><button class="btn" data-ad="addMon" style="flex:0">Ajouter</button></div>`:`<p class="small">Aucune créature sauvegardée.</p>`}</div></div>
   ${M.sorts.length+M.objets.length+M.monstres.length?`<h3 style="margin-top:12px">Déjà créés</h3><div class="maisonl">${[...M.sorts.map((s,i)=>["sorts",i,"✨ "+s.nom+` (niv. ${s.niveau})`]),...M.objets.map((o,i)=>["objets",i,"💍 "+o.nom]),...M.monstres.map((m,i)=>["monstres",i,"🐉 "+m.nom])].map(([k,i,l])=>`<span class="tag">${esc(l)} <button class="mini" data-adm="${k}:${i}">✕</button></span>`).join("")}</div><p class="small">Un élément retiré disparaît des listes au prochain chargement de la page.</p>`:""}</div>`;
  // sécurité
  h+=`<div class="card"><h2>Sécurité et serveur</h2>
   <p>${api?(st&&st.mdp?"🔒 <b>Mot de passe actif.</b> ":"🔓 <b>Pas de mot de passe.</b> "):""}Le mot de passe se règle dans <code>dnd/api/config.php</code> (<code>MOT_DE_PASSE</code>). Les joueurs le tapent une fois sur leur téléphone, ils restent connectés 30 jours.</p>
   <ul class="small"><li>Sur ta box à la maison : <code>ACCES = 'lan'</code> suffit, un mot de passe est un plus.</li><li>Sur un serveur : mets un mot de passe, et pour jouer à distance passe par un VPN (WireGuard, Tailscale) plutôt que d'ouvrir un port sur Internet.</li><li>Si tu l'ouvres quand même sur Internet : HTTPS obligatoire (Let's Encrypt), sinon le mot de passe circule en clair.</li></ul>
   ${api&&st&&st.mdp?`<button class="btn sec" data-ad="logout">Se déconnecter sur cet appareil</button>`:""}</div>`;
  box.innerHTML=h}
async function refresh(){if(Store.mode==="api"){try{st=await Store.api("stats")}catch(e){st=null}}await loadRows();await Maison.load();render()}
async function loadRows(){rows=null;selIds.clear();render();try{rows=Store.mode==="api"?await Store.api("rows",null,"&kind="+kind):(await Store.list(kind)).map(r=>({id:r.id,name:r.name,summary:r.summary,updated:r.updated,size:JSON.stringify(r.data||{}).length}))}catch(e){rows=[]}render()}
function dl(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
async function doExport(){busy=true;msg="Export en cours…";render();const d=new Date().toISOString().slice(0,10);
  try{if(Store.mode==="api"){const r=await Store.api("export",null,withFiles?"&fichiers=1":"");dl(`dnd-sauvegarde-${d}.json`,JSON.stringify(r));msg=`✔ Export terminé : ${Object.values(r.tables).reduce((a,t)=>a+t.length,0)} lignes${withFiles?`, ${Object.keys(r.fichiers||{}).length} image(s)`:""}.`}
    else{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^dnd-/.test(k))o[k]=localStorage.getItem(k)}
      let cloud=[];if(Store.mode==="cloud"){for(const [k] of KINDS){try{(await Store.list(k)).forEach(x=>cloud.push({kind:k,name:x.name,summary:x.summary,data:x.data}))}catch(e){}}}
      dl(`dnd-sauvegarde-${d}.json`,JSON.stringify({app:"dnd-createur",version:1,local:o,items:cloud}));msg="✔ Export du navigateur terminé."}}
  catch(e){msg="Export impossible : "+esc(e.message)}busy=false;render()}
async function doImport(file){let d;try{d=JSON.parse(await file.text())}catch(e){msg="Ce fichier n'est pas une sauvegarde valide.";return render()}
  if(!d||d.app!=="dnd-createur"){msg="Ce fichier ne vient pas de ce site.";return render()}
  busy=true;msg="Import en cours…";render();
  try{if(d.tables){if(Store.mode!=="api")throw new Error("cette sauvegarde vient de la version XAMPP : importe-la là-bas");
      const r=await Store.api("import",{mode:impMode,tables:d.tables,fichiers:d.fichiers||{}});msg=`✔ Import terminé (${r.mode}) : ${Object.entries(r.lignes).map(([t,n])=>`${n} ${TNAME[t]||t}`).join(", ")}${r.fichiers?`, ${r.fichiers} image(s)`:""}. Recharge la page pour tout voir.`}
    else{let n=0;if(d.local)Object.entries(d.local).forEach(([k,v])=>{if(/^dnd-/.test(k)&&(impMode==="remplacer"||!localStorage.getItem(k)||k==="dnd-saves")){if(k==="dnd-saves"&&impMode==="ajouter"){try{const a=JSON.parse(localStorage.getItem(k)||"[]"),b=JSON.parse(v);const ids=new Set(a.map(x=>x.id));localStorage.setItem(k,JSON.stringify(a.concat(b.filter(x=>!ids.has(x.id)))));n++;return}catch(e){}}localStorage.setItem(k,v);n++}});
      for(const it of (d.items||[])){try{await Store.save(it.kind,null,it.name,it.summary,it.data);n++}catch(e){}}
      msg=`✔ Import terminé (${n} élément(s)). Recharge la page pour tout voir.`}}
  catch(e){msg="Import impossible : "+esc(e.message)}busy=false;await refresh()}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("[data-ad],[data-adm]");if(!t||!t.closest("#adminPage"))return;
  if(t.dataset.adm){const [k,i]=t.dataset.adm.split(":");Maison.data[k].splice(+i,1);await Maison.store();render();return}
  const a=t.dataset.ad;
  if(a==="export")doExport();
  if(a==="migrer"){busy=true;render();try{const r=await Store.api("migrer_images");msg=`✔ ${r.cartes} image(s) de carte rangée(s) dans dnd/uploads.`}catch(err){msg="Échec : "+esc(err.message)}busy=false;refresh()}
  if(a==="delsel"){if(!t.dataset.ok){t.dataset.ok=1;t.textContent=`Sûr ? Re-clique pour supprimer ${selIds.size} élément(s)`;return}
    for(const id of selIds){try{await Store.remove(id,kind)}catch(err){}}msg=`✔ ${selIds.size} élément(s) supprimé(s).`;await refresh()}
  if(a==="logout"){await fetch("api/?a=logout",{method:"POST"});location.reload()}
  if(a==="loadCreas"){creas=[];try{creas=await Store.list("pnj")}catch(err){}render()}
  if(a==="addMon"){const c=creas[+$("#hmCrea").value];if(!c)return;const M=Maison.data;M.monstres=M.monstres.filter(m=>m.nom!==c.name).concat([{nom:c.name,data:c.data}]);await Maison.store();Maison.inject();toast(`« ${c.name} » ajouté aux modèles`);render()}
  if(a==="addSort"){const nom=$("#hsNom").value.trim(),desc=$("#hsDesc").value.trim();const classes=[...document.querySelectorAll("[data-hscls]:checked")].map(x=>x.dataset.hscls);
    if(!nom||!desc||!classes.length)return toast("Il faut un nom, une description et au moins une classe");
    const s={nom,niveau:+$("#hsLv").value,ecole:$("#hsEc").value,mots:$("#hsMots").value.trim(),classes,desc};const M=Maison.data;M.sorts=M.sorts.filter(x=>x.nom!==nom).concat([s]);await Maison.store();Maison.inject();toast(`Sort « ${nom} » ajouté`);render()}
  if(a==="addObj"){const nom=$("#hoNom").value.trim(),eff=$("#hoEff").value.trim();if(!nom||!eff)return toast("Il faut un nom et un effet");
    const mods={};const n=id=>+$(id).value||0;if(n("#hoAc"))mods.ac=n("#hoAc");if(n("#hoSv"))mods.save=n("#hoSv");if(n("#hoWp"))mods.weapon=n("#hoWp");const hl=$("#hoHeal").value.trim();if(hl)mods.heal=hl;
    const o={nom,type:$("#hoType").value,rarete:$("#hoRar").value,harmo:$("#hoHarmo").checked,effet:eff,mods};const M=Maison.data;M.objets=M.objets.filter(x=>x.nom!==nom).concat([o]);await Maison.store();Maison.inject();toast(`Objet « ${nom} » ajouté`);render()}});
document.addEventListener("change",e=>{const t=e.target;if(!t.closest||!t.closest("#adminPage"))return;
  if(t.name==="adKind"){kind=t.value;loadRows()}
  if(t.name==="adMode"){impMode=t.value;render()}
  if(t.id==="adFiles"){withFiles=t.checked;render()}
  if(t.id==="adImport"&&t.files[0])doImport(t.files[0]);
  if(t.id==="adAll"){selIds=t.checked?new Set(rows.map(r=>r.id)):new Set();render()}
  if(t.dataset.adsel){t.checked?selIds.add(t.dataset.adsel):selIds.delete(t.dataset.adsel);render()}});
document.addEventListener("view",e=>{if(e.detail==="admin"){render();refresh()}});
})();
