/* ===================== NIVEAUX 6 À 10 ===================== */
function pbFor(l){return l>=9?4:l>=5?3:2}
Object.assign(SLOTS_FULL,{6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],9:[4,3,3,3,1],10:[4,3,3,3,2]});
Object.assign(SLOTS_HALF,{6:[4,2],7:[4,3],8:[4,3],9:[4,3,2],10:[4,3,2]});
Object.assign(PACT,{6:[2,3],7:[2,4],8:[2,4],9:[2,5],10:[2,5]});
CASTER.Barde.cant=[2,2,2,3,3,3,3,3,3,4];CASTER.Barde.known=[4,5,6,7,8,9,10,11,12,14];
CASTER.Clerc.cant=[3,3,3,4,4,4,4,4,4,5];CASTER.Druide.cant=[2,2,2,3,3,3,3,3,3,4];
CASTER.Ensorceleur.cant=[4,4,4,5,5,5,5,5,5,6];CASTER.Ensorceleur.known=[2,3,4,5,6,7,8,9,10,11];
CASTER.Magicien.cant=[3,3,3,4,4,4,4,4,4,5];CASTER.Occultiste.cant=[2,2,2,3,3,3,3,3,3,4];CASTER.Occultiste.known=[2,3,4,5,6,7,8,9,10,10];
CASTER.Paladin.cant=Array(10).fill(0);CASTER["Rôdeur"].cant=Array(10).fill(0);CASTER["Rôdeur"].known=[0,2,3,3,4,4,5,5,6,6];

function maxSpellLevel(){const c=CASTER[S.cls];if(!c)return 0;const l=LV();
  if(c.type==="full"||c.type==="pact")return Math.min(5,Math.ceil(l/2));
  if(c.type==="half")return l>=9?3:l>=5?2:l>=2?1:0;return 0}
function slotsArr(){const c=CASTER[S.cls];if(!c)return [];const l=LV();
  if(c.type==="full")return SLOTS_FULL[l];if(c.type==="half")return SLOTS_HALF[l];
  if(c.type==="pact"){const [n,lv]=PACT[l];const a=Array(lv).fill(0);a[lv-1]=n;return a}return []}

/* ---------- listes de sorts : niveau 3 des demi-lanceurs, niveaux 4 et 5 ---------- */
LVL3.Paladin=["Arme élémentaire","Aura de vitalité","Cercle magique","Châtiment aveuglant","Création de nourriture et d'eau","Délivrance des malédictions","Dissipation de la magie","Lumière du jour","Manteau du croisé","Retour à la vie"];
LVL3["Rôdeur"]=["Antidétection","Communication avec les plantes","Croissance végétale","Flèche de foudre","Lumière du jour","Marche sur l'eau","Mur de vent","Protection contre une énergie","Respiration aquatique","Tir de barrage"];
const LVL4={
 Barde:["Compulsion","Confusion","Invisibilité supérieure","Liberté de mouvement","Localisation de créature","Métamorphose","Porte dimensionnelle","Terrain hallucinatoire"],
 Clerc:["Bannissement","Contrôle de l'eau","Divination","Façonnage de la pierre","Gardien de la foi","Liberté de mouvement","Localisation de créature","Protection contre la mort"],
 Druide:["Confusion","Contrôle de l'eau","Domination de bête","Façonnage de la pierre","Flétrissement","Insecte géant","Invocation d'élémentaires mineurs","Invocation d'êtres des bois","Liberté de mouvement","Localisation de créature","Métamorphose","Mur de feu","Peau de pierre","Tempête de grêle","Terrain hallucinatoire"],
 Ensorceleur:["Bannissement","Confusion","Domination de bête","Flétrissement","Invisibilité supérieure","Métamorphose","Mur de feu","Peau de pierre","Porte dimensionnelle","Tempête de grêle"],
 Occultiste:["Bannissement","Flétrissement","Porte dimensionnelle","Terrain hallucinatoire"],
 Magicien:["Assassin imaginaire","Bannissement","Bouclier de feu","Chien de garde de Mordenkainen","Coffre secret de Léomund","Confusion","Contrôle de l'eau","Façonnage de la pierre","Fabrication","Flétrissement","Invisibilité supérieure","Invocation d'élémentaires mineurs","Localisation de créature","Métamorphose","Mur de feu","Œil magique","Peau de pierre","Porte dimensionnelle","Sanctuaire privé de Mordenkainen","Sphère résiliente d'Otiluke","Tempête de grêle","Tentacules noirs d'Evard","Terrain hallucinatoire"]
};
const LVL5={
 Barde:["Animation des objets","Apparence trompeuse","Cercle de téléportation","Domination de personne","Éveil","Immobilisation de monstre","Lien planaire","Modification de mémoire","Mythes et légendes","Quête","Rappel à la vie","Restauration supérieure","Rêve","Scrutation","Soins de groupe"],
 Clerc:["Colonne de flamme","Communion","Contagion","Dissipation du mal et du bien","Fléau d'insectes","Lien planaire","Mythes et légendes","Quête","Rappel à la vie","Restauration supérieure","Sanctification","Scrutation","Soins de groupe"],
 Druide:["Communion avec la nature","Contagion","Éveil","Fléau d'insectes","Invocation d'élémentaire","Lien planaire","Mur de pierre","Passage par les arbres","Quête","Réincarnation","Restauration supérieure","Scrutation","Soins de groupe"],
 Ensorceleur:["Animation des objets","Apparence trompeuse","Cercle de téléportation","Cône de froid","Création","Domination de personne","Fléau d'insectes","Immobilisation de monstre","Mur de pierre","Nuage mortel","Télékinésie"],
 Occultiste:["Contact avec un autre plan","Immobilisation de monstre","Rêve","Scrutation"],
 Magicien:["Animation des objets","Apparence trompeuse","Cercle de téléportation","Cône de froid","Contact avec un autre plan","Création","Domination de personne","Double illusoire","Immobilisation de monstre","Lien planaire","Lien télépathique de Rary","Main de Bigby","Modification de mémoire","Mur de force","Mur de pierre","Mythes et légendes","Nuage mortel","Passe-muraille","Quête","Rêve","Scrutation","Télékinésie"]
};
// sorts de domaine (clerc) niveaux 7 et 9, et sorts étendus des protecteurs (occultiste)
DOM_SPELLS["Connaissance"].push(["Œil magique","Confusion"],["Mythes et légendes","Scrutation"]);
DOM_SPELLS["Vie"].push(["Gardien de la foi","Protection contre la mort"],["Soins de groupe","Rappel à la vie"]);
DOM_SPELLS["Lumière"].push(["Gardien de la foi","Mur de feu"],["Colonne de flamme","Scrutation"]);
DOM_SPELLS["Nature"].push(["Domination de bête","Liane avide"],["Fléau d'insectes","Passage par les arbres"]);
DOM_SPELLS["Tempête"].push(["Contrôle de l'eau","Tempête de grêle"],["Vague destructrice","Fléau d'insectes"]);
DOM_SPELLS["Tromperie"].push(["Porte dimensionnelle","Métamorphose"],["Domination de personne","Modification de mémoire"]);
DOM_SPELLS["Guerre"].push(["Liberté de mouvement","Peau de pierre"],["Colonne de flamme","Immobilisation de monstre"]);
const PATRON_SP={"Archifée":[["Apaisement des émotions","Force fantasmagorique"],["Clignotement","Croissance végétale"],["Domination de bête","Invisibilité supérieure"],["Domination de personne","Apparence trompeuse"]],
 "Fiélon":[["Cécité/Surdité","Rayon ardent"],["Boule de feu","Nuage nauséabond"],["Bouclier de feu","Mur de feu"],["Fléau d'insectes","Sanctification"]],
 "Grand Ancien":[["Détection des pensées","Force fantasmagorique"],["Clairvoyance","Envoi de message"],["Domination de bête","Tentacules noirs d'Evard"],["Domination de personne","Télékinésie"]]};
function domSpells(){const sb=SUB();if(!sb||!sb.spells)return [];let l=[...sb.spells];const x=DOM_SPELLS[S.sub];
  if(S.cls==="Clerc"&&x){[3,5,7,9].forEach((lv,i)=>{if(LV()>=lv&&x[i])l=l.concat(x[i])})}return l}
function spellLevelOf(s){if(typeof SPELL_LV!=="undefined"&&SPELL_LV[s]!==undefined)return SPELL_LV[s];
  for(const [L,n] of [[LVL2,2],[LVL3,3],[LVL4,4],[LVL5,5]]){for(const k in L)if(L[k].includes(s))return n}
  for(const k in DOM_SPELLS){const d=DOM_SPELLS[k];for(let i=0;i<d.length;i++)if(d[i].includes(s))return i+2}
  for(const k in PATRON_SP){const d=PATRON_SP[k];for(let i=0;i<d.length;i++)if(d[i].includes(s))return i+2}
  return 1}
function spellPool(cls,max,extra){let p=[...(LVL1[cls]||LVL1X[cls]||[])];
  if(max>=2)p=p.concat(LVL2[cls]||[]);if(max>=3)p=p.concat(LVL3[cls]||[]);if(max>=4)p=p.concat(LVL4[cls]||[]);if(max>=5)p=p.concat(LVL5[cls]||[]);
  const ex=[...(extra||[])];if(cls==="Occultiste"&&PATRON_SP[S.sub])PATRON_SP[S.sub].forEach((pair,i)=>{if(max>=i+2)ex.push(...pair)});
  ex.forEach(x=>{if(!p.includes(x))p.push(x)});return [...new Set(p)]}

/* ---------- capacités de classe 6 à 10 ---------- */
const F=(c,o)=>{LVFEATS[c]=LVFEATS[c]||{};Object.entries(o).forEach(([l,a])=>{LVFEATS[c][l]=(LVFEATS[c][l]||[]).concat(a)})};
F("Barbare",{7:["Instinct sauvage : avantage à l'initiative ; si tu es surpris, tu peux agir à ton premier tour en entrant en rage"],9:["Critique brutal : +1 dé de dégâts de l'arme sur un coup critique au corps-à-corps"]});
F("Barde",{6:["Contre-charme : action, tes alliés à 9 m ont l'avantage contre la peur et le charme jusqu'à ton prochain tour"],9:["Chant reposant : d8"],10:["Inspiration bardique : d10","Expertise : 2 compétences de plus","Secrets magiques : 2 sorts de n'importe quelle classe (vois avec ton MJ)"]});
F("Clerc",{6:["Canalisation divine : 2 fois par repos court"],8:["Destruction des morts-vivants : FP 1 ou moins"],10:["Intervention divine : 1 fois par semaine, réussite si d100 ≤ ton niveau de clerc"]});
F("Druide",{8:["Forme sauvage : FP 1, avec vol"]});
F("Ensorceleur",{10:["Métamagie : 3 options"]});
F("Guerrier",{9:["Indomptable : relance une sauvegarde ratée (1 fois par repos long)"]});
F("Moine",{6:["Frappes de ki : tes attaques à mains nues sont magiques","Déplacement sans armure : +4,5 m"],7:["Dérobade : moitié des dégâts sur une sauvegarde DEX ratée, aucun si réussie","Tranquillité d'esprit : action, met fin à un effet de charme ou de peur sur toi"],9:["Déplacement sans armure amélioré : courir sur les murs et sur l'eau pendant ton tour"],10:["Pureté du corps : immunisé aux maladies et au poison","Déplacement sans armure : +6 m"]});
F("Occultiste",{7:["Manifestations occultes : 4 au choix"],9:["Manifestations occultes : 5 au choix"]});
F("Paladin",{6:["Aura de protection : toi et tes alliés à 3 m ajoutez ton mod. CHA (min. +1) aux jets de sauvegarde"],10:["Aura de courage : toi et tes alliés à 3 m ne pouvez pas être effrayés"]});
F("Rôdeur",{6:["Ennemi juré et Explorateur-né améliorés : un nouvel ennemi juré, un nouveau terrain favori"],8:["Traversée des terrains : le terrain difficile non magique ne te ralentit pas, avantage contre les plantes magiques"],10:["Camouflage naturel : +10 en Discrétion en restant immobile, camouflé avec de la boue ou des feuilles","Explorateur-né : un nouveau terrain favori"]});
F("Roublard",{7:["Dérobade : moitié des dégâts sur une sauvegarde DEX ratée, aucun si réussie"]});
// capacités de sous-classe (niveaux 6 à 10)
const SUBFEATS={
 "Voie du berserker":{6:"Rage aveugle : immunisé au charme et à la peur pendant ta rage",10:"Présence intimidante : action, effraie une créature à 9 m (SAG)"},
 "Voie du guerrier totémique":{6:"Aspect de la bête (ours : capacité de port doublée, avantage FOR pour pousser, soulever, briser)",10:"Marcheur spirituel : Communion avec la nature en rituel"},
 "Collège du savoir":{6:"Secrets magiques supplémentaires : 2 sorts de n'importe quelle classe"},
 "Collège de la vaillance":{6:"Attaque supplémentaire : 2 attaques par action Attaquer"},
 "Cercle de la Terre":{6:"Traversée des terrains : le terrain difficile non magique ne te ralentit pas",10:"Protection naturelle : immunisé au poison et aux maladies, pas de charme ni de peur venant d'élémentaires ou de fées"},
 "Cercle de la Lune":{6:"Frappes primitives : tes attaques en forme sauvage sont magiques",10:"Forme élémentaire : 2 utilisations de Forme sauvage pour devenir un élémentaire"},
 "Champion":{7:"Athlète remarquable : + moitié de la maîtrise aux tests FOR, DEX, CON non maîtrisés, saut plus long",10:"Style de combat supplémentaire"},
 "Maître de guerre":{7:"Connais ton ennemi : en observant 1 minute, tu sais si un ennemi est plus fort que toi · 5 dés de supériorité",10:"Dés de supériorité d10, 2 manœuvres de plus"},
 "Chevalier occulte":{7:"Magie de guerre : attaque d'arme en action bonus après un tour de magie",10:"Frappe occulte : désavantage à la sauvegarde contre ton prochain sort après une touche"},
 "Abjuration":{6:"Protection projetée : ta Protection arcanique absorbe les dégâts d'un allié à 9 m",10:"Abjuration améliorée : + maîtrise aux tests de contresort et de dissipation"},
 "Divination":{6:"Expert en divination : récupère un emplacement en lançant une divination",10:"Troisième œil : vision dans le noir, voir l'invisible, lire toutes les langues…"},
 "Enchantement":{6:"Charme instinctif : réaction, détourne une attaque vers une autre créature (SAG)",10:"Enchantement partagé : un charme à une cible peut en viser deux"},
 "Évocation":{6:"Tour de magie puissant : les cibles subissent la moitié des dégâts même en réussissant la sauvegarde",10:"Évocation renforcée : + mod. INT aux dégâts des évocations"},
 "Illusion":{6:"Illusion malléable : modifie tes illusions en action",10:"Double illusoire : réaction, une attaque te rate automatiquement (1 fois par repos court)"},
 "Invocation":{6:"Invocation durable : 30 PV temporaires à tes créatures invoquées",10:"Invocation concentrée : les dégâts ne brisent pas ta concentration sur une invocation"},
 "Nécromancie":{6:"Serviteurs morts-vivants : Animation des morts plus puissante",10:"Endurci contre la non-vie : résistance nécrotique, PV max non réductibles"},
 "Transmutation":{6:"Pierre de transmutation : une pierre qui donne un bonus (vision, vitesse, résistance…)",10:"Métamorphe : Métamorphose sur toi sans emplacement"},
 "Voie de la main ouverte":{6:"Intégrité du corps : action, regagne 3 × ton niveau de moine en PV (1 fois par repos long)"},
 "Voie de l'ombre":{6:"Pas de l'ombre : action bonus, téléportation de 18 m d'une ombre à une autre"},
 "Voie des quatre éléments":{6:"Nouvelle discipline élémentaire"},
 "Pacte de la lame":{},"Pacte de la chaîne":{},"Pacte du grimoire":{},
 "Serment de dévotion":{7:"Aura de dévotion : toi et tes alliés à 3 m ne pouvez pas être charmés"},
 "Serment des anciens":{7:"Aura de garde : toi et tes alliés à 3 m avez la résistance aux dégâts des sorts"},
 "Serment de vengeance":{7:"Vengeur implacable : après une attaque d'opportunité réussie, déplacement de la moitié de ta vitesse"},
 "Chasseur":{7:"Tactique défensive : Échapper à la horde, Défense contre les attaques multiples ou Volonté d'acier"},
 "Maître des bêtes":{7:"Entraînement exceptionnel : ton compagnon peut Foncer, Se désengager, Esquiver ou Aider en action bonus"},
 "Voleur":{9:"Discrétion suprême : avantage en Discrétion si tu ne bouges que de la moitié de ta vitesse"},
 "Assassin":{9:"Expert en infiltration : crée de fausses identités parfaites"},
 "Escroc arcanique":{9:"Embuscade magique : si tu es caché, la cible a un désavantage contre ton sort"},
 // sous-classes de niveau 1
 "Connaissance":{6:"Canalisation divine : lire les pensées d'une créature",8:"Incantation puissante : + mod. SAG aux dégâts des tours de magie"},
 "Vie":{6:"Guérisseur béni : quand tu soignes un autre, tu regagnes 2 + niveau du sort PV",8:"Frappe divine : +1d8 radiants une fois par tour avec une arme"},
 "Lumière":{6:"Lueur protectrice améliorée : protège aussi tes alliés",8:"Incantation puissante : + mod. SAG aux dégâts des tours de magie"},
 "Nature":{6:"Atténuation des éléments : réaction, résistance aux dégâts d'acide, froid, feu, foudre ou tonnerre pour toi ou un allié",8:"Frappe divine : +1d8 froid, feu ou foudre une fois par tour"},
 "Tempête":{6:"Frappe de la foudre : tes dégâts de foudre repoussent de 3 m les créatures Grandes ou plus petites",8:"Frappe divine : +1d8 tonnerre une fois par tour"},
 "Tromperie":{6:"Canalisation divine : manteau des ombres (invisible jusqu'à ton prochain tour)",8:"Frappe divine : +1d8 poison une fois par tour"},
 "Guerre":{6:"Canalisation divine : bénédiction du dieu de la guerre (+10 à l'attaque d'un allié)",8:"Frappe divine : +1d8 dégâts du type de l'arme une fois par tour"},
 "Lignée draconique":{6:"Affinité élémentaire : + mod. CHA aux dégâts du type de ton dragon, résistance à ce type pour 1 point de sorcellerie"},
 "Magie sauvage":{6:"Bouleversement de la chance : réaction, 2 points de sorcellerie pour ajouter ou retirer 1d4 à un jet"},
 "Archifée":{6:"Échappatoire brumeuse : réaction quand tu es blessé, invisible et téléporté de 18 m",10:"Défenses envoûtantes : immunisé au charme, renvoie les charmes"},
 "Fiélon":{6:"Chance du ténébreux : +1d10 à un test ou une sauvegarde (1 fois par repos court)",10:"Résistance fiélonne : résistance à un type de dégâts choisi à chaque repos"},
 "Grand Ancien":{6:"Bouclier entropique : réaction, désavantage à une attaque contre toi, et avantage à ta riposte si elle rate",10:"Pensées protégées : résistance psychique, immunité à la lecture des pensées"}
};
/* ---------- choix de niveau ---------- */
function asiLevels(){const b=[4,8];if(S.cls==="Guerrier")b.push(6);if(S.cls==="Roublard")b.push(10);return b.filter(l=>l<=LV()).sort((a,b)=>a-b)}
function asiOf(l){if(l===4){S.asi=S.asi||[null,null];return S.asi}S.asis=S.asis||{};S.asis[l]=S.asis[l]||[null,null];return S.asis[l]}
function asiBonus(a){let n=0;asiLevels().forEach(l=>asiOf(l).forEach(x=>{if(x===a)n++}));return n}
function invocCount(){if(S.cls!=="Occultiste")return 0;const l=LV();return l>=9?5:l>=7?4:l>=5?3:l>=2?2:0}
function metaCount(){if(S.cls!=="Ensorceleur")return 0;return LV()>=10?3:LV()>=3?2:0}
function expertN(){return (S.cls==="Roublard"?(LV()>=6?4:2):0)+(S.cls==="Barde"?(LV()>=10?4:LV()>=3?2:0):0)}
const _levelFeats=window.levelFeats;
window.levelFeats=function(){let out=_levelFeats().filter(f=>!/^Niveau 4$/.test(f[0])&&!/^(Rage|Points de ki|Attaque sournoise)/.test(f[1]));
  const l=LV();
  if(S.cls==="Barbare")out=out.filter(f=>!/^Rage : \d/.test(f[1])).concat([["Barbare",`Rage : ${l>=6?4:l>=3?3:2} utilisations, +${l>=9?3:2} dégâts`]]);
  if(S.cls==="Roublard")out.push(["Roublard","Attaque sournoise : "+Math.ceil(l/2)+"d6"]);
  if(S.cls==="Moine"&&l>=2)out.push(["Moine","Points de ki : "+l]);
  [S.sub2,S.sub].forEach(n=>{const sf=n&&SUBFEATS[n];if(sf)Object.entries(sf).forEach(([lv,t])=>{if(+lv<=l)out.push([n+" (niv. "+lv+")",t])})});
  asiLevels().forEach(lv=>{const a=asiOf(lv);if(a[0]&&a[1])out.push(["Niveau "+lv,"Amélioration de caractéristiques : "+(a[0]===a[1]?a[0]+" +2":a[0]+" +1, "+a[1]+" +1")])});
  if(S.race==="Drakéide"&&l>=6)out=out.map(f=>[f[0],f[1].replace("2d6 ",l>=6?"3d6 ":"2d6 ")]);
  return out}
const _levelChoicesHtml=window.levelChoicesHtml;
window.levelChoicesHtml=function(){let h=_levelChoicesHtml();
  // remplace le sélecteur 1-5 par 1-10 et l'ASI unique par une ASI par niveau concerné
  h=h.replace(/<div class="grid" style="grid-template-columns:repeat\(5,1fr\);margin-top:8px">[\s\S]*?<\/div><\/div>/,()=>{let g=`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:8px">`;
    for(let l=1;l<=MAXLV;l++)g+=radio("level",String(l),String(LV()),"Niv. "+l,l===1?"Débutant":l===5?"Maîtrise +3":l===9?"Maîtrise +4":"");return g+`</div></div>`});
  h=h.replace(/<div class="card"><h3>Amélioration de caractéristiques \(niveau 4\)<\/h3>[\s\S]*$/,"");
  asiLevels().forEach(lv=>{const a=asiOf(lv);h+=`<div class="card"><h3>Amélioration de caractéristiques (niveau ${lv})</h3><div class="small">+1 à deux caractéristiques, ou deux fois la même pour +2 (maximum 20).</div><div class="row" style="margin-top:6px">${[0,1].map(i=>`<label class="f"><span>+1 en</span><select data-asil="${lv}:${i}"><option value="">—</option>${AB.map(x=>`<option value="${x}" ${a[i]===x?"selected":""}>${ABN[x]}</option>`).join("")}</select></label>`).join("")}</div></div>`});
  return h}
function validateLevel(){const s2=sub2();if(s2&&!S.sub2)return "Choisis ton "+s2.label.toLowerCase()+".";
  if(invocCount()&&(S.invoc||[]).length!==invocCount())return `Choisis ${invocCount()} manifestations occultes.`;
  if(metaCount()&&(S.meta||[]).length!==metaCount())return `Choisis ${metaCount()} options de métamagie.`;
  for(const lv of asiLevels()){const a=asiOf(lv);if(!(a[0]&&a[1]))return `Choisis ton amélioration de caractéristiques (niveau ${lv}).`}
  for(const a of AB){if(score(a)!==null&&score(a)>20)return "Une caractéristique ne peut pas dépasser 20 : change une amélioration."}
  return ""}
document.addEventListener("change",e=>{const t=e.target;if(!t.dataset||!t.dataset.asil)return;e.stopImmediatePropagation();const [lv,i]=t.dataset.asil.split(":").map(Number);asiOf(lv)[i]=t.value||null;const y=window.scrollY;render();window.scrollTo(0,y)},true);

/* jets de sauvegarde : maîtrise + aura du paladin (niv. 6) + objets magiques */
function saveBonus(a){const c=C();let v=M(a)+(c&&c.saves.includes(a)?PB:0);if(S.cls==="Paladin"&&LV()>=6)v+=Math.max(1,M("CHA"));if(typeof itemSaveBonus==="function")v+=itemSaveBonus();return v}
