/* ===================== TRACKER DE COMBAT ===================== */
const Combat=(()=>{
const $=s=>document.querySelector(s);
const KIND={pj:"🛡️ PJ",ennemi:"⚔️ Ennemi",allie:"🤝 Allié",neutre:"⚖️ Neutre"};
const XPT={1:[25,50,75,100],2:[50,100,150,200],3:[75,150,225,400],4:[125,250,375,500],5:[250,500,750,1100],6:[300,600,900,1400],7:[350,750,1100,1700],8:[450,900,1400,2100],9:[550,1100,1600,2400],10:[600,1200,1900,2800]};
const DIFF=["Facile","Moyen","Difficile","Mortel"];
const mult=n=>n<=0?0:n===1?1:n===2?1.5:n<=6?2:n<=10?2.5:n<=14?3:4;
let K;try{K=JSON.parse(localStorage.getItem("dnd-combat"))}catch(e){}
if(!K||!Array.isArray(K.list))K={list:[],turn:0,round:1,started:false};
let dbT,dbLoaded=false;const persist=()=>{try{localStorage.setItem("dnd-combat",JSON.stringify(K))}catch(e){}document.dispatchEvent(new Event("combatchange"));
  if(dbLoaded&&typeof Store!=="undefined"&&Store.mode==="api"){clearTimeout(dbT);dbT=setTimeout(()=>Store.api("etat",K,"&cle=combat").catch(()=>{}),600)}};
const uid=()=>Math.random().toString(36).slice(2,9);
let picker=null; // liste de sauvegardes affichée

function fromNpc(d,n,hpMode){const out=[];const avg=Dice.avg(d.hp)||1;const ib=window.PNJ.md(+d.ab.DEX||10);
  for(let i=1;i<=n;i++){const r=hpMode==="roll"?Math.max(1,(Dice.roll(d.hp)||{tot:avg}).tot):avg;
    out.push({id:uid(),name:(d.name||"Créature")+(n>1?" "+i:""),kind:d.role||"ennemi",initBonus:ib,init:null,ac:+d.ac||10,hp:r,max:r,temp:0,cond:[],xp:window.PNJ.XP[d.cr]||0,cr:d.cr,npc:d})}
  return out}
function fromPerso(st){const keep=S;S=Object.assign(blank(),st);PB=pbFor(LV());let e=null;
  try{e={id:uid(),pid:st.saveId||null,name:S.name||"Perso",kind:"pj",initBonus:M("DEX"),init:null,ac:armorClass().v,hp:S.play&&S.play.hp!=null?S.play.hp:hp(),max:hp(),temp:0,cond:[],level:LV(),pp:10+skillTotal("Perception"),token:S.token||null,
    atk:attacks().map(a=>({n:a.n,atk:a.atk,dmg:a.dmg}))}}catch(err){}
  S=keep;PB=pbFor(LV());return e}
function add(list){list.filter(Boolean).forEach(x=>K.list.push(x));persist();render();toast(list.length+" ajouté(s) au combat")}
function difficulty(){const pjs=K.list.filter(x=>x.kind==="pj");const foes=K.list.filter(x=>x.kind==="ennemi");
  if(!pjs.length||!foes.length)return null;const th=[0,0,0,0];pjs.forEach(p=>{const t=XPT[Math.min(10,p.level||1)];t.forEach((v,i)=>th[i]+=v)});
  const base=foes.reduce((a,b)=>a+(b.xp||0),0);const adj=Math.round(base*mult(foes.length));let d="Trop facile";th.forEach((v,i)=>{if(adj>=v)d=DIFF[i]});
  return {base,adj,th,d,per:Math.round(base/pjs.length)}}
function order(){return [...K.list].sort((a,b)=>(b.init??-99)-(a.init??-99)||(b.initBonus-a.initBonus))}
function rollInit(all){K.list.forEach(x=>{if(all||x.init===null||x.init===undefined)x.init=1+Math.floor(Math.random()*20)+x.initBonus});K.turn=0;K.round=1;K.started=true;persist();render();toast("Initiative lancée !")}
function cur(){const o=order();return o[K.turn%Math.max(1,o.length)]}
function npcAttack(e,i){const a=e.npc.actions[i];if(a.kind==="autre")return toast(a.n+" : "+a.extra,4000);
  const m=window.PNJ.md(+e.npc.ab[a.ab]||10),pb=window.PNJ.pbOf(e.npc.cr);const d=1+Math.floor(Math.random()*20);const crit=d===20;
  const f=(crit?a.dice.replace(/(\d*)d(\d+)/g,(x,n,s)=>(2*(+n||1))+"d"+s):a.dice)+(m?sgn(m):"");const r=Dice.roll(f)||{tot:0,txt:""};
  {const msg=`${e.name} · ${a.n} : ${d===1?"1 naturel, raté":(d+m+pb)+" pour toucher"} (d20 = ${d})${crit?" CRITIQUE !":""} · ${r.tot} dégâts ${a.dtype}`;toast(msg,4500);publicRoll(msg)}}
function pjAttack(e,i){const a=e.atk[i];const f=(a.dmg.match(/^[\dd+\-]+/)||[""])[0];if(a.atk.startsWith("DD")){const r=Dice.roll(f);return toast(`${e.name} · ${a.n} : ${a.atk}, ${r?r.tot:"?"} dégâts`,4000)}
  const d=1+Math.floor(Math.random()*20),b=parseInt(a.atk);const r=Dice.roll(d===20?f.replace(/(\d*)d(\d+)/g,(x,n,s)=>(2*(+n||1))+"d"+s):f);{const msg=`${e.name} · ${a.n} : ${d+b} pour toucher (d20 = ${d})${d===20?" CRITIQUE !":""} · ${r?r.tot:"?"} dégâts`;toast(msg,4500);publicRoll(msg)}}

function render(){const box=$("#combatPage");if(!box)return;const o=order();const c=K.started?cur():null;const df=difficulty();
  let h=`<div class="card"><div class="chead"><div><h2 style="margin:0">Round ${K.round}</h2><div class="small">${c?"Au tour de : <b>"+esc(c.name)+"</b>":"Ajoute les combattants puis lance l'initiative."}</div></div>
    <div class="cbtns"><button class="btn sec" data-c="prev">◀ Tour précédent</button><button class="btn" data-c="next">Tour suivant ▶</button><button class="btn sec" data-c="init">🎲 Initiative (manquantes)</button><button class="btn sec" data-c="initall">🎲 Tout relancer</button><button class="btn sec del" data-c="clear">Vider</button></div></div>
    ${df?`<div class="hint" style="margin-top:10px">Difficulté de la rencontre : <b>${df.d}</b> · ${df.base} PX (ajusté ${df.adj}) · seuils du groupe : facile ${df.th[0]}, moyen ${df.th[1]}, difficile ${df.th[2]}, mortel ${df.th[3]} · <b>${df.per} PX par joueur</b> à la victoire</div>`:""}</div>`;
  h+=`<div class="ctable">${o.length?o.map((e,i)=>{const on=c&&c.id===e.id;const pct=Math.max(0,Math.min(100,100*e.hp/Math.max(1,e.max)));const dead=e.hp<=0;
    return `<div class="crow ${e.kind} ${on?"cur":""} ${dead?"dead":""}">
     <div class="cinit"><input type="number" data-ce="${e.id}:init" value="${e.init??""}" placeholder="init" title="Initiative"><div class="small">${sgn(e.initBonus)}</div></div>
     <div class="cname"><b>${esc(e.name)}</b> <span class="small">${KIND[e.kind]||""}${e.cr?" · FP "+e.cr:""}${e.level?" · niv. "+e.level:""}${e.pp?" · PP "+e.pp:""}</span>
       <div class="hpbar sm"><div style="width:${pct}%;background:${pct>50?"var(--amber)":pct>20?"var(--gold)":"var(--red)"}"></div><span>${e.hp} / ${e.max}${e.temp?" (+"+e.temp+")":""}${dead?(e.kind==="pj"?" · à terre !":" · vaincu"):""}</span></div>
       <div class="chk" style="margin-top:4px">${e.cond.map(x=>`<span class="tag cond" data-cdel="${e.id}:${esc(x)}" title="Retirer">${esc(x)} ✕</span>`).join("")}
         <select data-cadd="${e.id}" style="width:auto;font-size:.8rem;padding:2px 6px"><option value="">+ état</option>${CONDITIONS.map(x=>`<option>${x}</option>`).join("")}</select></div>
       ${(e.npc&&e.npc.actions||[]).length?`<div class="chk" style="margin-top:4px">${e.npc.actions.map((a,k)=>`<button class="mini" data-catk="${e.id}:${k}">🎲 ${esc(a.n)}</button>`).join("")}</div>`:""}
       ${(e.atk||[]).length?`<div class="chk" style="margin-top:4px">${e.atk.map((a,k)=>`<button class="mini" data-cpatk="${e.id}:${k}">🎲 ${esc(a.n)}</button>`).join("")}</div>`:""}</div>
     <div class="cac"><small>CA</small><b>${e.ac}</b></div>
     <div class="chp"><input type="number" min="0" data-camt="${e.id}" placeholder="PV"><div class="cbtns" style="justify-content:flex-start;flex-wrap:nowrap;gap:4px"><button class="mini" data-chp="${e.id}:dmg">− dégâts</button><button class="mini" data-chp="${e.id}:heal">+ soins</button></div></div>
     <button class="btn sec del" data-cdelrow="${e.id}" title="Retirer du combat">✕</button></div>`}).join(""):`<div class="card small">Aucun combattant pour l'instant.</div>`}</div>`;
  // ajout
  h+=`<div class="card"><h2>Ajouter des combattants</h2><div class="row" style="flex:0;flex-wrap:wrap"><button class="btn sec" data-c="me">+ Mon perso actuel</button><button class="btn sec" data-c="pickP">+ Depuis mes persos</button><button class="btn sec" data-c="pickN">+ Depuis mes créatures</button><button class="btn sec" data-c="pickG">+ Le groupe</button></div>
    <div class="row" style="margin-top:10px;align-items:flex-end"><label class="f"><span>Modèle de créature</span><select id="cTpl">${Object.keys(window.PNJ.TEMPLATES).map(k=>`<option>${esc(k)}</option>`).join("")}</select></label>
      <label class="f" style="max-width:110px"><span>Combien</span><input type="number" id="cQty" value="1" min="1" max="20"></label>
      <label class="f" style="max-width:170px"><span>PV</span><select id="cHpMode"><option value="avg">Moyenne</option><option value="roll">Lancés aux dés</option></select></label>
      <button class="btn" data-c="tpl" style="margin-bottom:10px">Ajouter</button></div>
    <details><summary class="small" style="cursor:pointer">Ajout rapide à la main</summary><div class="row" style="align-items:flex-end;margin-top:6px">
      <label class="f"><span>Nom</span><input type="text" id="mName"></label><label class="f" style="max-width:110px"><span>Bonus init</span><input type="number" id="mInit" value="0"></label>
      <label class="f" style="max-width:90px"><span>CA</span><input type="number" id="mAc" value="12"></label><label class="f" style="max-width:90px"><span>PV</span><input type="number" id="mHp" value="10"></label>
      <label class="f" style="max-width:140px"><span>Camp</span><select id="mKind">${Object.entries(KIND).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label>
      <button class="btn sec" data-c="manual" style="margin-bottom:10px">Ajouter</button></div></details>
    <div id="cPicker">${picker?pickerHtml():""}</div></div>`;
  box.innerHTML=h;persist()}
function pickerHtml(){if(picker.items===null)return `<p class="small">Chargement…</p>`;if(!picker.items.length)return `<p class="small">${picker.kind==="groupe"?"Personne n'a encore partagé de perso dans l'onglet Groupe.":"Aucune sauvegarde."}</p>`;
  return `<div class="savelist">${picker.items.map((it,i)=>`<div class="saveitem"><div><b>${esc(it.name)}</b><div class="small">${esc(it.summary||"")}</div></div><div class="saveact">${picker.kind==="pnj"?`<input type="number" value="1" min="1" max="20" id="pq${i}" style="width:60px">`:""}<button class="btn sec" data-pick="${i}">Ajouter</button></div></div>`).join("")}</div>`}
async function openPicker(kind){picker={kind,items:null};render();
  if(kind==="groupe"){picker.items=window.Groupe?await window.Groupe.list():[];}else picker.items=await Store.list(kind);render()}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#combatPage"))return;let x,v;
  const ent=id=>K.list.find(z=>z.id===id);
  if(x=t.closest("[data-c]")){v=x.dataset.c;
    if(v==="next"){if(!K.list.length)return;if(!K.started)return rollInit(false);for(let g=0;g<K.list.length;g++){K.turn++;if(K.turn>=K.list.length){K.turn=0;K.round++}const z=cur();if(!(z.hp<=0&&z.kind!=="pj"))break}const c=cur();
      if(c&&c.cond.length)toast(c.name+" : "+c.cond.join(", "),3000);render()}
    if(v==="prev"){if(K.turn>0)K.turn--;else if(K.round>1){K.round--;K.turn=K.list.length-1}render()}
    if(v==="init")rollInit(false);if(v==="initall")rollInit(true);
    if(v==="clear"){if(!x.dataset.ok){x.dataset.ok=1;x.textContent="Sûr ?";return}K={list:[],turn:0,round:1,started:false};picker=null;render()}
    if(v==="me"){if(!S.race||!S.cls)return toast("Crée d'abord un perso dans l'onglet Personnages");add([fromPerso(JSON.parse(JSON.stringify(S)))])}
    if(v==="pickP")openPicker("perso");if(v==="pickN")openPicker("pnj");if(v==="pickG")openPicker("groupe");
    if(v==="tpl"){const k=$("#cTpl").value;add(fromNpc(window.PNJ.TEMPLATES[k],Math.max(1,Math.min(20,+$("#cQty").value||1)),$("#cHpMode").value))}
    if(v==="manual"){const n=$("#mName").value||"Combattant";const hpv=Math.max(1,+$("#mHp").value||1);add([{id:uid(),name:n,kind:$("#mKind").value,initBonus:+$("#mInit").value||0,init:null,ac:+$("#mAc").value||10,hp:hpv,max:hpv,temp:0,cond:[],xp:0}])}
    return}
  if(x=t.closest("[data-pick]")){const i=+x.dataset.pick,it=picker.items[i];
    if(picker.kind==="pnj")add(fromNpc(it.data,Math.max(1,+(document.getElementById("pq"+i)||{}).value||1),$("#cHpMode")?$("#cHpMode").value:"avg"));
    else if(picker.kind==="perso")add([fromPerso(Object.assign({},it.data,{saveId:it.id}))]);
    else add([{id:uid(),pid:Store.mode==="api"&&/^db/.test(it.id||"")?it.id:null,name:it.name,kind:"pj",initBonus:it.initBonus||0,init:null,ac:it.ac||10,hp:it.hpCur??it.hp??10,max:it.hp||10,temp:0,cond:[],level:it.level||1,pp:it.pp}]);return}
  if(x=t.closest("[data-chp]")){const [id,k]=x.dataset.chp.split(":");const e2=ent(id);const n=Math.max(0,+(document.querySelector(`[data-camt="${id}"]`).value)||0);if(!n)return toast("Entre un nombre de PV");
    if(k==="dmg"){let d=n;if(e2.temp){const a=Math.min(e2.temp,d);e2.temp-=a;d-=a}e2.hp=Math.max(0,e2.hp-d);if(e2.hp===0)toast(e2.name+(e2.kind==="pj"?" tombe à 0 PV !":" est vaincu !"),3000)}else e2.hp=Math.min(e2.max,e2.hp+n);if(e2.pid&&Store.mode==="api")Store.api("etat",{hp:e2.hp,temp:e2.temp||0,at:Date.now()},"&cle=pjdm_"+e2.pid).catch(()=>{});render();return}
  if(x=t.closest("[data-cdel]")){const [id,c]=x.dataset.cdel.split(/:(.*)/);const e2=ent(id);e2.cond=e2.cond.filter(z=>z!==c);render();return}
  if(x=t.closest("[data-cdelrow]")){const o=order(),c=K.started?cur():null;K.list=K.list.filter(z=>z.id!==x.dataset.cdelrow);if(c&&c.id===x.dataset.cdelrow&&K.turn>=K.list.length)K.turn=0;render();return}
  if(x=t.closest("[data-catk]")){const [id,k]=x.dataset.catk.split(":");npcAttack(ent(id),+k);return}
  if(x=t.closest("[data-cpatk]")){const [id,k]=x.dataset.cpatk.split(":");pjAttack(ent(id),+k);return}
});
document.addEventListener("change",e=>{const t=e.target;if(!t.closest||!t.closest("#combatPage"))return;
  if(t.dataset.ce){const [id,f]=t.dataset.ce.split(":");const x=K.list.find(z=>z.id===id);x[f]=t.value===""?null:+t.value;render()}
  if(t.dataset.cadd&&t.value){const x=K.list.find(z=>z.id===t.dataset.cadd);if(!x.cond.includes(t.value))x.cond.push(t.value);render()}});
document.addEventListener("view",e=>{if(e.detail==="combat")render()});
return {patch:f=>{f(K);persist();render()},add,fromNpc,fromPerso,difficulty,XPT,mult,DIFF,render,state:()=>({list:K.list,current:K.started?(cur()||{}).id:null,round:K.round}),setState:k=>{dbLoaded=true;if(!k||!Array.isArray(k.list)){if(K.list.length)persist();return}K=Object.assign({list:[],turn:0,round:1,started:false},k);try{localStorage.setItem("dnd-combat",JSON.stringify(K))}catch(e){}render()}};
})();
