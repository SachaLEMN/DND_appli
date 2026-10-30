/* ===================== NIVEAUX 1 À 5 ===================== */
const MAXLV=10;
const LV=()=>Math.min(MAXLV,Math.max(1,+S.level||1));

/* Emplacements de sorts par niveau de perso : [niv1, niv2, niv3] */
const SLOTS_FULL={1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2]};
const SLOTS_HALF={1:[],2:[2],3:[3],4:[3],5:[4,2]};
const PACT={1:[1,1],2:[2,1],3:[2,2],4:[2,2],5:[2,3]}; // [nombre, niveau]
const CASTER={
 Barde:{ab:"CHA",type:"full",cant:[2,2,2,3,3],known:[4,5,6,7,8]},
 Clerc:{ab:"SAG",type:"full",cant:[3,3,3,4,4],prep:"full"},
 Druide:{ab:"SAG",type:"full",cant:[2,2,2,3,3],prep:"full"},
 Ensorceleur:{ab:"CHA",type:"full",cant:[4,4,4,5,5],known:[2,3,4,5,6]},
 Magicien:{ab:"INT",type:"full",cant:[3,3,3,4,4],prep:"full",book:true},
 Occultiste:{ab:"CHA",type:"pact",cant:[2,2,2,3,3],known:[2,3,4,5,6]},
 Paladin:{ab:"CHA",type:"half",cant:[0,0,0,0,0],prep:"half",from:2},
 "Rôdeur":{ab:"SAG",type:"half",cant:[0,0,0,0,0],known:[0,2,3,3,4],from:2}
};
function maxSpellLevel(){const c=CASTER[S.cls];if(!c)return 0;const l=LV();
  if(c.type==="full"||c.type==="pact")return l>=5?3:l>=3?2:1;
  if(c.type==="half")return l>=5?2:l>=2?1:0;return 0}
function slotsArr(){const c=CASTER[S.cls];if(!c)return [];const l=LV();
  if(c.type==="full")return SLOTS_FULL[l];if(c.type==="half")return SLOTS_HALF[l];
  if(c.type==="pact"){const [n,lv]=PACT[l];const a=[0,0,0];a[lv-1]=n;return a.slice(0,lv)}return []}
function slotsTxt(){const a=slotsArr();return a.map((n,i)=>n?`${n} × niv. ${i+1}`:"").filter(Boolean).join(", ")||"—"}

/* Listes de sorts niveaux 2 et 3 (noms) */
const LVL2={
 Barde:["Amélioration de caractéristique","Bouche magique","Cécité/Surdité","Couronne du dément","Détection des pensées","Discours captivant","Fracassement","Immobilisation de personne","Invisibilité","Localisation d'animaux ou de plantes","Localisation d'objet","Messager animal","Métal brûlant","Restauration partielle","Silence","Suggestion","Zone de vérité"],
 Clerc:["Aide","Amélioration de caractéristique","Arme spirituelle","Augure","Cécité/Surdité","Flamme éternelle","Immobilisation de personne","Lien de protection","Localisation d'objet","Préservation des morts","Prière de guérison","Protection contre le poison","Restauration partielle","Silence","Zone de vérité"],
 Druide:["Amélioration de caractéristique","Bourrasque","Croissance d'épines","Lame de feu","Localisation d'animaux ou de plantes","Localisation d'objet","Messager animal","Métal brûlant","Passage sans trace","Peau d'écorce","Protection contre le poison","Rayon de lune","Restauration partielle","Sens animal","Sphère de feu","Trouver des pièges","Vision dans le noir"],
 Ensorceleur:["Agrandissement/Rapetissement","Amélioration de caractéristique","Bourrasque","Cécité/Surdité","Couronne du dément","Déblocage","Détection des pensées","Flou","Fracassement","Image miroir","Immobilisation de personne","Invisibilité","Lévitation","Nuage de dagues","Pas brumeux","Pattes d'araignée","Rayon ardent","Suggestion","Ténèbres","Toile d'araignée","Vision dans le noir"],
 Occultiste:["Couronne du dément","Discours captivant","Fracassement","Image miroir","Immobilisation de personne","Invisibilité","Nuage de dagues","Pas brumeux","Pattes d'araignée","Rayon affaiblissant","Suggestion","Ténèbres"],
 Magicien:["Agrandissement/Rapetissement","Arme magique","Aura magique de Nystul","Bouche magique","Bourrasque","Cécité/Surdité","Corde enchantée","Couronne du dément","Déblocage","Détection des pensées","Flèche acide de Melf","Flou","Fracassement","Image miroir","Immobilisation de personne","Invisibilité","Lévitation","Localisation d'objet","Nuage de dagues","Pas brumeux","Pattes d'araignée","Préservation des morts","Rayon affaiblissant","Rayon ardent","Serrure magique","Suggestion","Ténèbres","Toile d'araignée","Vision dans le noir"],
 Paladin:["Aide","Arme magique","Châtiment révélateur","Localisation d'objet","Protection contre le poison","Restauration partielle","Zone de vérité"],
 "Rôdeur":["Cordon de flèches","Croissance d'épines","Localisation d'animaux ou de plantes","Localisation d'objet","Messager animal","Passage sans trace","Peau d'écorce","Protection contre le poison","Rayon de lune","Restauration partielle","Sens animal","Silence","Trouver des pièges","Vision dans le noir"]
};
const LVL3={
 Barde:["Antidétection","Clairvoyance","Communication avec les morts","Communication avec les plantes","Dissipation de la magie","Envoi de message","Glyphe de garde","Image majeure","Langues","Malédiction","Motif hypnotique","Petite hutte de Léomund","Peur"],
 Clerc:["Animation des morts","Cercle magique","Clairvoyance","Communication avec les morts","Création de nourriture et d'eau","Délivrance des malédictions","Dissipation de la magie","Esprits gardiens","Fusion dans la pierre","Glyphe de garde","Langues","Lumière du jour","Malédiction","Marche sur l'eau","Mot de guérison de groupe","Protection contre une énergie","Retour à la vie","Envoi de message"],
 Druide:["Appel de la foudre","Communication avec les plantes","Croissance végétale","Dissipation de la magie","Fusion dans la pierre","Invocation d'animaux","Lumière du jour","Marche sur l'eau","Mur de vent","Protection contre une énergie","Respiration aquatique","Tempête de neige"],
 Ensorceleur:["Boule de feu","Clairvoyance","Clignotement","Contresort","Dissipation de la magie","Éclair","Forme gazeuse","Hâte","Image majeure","Langues","Lenteur","Lumière du jour","Marche sur l'eau","Motif hypnotique","Nuage nauséabond","Peur","Protection contre une énergie","Respiration aquatique","Tempête de neige","Vol"],
 Occultiste:["Cercle magique","Contresort","Délivrance des malédictions","Dissipation de la magie","Faim de Hadar","Forme gazeuse","Langues","Motif hypnotique","Peur","Toucher vampirique","Vol"],
 Magicien:["Animation des morts","Antidétection","Boule de feu","Cercle magique","Clairvoyance","Clignotement","Contresort","Délivrance des malédictions","Dissipation de la magie","Éclair","Envoi de message","Forme gazeuse","Glyphe de garde","Hâte","Image majeure","Langues","Lenteur","Malédiction","Monture fantôme","Motif hypnotique","Nuage nauséabond","Petite hutte de Léomund","Peur","Protection contre une énergie","Respiration aquatique","Tempête de neige","Toucher vampirique","Vol"]
};
const LVL1X={ // listes de niveau 1 des demi-lanceurs
 Paladin:["Bénédiction","Bouclier de la foi","Châtiment ardent","Châtiment courroucé","Châtiment tonitruant","Détection de la magie","Détection du mal et du bien","Détection du poison et des maladies","Faveur divine","Héroïsme","Injonction","Protection contre le mal et le bien","Purification de nourriture et d'eau","Soins"],
 "Rôdeur":["Alarme","Amitié avec les animaux","Baies nourricières","Détection de la magie","Détection du poison et des maladies","Frappe piégeuse","Grande foulée","Grêle d'épines","Marque du chasseur","Nappe de brouillard","Parler avec les animaux","Saut","Soins"]
};
Object.assign(SP,{
 "Châtiment ardent":["Évocation · bonus","Ta prochaine attaque d'arme qui touche ajoute 1d6 feu et enflamme la cible."],
 "Châtiment courroucé":["Évocation · bonus","Ta prochaine attaque d'arme qui touche ajoute 1d6 psychique et effraie la cible (SAG)."],
 "Châtiment tonitruant":["Évocation · bonus","Ta prochaine attaque d'arme qui touche ajoute 2d6 tonnerre et repousse de 3 m (FOR)."],
 "Marque du chasseur":["Divination · bonus","+1d6 dégâts à tes attaques d'arme contre la cible marquée (concentration 1 h)."],
 "Frappe piégeuse":["Invocation · bonus","Ta prochaine attaque qui touche fait pousser des ronces qui entravent la cible (FOR)."],
 "Grêle d'épines":["Invocation · bonus","Ta prochaine attaque à distance qui touche fait exploser des épines : 1d10 perforants autour (DEX)."]
});
function spellLevelOf(s){for(const L of [LVL2,LVL3]){for(const k in L)if(L[k].includes(s))return L===LVL2?2:3}
  for(const k in DOM_SPELLS){if(DOM_SPELLS[k][0].includes(s))return 2;if(DOM_SPELLS[k][1].includes(s))return 3}return 1}
function spellPool(cls,max,extra){let p=[...(LVL1[cls]||LVL1X[cls]||[])];if(extra)extra.forEach(x=>{if(!p.includes(x))p.push(x)});
  if(max>=2)p=p.concat(LVL2[cls]||[]);if(max>=3)p=p.concat(LVL3[cls]||[]);return p}
function spellDesc(s){const d=SP[s];if(d)return d;return ["Niveau "+spellLevelOf(s),"Voir le Manuel des Joueurs pour le détail."]}

/* Sous-classes obtenues au niveau 2 ou 3 */
const SUB2={
 Barbare:{at:3,label:"Voie primitive",opts:{"Voie du berserker":"Frénésie : en rage, une attaque de mêlée en plus par action bonus à chaque tour (épuisement après).","Voie du guerrier totémique":"Esprit totémique (ours : résistance à tous les dégâts sauf psychiques en rage ; aigle ; loup)."}},
 Barde:{at:3,label:"Collège bardique",opts:{"Collège du savoir":"3 compétences en plus au choix. Mots cinglants : utilise une Inspiration pour diminuer le jet d'un ennemi.","Collège de la vaillance":"Armures intermédiaires, boucliers et armes de guerre. L'Inspiration peut s'ajouter aux dégâts ou à la CA."}},
 Druide:{at:2,label:"Cercle druidique",opts:{"Cercle de la Terre":"1 tour de magie de druide en plus. Récupération naturelle (emplacements après un repos court). Sorts de cercle selon le terrain.","Cercle de la Lune":"Forme sauvage en action bonus, formes de combat jusqu'à FP 1, se soigne en dépensant des emplacements."}},
 Guerrier:{at:3,label:"Archétype martial",opts:{"Champion":"Critique amélioré : coup critique sur 19 ou 20.","Maître de guerre":"4 dés de supériorité (d8) et 3 manœuvres (riposte, croc-en-jambe, attaque menaçante…).","Chevalier occulte":"Sorts de magicien (abjuration, évocation) et arme liée."}},
 Magicien:{at:2,label:"Tradition arcanique",opts:{"Abjuration":"Protection arcanique : un bouclier magique qui absorbe des dégâts.","Divination":"Présage : 2 d20 lancés chaque matin qui remplacent des jets.","Enchantement":"Regard hypnotique : charme une créature proche.","Évocation":"Sculpter les sorts : tes alliés ne subissent pas tes sorts de zone.","Illusion":"Illusion mineure améliorée (son et image en même temps).","Invocation":"Transfert bénin : téléportation de 9 m.","Nécromancie":"Moisson macabre : regagne des PV quand tes sorts tuent.","Transmutation":"Alchimiste mineur et pierre de transmutation."}},
 Moine:{at:3,label:"Tradition monastique",opts:{"Voie de la main ouverte":"Déluge de coups qui renverse, repousse ou empêche les réactions.","Voie de l'ombre":"Sorts d'ombre (ténèbres, silence, passage sans trace) avec le ki.","Voie des quatre éléments":"Disciplines élémentaires : souffle de feu, poing de l'air, etc. avec le ki."}},
 Occultiste:{at:3,label:"Pacte",opts:{"Pacte de la lame":"Fais apparaître une arme de pacte dont tu es maître.","Pacte de la chaîne":"Familier spécial (diablotin, pseudodragon, quasit, sprite).","Pacte du grimoire":"Livre des ombres : 3 tours de magie de n'importe quelle classe."}},
 Paladin:{at:3,label:"Serment sacré",opts:{"Serment de dévotion":"Honneur et vérité. Arme sacrée (+CHA au toucher), Renvoi des impies.","Serment des anciens":"Lumière et nature. Courroux de la nature (entrave), Renvoi des infidèles.","Serment de vengeance":"Traque des grands méchants. Vœu d'hostilité (avantage contre une cible), Abjuration d'ennemi."}},
 "Rôdeur":{at:3,label:"Archétype de rôdeur",opts:{"Chasseur":"Proie du chasseur : Tueur de colosses (+1d8 une fois par tour contre une cible blessée) ou autre option.","Maître des bêtes":"Un compagnon animal (loup, sanglier, faucon…) qui obéit à tes ordres."}},
 Roublard:{at:3,label:"Archétype de roublard",opts:{"Voleur":"Mains lestes (objets en action bonus), Monte-en-l'air (escalade rapide).","Assassin":"Avantage contre ceux qui n'ont pas encore agi, critique automatique sur les créatures surprises.","Escroc arcanique":"Sorts de magicien (enchantement, illusion) et main de mage invisible."}}
};
const INVOC={"Décharge agonisante":"Ajoute ton mod. CHA aux dégâts de Décharge occulte.","Décharge repoussante":"Décharge occulte repousse la cible de 3 m.","Armure d'ombres":"Armure de mage sur toi à volonté.","Vue du diable":"Vois normalement dans les ténèbres, même magiques, jusqu'à 36 m.","Vision occulte":"Détection de la magie à volonté.","Masque des mille visages":"Déguisement à volonté.","Langue des bêtes":"Parler avec les animaux à volonté.","Fléau du démon (Regard de deux esprits)":"Vois et entends à travers les sens d'une créature consentante."};
const META={"Sort prudent":"Protège des alliés d'un sort de zone.","Sort distant":"Double la portée d'un sort.","Sort renforcé":"Relance des dés de dégâts.","Sort étendu":"Double la durée d'un sort.","Sort intensifié":"Désavantage à la sauvegarde de la cible.","Sort accéléré":"Lance un sort en action bonus.","Sort subtil":"Lance un sort sans composantes verbales ni gestuelles.","Sort jumeau":"Vise une deuxième créature."};
const STYLE_AT={Guerrier:1,Paladin:2,"Rôdeur":2};
const STYLE_OK={Guerrier:Object.keys(STYLES),Paladin:["Défense","Duel","Arme à deux mains","Protection"],"Rôdeur":["Archerie","Défense","Duel","Combat à deux armes"]};

/* Capacités gagnées par niveau (2 à 5) */
const LVFEATS={
 Barbare:{2:["Attaque téméraire : avantage aux attaques de mêlée (FOR) ce tour, mais les ennemis ont l'avantage contre toi","Sens du danger : avantage aux sauvegardes de DEX contre ce que tu vois"],5:["Attaque supplémentaire : 2 attaques par action Attaquer","Déplacement rapide : +3 m de vitesse sans armure lourde"]},
 Barde:{2:["Touche-à-tout : + moitié de la maîtrise aux tests non maîtrisés","Chant reposant : +1d6 PV aux alliés pendant un repos court"],3:["Expertise : maîtrise doublée sur 2 compétences"],5:["Inspiration bardique : d8, récupérée après un repos court ou long","Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Clerc:{2:["Canalisation divine (1 fois par repos court) : Renvoi des morts-vivants + effet de domaine"],5:["Destruction des morts-vivants : les morts-vivants de FP 1/2 ou moins renvoyés sont détruits","Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Druide:{2:["Forme sauvage : 2 fois par repos court, bête de FP 1/4 maximum, sans vol ni nage"],4:["Forme sauvage : FP 1/2, avec nage"],5:["Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Ensorceleur:{2:["Source de magie : points de sorcellerie = niveau, échangeables contre des emplacements"],3:["Métamagie : 2 options"],5:["Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Guerrier:{2:["Fougue (sursaut d'activité) : une action en plus pendant ton tour (1 fois par repos court)"],5:["Attaque supplémentaire : 2 attaques par action Attaquer"]},
 Magicien:{5:["Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Moine:{2:["Ki : points = niveau (repos court). Déluge de coups, Défense patiente, Déplacement aérien (1 ki chacun)","Déplacement sans armure : +3 m de vitesse"],3:["Parade de projectiles : réaction, réduit les dégâts d'une attaque à distance de 1d10 + DEX + niveau"],4:["Chute ralentie : réaction, réduit les dégâts de chute de 5 × niveau"],5:["Attaque supplémentaire : 2 attaques par action Attaquer","Frappe étourdissante : 1 ki, la cible est étourdie (CON)","Arts martiaux : dégâts d6"]},
 Occultiste:{2:["Manifestations occultes : 2 au choix"],5:["Manifestations occultes : 3 au choix","Tours de magie : les tours d'attaque font 2 dés de dégâts"]},
 Paladin:{2:["Incantation (CHA) : sorts préparés = moitié du niveau + mod. CHA","Châtiment divin : après une touche en mêlée, dépense un emplacement pour +2d8 radiants (+1d8 par niveau d'emplacement, +1d8 contre fiélons et morts-vivants)"],3:["Santé divine : immunisé aux maladies","Canalisation divine (1 fois par repos court)"],5:["Attaque supplémentaire : 2 attaques par action Attaquer"]},
 "Rôdeur":{2:["Incantation (SAG) : sorts connus"],3:["Vigilance primitive : dépense un emplacement pour sentir certains types de créatures à 1,5 km"],5:["Attaque supplémentaire : 2 attaques par action Attaquer"]},
 Roublard:{2:["Ruse : Foncer, Se désengager ou Se cacher par une action bonus"],5:["Esquive instinctive : réaction, divise par deux les dégâts d'une attaque que tu vois"]}
};
function invocCount(){return S.cls!=="Occultiste"?0:LV()>=5?3:LV()>=2?2:0}
function metaCount(){return S.cls==="Ensorceleur"&&LV()>=3?2:0}
function expertN(){return (S.cls==="Roublard"?2:0)+(S.cls==="Barde"&&LV()>=3?2:0)}
function sub2(){const d=SUB2[S.cls];return d&&LV()>=d.at?d:null}
function styleNeeded(){const a=STYLE_AT[S.cls];return a&&LV()>=a}
function asiBonus(a){const b={};if(LV()>=4)(S.asi||[]).forEach(x=>{if(x)b[x]=(b[x]||0)+1});return b[a]||0}
function hpLevels(){const c=C();if(!c)return 0;const l=LV(),con=M("CON");const r=R(),sb=SUB();
  let h=c.hd+con;for(let i=2;i<=l;i++){const roll=S.hpRolls&&S.hpRolls[i];h+=Math.max(1,(roll?roll:c.hd/2+1)+con)}
  if(r&&r.hp)h+=l;if(sb&&sb.dragon)h+=l;return h}
function levelFeats(){const out=[];const f=LVFEATS[S.cls]||{};for(let l=2;l<=LV();l++)(f[l]||[]).forEach(t=>out.push(["Niveau "+l,t]));
  if(S.cls==="Roublard")out.push(["Roublard","Attaque sournoise : "+Math.ceil(LV()/2)+"d6"]);
  if(S.cls==="Barbare")out.push(["Barbare","Rage : "+(LV()>=3?3:2)+" utilisations, +2 dégâts"]);
  if(S.cls==="Moine"&&LV()>=2)out.push(["Moine","Points de ki : "+LV()]);
  if(S.cls==="Ensorceleur"&&LV()>=2)out.push(["Ensorceleur","Points de sorcellerie : "+LV()]);
  if(S.cls==="Paladin")out.push(["Paladin","Imposition des mains : réserve de "+(5*LV())+" PV"]);
  const s2=sub2();if(s2&&S.sub2)out.push([S.sub2,SUB2[S.cls].opts[S.sub2]]);
  (S.invoc||[]).slice(0,invocCount()).forEach(x=>out.push(["Manifestation",x+" : "+INVOC[x]]));
  (S.meta||[]).slice(0,metaCount()).forEach(x=>out.push(["Métamagie",x+" : "+META[x]]));
  if(LV()>=4&&S.asi&&S.asi.every(Boolean))out.push(["Niveau 4","Amélioration de caractéristiques : "+(S.asi[0]===S.asi[1]?S.asi[0]+" +2":S.asi[0]+" +1, "+S.asi[1]+" +1")]);
  return out}
function spellInfoL(){const c=CASTER[S.cls];if(!c)return null;const l=LV();if(c.from&&l<c.from)return null;
  const m=M(c.ab);const sb=SUB();let cant=c.cant[l-1];if(S.sub2==="Cercle de la Terre"&&sub2())cant+=1;
  let prep=0;if(c.prep==="full")prep=Math.max(1,l+m);if(c.prep==="half")prep=Math.max(1,Math.floor(l/2)+m);
  return {ab:c.ab,dc:8+PB+m,atk:sgn(PB+m),slots:slotsTxt(),slotsArr:slotsArr(),pact:c.type==="pact",cant,known:c.known?c.known[l-1]:0,book:c.book?6+2*(l-1):0,prep,max:maxSpellLevel()}}
function levelChoicesHtml(){
  if(!S.cls)return "";let h=`<div class="card"><h2>Niveau du personnage</h2><div class="small">Commence au niveau 1 pour une nouvelle campagne, ou plus haut si ton MJ le demande.</div><div class="grid" style="grid-template-columns:repeat(5,1fr);margin-top:8px">`;
  for(let l=1;l<=MAXLV;l++)h+=radio("level",String(l),String(LV()),"Niveau "+l,l===1?"Débutant":l===5?"Bonus de maîtrise +3":"");
  h+=`</div></div>`;
  const s2=sub2();if(s2){h+=`<div class="card"><h3>${s2.label} (niveau ${s2.at})</h3><div class="grid">`;Object.entries(s2.opts).forEach(([k,v])=>h+=radio("sub2",k,S.sub2,k,esc(v)));h+=`</div></div>`}
  if(invocCount()){h+=`<div class="card"><h3>Manifestations occultes <span class="count">${(S.invoc||[]).length}/${invocCount()}</span></h3><div class="grid">`;
    Object.entries(INVOC).forEach(([k,v])=>{const on=(S.invoc||[]).includes(k);h+=`<label class="opt ${on?"sel":""}"><input type="checkbox" data-invoc="${esc(k)}" ${on?"checked":""}><b>${esc(k)}</b><span>${esc(v)}</span></label>`});h+=`</div></div>`}
  if(metaCount()){h+=`<div class="card"><h3>Métamagie <span class="count">${(S.meta||[]).length}/${metaCount()}</span></h3><div class="grid">`;
    Object.entries(META).forEach(([k,v])=>{const on=(S.meta||[]).includes(k);h+=`<label class="opt ${on?"sel":""}"><input type="checkbox" data-meta="${esc(k)}" ${on?"checked":""}><b>${esc(k)}</b><span>${esc(v)}</span></label>`});h+=`</div></div>`}
  if(LV()>=4){const a=S.asi||[null,null];h+=`<div class="card"><h3>Amélioration de caractéristiques (niveau 4)</h3><div class="small">+1 à deux caractéristiques, ou choisis deux fois la même pour +2 (maximum 20).</div><div class="row" style="margin-top:6px">${[0,1].map(i=>`<label class="f"><span>+1 en</span><select data-asi="${i}"><option value="">—</option>${AB.map(x=>`<option value="${x}" ${a[i]===x?"selected":""}>${ABN[x]}</option>`).join("")}</select></label>`).join("")}</div></div>`}
  return h}
function validateLevel(){const s2=sub2();if(s2&&!S.sub2)return "Choisis ton "+s2.label.toLowerCase()+".";
  if(invocCount()&&(S.invoc||[]).length!==invocCount())return `Choisis ${invocCount()} manifestations occultes.`;
  if(metaCount()&&(S.meta||[]).length!==metaCount())return "Choisis 2 options de métamagie.";
  if(LV()>=4&&!(S.asi&&S.asi[0]&&S.asi[1]))return "Choisis ton amélioration de caractéristiques (niveau 4).";
  if(LV()>=4){for(const a of AB){if(score(a)!==null&&score(a)>20)return "Une caractéristique ne peut pas dépasser 20 : change ton amélioration."}}
  return ""}
const DOM_SPELLS={"Connaissance":[["Augure","Suggestion"],["Antidétection","Communication avec les morts"]],"Vie":[["Arme spirituelle","Restauration partielle"],["Lueur d'espoir","Retour à la vie"]],"Lumière":[["Rayon ardent","Sphère de feu"],["Boule de feu","Lumière du jour"]],"Nature":[["Peau d'écorce","Croissance d'épines"],["Croissance végétale","Mur de vent"]],"Tempête":[["Bourrasque","Fracassement"],["Appel de la foudre","Tempête de neige"]],"Tromperie":[["Image miroir","Passage sans trace"],["Clignotement","Dissipation de la magie"]],"Guerre":[["Arme magique","Arme spirituelle"],["Manteau du croisé","Esprits gardiens"]]};
function domSpells(){const sb=SUB();if(!sb||!sb.spells)return [];let l=[...sb.spells];const x=DOM_SPELLS[S.sub];if(S.cls==="Clerc"&&x){if(LV()>=3)l=l.concat(x[0]);if(LV()>=5)l=l.concat(x[1])}return l}
