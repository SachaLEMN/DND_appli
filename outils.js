/* ===================== OUTILS DU MJ : dés, rencontres, PNJ rapide, butin ===================== */
(()=>{
const $=s=>document.querySelector(s);
const pick=a=>a[Math.floor(Math.random()*a.length)];
let O;try{O=JSON.parse(localStorage.getItem("dnd-outils"))}catch(e){}
O=Object.assign({hist:[],mode:"norm",qty:1,mod:0,enc:{n:4,lv:1,diff:1,theme:"mixte"},encRes:null,npc:null,loot:null,lootCr:"0-4",lootType:"ind"},O||{});
const persist=()=>{try{localStorage.setItem("dnd-outils",JSON.stringify(O))}catch(e){}};

/* ---------- PNJ rapide ---------- */
const NAMES={
 "Humain":{m:["Aldric","Bertrand","Corvin","Dorian","Edmond","Gauvain","Hugues","Lothaire","Mathis","Renaud","Thibault","Yvain"],f:["Adèle","Brunehaut","Clémence","Éléonore","Gisèle","Héloïse","Isaure","Margot","Ombeline","Roseline","Sibylle","Yolande"],n:["Lebrun","Duval","Fléchard","Montfort","Rochebrune","Vasseur","Courtil","Maréchal"]},
 "Elfe":{m:["Aelar","Caelynn","Erevan","Galinndan","Ivellios","Lucan","Riardon","Thamior"],f:["Adrie","Birel","Enna","Keyleth","Lia","Naivara","Sariel","Valanthe"],n:["Feuillargent","Chantelune","Brise-d'Aube","Ombrefeuille","Étoile-Sylve"]},
 "Nain":{m:["Bardin","Dain","Gimrek","Harbek","Orsik","Thorin","Ulfgar","Vondal"],f:["Amber","Bardryn","Eldeth","Gunnloda","Helja","Kathra","Riswynn","Vistra"],n:["Barbe-de-Fer","Brise-Pierre","Marteau-d'Or","Forge-Ardente","Poing-de-Granit"]},
 "Halfelin":{m:["Alton","Cade","Eldon","Garret","Lyle","Milo","Perrin","Roscoe"],f:["Andry","Bree","Callie","Kithri","Lavinia","Merla","Nedda","Verna"],n:["Bonbaril","Piedléger","Tiède-Pâté","Brindherbe","Collinvert"]},
 "Gnome":{m:["Alston","Boddynock","Dimble","Fonkin","Glim","Orryn","Zook"],f:["Bimpnottin","Caramip","Ellyjobell","Loopmottin","Nissa","Roywyn"],n:["Tournevis","Cliquetis","Bricolin","Ressort","Mécanelle"]},
 "Demi-orc":{m:["Dench","Feng","Gell","Holg","Krusk","Ront","Thokk"],f:["Baggi","Emen","Kansif","Myev","Ovak","Sutha","Volen"],n:["Croc-Brisé","Mâchefer","Sang-Noir","Hurle-Lune"]},
 "Tieffelin":{m:["Akmenos","Barakas","Ekemon","Kairon","Morthos","Skamos"],f:["Akta","Bryseis","Kallista","Nemeia","Orianna","Rieta"],n:["Espoir","Tourment","Chant","Gloire","Murmure"]},
 "Drakéide":{m:["Arjhan","Balasar","Donaar","Ghesh","Kriv","Medrash","Torinn"],f:["Akra","Biri","Harann","Kava","Sora","Thava","Uadjit"],n:["Clethtinthiallor","Kepeshkmolik","Myastan","Yarjerit","Delmirev"]}
};
const JOBS=["aubergiste","forgeron","garde de la ville","marchand ambulant","prêtre du village","voleur à la tire","chasseur","herboriste","barde de taverne","capitaine de la garde","noble ruiné","pêcheur","palefrenier","alchimiste","cartographe","contrebandier","fermier","mendiant (qui en sait long)","bibliothécaire","mercenaire en repos"];
const LOOKS=["une cicatrice sur la joue","un œil de verre","des tatouages sur les avant-bras","des cheveux tressés de perles","un chapeau trop grand","des vêtements rapiécés mais propres","une dent en or","des mains couvertes d'encre","un manteau de fourrure râpé","une barbe (ou des cheveux) teinte en rouge","une boucle d'oreille en os","une jambe de bois","des taches de rousseur partout","un sourire inquiétant","une voix étonnamment aiguë"];
const TRAITS=["méfiant envers les étrangers","bavard et curieux","très poli, presque trop","grincheux mais honnête","peureux","vantard","généreux","radin","joyeux, rit de tout","fatigué de la vie","superstitieux","fier de sa famille","pressé, toujours en retard","rêveur"];
const QUIRKS=["se gratte la nuque en mentant","répète la fin des phrases","parle de lui à la troisième personne","mâchonne une herbe","appelle tout le monde « mon gars » ou « ma belle »","ponctue ses phrases d'un proverbe","joue avec une pièce de monnaie","chuchote quand il dit un secret","éternue quand il est nerveux","ne regarde jamais dans les yeux"];
const WANTS=["rembourser une dette","retrouver un proche disparu","quitter la ville","devenir riche","se venger d'un noble","protéger sa boutique","trouver un remède pour son enfant","prouver son innocence","être reconnu par sa guilde","oublier une erreur passée"];
const SECRETS=["travaille en cachette pour la guilde des voleurs","a vu quelque chose la nuit du crime","est en réalité d'origine noble","doit beaucoup d'argent à un orc dangereux","cache un objet magique sous son lit","est espionné par un cultiste","a une liaison avec un garde","connaît un passage secret sous la ville","a trahi un ancien ami","n'a aucun secret… ou presque"];
function genNpc(race){race=race==="Au hasard"?pick(Object.keys(NAMES)):race;const L=NAMES[race];const g=Math.random()<.5?"m":"f";
  return {race,name:pick(L[g])+" "+pick(L.n),g:g==="m"?"homme":"femme",job:pick(JOBS),look:pick(LOOKS),trait:pick(TRAITS),quirk:pick(QUIRKS),want:pick(WANTS),secret:pick(SECRETS)}}

/* ---------- butin ---------- */
const TRINKETS=["une petite boîte à musique qui joue un air triste","une dent de dragon (sans doute fausse)","une carte au trésor à moitié brûlée","une clé en argent sans serrure connue","un dé à 6 faces qui tombe toujours sur 6","une plume qui ne se mouille jamais","un médaillon avec le portrait d'un inconnu","une bougie qui ne fond pas","une pierre tiède en permanence","une lettre d'amour jamais envoyée","un crâne de rat gravé de runes","une bague trop petite pour un humain","un flacon de sable noir","une figurine d'ours en bois","un miroir de poche fêlé","une cloche qui sonne sans bruit","un journal de bord d'un navire disparu","un œil de verre","une pièce d'un royaume inconnu","un parchemin indéchiffrable"];
const ITEMS_LOW=["Potion de soins","Potion de soins","Potion de soins","Potion d'escalade","Potion de respiration aquatique","Antidote","Parchemin de sort (Soins)","Parchemin de sort (Projectile magique)","Parchemin de sort (Bouclier)","Munitions +1 (×10)","Corde d'escalade","Lunettes de nuit","Bottes elfiques","Potion de résistance"];
const ITEMS_MID=["Potion de soins supérieurs","Arme +1","Bouclier +1","Armure +1","Cape de protection","Anneau de protection","Sac sans fond","Anneau de saut","Baguette de projectiles magiques","Potion de force de géant des collines","Parchemin de sort (Boule de feu)","Gantelets de puissance d'ogre","Amulette de santé","Bracelets de défense","Pierre porte-bonheur","Potion d'héroïsme"];
const GEMS10=["azurite","hématite","malachite","obsidienne","quartz bleu","turquoise"],ART25=["une statuette en os sculpté","un bracelet en argent","un calice en cuivre","une tapisserie brodée","un masque doré en tissu","un peigne en ivoire"];
function rollLoot(cr,type){const out=[];const R=f=>Dice.roll(f).tot;
  if(type==="ind"){const d=R("1d100");
    if(cr==="0-4"){if(d<=30)out.push(R("5d6")+" pc");else if(d<=60)out.push(R("4d6")+" pa");else if(d<=70)out.push(R("3d6")+" pe");else if(d<=95)out.push(R("3d6")+" po");else out.push(R("1d6")+" pp")}
    else{if(d<=30)out.push(R("4d6")*100+" pc",R("1d6")*10+" pe");else if(d<=60)out.push(R("6d6")*10+" pa",R("2d6")*10+" po");else if(d<=70)out.push(R("3d6")*10+" pe",R("2d6")*10+" po");else if(d<=95)out.push(R("4d6")*10+" po");else out.push(R("2d6")*10+" po",R("3d6")+" pp")}
    if(Math.random()<.25)out.push("Babiole : "+pick(TRINKETS));}
  else{if(cr==="0-4"){out.push(R("6d6")*100+" pc",R("3d6")*100+" pa",R("2d6")*10+" po");const g=R("1d6")-2;if(g>0)out.push(g+" gemmes de 10 po ("+pick(GEMS10)+")");if(Math.random()<.5)out.push("Objet d'art (25 po) : "+pick(ART25));
      const n=R("1d4")-1;for(let i=0;i<n;i++)out.push("Objet magique : "+pick(ITEMS_LOW))}
    else{out.push(R("2d6")*100+" pc",R("2d6")*1000+" pa",R("6d6")*100+" po",R("3d6")*10+" pp");const g=R("2d4");out.push(g+" gemmes de 50 po");out.push("Objet d'art (250 po) : "+pick(["une couronne en argent","un collier de perles","une épée de cérémonie dorée","une statue en marbre"]));
      const n=R("1d4");for(let i=0;i<n;i++)out.push("Objet magique : "+pick(Math.random()<.5?ITEMS_LOW:ITEMS_MID))}
    out.push("Babiole : "+pick(TRINKETS))}
  return out}

/* ---------- rencontres ---------- */
const THEMES={mixte:null,humanoides:t=>/Humanoïde/.test(t.type),betes:t=>t.type==="Bête",mortsvivants:t=>t.type==="Mort-vivant",gobelinoides:t=>/gobelinoïde|kobold|orc/i.test(t.type)};
function genEncounter(){const {n,lv,diff,theme}=O.enc;const th=Combat.XPT[Math.min(10,Math.max(1,lv))].map(v=>v*n);
  const lo=th[diff],hi=diff<3?th[diff+1]:th[3]*1.5;const target=(lo+hi)/2;
  const pool=Object.entries(window.PNJ.TEMPLATES).filter(([k,t])=>t.role==="ennemi"&&(!THEMES[theme]||THEMES[theme](t)));if(!pool.length)return null;
  let best=null;for(let i=0;i<600;i++){const types=Math.random()<.45?2:1;const g=[];let cnt=0,xp=0;
    for(let j=0;j<types;j++){const [k,t]=pick(pool);const q=1+Math.floor(Math.random()*(j===0?6:3));g.push({k,q,xp:window.PNJ.XP[t.cr]});cnt+=q;xp+=q*window.PNJ.XP[t.cr]}
    const adj=xp*Combat.mult(cnt);const ok=adj>=lo&&adj<hi;const score=(ok?0:1e6)+Math.abs(adj-target)+cnt*5;
    if(!best||score<best.score)best={g,adj,xp,cnt,score,ok}}
  const merged={};best.g.forEach(x=>{merged[x.k]=(merged[x.k]||0)+x.q});
  return {list:Object.entries(merged).map(([k,q])=>({k,q})),xp:best.xp,adj:Math.round(best.adj),ok:best.ok,th,per:Math.round(best.xp/n)}}

/* ---------- rendu ---------- */
function render(){const box=$("#outilsPage");if(!box)return;
  const die=d=>`<button class="btn sec dbtn" data-die="${d}">d${d}</button>`;
  let h=`<div class="recgrid"><div class="card"><h2>🎲 Lanceur de dés</h2>
    <div class="row" style="align-items:flex-end"><label class="f" style="max-width:90px"><span>Nombre</span><input type="number" id="dQty" min="1" max="50" value="${O.qty}"></label><label class="f" style="max-width:100px"><span>Bonus</span><input type="number" id="dMod" value="${O.mod}"></label></div>
    <div class="chk">${[4,6,8,10,12,20,100].map(die).join("")}</div>
    <div class="chk" style="margin-top:8px"><span class="small" style="align-self:center">d20 :</span>${[["norm","Normal"],["adv","Avantage"],["dis","Désavantage"]].map(([k,l])=>`<label class="${O.mode===k?"sel":""}"><input type="radio" name="dmode" value="${k}" ${O.mode===k?"checked":""}>${l}</label>`).join("")}</div>
    <div class="row" style="margin-top:8px;align-items:flex-end"><label class="f"><span>Ou une formule</span><input type="text" id="dFormula" placeholder="ex. 2d6+3, 1d8+1d6"></label><button class="btn" id="dRoll" style="flex:0;margin-bottom:10px">Lancer</button></div>
    ${O.hist.length?`<div class="dres">${esc(O.hist[0])}</div><ul class="tight small">${O.hist.slice(1,8).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}</div>`;
  // PNJ rapide
  const np=O.npc;
  h+=`<div class="card"><h2>🧑 PNJ en 2 secondes</h2><div class="row" style="align-items:flex-end"><label class="f"><span>Race</span><select id="nRace"><option>Au hasard</option>${Object.keys(NAMES).map(r=>`<option>${r}</option>`).join("")}</select></label><button class="btn" id="nGen" style="flex:0;margin-bottom:10px">Générer</button></div>
    ${np?`<div class="npcbox"><h3 style="margin:0">${esc(np.name)}</h3><div class="small">${esc(np.race)}, ${np.g} · ${esc(np.job)}</div><ul class="tight"><li><b>Apparence :</b> ${esc(np.look)}</li><li><b>Caractère :</b> ${esc(np.trait)}</li><li><b>Manie :</b> ${esc(np.quirk)}</li><li><b>Ce qu'il veut :</b> ${esc(np.want)}</li><li><b>Secret :</b> ${esc(np.secret)}</li></ul>
      <div class="row" style="flex:0"><button class="btn sec" id="nCopy">Copier</button><button class="btn sec" id="nToPnj">➜ En faire une créature</button></div></div>`:`<p class="small">Un nom, un métier, une manie et un secret pour improviser n'importe quel personnage.</p>`}</div></div>`;
  // rencontres
  const e=O.enc,r=O.encRes;
  h+=`<div class="card"><h2>⚔️ Générateur de rencontres</h2><div class="small">Propose un groupe d'ennemis équilibré selon les règles de difficulté (seuils de PX par niveau et multiplicateur selon le nombre d'ennemis).</div>
    <div class="row" style="align-items:flex-end;margin-top:8px"><label class="f" style="max-width:120px"><span>Joueurs</span><input type="number" id="eN" min="1" max="8" value="${e.n}"></label><label class="f" style="max-width:120px"><span>Niveau</span><input type="number" id="eLv" min="1" max="10" value="${e.lv}"></label>
    <label class="f"><span>Difficulté</span><select id="eDiff">${Combat.DIFF.map((d,i)=>`<option value="${i}" ${+e.diff===i?"selected":""}>${d}</option>`).join("")}</select></label>
    <label class="f"><span>Thème</span><select id="eTheme">${[["mixte","Mélange"],["humanoides","Humanoïdes (bandits, cultistes…)"],["gobelinoides","Gobelins, kobolds, orcs"],["betes","Bêtes sauvages"],["mortsvivants","Morts-vivants"]].map(([k,l])=>`<option value="${k}" ${e.theme===k?"selected":""}>${l}</option>`).join("")}</select></label>
    <button class="btn" id="eGen" style="flex:0;margin-bottom:10px">Générer</button></div>
    ${r?`<div class="npcbox"><h3 style="margin:0">${r.list.map(x=>x.q+" × "+esc(x.k)).join(" + ")}</h3><div class="small">${r.xp} PX (ajusté ${r.adj}) · seuils : facile ${r.th[0]}, moyen ${r.th[1]}, difficile ${r.th[2]}, mortel ${r.th[3]} · ${r.per} PX par joueur${r.ok?"":" · ⚠ pas de combinaison parfaite avec ce thème, c'est la plus proche"}</div>
      <div class="row" style="flex:0;margin-top:6px"><button class="btn" id="eToCombat">➜ Envoyer au combat</button><button class="btn sec" id="eGen2">Autre proposition</button></div></div>`:""}</div>`;
  // butin
  h+=`<div class="card"><h2>💰 Butin</h2><div class="row" style="align-items:flex-end"><label class="f"><span>Puissance des ennemis</span><select id="lCr"><option value="0-4" ${O.lootCr==="0-4"?"selected":""}>FP 0 à 4</option><option value="5-10" ${O.lootCr==="5-10"?"selected":""}>FP 5 à 10</option></select></label>
    <label class="f"><span>Type</span><select id="lType"><option value="ind" ${O.lootType==="ind"?"selected":""}>Sur un ennemi (individuel)</option><option value="hoard" ${O.lootType==="hoard"?"selected":""}>Trésor de repaire</option></select></label><button class="btn" id="lGen" style="flex:0;margin-bottom:10px">Tirer le butin</button></div>
    ${O.loot?`<div class="npcbox"><ul class="tight">${O.loot.map((x,i)=>`<li>${esc(x)} ${/^Objet magique : /.test(x)?`<button class="mini" data-lgive="${i}">➜ Donner à ${esc(S.name||"mon perso")}</button>`:/^\d+ (pc|pa|pe|po|pp)$/.test(x)?`<button class="mini" data-lcoin="${i}">➜ Bourse de ${esc(S.name||"mon perso")}</button>`:""}</li>`).join("")}</ul><button class="btn sec" id="lCopy">Copier</button></div>`:""}</div>`;
  box.innerHTML=h;persist()}
function pushHist(t){O.hist.unshift(t);O.hist=O.hist.slice(0,10);toast(t,3500);publicRoll(t);render()}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest||!t.closest("#outilsPage"))return;
  const qty=()=>Math.max(1,Math.min(50,+($("#dQty").value)||1)),md=()=>+($("#dMod").value)||0;
  const db=t.closest("[data-die]");if(db){const d=+db.dataset.die;O.qty=qty();O.mod=md();
    if(d===20&&O.qty===1&&O.mode!=="norm"){const r=Dice.d20(O.mode);return pushHist(`d20 ${O.mode==="adv"?"avec avantage":"avec désavantage"} : ${r.v+O.mod} (${r.txt}${O.mod?" "+sgn(O.mod):""})`)}
    const f=O.qty+"d"+d+(O.mod?sgn(O.mod):"");const r=Dice.roll(f);return pushHist(`${f} : ${r.tot}  ${r.txt}`)}
  if(t.id==="dRoll"){const f=$("#dFormula").value.trim();const r=Dice.roll(f);if(!r)return toast("Formule invalide (ex. 2d6+3)");return pushHist(`${f} : ${r.tot}  ${r.txt}`)}
  if(t.id==="nGen"){O.npc=genNpc($("#nRace").value);render()}
  if(t.id==="nCopy"){const n=O.npc;navigator.clipboard.writeText(`${n.name} (${n.race}, ${n.g}, ${n.job}) — ${n.look}. ${n.trait}, ${n.quirk}. Veut : ${n.want}. Secret : ${n.secret}.`).then(()=>toast("Copié !"),()=>toast("Copie impossible ici"))}
  if(t.id==="nToPnj"){const n=O.npc;const base=JSON.parse(JSON.stringify(window.PNJ.TEMPLATES[/garde/.test(n.job)?"Garde":/voleur|contrebandier|mercenaire/.test(n.job)?"Bandit":"Acolyte (soigneur)"]));
    base.name=n.name;base.role="neutre";base.type="Humanoïde ("+n.race.toLowerCase()+")";base.notes=`${n.job.charAt(0).toUpperCase()+n.job.slice(1)}. ${n.look}. ${n.trait}, ${n.quirk}. Veut : ${n.want}. Secret : ${n.secret}.`;if(!/garde|voleur|contrebandier|mercenaire/.test(n.job)){base.traits=[];base.actions=[{n:"Gourdin",kind:"melee",ab:"FOR",range:"allonge 1,50 m",dice:"1d4",dtype:"contondants",extra:""}]}
    window.PNJ.load(base);location.hash="#pnj";toast("PNJ envoyé dans Ennemis & alliés")}
  if(t.id==="eGen"||t.id==="eGen2"){O.enc={n:Math.max(1,+$("#eN").value||4),lv:Math.max(1,Math.min(10,+$("#eLv").value||1)),diff:+$("#eDiff").value,theme:$("#eTheme").value};O.encRes=genEncounter();render()}
  if(t.id==="eToCombat"&&O.encRes){const list=[];O.encRes.list.forEach(x=>list.push(...Combat.fromNpc(window.PNJ.TEMPLATES[x.k],x.q,"avg")));Combat.add(list);location.hash="#combat"}
  if(t.id==="lGen"){O.lootCr=$("#lCr").value;O.lootType=$("#lType").value;O.loot=rollLoot(O.lootCr,O.lootType);render()}
  const lg=t.closest("[data-lgive]");if(lg){const nom=O.loot[+lg.dataset.lgive].replace(/^Objet magique : /,"");if(giveItem(nom)){toast(nom+" donné à "+(S.name||"ton perso"));O.loot.splice(+lg.dataset.lgive,1);render()}return}
  const lc=t.closest("[data-lcoin]");if(lc){if(!S.race||!S.cls)return toast("Ouvre d'abord un perso");const [n,k]=O.loot[+lc.dataset.lcoin].split(" ");const p=P();p.money[k]=(+p.money[k]||0)+(+n);save();toast(n+" "+k+" ajoutés à la bourse de "+(S.name||"ton perso"));O.loot.splice(+lc.dataset.lcoin,1);render();return}
  if(t.id==="lCopy")navigator.clipboard.writeText(O.loot.join("\n")).then(()=>toast("Copié !"),()=>toast("Copie impossible ici"));
});
document.addEventListener("change",e=>{const t=e.target;if(!t.closest||!t.closest("#outilsPage"))return;if(t.name==="dmode"){O.mode=t.value;render()}});
document.addEventListener("view",e=>{if(e.detail==="outils")render()});
})();
