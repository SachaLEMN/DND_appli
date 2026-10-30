/* ===================== PASSAGE DE NIVEAU ===================== */
(()=>{
let LU=null; // {before, from, to}
function snapshot(){return {hp:hp(),pb:PB,feats:featList().map(f=>f[1]),slots:spellInfo()?spellInfo().slots:"—",si:spellInfo(),
  cant:spellInfo()?spellInfo().cant:0,known:spellInfo()?spellInfo().known:0,prep:spellInfo()?spellInfo().prep:0,book:spellInfo()?spellInfo().book:0}}
function todo(){const out=[];const e1=validate(1);if(e1)out.push([1,e1]);const e4=validate(4);if(e4)out.push([4,e4]);
  if(stepVisible(6)){const e6=validate(6);if(e6)out.push([6,e6])}return out}
function panel(){if(!LU)return "";const c=C();const now=snapshot();const b=LU.before;
  const newFeats=now.feats.filter(f=>!b.feats.includes(f));const t=todo();
  const avg=c.hd/2+1,con=M("CON");const rolled=S.hpRolls&&S.hpRolls[LU.to];
  let h=`<div class="card lvup"><h2>⬆️ ${esc(S.name||"Ton perso")} passe au niveau ${LU.to} !</h2>
   <div class="stat3"><div><small>PV max</small><span class="big">${b.hp} → ${now.hp}</span></div>${now.pb!==b.pb?`<div><small>Bonus de maîtrise</small><span class="big">+${b.pb} → +${now.pb}</span></div>`:""}<div><small>Dés de vie</small><span class="big">${LU.to}d${c.hd}</span></div>${now.si?`<div><small>Emplacements</small><span style="font-size:.95rem">${esc(now.slots)}</span></div>`:""}</div>
   <div class="row" style="margin-top:10px;align-items:center"><div class="small" style="flex:2">PV gagnés : <b>${rolled?"lancé "+rolled:"moyenne "+avg}</b> ${sgn(con)} (CON)${S.race==="Nain des collines"?" +1 (nain)":""}${S.sub==="Lignée draconique"?" +1 (draconique)":""}.</div>
     <div class="cbtns" style="flex:1"><button class="btn sec" data-lu="avg">Prendre la moyenne (${avg})</button><button class="btn sec" data-lu="roll">🎲 Lancer 1d${c.hd}</button></div></div>
   ${newFeats.length?`<h3 style="margin-top:12px">Nouveautés</h3><ul class="tight">${newFeats.map(f=>`<li>${esc(f)}</li>`).join("")}</ul>`:""}
   ${now.si&&(now.cant>b.cant||now.known>b.known||now.prep!==b.prep||now.book>b.book||!b.si)?`<div class="hint">Magie : ${[now.cant>b.cant?`+${now.cant-b.cant} tour de magie`:"",now.known>b.known?`+${now.known-(b.known||0)} sort(s) connu(s)`:"",now.book>b.book?`+${now.book-(b.book||0)} sorts dans le grimoire`:"",now.prep!==b.prep?`${now.prep} sorts à préparer`:"",now.si.max>(b.si?b.si.max:0)?`accès aux sorts de niveau ${now.si.max}`:""].filter(Boolean).join(" · ")}</div>`:""}
   <h3 style="margin-top:12px">${t.length?"À choisir":"Tout est prêt"}</h3>
   ${t.length?`<ul class="tight">${t.map(([st,msg])=>`<li>${esc(msg)} <button class="mini" data-lu="go:${st}">Y aller (étape ${st+1})</button></li>`).join("")}</ul>`:`<p class="small">Aucun choix à faire pour ce niveau.</p>`}
   <div class="cbtns" style="justify-content:flex-start;margin-top:10px"><button class="btn" data-lu="done" ${t.length?"disabled title='Fais d&apos;abord les choix ci-dessus'":""}>✔ Terminer${S.saveId?" et sauvegarder":""}</button><button class="btn sec del" data-lu="cancel">Annuler le passage de niveau</button></div></div>`;
  return h}
// le panneau s'affiche en haut de chaque étape tant que le passage n'est pas terminé
const _render=render;
window.render=function(){_render();if(LU){const pg=document.getElementById("page");pg.insertAdjacentHTML("afterbegin",panel())}};
document.addEventListener("click",async e=>{const t=e.target;const b=t.closest&&t.closest("[data-lvup],[data-lu]");if(!b)return;e.stopPropagation();
  if(b.dataset.lvup){if(LV()>=MAXLV)return;PB=pbFor(LV());LU={before:snapshot(),from:LV(),to:LV()+1,snap:JSON.stringify(S)};S.level=LU.to;S.hpRolls=S.hpRolls||{};delete S.hpRolls[LU.to];
    if(S.asi&&LU.to===4)S.asi=[null,null];render();window.scrollTo(0,0);return}
  const v=b.dataset.lu;
  if(v==="roll"){const r=1+Math.floor(Math.random()*C().hd);S.hpRolls[LU.to]=r;toast(`1d${C().hd} = ${r}`);render();return}
  if(v==="avg"){delete S.hpRolls[LU.to];render();return}
  if(v.startsWith("go:")){go(+v.slice(3));return}
  if(v==="cancel"){S=Object.assign(blank(),JSON.parse(LU.snap));LU=null;render();toast("Passage de niveau annulé");return}
  if(v==="done"){const gain=hp()-LU.before.hp;if(S.play){S.play.hp=Math.min(hp(),(S.play.hp??LU.before.hp)+gain)}const to=LU.to;LU=null;
    if(S.saveId){try{const r=await Store.save("perso",S.saveId,S.name,persoSummary(),JSON.parse(JSON.stringify(Object.assign({},S,{confirmReset:false}))));S.saveId=r.id}catch(err){}}
    S.step=8;render();window.scrollTo(0,0);toast(`Niveau ${to} ! +${gain} PV max${S.saveId?" · sauvegardé":""}`,3500)}
},true);
})();
