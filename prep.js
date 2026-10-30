/* ===================== Rencontres préparées (onglet Combat) =====================
   On prépare un combat à l'avance (créatures + jetons sur une carte) et on le lance d'un clic le jour J. */
(()=>{
const $=s=>document.querySelector(s);const uid=()=>Math.random().toString(36).slice(2,9);
let L=null,open=false,noPj=true,msg="";
function render(){const box=$("#rencPage");if(!box)return;const st=typeof Combat!=="undefined"?Combat.state():{list:[]};
  const foes=st.list.filter(e=>!(noPj&&e.kind==="pj"));const mp=typeof Carte!=="undefined"?Carte.map:null;
  const toks=mp?mp.tokens.filter(t=>!t.pj&&(!t.ref||foes.some(e=>e.id===t.ref))):[];
  box.innerHTML=`<div class="card"><div class="row" style="justify-content:space-between;align-items:center;flex:0"><h2 style="margin:0">Rencontres préparées</h2><button class="btn sec" data-rn="toggle">${open?"Fermer":"📋 Mes rencontres"}</button></div>
   <div class="row" style="align-items:flex-end;margin-top:8px"><label class="f"><span>Préparer le combat actuel sous le nom</span><input type="text" id="rnName" placeholder="ex. Embuscade sur la route de Mâlefort"></label>
    <div class="chk" style="flex:0;margin-bottom:10px"><label class="${noPj?"sel":""}"><input type="checkbox" id="rnNoPj" ${noPj?"checked":""}> Sans les PJ</label></div>
    <button class="btn" data-rn="save" style="flex:0;margin-bottom:10px">💾 Préparer</button></div>
   <div class="small">${foes.length} combattant(s)${mp&&mp.saveId?` · carte « ${esc(mp.name||"sans nom")} » avec ${toks.length} jeton(s)`:mp&&toks.length?" · ⚠ sauvegarde d'abord la carte pour la lier à la rencontre":""}. ${msg}</div>
   ${open?listHtml():""}</div>`}
function listHtml(){if(L===null)return `<p class="small">Chargement…</p>`;if(!L.length)return `<p class="small">Aucune rencontre préparée.</p>`;
  return `<div class="savelist" style="margin-top:8px">${L.map((r,i)=>`<div class="saveitem"><div><b>${esc(r.name)}</b><div class="small">${esc(r.summary||"")}</div></div><div class="saveact"><button class="btn" data-rn="go:${i}">▶ Lancer</button><button class="btn sec del" data-rn="del:${i}">✕</button></div></div>`).join("")}</div>`}
async function save(){const st=Combat.state();const list=st.list.filter(e=>!(noPj&&e.kind==="pj"));if(!list.length)return toast("Ajoute d'abord des créatures au combat");
  const mp=Carte.map;const ids=new Set(list.map(e=>e.id));const toks=mp.saveId?mp.tokens.filter(t=>!t.pj&&(!t.ref||ids.has(t.ref))):[];
  const name=(($("#rnName")||{}).value||"").trim()||"Rencontre du "+new Date().toLocaleDateString("fr-FR");
  const d={list:JSON.parse(JSON.stringify(list)).map(e=>Object.assign(e,{init:null})),map:mp.saveId?{id:mp.saveId,name:mp.name,tokens:JSON.parse(JSON.stringify(toks))}:null};
  const sum=`${list.length} combattant(s) : ${[...new Set(list.map(e=>e.name.replace(/\s+\d+$/,"")))].slice(0,4).join(", ")}${d.map?" · 🗺️ "+(d.map.name||"carte"):""}`;
  try{await Store.save("rencontre",null,name,sum,d);msg="✔ « "+esc(name)+" » préparée.";if(open)L=await Store.list("rencontre");render();toast("Rencontre préparée")}catch(e){toast("Sauvegarde impossible")}}
async function go(r){const d=r.data,map={};const fresh=d.list.map(e=>{const n=Object.assign({},e,{id:uid(),init:null});map[e.id]=n.id;return n});
  Combat.patch(K=>{K.list=K.list.filter(e=>e.kind==="pj").concat(fresh);K.started=false;K.turn=0;K.round=1});
  if(d.map&&d.map.id){try{const all=await Store.list("carte");const m=all.find(x=>x.id===d.map.id);
    if(m){const pjs=Carte.map.tokens.filter(t=>t.pj);const data=Object.assign({},m.data);data.tokens=(m.data.tokens||[]).filter(t=>t.pj||!t.ref).concat(d.map.tokens.filter(t=>t.ref).map(t=>Object.assign({},t,{id:uid(),ref:map[t.ref]||null})));
      Carte.load(data,m.id);if(pjs.length&&!data.tokens.some(t=>t.pj))Carte.addTokens(pjs.map(t=>Object.assign({},t)))}
    else toast("La carte liée n'existe plus : seul le combat est chargé",3500)}catch(e){}}
  toast("« "+r.name+" » lancée : lance l'initiative !",3500);msg="";render()}
document.addEventListener("click",async e=>{const t=e.target.closest&&e.target.closest("[data-rn]");if(!t)return;const [a,i]=t.dataset.rn.split(":");
  if(a==="toggle"){open=!open;if(open){L=null;render();try{L=await Store.list("rencontre")}catch(err){L=[]}}render()}
  if(a==="save")save();
  if(a==="go")go(L[+i]);
  if(a==="del"){if(!t.dataset.ok){t.dataset.ok=1;t.textContent="Sûr ?";return}await Store.remove(L[+i].id,"rencontre");L=await Store.list("rencontre");render()}});
document.addEventListener("change",e=>{if(e.target.id==="rnNoPj"){noPj=e.target.checked;render()}});
document.addEventListener("combatchange",()=>{if(location.hash==="#combat"&&!document.activeElement.closest("#rencPage"))render()});
document.addEventListener("view",e=>{if(e.detail==="combat")render()});
})();
