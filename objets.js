/* ===================== OBJETS MAGIQUES ===================== */
// mods : ac (CA), save (sauvegardes), check (tests), acNoArmor (CA sans armure ni bouclier), set {CAR:valeur} (caractéristique fixée),
//        weapon N (arme +N, au choix), armor N (armure portée +N), shield N (bouclier +N), heal "formule" (potion), spellAtk N
const OBJ=(nom,type,rarete,harmo,effet,mods)=>({nom,type,rarete,harmo:!!harmo,effet,mods:mods||{}});
let OBJETS=[
 OBJ("Potion de soins","Potion","commune",0,"Rend 2d4 + 2 PV.",{heal:"2d4+2"}),
 OBJ("Potion de soins supérieurs","Potion","peu commune",0,"Rend 4d4 + 4 PV.",{heal:"4d4+4"}),
 OBJ("Potion de soins puissants","Potion","rare",0,"Rend 8d4 + 8 PV.",{heal:"8d4+8"}),
 OBJ("Potion de soins suprêmes","Potion","très rare",0,"Rend 10d4 + 20 PV.",{heal:"10d4+20"}),
 OBJ("Potion d'escalade","Potion","commune",0,"Vitesse d'escalade égale à ta vitesse et avantage en Athlétisme pour grimper pendant 1 h."),
 OBJ("Potion de respiration aquatique","Potion","peu commune",0,"Respirer sous l'eau pendant 1 h."),
 OBJ("Potion de résistance","Potion","peu commune",0,"Résistance à un type de dégâts pendant 1 h."),
 OBJ("Potion de force de géant des collines","Potion","peu commune",0,"FOR 21 pendant 1 h."),
 OBJ("Potion d'héroïsme","Potion","rare",0,"10 PV temporaires et l'effet de Bénédiction pendant 1 h."),
 OBJ("Potion d'invisibilité","Potion","très rare",0,"Invisible pendant 1 h, jusqu'à ce que tu attaques ou lances un sort."),
 OBJ("Potion de vol","Potion","très rare",0,"Vitesse de vol égale à ta vitesse pendant 1 h."),
 OBJ("Potion de rapidité","Potion","très rare",0,"Effet de Hâte pendant 1 min, sans concentration."),
 OBJ("Antidote","Potion","commune",0,"Avantage aux sauvegardes contre le poison pendant 1 h."),
 OBJ("Arme +1","Arme","peu commune",0,"+1 aux jets d'attaque et de dégâts avec cette arme.",{weapon:1}),
 OBJ("Arme +2","Arme","rare",0,"+2 aux jets d'attaque et de dégâts avec cette arme.",{weapon:2}),
 OBJ("Arme +3","Arme","très rare",0,"+3 aux jets d'attaque et de dégâts avec cette arme.",{weapon:3}),
 OBJ("Langue de feu","Arme","rare",1,"Action bonus : la lame s'enflamme, +2d6 feu aux dégâts et lumière sur 12 m."),
 OBJ("Arme vicieuse","Arme","rare",0,"Sur un 20 naturel, +7 dégâts du type de l'arme."),
 OBJ("Javeline de foudre","Arme","peu commune",0,"1 fois par jour : se transforme en éclair, ligne de 36 m, 4d6 foudre (DEX 13)."),
 OBJ("Munitions +1 (×10)","Arme","peu commune",0,"+1 aux jets d'attaque et de dégâts, détruites après avoir touché."),
 OBJ("Armure +1","Armure","rare",0,"+1 à la CA quand tu portes cette armure.",{armor:1}),
 OBJ("Armure +2","Armure","très rare",0,"+2 à la CA quand tu portes cette armure.",{armor:2}),
 OBJ("Bouclier +1","Armure","peu commune",0,"+1 à la CA en plus du bonus normal du bouclier.",{shield:1}),
 OBJ("Bouclier +2","Armure","rare",0,"+2 à la CA en plus du bonus normal du bouclier.",{shield:2}),
 OBJ("Armure de résistance","Armure","rare",1,"Résistance à un type de dégâts (feu, froid, foudre…)."),
 OBJ("Armure en mithral","Armure","peu commune",0,"Pas de désavantage en Discrétion, pas de Force minimale."),
 OBJ("Anneau de protection","Anneau","rare",1,"+1 à la CA et aux jets de sauvegarde.",{ac:1,save:1}),
 OBJ("Anneau de résistance","Anneau","rare",1,"Résistance à un type de dégâts lié à la pierre de l'anneau."),
 OBJ("Anneau de saut","Anneau","peu commune",1,"Saut à volonté (distance de saut triplée)."),
 OBJ("Anneau de nage","Anneau","peu commune",0,"Vitesse de nage de 12 m."),
 OBJ("Anneau de chaleur constante","Anneau","peu commune",1,"Résistance au froid, à l'aise par grand froid."),
 OBJ("Anneau d'action libre","Anneau","rare",1,"Le terrain difficile ne ralentit pas, immunisé à la paralysie et à l'entrave magiques."),
 OBJ("Anneau d'esquive totale","Anneau","rare",1,"3 charges : réaction, réussir une sauvegarde de DEX ratée."),
 OBJ("Cape de protection","Objet merveilleux","peu commune",1,"+1 à la CA et aux jets de sauvegarde.",{ac:1,save:1}),
 OBJ("Bracelets de défense","Objet merveilleux","rare",1,"+2 à la CA si tu ne portes ni armure ni bouclier.",{acNoArmor:2}),
 OBJ("Gantelets de puissance d'ogre","Objet merveilleux","peu commune",1,"Ta Force passe à 19.",{set:{FOR:19}}),
 OBJ("Amulette de santé","Objet merveilleux","rare",1,"Ta Constitution passe à 19.",{set:{CON:19}}),
 OBJ("Bandeau d'intellect","Objet merveilleux","peu commune",1,"Ton Intelligence passe à 19.",{set:{INT:19}}),
 OBJ("Pierre porte-bonheur","Objet merveilleux","peu commune",1,"+1 aux tests de caractéristique et aux jets de sauvegarde.",{save:1,check:1}),
 OBJ("Bottes elfiques","Objet merveilleux","peu commune",0,"Tes pas sont silencieux : avantage en Discrétion pour te déplacer sans bruit."),
 OBJ("Cape elfique","Objet merveilleux","peu commune",1,"Avantage en Discrétion, désavantage pour te repérer à la vue."),
 OBJ("Bottes de rapidité","Objet merveilleux","rare",1,"Action bonus : vitesse doublée et attaques d'opportunité désavantagées, 10 min par jour."),
 OBJ("Bottes de sept lieues","Objet merveilleux","peu commune",1,"Vitesse de marche 9 m, saut triplé."),
 OBJ("Lunettes de nuit","Objet merveilleux","peu commune",0,"Vision dans le noir à 18 m."),
 OBJ("Sac sans fond","Objet merveilleux","peu commune",0,"Contient jusqu'à 250 kg dans un espace extradimensionnel, pèse toujours 7,5 kg."),
 OBJ("Broche de bouclier","Objet merveilleux","peu commune",1,"Résistance aux dégâts de force, immunité à Projectile magique."),
 OBJ("Corde d'escalade","Objet merveilleux","peu commune",0,"18 m de corde qui bouge et se noue sur ordre."),
 OBJ("Heaume de compréhension des langues","Objet merveilleux","peu commune",0,"Compréhension des langues à volonté."),
 OBJ("Médaillon des pensées","Objet merveilleux","peu commune",1,"3 charges : Détection des pensées (DD 13)."),
 OBJ("Amulette d'antidétection","Objet merveilleux","peu commune",1,"Invisible à la magie de divination."),
 OBJ("Perle de thaumaturgie","Objet merveilleux","peu commune",1,"1 fois par jour : récupère un emplacement de sort de niveau 3 ou moins."),
 OBJ("Baguette de projectiles magiques","Baguette","peu commune",0,"7 charges : Projectile magique (1 charge par niveau d'emplacement), récupère 1d6+1 charges à l'aube."),
 OBJ("Baguette du mage de guerre +1","Baguette","peu commune",1,"+1 aux jets d'attaque des sorts, ignore les abris partiels.",{spellAtk:1}),
 OBJ("Bâton de la vipère","Bâton","peu commune",1,"Action bonus : la tête devient un serpent venimeux, +1d6 poison… (CON)."),
 OBJ("Parchemin de sort","Parchemin","variable",0,"Permet de lancer une fois le sort écrit dessus, s'il est sur la liste de ta classe.")
];
const findObj=n=>{if(!n)return null;const ex=OBJETS.find(o=>o.nom===n);if(ex)return ex;const c=OBJETS.filter(o=>n.startsWith(o.nom)).sort((a,b)=>b.nom.length-a.nom.length);return c[0]||null};
function activeItems(){return (S.items||[]).map(it=>({it,o:findObj(it.nom)})).filter(x=>x.o&&(!x.o.harmo||x.it.att))}
function itemSaveBonus(){return activeItems().reduce((a,x)=>a+(x.o.mods.save||0),0)}
function itemCheckBonus(){return activeItems().reduce((a,x)=>a+(x.o.mods.check||0),0)}
/* -- effets branchés sur les calculs du créateur -- */
(()=>{
  const _score=window.score;window.score=function(a){const s=_score(a);if(s===null)return s;let v=s;activeItems().forEach(x=>{const st=x.o.mods.set;if(st&&st[a]&&st[a]>v)v=st[a]});return v};
  const _ac=window.armorClass;window.armorClass=function(){const r=_ac();const items=chosenItems();const armor=items.find(i=>i.a),shield=items.some(i=>i.sh);let v=r.v,txt=r.txt;const add=[];
    activeItems().forEach(x=>{const m=x.o.mods;if(m.ac){v+=m.ac;add.push(x.o.nom)}if(m.armor&&armor&&!/sans armure|Défense sans armure|Résistance draconique/.test(r.txt)){v+=m.armor;add.push(x.o.nom)}
      if(m.shield&&shield&&/bouclier/.test(r.txt)){v+=m.shield;add.push(x.o.nom)}if(m.acNoArmor&&!armor&&!shield){v+=m.acNoArmor;add.push(x.o.nom)}});
    return Object.assign({},r,{v,txt:txt+(add.length?" + "+add.join(", "):"")})};
  const _att=window.attacks;window.attacks=function(){const out=_att();const bon={};activeItems().forEach(x=>{if(x.o.mods.weapon&&x.it.arme)bon[x.it.arme]=Math.max(bon[x.it.arme]||0,x.o.mods.weapon)});
    return out.map(a=>{const n=bon[a.n];if(!n)return a;const at=parseInt(a.atk);const dm=a.dmg.replace(/(\d+d\d+)([+-]\d+)?/g,(m,d,k)=>d+sgn((parseInt(k)||0)+n));
      return Object.assign({},a,{n:a.n+" +"+n,atk:a.atk.replace(/^[+-]?\d+/,sgn(at+n)),dmg:dm})})};
  const _skill=window.skillTotal;window.skillTotal=function(sk){return _skill(sk)+itemCheckBonus()};
  const _si=window.spellInfoL;window.spellInfoL=function(){const r=_si();if(!r)return r;const b=activeItems().reduce((a,x)=>a+(x.o.mods.spellAtk||0),0);if(b)r.atk=sgn(parseInt(r.atk)+b);return r};
  const _fl=window.featList;window.featList=function(){const f=_fl();(S.items||[]).forEach(it=>{const o=findObj(it.nom);if(!o)return f.push(["Objet",it.nom]);
    f.push(["Objet magique",`${it.nom}${it.arme?" ("+it.arme+")":""}${it.q>1?" ×"+it.q:""}${o.harmo?(it.att?" — harmonisé":" — non harmonisé, sans effet"):""} : ${o.effet}`])});return f};
})();
/* -- interface : carte « Objets magiques » dans l'étape En partie -- */
let objSearch=null;
function objCard(){const items=S.items||[];const att=items.filter(i=>i.att).length;const weapons=[...new Set(attacks().map(a=>a.n.replace(/ \+\d$/,"")).filter(n=>W[n]))];
  let h=`<div class="card"><div class="chead"><h3 style="margin:0">✨ Objets magiques <span class="small">harmonisation ${att}/3</span></h3><button class="btn sec" data-oo="search">${objSearch!==null?"Fermer":"+ Ajouter un objet"}</button></div>`;
  if(objSearch!==null){const q=objSearch.toLowerCase();const res=OBJETS.filter(o=>!q||(o.nom+" "+o.type+" "+o.effet).toLowerCase().includes(q)).slice(0,30);
    h+=`<input type="text" id="oSearch" value="${esc(objSearch)}" placeholder="Chercher : potion, anneau, +1…" style="margin:8px 0"><div class="olist">${res.map(o=>`<div class="oitem"><div><b>${esc(o.nom)}</b> <span class="tag">${esc(o.type)}</span><span class="tag">${esc(o.rarete)}</span>${o.harmo?`<span class="tag">harmonisation</span>`:""}<div class="small">${esc(o.effet)}</div></div><button class="mini" data-oadd="${esc(o.nom)}">Ajouter</button></div>`).join("")||`<div class="small">Rien trouvé.</div>`}
      <div class="row" style="margin-top:6px;align-items:flex-end"><label class="f"><span>Objet libre (pas dans la liste)</span><input type="text" id="oFree" placeholder="ex. Dague runique de Marek"></label><button class="btn sec" data-oo="free" style="flex:0;margin-bottom:10px">Ajouter</button></div></div>`}
  if(!items.length)h+=`<p class="small">Aucun objet magique. Ajoute-les ici ou depuis le butin des Outils du MJ.</p>`;
  h+=items.map((it,i)=>{const o=findObj(it.nom);return `<div class="oitem ${o&&o.harmo&&!it.att?"off":""}"><div style="flex:1"><b>${esc(it.nom)}</b> ${o?`<span class="tag">${esc(o.rarete)}</span>`:""}
     <div class="small">${esc(o?o.effet:"Objet libre")}</div>
     ${o&&o.mods.weapon?`<label class="small">Arme : <select data-oarme="${i}" style="width:auto;padding:2px 6px"><option value="">— choisir —</option>${weapons.map(w=>`<option ${it.arme===w?"selected":""}>${w}</option>`).join("")}</select></label>`:""}</div>
     <div class="oact">${o&&o.harmo?`<label class="small"><input type="checkbox" data-oatt="${i}" ${it.att?"checked":""}> harmonisé</label>`:""}
       <input type="number" min="0" data-oq="${i}" value="${it.q||1}" style="width:58px" title="Quantité">${o&&o.mods.heal?`<button class="mini" data-odrink="${i}">🍷 Boire</button>`:""}<button class="mini" data-odel="${i}">✕</button></div></div>`}).join("");
  return h+`</div>`}
function giveItem(nom){if(!S.race||!S.cls){toast("Ouvre d'abord un perso dans l'onglet Personnages");return false}S.items=S.items||[];const ex=S.items.find(i=>i.nom===nom&&!findObj(nom)?.mods.weapon);
  if(ex&&findObj(nom)&&findObj(nom).type==="Potion")ex.q=(ex.q||1)+1;else S.items.push({nom,q:1,att:false,arme:null});save();return true}
// injecte la carte dans l'étape En partie
const _pPlay=window.pPlay;window.pPlay=function(){let h=_pPlay();if(!S.race||!S.cls||!S.bg)return h;const i=h.indexOf('<div class="card"><h3>États</h3>');return i>=0?h.slice(0,i)+objCard()+h.slice(i):h+objCard()};
document.addEventListener("click",e=>{const t=e.target;if(S.step!==9||!t.closest)return;let x;
  if(x=t.closest("[data-oo]")){e.stopPropagation();if(x.dataset.oo==="search"){objSearch=objSearch===null?"":null;rerenderKeep();setTimeout(()=>{const s=document.getElementById("oSearch");s&&s.focus()},30)}
    if(x.dataset.oo==="free"){const n=(document.getElementById("oFree").value||"").trim();if(n){giveItem(n);rerenderKeep()}}return}
  if(x=t.closest("[data-oadd]")){e.stopPropagation();giveItem(x.dataset.oadd);toast(x.dataset.oadd+" ajouté");rerenderKeep();return}
  if(x=t.closest("[data-odel]")){e.stopPropagation();S.items.splice(+x.dataset.odel,1);rerenderKeep();return}
  if(x=t.closest("[data-odrink]")){e.stopPropagation();const it=S.items[+x.dataset.odrink],o=findObj(it.nom);const r=Dice.roll(o.mods.heal);const p=P();const before=p.hp;p.hp=Math.min(hp(),p.hp+r.tot);if(before===0)p.death={s:0,f:0};
    it.q=(it.q||1)-1;if(it.q<=0)S.items.splice(+x.dataset.odrink,1);logRoll(`${it.nom} : +${r.tot} PV (${r.txt})`);rerenderKeep();return}},true);
document.addEventListener("change",e=>{const t=e.target;if(S.step!==9||!t.dataset)return;
  if(t.dataset.oatt!==undefined){e.stopImmediatePropagation();const n=(S.items||[]).filter(i=>i.att).length;const it=S.items[+t.dataset.oatt];if(t.checked&&n>=3){t.checked=false;return toast("3 objets harmonisés maximum")}it.att=t.checked;rerenderKeep()}
  if(t.dataset.oq!==undefined){e.stopImmediatePropagation();S.items[+t.dataset.oq].q=Math.max(0,+t.value||0);save()}
  if(t.dataset.oarme!==undefined){e.stopImmediatePropagation();S.items[+t.dataset.oarme].arme=t.value||null;rerenderKeep()}},true);
document.addEventListener("input",e=>{if(e.target.id==="oSearch"){objSearch=e.target.value;const pos=e.target.selectionStart;rerenderKeep();const s=document.getElementById("oSearch");if(s){s.focus();s.setSelectionRange(pos,pos)}}},true);
