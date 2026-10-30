/* ===================== ENNEMIS & ALLIÉS (PNJ / monstres) ===================== */
(()=>{
const $=s=>document.querySelector(s);
const sgn=n=>(n>=0?"+":"")+n;
const md=v=>Math.floor((v-10)/2);
const ABS=["FOR","DEX","CON","INT","SAG","CHA"];
const SKL=[["Acrobaties","DEX"],["Arcanes","INT"],["Athlétisme","FOR"],["Discrétion","DEX"],["Dressage","SAG"],["Escamotage","DEX"],["Histoire","INT"],["Intimidation","CHA"],["Investigation","INT"],["Médecine","SAG"],["Nature","INT"],["Perception","SAG"],["Intuition","SAG"],["Persuasion","CHA"],["Religion","INT"],["Représentation","CHA"],["Survie","SAG"],["Tromperie","CHA"]];
const SKA=Object.fromEntries(SKL);
const SIZES=["Très petite (TP)","Petite (P)","Moyenne (M)","Grande (G)","Très grande (TG)","Gigantesque (Gig)"];
const TYPES=["Aberration","Bête","Céleste","Créature artificielle","Dragon","Élémentaire","Fée","Fiélon","Géant","Humanoïde","Monstruosité","Mort-vivant","Plante","Vase"];
const ALIGNS=["Loyal bon","Neutre bon","Chaotique bon","Loyal neutre","Neutre","Chaotique neutre","Loyal mauvais","Neutre mauvais","Chaotique mauvais","Sans alignement","Tout alignement"];
const CRS=["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12"];
const XP={"0":10,"1/8":25,"1/4":50,"1/2":100,"1":200,"2":450,"3":700,"4":1100,"5":1800,"6":2300,"7":2900,"8":3900,"9":5000,"10":5900,"11":7200,"12":8400};
const pbOf=cr=>{const v=cr.includes("/")?0:+cr;return v<5?2:v<9?3:v<13?4:5};
const ROLES={ennemi:"⚔️ Ennemi",allie:"🤝 Allié",neutre:"⚖️ Neutre"};

/* Modèles : profils des règles de base (SRD 5.1), noms traduits */
const T=(o)=>Object.assign({role:"ennemi",size:"Moyenne (M)",type:"Humanoïde",align:"Neutre",ac:10,acTxt:"",hp:"2d8",speed:"9 m",cr:"1/4",ab:{FOR:10,DEX:10,CON:10,INT:10,SAG:10,CHA:10},saves:[],skills:{},vuln:"",res:"",immun:"",condImm:"",senses:"",langs:"",traits:[],actions:[],reactions:[],notes:""},o);
const W=(n,kind,ab,range,dice,dtype,extra)=>({n,kind,ab,range,dice,dtype,extra:extra||""});
const O=(n,t)=>({n,kind:"autre",ab:"FOR",range:"",dice:"",dtype:"",extra:t});
const TEMPLATES={
 "Gobelin":T({name:"Gobelin",size:"Petite (P)",type:"Humanoïde (gobelinoïde)",align:"Neutre mauvais",ac:15,acTxt:"armure de cuir, bouclier",hp:"2d6",cr:"1/4",ab:{FOR:8,DEX:14,CON:10,INT:10,SAG:8,CHA:8},skills:{"Discrétion":2},senses:"vision dans le noir 18 m",langs:"commun, gobelin",
   traits:[{n:"Fuite agile",t:"Le gobelin peut se désengager ou se cacher par une action bonus à chacun de ses tours."}],
   actions:[W("Cimeterre","melee","DEX","allonge 1,50 m","1d6","tranchants"),W("Arc court","ranged","DEX","portée 24/96 m","1d6","perforants")]}),
 "Kobold":T({name:"Kobold",size:"Petite (P)",type:"Humanoïde (kobold)",align:"Loyal mauvais",ac:12,hp:"2d6-2",cr:"1/8",ab:{FOR:7,DEX:15,CON:9,INT:8,SAG:7,CHA:8},senses:"vision dans le noir 18 m",langs:"commun, draconique",
   traits:[{n:"Sensibilité au soleil",t:"En plein soleil, désavantage aux jets d'attaque et aux tests de Sagesse (Perception) basés sur la vue."},{n:"Tactique de groupe",t:"Avantage à l'attaque contre une créature si un allié non neutralisé du kobold se trouve à 1,50 m d'elle."}],
   actions:[W("Dague","melee","DEX","allonge 1,50 m","1d4","perforants"),W("Fronde","ranged","DEX","portée 9/36 m","1d4","contondants")]}),
 "Bandit":T({name:"Bandit",align:"Chaotique neutre",ac:12,acTxt:"armure de cuir",hp:"2d8+2",cr:"1/8",ab:{FOR:11,DEX:12,CON:12,INT:10,SAG:10,CHA:10},langs:"commun",
   actions:[W("Cimeterre","melee","DEX","allonge 1,50 m","1d6","tranchants"),W("Arbalète légère","ranged","DEX","portée 24/96 m","1d8","perforants")]}),
 "Garde":T({name:"Garde",role:"neutre",align:"Loyal neutre",ac:16,acTxt:"chemise de mailles, bouclier",hp:"2d8+2",cr:"1/8",ab:{FOR:13,DEX:12,CON:12,INT:10,SAG:11,CHA:10},skills:{"Perception":1},langs:"commun",
   actions:[W("Lance","melee","FOR","allonge 1,50 m ou portée 6/18 m","1d6","perforants","ou 1d8 + FOR à deux mains")]}),
 "Cultiste":T({name:"Cultiste",align:"Chaotique mauvais",ac:12,acTxt:"armure de cuir",hp:"2d8",cr:"1/8",ab:{FOR:11,DEX:12,CON:10,INT:10,SAG:11,CHA:10},skills:{"Tromperie":1,"Religion":1},langs:"commun",
   traits:[{n:"Dévotion obscure",t:"Avantage aux jets de sauvegarde contre les effets de charme et de peur."}],
   actions:[W("Cimeterre","melee","DEX","allonge 1,50 m","1d6","tranchants")]}),
 "Loup":T({name:"Loup",type:"Bête",align:"Sans alignement",ac:13,acTxt:"armure naturelle",hp:"2d8+2",speed:"12 m",cr:"1/4",ab:{FOR:12,DEX:15,CON:12,INT:3,SAG:12,CHA:6},skills:{"Perception":1,"Discrétion":1},
   traits:[{n:"Ouïe et odorat aiguisés",t:"Avantage aux tests de Sagesse (Perception) basés sur l'ouïe ou l'odorat."},{n:"Tactique de groupe",t:"Avantage à l'attaque contre une créature si un allié non neutralisé du loup se trouve à 1,50 m d'elle."}],
   actions:[W("Morsure","melee","DEX","allonge 1,50 m","2d4","perforants","Si la cible est une créature, elle doit réussir une sauvegarde de Force DD 11 ou tomber à terre.")]}),
 "Squelette":T({name:"Squelette",type:"Mort-vivant",align:"Loyal mauvais",ac:13,acTxt:"restes d'armure",hp:"2d8+4",cr:"1/4",ab:{FOR:10,DEX:14,CON:15,INT:6,SAG:8,CHA:5},vuln:"contondants",immun:"poison",condImm:"empoisonné, épuisé",senses:"vision dans le noir 18 m",langs:"comprend les langues qu'il connaissait de son vivant mais ne peut pas parler",
   actions:[W("Épée courte","melee","DEX","allonge 1,50 m","1d6","perforants"),W("Arc court","ranged","DEX","portée 24/96 m","1d6","perforants")]}),
 "Zombie":T({name:"Zombie",type:"Mort-vivant",align:"Neutre mauvais",ac:8,hp:"3d8+9",speed:"6 m",cr:"1/4",ab:{FOR:13,DEX:6,CON:16,INT:3,SAG:6,CHA:5},saves:["SAG"],immun:"poison",condImm:"empoisonné",senses:"vision dans le noir 18 m",langs:"comprend les langues qu'il connaissait de son vivant mais ne peut pas parler",
   traits:[{n:"Ténacité des morts-vivants",t:"Si des dégâts font tomber le zombie à 0 PV, il fait une sauvegarde de Constitution DD 5 + dégâts subis, sauf contre des dégâts radiants ou un coup critique. En cas de réussite, il tombe à 1 PV à la place."}],
   actions:[W("Coup","melee","FOR","allonge 1,50 m","1d6","contondants")]}),
 "Orc":T({name:"Orc",type:"Humanoïde (orc)",align:"Chaotique mauvais",ac:13,acTxt:"armure de peaux",hp:"2d8+6",cr:"1/2",ab:{FOR:16,DEX:12,CON:16,INT:7,SAG:11,CHA:10},skills:{"Intimidation":1},senses:"vision dans le noir 18 m",langs:"commun, orc",
   traits:[{n:"Agressif",t:"Par une action bonus, l'orc peut se déplacer jusqu'à sa vitesse vers une créature hostile qu'il voit."}],
   actions:[W("Hache à deux mains","melee","FOR","allonge 1,50 m","1d12","tranchants"),W("Javeline","melee","FOR","allonge 1,50 m ou portée 9/36 m","1d6","perforants")]}),
 "Hobgobelin":T({name:"Hobgobelin",type:"Humanoïde (gobelinoïde)",align:"Loyal mauvais",ac:18,acTxt:"cotte de mailles, bouclier",hp:"2d8+2",cr:"1/2",ab:{FOR:13,DEX:12,CON:12,INT:10,SAG:10,CHA:9},senses:"vision dans le noir 18 m",langs:"commun, gobelin",
   traits:[{n:"Avantage martial",t:"Une fois par tour, +7 (2d6) dégâts à une créature touchée par une attaque d'arme si un allié non neutralisé du hobgobelin se trouve à 1,50 m d'elle."}],
   actions:[W("Épée longue","melee","FOR","allonge 1,50 m","1d8","tranchants","ou 1d10 + FOR à deux mains"),W("Arc long","ranged","DEX","portée 45/180 m","1d8","perforants")]}),
 "Araignée géante":T({name:"Araignée géante",size:"Grande (G)",type:"Bête",align:"Sans alignement",ac:14,acTxt:"armure naturelle",hp:"4d10+4",speed:"9 m, escalade 9 m",cr:"1",ab:{FOR:14,DEX:16,CON:12,INT:2,SAG:11,CHA:4},skills:{"Discrétion":2},senses:"vision aveugle 3 m, vision dans le noir 18 m",
   traits:[{n:"Pattes d'araignée",t:"Escalade les surfaces difficiles, y compris au plafond, sans test."},{n:"Sens de la toile",t:"En contact avec une toile, connaît la position de toute créature qui la touche."},{n:"Marche sur les toiles",t:"Ignore les restrictions de mouvement dues aux toiles."}],
   actions:[W("Morsure","melee","DEX","allonge 1,50 m","1d8","perforants","La cible fait une sauvegarde de Constitution DD 11 : 9 (2d8) dégâts de poison en cas d'échec, moitié en cas de réussite."),O("Toile (recharge 5–6)","Attaque à distance +5, portée 9/18 m. Cible entravée par la toile (Force DD 12 pour s'en libérer, la toile a CA 10, 5 PV).")]}),
 "Ours brun":T({name:"Ours brun",size:"Grande (G)",type:"Bête",align:"Sans alignement",ac:11,acTxt:"armure naturelle",hp:"4d10+12",speed:"12 m, escalade 9 m",cr:"1",ab:{FOR:19,DEX:10,CON:16,INT:2,SAG:13,CHA:7},skills:{"Perception":1},
   traits:[{n:"Odorat aiguisé",t:"Avantage aux tests de Sagesse (Perception) basés sur l'odorat."}],
   actions:[O("Attaques multiples","L'ours fait deux attaques : une de morsure et une de griffes."),W("Morsure","melee","FOR","allonge 1,50 m","1d8","perforants"),W("Griffes","melee","FOR","allonge 1,50 m","2d6","tranchants")]}),
 "Ogre":T({name:"Ogre",size:"Grande (G)",type:"Géant",align:"Chaotique mauvais",ac:11,acTxt:"armure de peaux",hp:"7d10+21",speed:"12 m",cr:"2",ab:{FOR:19,DEX:8,CON:16,INT:5,SAG:7,CHA:7},senses:"vision dans le noir 18 m",langs:"commun, géant",
   actions:[W("Massue","melee","FOR","allonge 1,50 m","2d8","contondants"),W("Javeline","melee","FOR","allonge 1,50 m ou portée 9/36 m","2d6","perforants")]}),
 "Capitaine bandit":T({name:"Capitaine bandit",align:"Chaotique neutre",ac:15,acTxt:"armure de cuir clouté",hp:"10d8+20",cr:"2",ab:{FOR:15,DEX:16,CON:14,INT:14,SAG:11,CHA:14},saves:["FOR","DEX","SAG"],skills:{"Athlétisme":1,"Tromperie":1},langs:"commun, une autre langue",
   actions:[O("Attaques multiples","Le capitaine fait trois attaques : deux au cimeterre et une à la dague. Ou deux attaques à distance avec ses dagues."),W("Cimeterre","melee","DEX","allonge 1,50 m","1d6","tranchants"),W("Dague","melee","DEX","allonge 1,50 m ou portée 6/18 m","1d4","perforants")],
   reactions:[{n:"Parade",t:"+2 à la CA contre une attaque au corps-à-corps qui le toucherait, s'il voit l'attaquant et tient une arme de corps-à-corps."}]}),
 "Acolyte (soigneur)":T({name:"Acolyte",role:"allie",align:"Neutre bon",ac:10,hp:"2d8",cr:"1/4",ab:{FOR:10,DEX:10,CON:10,INT:10,SAG:14,CHA:11},skills:{"Médecine":1,"Religion":1},langs:"commun",
   traits:[{n:"Incantation",t:"Lanceur de sorts de niveau 1 (Sagesse, DD 12, +4 au toucher). Tours de magie : lumière, flamme sacrée, thaumaturgie. Niveau 1 (3 emplacements) : bénédiction, soins, sanctuaire."}],
   actions:[W("Gourdin","melee","FOR","allonge 1,50 m","1d4","contondants")]}),
 "Vétéran (garde du corps)":T({name:"Vétéran",role:"allie",align:"Loyal neutre",ac:17,acTxt:"clibanion",hp:"9d8+18",cr:"3",ab:{FOR:16,DEX:13,CON:14,INT:10,SAG:11,CHA:10},skills:{"Athlétisme":1,"Perception":1},langs:"commun",
   actions:[O("Attaques multiples","Le vétéran fait deux attaques à l'épée longue. S'il a dégainé son épée courte, il peut aussi faire une attaque à l'épée courte."),W("Épée longue","melee","FOR","allonge 1,50 m","1d8","tranchants","ou 1d10 + FOR à deux mains"),W("Épée courte","melee","FOR","allonge 1,50 m","1d6","perforants"),W("Arbalète lourde","ranged","DEX","portée 30/120 m","1d10","perforants")]})
};
function tokImg(file){return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const S0=128,c=document.createElement("canvas");c.width=c.height=S0;const x=c.getContext("2d");const m=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-m)/2,(im.naturalHeight-m)/2,m,m,0,0,S0,S0);ok(c.toDataURL("image/jpeg",0.85))};im.onerror=ko;im.src=fr.result};fr.readAsDataURL(file)})}
window.tokImg=tokImg;
const BLANK=()=>T({name:"",ab:{FOR:10,DEX:10,CON:10,INT:10,SAG:10,CHA:10}});
window.PNJ={TEMPLATES,XP,pbOf,md,ROLES,load:(data,id)=>{N=Object.assign(BLANK(),JSON.parse(JSON.stringify(data)));npcSaveId=id||null;persist()}};

let N;try{N=JSON.parse(localStorage.getItem("dnd-pnj"))}catch(e){}
if(!N||!N.ab)N=BLANK();
let npcSaveId=null;try{npcSaveId=localStorage.getItem("dnd-pnj-id")}catch(e){}
const persist=()=>{try{localStorage.setItem("dnd-pnj",JSON.stringify(N));localStorage.setItem("dnd-pnj-id",npcSaveId||"")}catch(e){}};

/* ---------- calculs ---------- */
const M=a=>md(+N.ab[a]||10);
const PB=()=>pbOf(N.cr);
function avgDice(f){const s=String(f||"").replace(/\s/g,"");if(!s)return null;let tot=0,ok=false;
  for(const t of s.match(/[+-]?[^+-]+/g)||[]){const m=t.match(/^([+-]?)(\d*)d(\d+)$/i);
    if(m){const n=+(m[2]||1),d=+m[3];tot+=(m[1]==="-"?-1:1)*n*(d+1)/2;ok=true}
    else if(/^[+-]?\d+$/.test(t)){tot+=+t;ok=true}else return null}
  return ok?Math.floor(tot):null}
function rollDice(f){const s=String(f||"").replace(/\s/g,"");let tot=0,parts=[];
  for(const t of s.match(/[+-]?[^+-]+/g)||[]){const m=t.match(/^([+-]?)(\d*)d(\d+)$/i);
    if(m){const n=+(m[2]||1),d=+m[3];const r=[];for(let i=0;i<n;i++)r.push(1+Math.floor(Math.random()*d));const v=r.reduce((a,b)=>a+b,0);tot+=(m[1]==="-"?-v:v);parts.push("["+r.join(",")+"]")}
    else if(/^[+-]?\d+$/.test(t)){tot+=+t;parts.push(t)}}
  return {tot,txt:parts.join(" ")}}
function atk(a){return M(a.ab)+PB()}
function dmgFormula(a){if(!a.dice)return "";const m=M(a.ab);return a.dice+(m?sgn(m):"")}
function dmgAvg(a){return avgDice(dmgFormula(a))}
function skillBonus(s){return M(SKA[s])+PB()*(N.skills[s]||0)}

/* ---------- profil (rendu façon bestiaire) ---------- */
function statBlock(){
  const hpAvg=avgDice(N.hp);
  const saves=N.saves.map(a=>a+" "+sgn(M(a)+PB())).join(", ");
  const skills=Object.keys(N.skills).filter(s=>N.skills[s]).map(s=>s+" "+sgn(skillBonus(s))).join(", ");
  const pp=10+(N.skills["Perception"]?skillBonus("Perception"):M("SAG"));
  const line=(k,v)=>v?`<div class="sbl"><b>${k}</b> ${esc(v)}</div>`:"";
  const act=(a,i)=>{if(a.kind==="autre")return `<p><b><i>${esc(a.n)}.</i></b> ${esc(a.extra)}</p>`;
    const kind=a.kind==="ranged"?"Attaque à distance avec une arme":"Attaque au corps-à-corps avec une arme";
    const av=dmgAvg(a);
    return `<p class="act" data-roll-act="${i}" title="Clique pour lancer l'attaque"><b><i>${esc(a.n||"Nouvelle attaque")}.</i></b> <i>${kind} :</i> ${sgn(atk(a))} pour toucher, ${esc(a.range)}, une cible. <i>Touché :</i> ${av!==null?av+" ("+esc(dmgFormula(a))+")":esc(a.dice)} dégâts ${esc(a.dtype)}${a.extra?". "+esc(a.extra):"."} <span class="die">🎲</span></p>`};
  return `<div class="statblock ${N.role}">
   <div class="sbtitle">${esc(N.name||"Créature sans nom")}</div>
   <div class="sbsub">${esc(N.size.replace(/ \(.*\)/,""))}, ${esc(N.type.toLowerCase())}, ${esc(N.align.toLowerCase())} · <span class="rolechip">${ROLES[N.role]}</span></div>
   <hr>
   ${line("Classe d'armure",N.ac+(N.acTxt?" ("+N.acTxt+")":""))}
   <div class="sbl"><b>Points de vie</b> ${hpAvg!==null?hpAvg:"?"} (${esc(N.hp)}) <button class="mini" id="rollHp">🎲 lancer</button> <span id="hpRes" class="small"></span></div>
   ${line("Vitesse",N.speed)}
   <hr>
   <div class="sbabil">${ABS.map(a=>`<div><b>${a}</b><br>${N.ab[a]} (${sgn(M(a))})</div>`).join("")}</div>
   <hr>
   ${line("Jets de sauvegarde",saves)}${line("Compétences",skills)}${line("Vulnérabilités aux dégâts",N.vuln)}${line("Résistances aux dégâts",N.res)}${line("Immunités aux dégâts",N.immun)}${line("Immunités aux états",N.condImm)}
   ${line("Sens",(N.senses?N.senses+", ":"")+"Perception passive "+pp)}${line("Langues",N.langs||"—")}
   <div class="sbl"><b>Puissance</b> ${esc(N.cr)} (${XP[N.cr]} PX) · <b>Bonus de maîtrise</b> +${PB()} · <b>Initiative</b> ${sgn(M("DEX"))}</div>
   <hr>
   ${N.traits.map(t=>`<p><b><i>${esc(t.n)}.</i></b> ${esc(t.t)}</p>`).join("")}
   ${N.actions.length?`<div class="sbh">Actions</div>${N.actions.map(act).join("")}`:""}
   ${N.reactions.length?`<div class="sbh">Réactions</div>${N.reactions.map(t=>`<p><b><i>${esc(t.n)}.</i></b> ${esc(t.t)}</p>`).join("")}`:""}
   ${N.notes?`<div class="sbh">Notes du MJ</div><p>${esc(N.notes)}</p>`:""}
  </div>
  <div class="row" style="margin-top:10px"><button class="btn sec" id="npcCopy">Copier en texte</button></div>
  <div class="small" style="margin-top:6px">Astuce : clique sur une attaque pour la lancer (toucher + dégâts).</div>`}
function statText(){const L=[];const hpAvg=avgDice(N.hp);
  L.push(`${N.name||"Créature"} — ${N.size.replace(/ \(.*\)/,"")}, ${N.type.toLowerCase()}, ${N.align.toLowerCase()} (${ROLES[N.role].slice(3)})`);
  L.push(`CA ${N.ac}${N.acTxt?" ("+N.acTxt+")":""} · PV ${hpAvg} (${N.hp}) · Vitesse ${N.speed}`);
  L.push(ABS.map(a=>`${a} ${N.ab[a]} (${sgn(M(a))})`).join(" · "));
  if(N.saves.length)L.push("Sauvegardes : "+N.saves.map(a=>a+" "+sgn(M(a)+PB())).join(", "));
  const sk=Object.keys(N.skills).filter(s=>N.skills[s]);if(sk.length)L.push("Compétences : "+sk.map(s=>s+" "+sgn(skillBonus(s))).join(", "));
  [["Vulnérabilités",N.vuln],["Résistances",N.res],["Immunités",N.immun],["Immunités aux états",N.condImm]].forEach(([k,v])=>v&&L.push(k+" : "+v));
  L.push("Sens : "+(N.senses?N.senses+", ":"")+"Perception passive "+(10+(N.skills["Perception"]?skillBonus("Perception"):M("SAG"))));
  L.push("Langues : "+(N.langs||"—"));L.push(`Puissance ${N.cr} (${XP[N.cr]} PX)`);
  N.traits.forEach(t=>L.push(`• ${t.n}. ${t.t}`));
  if(N.actions.length){L.push("ACTIONS");N.actions.forEach(a=>L.push(a.kind==="autre"?`• ${a.n}. ${a.extra}`:`• ${a.n}. ${sgn(atk(a))} pour toucher, ${a.range}. Touché : ${dmgAvg(a)} (${dmgFormula(a)}) ${a.dtype}.${a.extra?" "+a.extra:""}`))}
  if(N.reactions.length){L.push("RÉACTIONS");N.reactions.forEach(t=>L.push(`• ${t.n}. ${t.t}`))}
  if(N.notes)L.push("Notes : "+N.notes);return L.join("\n")}

/* ---------- éditeur ---------- */
const inp=(path,label,val,ph,type)=>`<label class="f"><span>${label}</span><input type="${type||"text"}" data-n="${path}" value="${esc(val)}" placeholder="${esc(ph||"")}"></label>`;
const sel=(path,label,opts,val)=>`<label class="f"><span>${label}</span><select data-n="${path}">${opts.map(o=>`<option ${o===val?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`;
function editor(){
  let h=`<div class="card"><h2>Partir d'un modèle</h2><div class="small">Profils des règles de base. Choisis-en un puis modifie tout ce que tu veux (nom, stats, attaques…).</div>
   <div class="grid tgrid" style="margin-top:8px">${Object.entries(TEMPLATES).map(([k,t])=>`<button class="opt preset" data-tpl="${esc(k)}"><b>${esc(k)}</b><span>FP ${t.cr} · ${esc(t.type.replace(/ \(.*\)/,""))} · ${ROLES[t.role]}</span></button>`).join("")}</div>
   <div class="small" style="margin-top:6px">⚠ Charger un modèle remplace la créature en cours.</div></div>`;
  h+=`<div class="card"><h2>Identité</h2><div class="row" style="align-items:center"><div style="flex:3">${inp("name","Nom",N.name,"ex. Grishnak le Borgne")}</div><div class="tokpick" style="flex:0;min-width:0">${N.token?`<img src="${N.token}" class="tokprev">`:`<div class="tokprev empty">?</div>`}<label class="mini" style="cursor:pointer">🖼️ Jeton<input type="file" accept="image/*" id="npcTok" hidden></label>${N.token?`<button class="mini" id="npcTokDel">✕</button>`:""}</div></div>
   <div class="grid" style="grid-template-columns:repeat(3,1fr)">${Object.entries(ROLES).map(([k,v])=>`<label class="opt ${N.role===k?"sel":""}"><input type="radio" name="npcRole" value="${k}" ${N.role===k?"checked":""}><b>${v}</b></label>`).join("")}</div>
   <div class="row" style="margin-top:10px">${sel("size","Taille",SIZES,N.size)}${inp("type","Type",N.type,"ex. Humanoïde (orc)")}${sel("align","Alignement",ALIGNS,N.align)}</div>
   <datalist id="typeList">${TYPES.map(t=>`<option>${t}</option>`).join("")}</datalist></div>`;
  h+=`<div class="card"><h2>Combat</h2><div class="row">${inp("ac","Classe d'armure",N.ac,"","number")}${inp("acTxt","Armure (texte)",N.acTxt,"ex. armure de cuir, bouclier")}</div>
   <div class="row">${inp("hp","Points de vie (dés)",N.hp,"ex. 2d8+2")}${inp("speed","Vitesse",N.speed,"ex. 9 m, vol 18 m")}${sel("cr","Facteur de puissance (FP)",CRS,N.cr)}</div>
   <div class="small">Moyenne des PV : <b id="hpAvg">${avgDice(N.hp)??"formule invalide"}</b> · Bonus de maîtrise selon le FP : <b>+${PB()}</b> · Une créature FP 1/4 est un bon adversaire pour un perso de niveau 1.</div></div>`;
  h+=`<div class="card"><h2>Caractéristiques</h2><div class="abil">${ABS.map(a=>`<div class="ab"><div class="n">${a}</div><input type="number" min="1" max="30" data-n="ab.${a}" value="${N.ab[a]}" style="text-align:center;font-size:1.3rem"><span class="m" data-mod="${a}">${sgn(M(a))}</span></div>`).join("")}</div></div>`;
  h+=`<div class="card"><h2>Maîtrises</h2><h3>Jets de sauvegarde</h3><div class="chk">${ABS.map(a=>`<label class="${N.saves.includes(a)?"sel":""}"><input type="checkbox" data-save="${a}" ${N.saves.includes(a)?"checked":""}>${a}</label>`).join("")}</div>
   <h3 style="margin-top:12px">Compétences <span class="small">(clic : rien → maîtrise ● → expertise ●●)</span></h3><div class="chk">${SKL.map(([s,a])=>{const l=N.skills[s]||0;return `<label class="${l?"sel":""}" data-skc="${s}">${l===2?"●●":l===1?"●":"○"} ${s} <span class="small">${l?sgn(skillBonus(s)):""}</span></label>`}).join("")}</div></div>`;
  h+=`<div class="card"><h2>Défenses, sens et langues</h2><div class="row">${inp("vuln","Vulnérabilités aux dégâts",N.vuln,"ex. contondants")}${inp("res","Résistances aux dégâts",N.res,"ex. feu")}</div>
   <div class="row">${inp("immun","Immunités aux dégâts",N.immun,"ex. poison")}${inp("condImm","Immunités aux états",N.condImm,"ex. empoisonné")}</div>
   <div class="row">${inp("senses","Sens",N.senses,"ex. vision dans le noir 18 m")}${inp("langs","Langues",N.langs,"ex. commun, orc")}</div></div>`;
  const listCard=(key,title,hint)=>`<div class="card"><h2>${title}</h2><div class="small">${hint}</div>${N[key].map((t,i)=>`<div class="lrow"><input type="text" data-n="${key}.${i}.n" value="${esc(t.n)}" placeholder="Nom"><textarea data-n="${key}.${i}.t" placeholder="Description">${esc(t.t)}</textarea><button class="btn sec del" data-ldel="${key}.${i}">✕</button></div>`).join("")}<button class="btn sec" data-ladd="${key}">+ Ajouter</button></div>`;
  h+=listCard("traits","Capacités spéciales","Ce que la créature fait de particulier (fuite agile, résistance à la magie, tactique de groupe…).");
  h+=`<div class="card"><h2>Actions</h2><div class="small">Pour une attaque d'arme, le bonus pour toucher (carac + maîtrise) et les dégâts moyens se calculent tout seuls. « Autre » sert pour les attaques multiples, les sorts, les souffles…</div>
   ${N.actions.map((a,i)=>`<div class="arow">
     <div class="row"><input type="text" data-n="actions.${i}.n" value="${esc(a.n)}" placeholder="Nom (ex. Morsure)"><select data-n="actions.${i}.kind"><option value="melee" ${a.kind==="melee"?"selected":""}>Corps-à-corps</option><option value="ranged" ${a.kind==="ranged"?"selected":""}>Distance</option><option value="autre" ${a.kind==="autre"?"selected":""}>Autre</option></select><button class="btn sec del" data-adel="${i}" style="flex:0">✕</button></div>
     ${a.kind==="autre"?`<textarea data-n="actions.${i}.extra" placeholder="Description">${esc(a.extra)}</textarea>`:`<div class="row"><select data-n="actions.${i}.ab">${ABS.map(x=>`<option ${x===a.ab?"selected":""}>${x}</option>`).join("")}</select><input type="text" data-n="actions.${i}.range" value="${esc(a.range)}" placeholder="allonge 1,50 m / portée 24/96 m"><input type="text" data-n="actions.${i}.dice" value="${esc(a.dice)}" placeholder="dés (1d8)"><input type="text" data-n="actions.${i}.dtype" value="${esc(a.dtype)}" placeholder="type (tranchants)"></div>
     <input type="text" data-n="actions.${i}.extra" value="${esc(a.extra)}" placeholder="Effet en plus (optionnel)"><div class="small" data-acalc="${i}">→ ${sgn(atk(a))} pour toucher, ${dmgAvg(a)??"?"} (${esc(dmgFormula(a))}) dégâts</div>`}
   </div>`).join("")}
   <div class="row" style="flex:0"><button class="btn sec" data-aadd="melee">+ Attaque au corps-à-corps</button><button class="btn sec" data-aadd="ranged">+ Attaque à distance</button><button class="btn sec" data-aadd="autre">+ Autre action</button></div></div>`;
  h+=listCard("reactions","Réactions","Ce que la créature peut faire hors de son tour (parade, riposte…).");
  h+=`<div class="card"><h2>Notes du MJ</h2><textarea data-n="notes" placeholder="Tactique, motivation, lien avec l'histoire, butin…">${esc(N.notes)}</textarea></div>`;
  return h}

/* ---------- rendu ---------- */
function renderNpc(){
  const page=$("#npcPage");
  page.innerHTML=`<div class="npcgrid"><div>${editor()}</div><div class="sbwrap">${statBlock()}</div></div>`;
  page.querySelector('[data-n="type"]').setAttribute("list","typeList");persist()}
function refreshPreview(){$(".sbwrap").innerHTML=statBlock();
  const ha=$("#hpAvg");if(ha)ha.textContent=avgDice(N.hp)??"formule invalide";
  ABS.forEach(a=>{const e=document.querySelector(`[data-mod="${a}"]`);if(e)e.textContent=sgn(M(a))});
  N.actions.forEach((a,i)=>{const e=document.querySelector(`[data-acalc="${i}"]`);if(e)e.textContent=`→ ${sgn(atk(a))} pour toucher, ${dmgAvg(a)??"?"} (${dmgFormula(a)}) dégâts`});
  persist()}
function setPath(p,v){const k=p.split(".");let o=N;for(let i=0;i<k.length-1;i++)o=o[k[i]];const last=k[k.length-1];
  o[last]=(p.startsWith("ab.")||p==="ac")?(v===""?"":+v):v}

const page=$("#npcPage");
page.addEventListener("input",e=>{const t=e.target;if(!t.dataset.n)return;setPath(t.dataset.n,t.value);refreshPreview()});
page.addEventListener("change",async e=>{const t=e.target;
  if(t.id==="npcTok"&&t.files[0]){N.token=await tokImg(t.files[0]);renderNpc();return}
  if(t.name==="npcRole"){N.role=t.value;renderNpc();return}
  if(t.dataset.save){const i=N.saves.indexOf(t.dataset.save);if(i>=0)N.saves.splice(i,1);else N.saves.push(t.dataset.save);renderNpc();return}
  if(t.dataset.n){setPath(t.dataset.n,t.value);if(/kind$|^cr$/.test(t.dataset.n))renderNpc();else refreshPreview()}});
page.addEventListener("click",e=>{const t=e.target;const c=s=>t.closest(s);
  let el;
  if(el=c("[data-tpl]")){N=JSON.parse(JSON.stringify(TEMPLATES[el.dataset.tpl]));npcSaveId=null;renderNpc();window.scrollTo(0,0);toast("Modèle chargé : "+el.dataset.tpl);return}
  if(el=c("[data-skc]")){e.preventDefault();const s=el.dataset.skc;N.skills[s]=((N.skills[s]||0)+1)%3;if(!N.skills[s])delete N.skills[s];renderNpc();return}
  if(el=c("[data-ladd]")){N[el.dataset.ladd].push({n:"",t:""});renderNpc();return}
  if(el=c("[data-ldel]")){const [k,i]=el.dataset.ldel.split(".");N[k].splice(+i,1);renderNpc();return}
  if(el=c("[data-aadd]")){const k=el.dataset.aadd;N.actions.push(k==="autre"?O("",""):W("",k,k==="ranged"?"DEX":"FOR",k==="ranged"?"portée 24/96 m":"allonge 1,50 m","1d6",""));renderNpc();return}
  if(el=c("[data-adel]")){N.actions.splice(+el.dataset.adel,1);renderNpc();return}
  if(t.id==="npcTokDel"){N.token=null;renderNpc();return}
  if(t.id==="rollHp"){const r=rollDice(N.hp);$("#hpRes").textContent="→ "+r.tot+" PV "+r.txt;return}
  if(t.id==="npcCopy"){navigator.clipboard.writeText(statText()).then(()=>toast("Copié !"),()=>toast("Copie impossible ici"));return}
  if(el=c("[data-roll-act]")){const a=N.actions[+el.dataset.rollAct];const d=1+Math.floor(Math.random()*20);const crit=d===20;
    const dm=rollDice(crit?a.dice.replace(/(\d*)d(\d+)/g,(m,n,f)=>(2*(+n||1))+"d"+f)+(M(a.ab)?sgn(M(a.ab)):""):dmgFormula(a));
    {const msg=`${N.name||"Créature"} · ${a.n} : ${d===1?"1 naturel, raté !":`${d+atk(a)} pour toucher (d20 = ${d})${crit?" CRITIQUE !":""} · ${dm.tot} dégâts`}`;toast(msg,4000);publicRoll(msg)}return}
});

/* ---------- sauvegardes ---------- */
let NS={show:false,items:null};
const npcSummary=()=>`${ROLES[N.role]} · FP ${N.cr} · ${N.type}`;
function renderNS(){$("#npcSavesBox").innerHTML=NS.show?savesPanel("pnj",NS.items,npcSaveId,"créatures"):""}
async function refreshNS(){NS.items=null;renderNS();NS.items=await Store.list("pnj");renderNS()}
$("#npcSaveBtn").onclick=async()=>{try{const r=await Store.save("pnj",npcSaveId,N.name,npcSummary(),JSON.parse(JSON.stringify(N)));npcSaveId=r.id;persist();
  toast(r.where==="api"?"Créature sauvegardée dans la base !":r.where==="cloud"?"Créature sauvegardée en ligne !":"Créature sauvegardée sur cet appareil");if(NS.show)refreshNS()}catch(e){toast("Échec de la sauvegarde")}};
$("#npcLoadBtn").onclick=()=>{NS.show=!NS.show;if(NS.show)refreshNS();else renderNS()};
$("#npcNewBtn").onclick=()=>{NS.show=false;$("#npcSavesBox").innerHTML=`<div class="card confirm"><h2>Effacer ${esc(N.name||"cette créature")} ?</h2><p>La créature en cours sera effacée (pas celles que tu as sauvegardées).</p><div class="row" style="flex:0"><button class="btn" id="npcYes">Oui, nouvelle créature</button><button class="btn sec" id="npcNo">Annuler</button></div></div>`;window.scrollTo(0,0)};
$("#npcSavesBox").addEventListener("click",async e=>{const t=e.target;
  if(t.id==="npcYes"){N=BLANK();npcSaveId=null;renderNS();renderNpc();toast("Nouvelle créature !");return}
  if(t.id==="npcNo"){renderNS();return}const it=id=>(NS.items||[]).find(x=>x.id===id);
  if(t.dataset.sload){const x=it(t.dataset.sload);N=Object.assign(BLANK(),x.data);npcSaveId=x.id;NS.show=false;renderNS();renderNpc();toast("« "+x.name+" » ouvert");}
  else if(t.dataset.scode){const x=it(t.dataset.scode);$("#npcSavesBox #codeOut").innerHTML=`<div class="hint">Code de <b>${esc(x.name)}</b> : envoie-le à un pote, il le colle dans « Importer ».</div><textarea readonly onclick="this.select()">${Store.exportCode({kind:"pnj",name:x.name,data:x.data})}</textarea>`}
  else if(t.dataset.sdel){if(!t.dataset.c){t.dataset.c=1;t.textContent="Sûr ?";return}await Store.remove(t.dataset.sdel,"pnj");if(t.dataset.sdel===npcSaveId)npcSaveId=null;refreshNS();toast("Supprimé")}
  else if(t.id==="importBtn"){try{const o=Store.importCode($("#npcSavesBox #importBox").value);if(o.kind!=="pnj")return toast("Ce code est celui d'un perso, pas d'une créature");
    N=Object.assign(BLANK(),o.data);npcSaveId=null;NS.show=false;renderNS();renderNpc();toast("Importé ! Pense à sauvegarder")}catch(err){toast("Code invalide")}}});
Store.onReady(()=>{if(NS.show)refreshNS()});

/* ---------- navigation entre les pages ---------- */
const VIEWS={persos:"viewPersos",pnj:"viewPnj",combat:"viewCombat",carte:"viewCarte",journal:"viewJournal",groupe:"viewGroupe",outils:"viewOutils",ecran:"viewCarte",joueur:"viewJoueur",admin:"viewAdmin"};
const TITLES={persos:"Créateur de personnage D&D 5e",pnj:"Ennemis & alliés — D&D 5e",combat:"Combat — D&D 5e",carte:"Carte — D&D 5e",journal:"Journal — D&D 5e",groupe:"Groupe — D&D 5e",outils:"Outils du MJ — D&D 5e",ecran:"📺 Écran joueurs — D&D 5e",joueur:"Ma fiche — D&D 5e",admin:"Admin — D&D 5e"};
function route(){let v=location.hash.slice(1);if(!VIEWS[v])v="persos";
  Object.entries(VIEWS).forEach(([k,id])=>{const el=document.getElementById(id);if(el)el.hidden=id!==VIEWS[v];const tab=document.querySelector(`.tabs a[href="#${k}"]`);if(tab)tab.classList.toggle("on",k===v)});
  document.title=TITLES[v];if(v==="pnj")renderNpc();document.dispatchEvent(new CustomEvent("view",{detail:v}))}
window.addEventListener("hashchange",()=>{route();window.scrollTo(0,0)});
window.routeView=route;
})();
