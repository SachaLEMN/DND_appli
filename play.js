/* ===================== FICHE DE JEU VIVANTE (étape « En partie ») ===================== */
const CONDITIONS=["À terre","Agrippé","Assourdi","Aveuglé","Charmé","Effrayé","Empoisonné","Entravé","Étourdi","Inconscient","Invisible","Neutralisé","Paralysé","Pétrifié","Épuisé","Concentration"];
function resources(){const l=LV(),c=S.cls,out=[];const m=a=>M(a);
  if(c==="Barbare")out.push(["rage","Rage",l>=3?3:2,"long"]);
  if(c==="Barde")out.push(["insp","Inspiration bardique ("+(l>=5?"d8":"d6")+")",Math.max(1,m("CHA")),l>=5?"court":"long"]);
  if(c==="Clerc"&&l>=2)out.push(["chan","Canalisation divine",1,"court"]);
  if(c==="Paladin"){out.push(["sens","Sens divin",1+Math.max(0,m("CHA")),"long"],["lay","Imposition des mains (PV)",5*l,"long","pool"]);if(l>=3)out.push(["chan","Canalisation divine",1,"court"])}
  if(c==="Druide"&&l>=2)out.push(["wild","Forme sauvage",2,"court"]);
  if(c==="Guerrier"){out.push(["wind","Second souffle",1,"court"]);if(l>=2)out.push(["surge","Fougue",1,"court"])}
  if(c==="Moine"&&l>=2)out.push(["ki","Points de ki",l,"court"]);
  if(c==="Ensorceleur"&&l>=2)out.push(["sorc","Points de sorcellerie",l,"long"]);
  if(c==="Magicien")out.push(["arec","Restauration arcanique",1,"long"]);
  if(S.race==="Drakéide")out.push(["breath","Souffle draconique",1,"court"]);
  if(S.race==="Demi-orc")out.push(["endur","Endurance implacable",1,"long"]);
  if(S.sub==="Magie sauvage")out.push(["tides","Marées du chaos",1,"long"]);
  return out}
function P(){if(!S.play){const b=S.bg?BGS[S.bg]:null;
  S.play={hp:null,temp:0,slots:[0,0,0],hd:0,money:{pc:0,pa:0,pe:0,po:b?b.po:0,pp:0},inv:null,cond:[],death:{s:0,f:0},insp:false,notes:"",res:{},mode:"norm",log:[]}}
  const p=S.play;if(p.hp===null||p.hp>hp())p.hp=hp();
  if(!p.inv){p.inv=[];chosenItems().forEach(it=>{const n=it.p?PACKS[it.p][0]:it.w?it.w:itemLabel(it).replace(/&amp;/g,"&");if(n)p.inv.push({n,q:it.q||1})});if(S.bg)BGS[S.bg].eq.forEach(n=>p.inv.push({n,q:1}))}
  return p}
function logRoll(txt){const p=P();p.log.unshift(txt);p.log=p.log.slice(0,12);toast(txt,3500);publicRoll((S.name?S.name+" · ":"")+txt)}
function pPlay(){
  if(!S.race||!S.cls||!S.bg)return `<div class="card">Termine d'abord la création du perso.</div>`;
  const p=P(),mx=hp(),ac=armorClass(),si=spellInfo(),c=C();
  const pct=Math.max(0,Math.min(100,100*p.hp/mx));
  const modeBtn=(k,l)=>`<label class="${p.mode===k?"sel":""}"><input type="radio" name="pmode" value="${k}" ${p.mode===k?"checked":""}>${l}</label>`;
  let h=`<div class="card play-top"><div class="row" style="align-items:center">
    <div style="flex:2;min-width:240px"><h2 style="margin-bottom:4px">${esc(S.name||"Sans nom")} <span class="small">· ${S.cls} ${LV()}</span> ${LV()<MAXLV?`<button class="mini" data-lvup="1">⬆️ Niveau ${LV()+1}</button>`:""}</h2>
      <div class="hpbar"><div style="width:${pct}%;background:${pct>50?"var(--amber)":pct>20?"var(--gold)":"var(--red)"}"></div><span>${p.hp} / ${mx} PV${p.temp?` (+${p.temp} temp.)`:""}</span></div>
      <div class="row" style="margin-top:8px;flex-wrap:nowrap"><input type="number" id="hpAmt" placeholder="nombre" min="0" style="max-width:110px"><button class="btn" data-hp="dmg" style="background:linear-gradient(#b44a35,#8c2b1e);border-color:#6d2015">− Dégâts</button><button class="btn" data-hp="heal">+ Soins</button><button class="btn sec" data-hp="temp">PV temp.</button></div></div>
    <div class="stat3" style="flex:1;min-width:260px"><div><small>CA</small><span class="big">${ac.v}</span></div><div class="rollable" data-proll="init"><small>Initiative 🎲</small><span class="big">${sgn(M("DEX"))}</span></div><div><small>Vitesse</small><span class="big" style="font-size:1rem">${R().spd}</span></div><div class="rollable ${p.insp?"on":""}" data-pinsp="1"><small>Inspiration</small><span class="big">${p.insp?"★":"☆"}</span></div></div></div>
    ${p.hp<=0?`<div class="hint" style="border-color:var(--red);background:var(--redbg);margin-top:10px"><b>À 0 PV : jets de sauvegarde contre la mort</b> — <button class="mini" data-proll="death">🎲 Lancer</button>
      Réussites ${[0,1,2].map(i=>`<input type="checkbox" data-death="s${i}" ${p.death.s>i?"checked":""}>`).join("")} · Échecs ${[0,1,2].map(i=>`<input type="checkbox" data-death="f${i}" ${p.death.f>i?"checked":""}>`).join("")}</div>`:""}
    <div class="chk" style="margin-top:10px"><span class="small" style="align-self:center">Jets :</span>${modeBtn("norm","Normal")}${modeBtn("adv","Avantage")}${modeBtn("dis","Désavantage")}
      <button class="btn sec" data-rest="short" style="margin-left:auto">☕ Repos court</button><button class="btn sec" data-rest="long">🌙 Repos long</button></div></div>`;
  // jets
  h+=`<div class="recgrid"><div class="card"><h3>Caractéristiques et sauvegardes <span class="small">(clic = jet)</span></h3><table class="rec"><tr><th></th><th>Test</th><th>Sauvegarde</th></tr>${AB.map(a=>{const sv=saveBonus(a);return `<tr><td>${ABN[a]} <b>${score(a)}</b></td><td><button class="mini" data-proll="ab:${a}">${sgn(M(a))}</button></td><td><button class="mini ${c.saves.includes(a)?"prof":""}" data-proll="sv:${a}">${sgn(sv)}</button></td></tr>`}).join("")}</table></div>
    <div class="card"><h3>Compétences <span class="small">(clic = jet)</span></h3><div class="chk">${SKILLS.map(([s,a])=>`<button class="mini ${allSkills().has(s)?"prof":""}" data-proll="sk:${s}">${s} ${sgn(skillTotal(s))}</button>`).join("")}</div>
      <div class="small" style="margin-top:6px">Perception passive : ${10+skillTotal("Perception")}</div></div></div>`;
  h+=`<div class="card"><h3>Attaques <span class="small">(clic = toucher + dégâts)</span></h3><div class="chk">${attacks().map((a,i)=>`<button class="mini atkb" data-proll="atk:${i}"><b>${esc(a.n)}</b> ${esc(a.atk)} · ${esc(a.dmg)}</button>`).join("")}</div></div>`;
  // magie + ressources
  if(si||resources().length){h+=`<div class="recgrid">`;
    if(si){h+=`<div class="card"><h3>Emplacements de sorts <span class="small">(coche = utilisé)</span></h3><div class="small">DD ${si.dc} · attaque de sort ${si.atk}</div>${si.slotsArr.map((n,i)=>n?`<div class="slotrow"><b>Niv. ${i+1}</b> ${Array.from({length:n},(_,k)=>`<input type="checkbox" data-slot="${i}:${k}" ${(p.slots[i]||0)>k?"checked":""}>`).join("")}</div>`:"").join("")}
      <div class="small" style="margin-top:6px">Sorts : ${esc([...S.cants,...(si.book?S.prepared:si.known?S.spells:domSpells().concat(S.prepared))].join(", ")||"—")}</div></div>`}
    if(resources().length){h+=`<div class="card"><h3>Capacités à usage limité</h3>${resources().map(([k,n,mx,rest,pool])=>{const used=p.res[k]||0;
      return pool?`<div class="slotrow"><b>${n}</b> <input type="number" data-respool="${k}" value="${mx-used}" min="0" max="${mx}" style="width:80px"> / ${mx} <span class="small">(repos ${rest})</span></div>`
      :`<div class="slotrow"><b>${n}</b> ${Array.from({length:mx},(_,i)=>`<input type="checkbox" data-res="${k}:${i}" ${used>i?"checked":""}>`).join("")} <span class="small">(repos ${rest})</span></div>`}).join("")}
      <div class="slotrow"><b>Dés de vie (${LV()}d${c.hd})</b> ${LV()-p.hd} restant(s) <button class="mini" data-hdroll="1" ${LV()-p.hd<=0?"disabled":""}>🎲 Dépenser 1 dé (repos court)</button></div></div>`}
    h+=`</div>`}
  else h+=`<div class="card"><div class="slotrow"><b>Dés de vie (${LV()}d${c.hd})</b> ${LV()-p.hd} restant(s) <button class="mini" data-hdroll="1" ${LV()-p.hd<=0?"disabled":""}>🎲 Dépenser 1 dé (repos court)</button></div></div>`;
  // états
  h+=`<div class="card"><h3>États</h3><div class="chk">${CONDITIONS.map(x=>`<label class="${p.cond.includes(x)?"sel":""}"><input type="checkbox" data-cond="${x}" ${p.cond.includes(x)?"checked":""}>${x}</label>`).join("")}</div></div>`;
  // argent + inventaire
  h+=`<div class="recgrid"><div class="card"><h3>Bourse</h3><div class="row">${[["pp","Platine"],["po","Or"],["pe","Électrum"],["pa","Argent"],["pc","Cuivre"]].map(([k,l])=>`<label class="f"><span>${l} (${k})</span><input type="number" min="0" data-money="${k}" value="${p.money[k]}"></label>`).join("")}</div>
     <div class="small">1 po = 10 pa = 100 pc · 1 pp = 10 po · 1 pe = 5 pa</div></div>
    <div class="card"><h3>Inventaire</h3>${p.inv.map((it,i)=>`<div class="invrow"><input type="number" min="0" data-invq="${i}" value="${it.q}" style="width:64px"><input type="text" data-invn="${i}" value="${esc(it.n)}"><button class="btn sec del" data-invdel="${i}">✕</button></div>`).join("")}
     <button class="btn sec" data-invadd="1" style="margin-top:6px">+ Ajouter un objet</button></div></div>`;
  h+=`<div class="card"><h3>Notes de partie</h3><textarea data-pnotes="1" placeholder="PNJ rencontrés, quêtes, indices…">${esc(p.notes)}</textarea></div>`;
  if(p.log.length)h+=`<div class="card"><h3>Derniers jets</h3><ul class="tight">${p.log.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`;
  return h}
function doRoll(k){const p=P(),c=C();const mode=p.mode;
  const roll=(label,bon)=>{const d=Dice.d20(mode);logRoll(`${label} : ${d.v+bon} (d20 ${d.txt} ${sgn(bon)})${d.v===20?" — 20 naturel !":d.v===1?" — 1 naturel…":""}`)};
  if(k==="init")return roll("Initiative",M("DEX"));
  if(k==="death"){const d=1+Math.floor(Math.random()*20);if(d===20){p.hp=1;p.death={s:0,f:0};logRoll("Jet contre la mort : 20 ! Tu reviens à 1 PV")}
    else if(d===1){p.death.f=Math.min(3,p.death.f+2);logRoll("Jet contre la mort : 1… deux échecs")}else if(d>=10){p.death.s=Math.min(3,p.death.s+1);logRoll(`Jet contre la mort : ${d}, réussite`)}else{p.death.f=Math.min(3,p.death.f+1);logRoll(`Jet contre la mort : ${d}, échec`)}
    if(p.death.s>=3)toast("3 réussites : tu es stabilisé !",3500);if(p.death.f>=3)toast("3 échecs… ton perso meurt.",3500);return}
  const [t,v]=k.split(/:(.*)/);
  if(t==="ab")return roll("Test de "+ABN[v],M(v));
  if(t==="sv")return roll("Sauvegarde de "+ABN[v],saveBonus(v));
  if(t==="sk")return roll(v,skillTotal(v));
  if(t==="atk"){const a=attacks()[+v];const f=(a.dmg.match(/^[\dd+\-]+/)||[""])[0];
    if(a.atk.startsWith("DD")){const r=Dice.roll(f);return logRoll(`${a.n} : ${a.atk}, ${r?r.tot:"?"} dégâts ${r?r.txt:""}`)}
    const bon=parseInt(a.atk);const d=Dice.d20(mode);const crit=d.v===20||(d.v===19&&S.sub2==="Champion");
    const ff=crit?f.replace(/(\d*)d(\d+)/g,(m,n,s)=>(2*(+n||1))+"d"+s):f;const r=Dice.roll(ff);
    logRoll(`${a.n} : ${d.v===1?"1 naturel, raté":(d.v+bon)+" pour toucher"} (d20 ${d.txt})${crit?" CRITIQUE !":""} · ${r?r.tot:"?"} dégâts ${r?r.txt:""}`)}}
function playClick(e){const t=e.target;const el=s=>t.closest(s);const p=S.play;if(!p)return false;let x;
  if(x=el("[data-proll]")){doRoll(x.dataset.proll);rerenderKeep();return true}
  if(x=el("[data-pinsp]")){p.insp=!p.insp;rerenderKeep();return true}
  if(x=el("[data-hp]")){const n=Math.max(0,parseInt($("#hpAmt").value)||0);if(!n){toast("Entre un nombre de PV");return true}
    if(x.dataset.hp==="dmg"){let d=n;if(p.temp){const a=Math.min(p.temp,d);p.temp-=a;d-=a}p.hp=Math.max(0,p.hp-d);if(p.hp===0)toast("0 PV : jets contre la mort !",3000)}
    else if(x.dataset.hp==="heal"){if(p.hp===0)p.death={s:0,f:0};p.hp=Math.min(hp(),p.hp+n)}else p.temp=Math.max(p.temp,n);rerenderKeep();return true}
  if(x=el("[data-rest]")){if(x.dataset.rest==="long"){p.hp=hp();p.temp=0;p.slots=[0,0,0];p.res={};p.hd=Math.max(0,p.hd-Math.max(1,Math.floor(LV()/2)));p.death={s:0,f:0};toast("Repos long : PV, emplacements et capacités récupérés")}
    else{resources().forEach(([k,,,rest])=>{if(rest==="court")delete p.res[k]});if(S.cls==="Occultiste")p.slots=[0,0,0];toast("Repos court : capacités « repos court » récupérées. Dépense tes dés de vie si besoin.",3500)}rerenderKeep();return true}
  if(x=el("[data-hdroll]")){const r=Dice.roll("1d"+C().hd);const g=Math.max(0,r.tot+M("CON"));p.hd++;p.hp=Math.min(hp(),p.hp+g);logRoll(`Dé de vie : +${g} PV (${r.txt} ${sgn(M("CON"))})`);rerenderKeep();return true}
  if(x=el("[data-invadd]")){p.inv.push({n:"",q:1});rerenderKeep();return true}
  if(x=el("[data-invdel]")){p.inv.splice(+x.dataset.invdel,1);rerenderKeep();return true}
  return false}
function playChange(t){const p=S.play;if(!p)return false;
  if(t.name==="pmode"){p.mode=t.value;rerenderKeep();return true}
  if(t.dataset.slot){const [i,k]=t.dataset.slot.split(":").map(Number);p.slots[i]=t.checked?k+1:k;rerenderKeep();return true}
  if(t.dataset.res){const [k,i]=t.dataset.res.split(":");p.res[k]=t.checked?+i+1:+i;rerenderKeep();return true}
  if(t.dataset.respool){const r=resources().find(x=>x[0]===t.dataset.respool);p.res[r[0]]=Math.max(0,r[2]-Math.max(0,Math.min(r[2],+t.value||0)));save();return true}
  if(t.dataset.cond){const i=p.cond.indexOf(t.dataset.cond);if(i>=0)p.cond.splice(i,1);else p.cond.push(t.dataset.cond);rerenderKeep();return true}
  if(t.dataset.death){const k=t.dataset.death[0],i=+t.dataset.death[1];p.death[k]=t.checked?i+1:i;rerenderKeep();return true}
  if(t.dataset.money){p.money[t.dataset.money]=Math.max(0,+t.value||0);save();return true}
  if(t.dataset.invq!==undefined){p.inv[+t.dataset.invq].q=Math.max(0,+t.value||0);save();return true}
  if(t.dataset.invn!==undefined){p.inv[+t.dataset.invn].n=t.value;save();return true}
  if(t.dataset.pnotes){p.notes=t.value;save();return true}
  return false}
function rerenderKeep(){const y=window.scrollY;render();window.scrollTo(0,y)}
document.addEventListener("click",e=>{if(S.step!==9||e.target.closest("[data-lvup],[data-lu]"))return;if(playClick(e))e.stopPropagation()},true);
document.addEventListener("change",e=>{if(S.step!==9||!S.play)return;if(playChange(e.target))e.stopImmediatePropagation()},true);
document.addEventListener("input",e=>{if(S.step!==9||!S.play)return;const t=e.target;if(t.dataset.pnotes||t.dataset.invn!==undefined||t.dataset.money||t.dataset.invq!==undefined){playChange(t);e.stopImmediatePropagation()}},true);
