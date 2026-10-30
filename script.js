/* ===================== DONNÉES ===================== */
const AB=["FOR","DEX","CON","INT","SAG","CHA"];
const ABN={FOR:"Force",DEX:"Dextérité",CON:"Constitution",INT:"Intelligence",SAG:"Sagesse",CHA:"Charisme"};
const SKILLS=[ // ordre de la fiche
 ["Acrobaties","DEX"],["Arcanes","INT"],["Athlétisme","FOR"],["Discrétion","DEX"],["Dressage","SAG"],["Escamotage","DEX"],
 ["Histoire","INT"],["Intimidation","CHA"],["Investigation","INT"],["Médecine","SAG"],["Nature","INT"],["Perception","SAG"],
 ["Intuition","SAG"],["Persuasion","CHA"],["Religion","INT"],["Représentation","CHA"],["Survie","SAG"],["Tromperie","CHA"]];
const SKAB=Object.fromEntries(SKILLS);
const ALLSK=SKILLS.map(s=>s[0]);
const LANGS=["Elfique","Géant","Gnome","Gobelin","Halfelin","Nain","Orc","Abyssal","Céleste","Commun des profondeurs","Draconique","Infernal","Primordial","Profond","Sylvestre"];

const DRAGONS={Noir:["Acide","ligne de 1,5 × 9 m","DEX"],Bleu:["Foudre","ligne de 1,5 × 9 m","DEX"],Airain:["Feu","ligne de 1,5 × 9 m","DEX"],Bronze:["Foudre","ligne de 1,5 × 9 m","DEX"],Cuivre:["Acide","ligne de 1,5 × 9 m","DEX"],Or:["Feu","cône de 4,5 m","DEX"],Vert:["Poison","cône de 4,5 m","CON"],Rouge:["Feu","cône de 4,5 m","DEX"],Argent:["Froid","cône de 4,5 m","CON"],Blanc:["Froid","cône de 4,5 m","CON"]};

const RACES={
 "Humain":{grp:"Humain",bon:{FOR:1,DEX:1,CON:1,INT:1,SAG:1,CHA:1},spd:"9 m",size:"M",lang:["Commun"],xl:1,desc:"+1 partout. Polyvalent, va avec tout.",traits:[]},
 "Haut-elfe":{grp:"Elfe",bon:{DEX:2,INT:1},spd:"9 m",size:"M",lang:["Commun","Elfique"],xl:1,sk:["Perception"],desc:"Vision dans le noir, un tour de magie de magicien.",traits:["Vision dans le noir 18 m","Sens aiguisés (Perception)","Ascendance féerique : avantage contre charme, immunisé au sommeil magique","Transe : 4 h de méditation = repos long","Tour de magie de magicien (INT)"],weap:["Épée longue","Épée courte","Arc court","Arc long"],cantrip:true},
 "Elfe des bois":{grp:"Elfe",bon:{DEX:2,SAG:1},spd:"10,5 m",size:"M",lang:["Commun","Elfique"],sk:["Perception"],desc:"Rapide et discret, parfait en forêt.",traits:["Vision dans le noir 18 m","Sens aiguisés (Perception)","Ascendance féerique : avantage contre charme, immunisé au sommeil magique","Transe : 4 h de méditation = repos long","Pied léger : vitesse 10,5 m","Cachette naturelle : peut se cacher dans un feuillage léger, pluie, brume"],weap:["Épée longue","Épée courte","Arc court","Arc long"]},
 "Drow":{grp:"Elfe",bon:{DEX:2,CHA:1},spd:"9 m",size:"M",lang:["Commun","Elfique"],sk:["Perception"],desc:"Elfe noir : grande vision dans le noir, magie innée, craint le soleil.",traits:["Vision dans le noir supérieure 36 m","Sens aiguisés (Perception)","Ascendance féerique : avantage contre charme, immunisé au sommeil magique","Transe : 4 h de méditation = repos long","Sensibilité au soleil : désavantage aux attaques et Perception (vue) en plein soleil","Magie drow : tour de magie Lumières dansantes (CHA)"],weap:["Rapière","Épée courte","Arbalète de poing"],spells:["Lumières dansantes"]},
 "Nain des collines":{grp:"Nain",bon:{CON:2,SAG:1},spd:"7,5 m",size:"M",lang:["Commun","Nain"],hp:1,desc:"Robuste : +1 PV par niveau, résiste au poison.",traits:["Vision dans le noir 18 m","Résistance naine : avantage aux sauvegardes contre le poison, résistance aux dégâts de poison","Connaissance de la pierre : double maîtrise en Histoire sur la maçonnerie","Ténacité naine : +1 PV max par niveau","L'armure lourde ne réduit pas la vitesse"],weap:["Hache d'armes","Hachette","Marteau léger","Marteau de guerre"],tools:"Outils de forgeron, de brasseur ou de maçon (au choix)"},
 "Nain des montagnes":{grp:"Nain",bon:{CON:2,FOR:2},spd:"7,5 m",size:"M",lang:["Commun","Nain"],desc:"Costaud, sait porter les armures.",traits:["Vision dans le noir 18 m","Résistance naine : avantage aux sauvegardes contre le poison, résistance aux dégâts de poison","Connaissance de la pierre : double maîtrise en Histoire sur la maçonnerie","L'armure lourde ne réduit pas la vitesse"],weap:["Hache d'armes","Hachette","Marteau léger","Marteau de guerre"],armor:["légère","intermédiaire"],tools:"Outils de forgeron, de brasseur ou de maçon (au choix)"},
 "Halfelin pied-léger":{grp:"Halfelin",bon:{DEX:2,CHA:1},spd:"7,5 m",size:"P",lang:["Commun","Halfelin"],desc:"Petit, chanceux, se cache derrière plus grand que lui.",traits:["Chanceux : relance un 1 naturel sur attaque, test ou sauvegarde","Brave : avantage contre la peur","Agilité halfeline : traverse l'espace des créatures plus grandes","Discrétion naturelle : peut se cacher derrière une créature plus grande"]},
 "Halfelin robuste":{grp:"Halfelin",bon:{DEX:2,CON:1},spd:"7,5 m",size:"P",lang:["Commun","Halfelin"],desc:"Petit, chanceux, résiste au poison.",traits:["Chanceux : relance un 1 naturel sur attaque, test ou sauvegarde","Brave : avantage contre la peur","Agilité halfeline : traverse l'espace des créatures plus grandes","Résistance des robustes : avantage contre le poison, résistance aux dégâts de poison"]},
 "Gnome des forêts":{grp:"Gnome",bon:{INT:2,DEX:1},spd:"7,5 m",size:"P",lang:["Commun","Gnome"],desc:"Malin, illusions, parle aux petits animaux.",traits:["Vision dans le noir 18 m","Ruse gnome : avantage aux sauvegardes INT, SAG et CHA contre la magie","Illusionniste-né : tour de magie Illusion mineure (INT)","Communication avec les petites bêtes"],spells:["Illusion mineure"]},
 "Gnome des roches":{grp:"Gnome",bon:{INT:2,CON:1},spd:"7,5 m",size:"P",lang:["Commun","Gnome"],desc:"Inventeur et bricoleur.",traits:["Vision dans le noir 18 m","Ruse gnome : avantage aux sauvegardes INT, SAG et CHA contre la magie","Connaissances en ingénierie : double maîtrise en Histoire sur les objets magiques, alchimiques ou techniques","Bricoleur : fabrique de petits mécanismes"],tools:"Outils de bricoleur"},
 "Demi-elfe":{grp:"Demi",bon:{CHA:2},plus2:true,spd:"9 m",size:"M",lang:["Commun","Elfique"],xl:1,anySk:2,desc:"CHA +2, +1 à deux autres, 2 compétences au choix.",traits:["Vision dans le noir 18 m","Ascendance féerique : avantage contre charme, immunisé au sommeil magique","Polyvalence : 2 compétences au choix"]},
 "Demi-orc":{grp:"Demi",bon:{FOR:2,CON:1},spd:"9 m",size:"M",lang:["Commun","Orc"],sk:["Intimidation"],desc:"Puissant, dur à tuer, gros critiques.",traits:["Vision dans le noir 18 m","Menaçant (Intimidation)","Endurance implacable : à 0 PV, reste à 1 PV (1 fois par repos long)","Attaques sauvages : +1 dé de dégâts de l'arme sur un critique au corps-à-corps"]},
 "Drakéide":{grp:"Autres",bon:{FOR:2,CHA:1},spd:"9 m",size:"M",lang:["Commun","Draconique"],dragon:true,desc:"Descendant de dragon : souffle et résistance.",traits:[]},
 "Tieffelin":{grp:"Autres",bon:{CHA:2,INT:1},spd:"9 m",size:"M",lang:["Commun","Infernal"],desc:"Sang infernal : résiste au feu, un peu de magie.",traits:["Vision dans le noir 18 m","Résistance infernale : résistance aux dégâts de feu","Ascendance infernale : tour de magie Thaumaturgie (CHA) ; Représailles infernales au niveau 3 ; Ténèbres au niveau 5"],spells:["Thaumaturgie"]}
};

const CLASSES={
 Barbare:{hd:12,saves:["FOR","CON"],role:"Costaud au corps-à-corps",n:2,sk:["Athlétisme","Dressage","Intimidation","Nature","Perception","Survie"],armor:["légère","intermédiaire","bouclier"],weap:"all",prio:["FOR","CON","DEX","SAG","CHA","INT"],desc:"Rage, encaisse énormément.",
   feats:["Rage (2 fois par repos long) : action bonus, 1 minute. Avantage aux tests et sauvegardes de FOR, +2 aux dégâts de mêlée avec FOR, résistance aux dégâts contondants, perforants et tranchants. Pas de sorts.","Défense sans armure : CA = 10 + DEX + CON (bouclier autorisé)"]},
 Barde:{hd:8,saves:["DEX","CHA"],role:"Soutien / social",n:3,sk:"any",armor:["légère"],weap:"rogue",prio:["CHA","DEX","CON","SAG","INT","FOR"],desc:"Magie, musique et baratin.",caster:{ab:"CHA",cant:2,known:4,slots:2,list:"Barde"},tools:"3 instruments de musique (au choix)",
   feats:["Incantation (CHA) : sorts connus","Inspiration bardique (d6) : action bonus, donne un d6 à un allié à 18 m pour un test, une attaque ou une sauvegarde. Utilisations = mod. CHA (min. 1) par repos long"]},
 Clerc:{hd:8,saves:["SAG","CHA"],role:"Soigneur / divin",n:2,sk:["Histoire","Intuition","Médecine","Persuasion","Religion"],armor:["légère","intermédiaire","bouclier"],weap:"simple",prio:["SAG","CON","FOR","DEX","CHA","INT"],desc:"Soins et protection divine.",caster:{ab:"SAG",cant:3,prep:true,slots:2,list:"Clerc"},sub:"domaine",
   feats:["Incantation (SAG) : sorts préparés chaque jour (niveau + mod. SAG)","Domaine divin (voir capacité de domaine)"]},
 Druide:{hd:8,saves:["INT","SAG"],role:"Nature / magie",n:2,sk:["Arcanes","Dressage","Intuition","Médecine","Nature","Perception","Religion","Survie"],armor:["légère","intermédiaire","bouclier"],weap:["Gourdin","Dague","Fléchette","Javeline","Masse","Bâton","Cimeterre","Fronde","Serpe","Lance"],prio:["SAG","CON","DEX","INT","CHA","FOR"],desc:"Magie de la nature, se transforme en animal au niv. 2.",caster:{ab:"SAG",cant:2,prep:true,slots:2,list:"Druide"},tools:"Matériel d'herboriste",lang:["Druidique"],
   feats:["Druidique : langue secrète des druides","Incantation (SAG) : sorts préparés chaque jour (niveau + mod. SAG)","Tradition : n'utilise pas d'armure ni de bouclier en métal"]},
 Ensorceleur:{hd:6,saves:["CON","CHA"],role:"Lanceur de sorts",n:2,sk:["Arcanes","Intimidation","Intuition","Persuasion","Religion","Tromperie"],armor:[],weap:["Dague","Fléchette","Fronde","Bâton","Arbalète légère"],prio:["CHA","CON","DEX","SAG","INT","FOR"],desc:"Magie innée dans le sang.",caster:{ab:"CHA",cant:4,known:2,slots:2,list:"Ensorceleur"},sub:"origine",
   feats:["Incantation (CHA) : sorts connus","Origine magique (voir ci-dessous)"]},
 Guerrier:{hd:10,saves:["FOR","CON"],role:"Costaud au corps-à-corps",n:2,sk:["Acrobaties","Athlétisme","Dressage","Histoire","Intimidation","Intuition","Perception","Survie"],armor:["légère","intermédiaire","lourde","bouclier"],weap:"all",prio:["FOR","CON","DEX","SAG","CHA","INT"],desc:"Maître de toutes les armes.",style:true,
   feats:["Second souffle : action bonus, regagne 1d10 + 1 PV (1 fois par repos court ou long)"]},
 Magicien:{hd:6,saves:["INT","SAG"],role:"Lanceur de sorts",n:2,sk:["Arcanes","Histoire","Intuition","Investigation","Médecine","Religion"],armor:[],weap:["Dague","Fléchette","Fronde","Bâton","Arbalète légère"],prio:["INT","CON","DEX","SAG","CHA","FOR"],desc:"Le plus grand choix de sorts grâce au grimoire.",caster:{ab:"INT",cant:3,book:6,prep:true,slots:2,list:"Magicien"},
   feats:["Incantation (INT) : grimoire de 6 sorts, sorts préparés chaque jour (niveau + mod. INT), rituels","Restauration arcanique : 1 fois par jour après un repos court, récupère 1 emplacement de niveau 1"]},
 Moine:{hd:8,saves:["FOR","DEX"],role:"Agile / arts martiaux",n:2,sk:["Acrobaties","Athlétisme","Discrétion","Histoire","Intuition","Religion"],armor:[],weap:"monk",prio:["DEX","SAG","CON","FOR","INT","CHA"],desc:"Combat à mains nues, très mobile.",tools:"1 type d'outils d'artisan ou 1 instrument de musique (au choix)",
   feats:["Défense sans armure : CA = 10 + DEX + SAG (sans armure ni bouclier)","Arts martiaux : utilise DEX pour les attaques à mains nues et armes de moine, dégâts d4, une attaque à mains nues en action bonus après l'action Attaquer"]},
 Occultiste:{hd:8,saves:["SAG","CHA"],role:"Lanceur de sorts",n:2,sk:["Arcanes","Histoire","Intimidation","Investigation","Nature","Religion","Tromperie"],armor:["légère"],weap:"simple",prio:["CHA","CON","DEX","SAG","INT","FOR"],desc:"Magie obtenue par un pacte.",caster:{ab:"CHA",cant:2,known:2,slots:1,pact:true,list:"Occultiste"},sub:"protecteur",
   feats:["Magie de pacte (CHA) : 1 emplacement de niveau 1, récupéré après un repos court ou long","Protecteur d'outre-monde (voir ci-dessous)"]},
 Paladin:{hd:10,saves:["SAG","CHA"],role:"Costaud / divin",n:2,sk:["Athlétisme","Intimidation","Intuition","Médecine","Persuasion","Religion"],armor:["légère","intermédiaire","lourde","bouclier"],weap:"all",prio:["FOR","CHA","CON","SAG","DEX","INT"],desc:"Chevalier sacré : armure lourde, soins, châtiments.",
   feats:["Sens divin : détecte célestes, fiélons et morts-vivants à 18 m (1 + mod. CHA fois par repos long)","Imposition des mains : réserve de soins par repos long (5 points = guérir une maladie ou un poison)"]},
 Rôdeur:{hd:10,saves:["FOR","DEX"],role:"Agile / pisteur",n:3,sk:["Athlétisme","Discrétion","Dressage","Intuition","Investigation","Nature","Perception","Survie"],armor:["légère","intermédiaire","bouclier"],weap:"all",prio:["DEX","SAG","CON","FOR","INT","CHA"],desc:"Pisteur et archer, à l'aise en pleine nature.",ranger:true,
   feats:[]},
 Roublard:{hd:8,saves:["DEX","INT"],role:"Agile / furtif",n:4,sk:["Acrobaties","Athlétisme","Discrétion","Escamotage","Intimidation","Intuition","Investigation","Perception","Persuasion","Représentation","Tromperie"],armor:["légère"],weap:"rogue",prio:["DEX","CON","INT","SAG","CHA","FOR"],desc:"Discrétion, pièges et attaque sournoise.",expertise:2,tools:"Outils de voleur",lang:["Jargon des voleurs"],
   feats:["Attaque sournoise (+1d6) : 1 fois par tour, avec une arme de finesse ou à distance, si avantage ou allié à 1,50 m de la cible","Expertise : maîtrise doublée sur 2 compétences (ou outils de voleur)","Jargon des voleurs : langage codé des voleurs"]}
};

const SUBS={
 domaine:{label:"Domaine divin",opts:{
  "Connaissance":{d:"Savoir et secrets. +2 langues, 2 compétences avec expertise.",spells:["Injonction","Identification"],feat:"Bénédictions du savoir : 2 langues et 2 compétences parmi Arcanes, Histoire, Nature, Religion, avec maîtrise doublée",lang:2,know:true},
  "Vie":{d:"Le meilleur soigneur. Armure lourde.",spells:["Bénédiction","Soins"],feat:"Disciple de la vie : les sorts de soin rendent 2 + niveau du sort PV en plus",armor:["lourde"]},
  "Lumière":{d:"Feu et lumière, éblouit les ennemis.",spells:["Mains brûlantes","Lueurs féeriques"],feat:"Lueur protectrice : réaction, désavantage à une attaque contre toi (mod. SAG fois par repos long). Tour de magie Lumière en bonus",cantrip:"Lumière"},
  "Nature":{d:"Allié de la nature. Armure lourde, un tour de magie de druide.",spells:["Amitié avec les animaux","Parler avec les animaux"],feat:"Acolyte de la nature : 1 tour de magie de druide et 1 compétence parmi Dressage, Nature, Survie",armor:["lourde"],natsk:true,druidCant:true},
  "Tempête":{d:"Foudre et tonnerre. Armure lourde, armes de guerre.",spells:["Nappe de brouillard","Vague tonnante"],feat:"Fureur de l'ouragan : réaction quand on te touche au corps-à-corps, 2d8 foudre ou tonnerre (sauvegarde DEX, mod. SAG fois par repos long)",armor:["lourde"],martial:true},
  "Tromperie":{d:"Ruse et illusions.",spells:["Charme-personne","Déguisement"],feat:"Bénédiction de l'escroc : action, donne l'avantage en Discrétion à un allié pendant 1 heure"},
  "Guerre":{d:"Prêtre combattant. Armure lourde, armes de guerre.",spells:["Faveur divine","Bouclier de la foi"],feat:"Prêtre de guerre : attaque d'arme en action bonus après l'action Attaquer (mod. SAG fois par repos long)",armor:["lourde"],martial:true}}},
 origine:{label:"Origine magique",opts:{
  "Lignée draconique":{d:"Sang de dragon : plus résistant, peau écailleuse.",feat:"Ascendance draconique (langue draconique) ; Résistance draconique : +1 PV par niveau, CA sans armure 13 + DEX",dragon:true},
  "Magie sauvage":{d:"Magie chaotique et imprévisible.",feat:"Montée de magie sauvage : le MJ peut faire lancer un d20 après un sort, sur 1 effet aléatoire ; Marées du chaos : avantage à un jet (1 fois par repos long)"}}},
 protecteur:{label:"Protecteur",opts:{
  "Archifée":{d:"Une fée puissante : charme et peur.",feat:"Présence féerique : action, cube de 3 m, créatures charmées ou effrayées (sauvegarde SAG), 1 fois par repos court",extra:["Lueurs féeriques","Sommeil"]},
  "Fiélon":{d:"Un démon ou un diable : gagne des PV en tuant.",feat:"Bénédiction du ténébreux : quand tu réduis un ennemi à 0 PV, PV temporaires = mod. CHA + niveau",extra:["Mains brûlantes","Injonction"]},
  "Grand Ancien":{d:"Une entité indicible : télépathie.",feat:"Éveil de l'esprit : télépathie avec une créature à 9 m",extra:["Murmures dissonants","Fou rire de Tasha"]}}}
};

const STYLES={"Archerie":"+2 aux jets d'attaque à distance","Défense":"+1 CA en portant une armure","Duel":"+2 dégâts avec une arme à une main (et rien dans l'autre main)","Arme à deux mains":"relance les 1 et 2 aux dégâts avec une arme à deux mains","Protection":"réaction : désavantage à une attaque contre un allié proche (bouclier requis)","Combat à deux armes":"ajoute le mod. aux dégâts de la seconde attaque"};
const ENEMIES=["Aberrations","Bêtes","Célestes","Créatures artificielles","Dragons","Élémentaires","Fées","Fiélons","Géants","Monstruosités","Morts-vivants","Plantes","Vases","Deux races d'humanoïdes (ex. gobelins et orcs)"];
const TERRAINS=["Arctique","Côte","Désert","Forêt","Marais","Montagne","Prairie","Souterrain"];

const BGS={
 "Acolyte":{sk:["Intuition","Religion"],xl:2,tools:"",eq:["Symbole sacré","Livre de prières","5 bâtonnets d'encens","Habits de cérémonie","Vêtements courants"],po:15,feat:"Abri du fidèle : ton temple et les fidèles de ta foi t'hébergent et t'aident",d:"Élevé au service d'un temple."},
 "Artisan de guilde":{sk:["Intuition","Persuasion"],xl:1,tools:"1 type d'outils d'artisan (au choix)",eq:["Outils d'artisan","Lettre de recommandation de la guilde","Vêtements de voyage"],po:15,feat:"Membre de guilde : la guilde t'héberge et te soutient (cotisation 5 po/mois)",d:"Forgeron, brasseur, tailleur…"},
 "Artiste":{sk:["Acrobaties","Représentation"],xl:0,tools:"Kit de déguisement, 1 instrument de musique (au choix)",eq:["Instrument de musique","Cadeau d'un admirateur","Costume"],po:15,feat:"À la demande du public : tu trouves toujours où te produire contre gîte et couvert",d:"Chanteur, acrobate, comédien…"},
 "Charlatan":{sk:["Escamotage","Tromperie"],xl:0,tools:"Kit de déguisement, kit de contrefaçon",eq:["Habits de qualité","Kit de déguisement","Outils d'escroquerie (fioles colorées, dés pipés…)"],po:15,feat:"Fausse identité : une seconde identité avec papiers et relations",d:"Escroc et beau parleur."},
 "Criminel":{sk:["Discrétion","Tromperie"],xl:0,tools:"Outils de voleur, 1 type de jeu (au choix)",eq:["Pied-de-biche","Vêtements sombres avec capuche"],po:15,feat:"Contact criminel : un contact fiable dans la pègre",d:"Voleur, contrebandier, receleur…"},
 "Enfant des rues":{sk:["Discrétion","Escamotage"],xl:0,tools:"Kit de déguisement, outils de voleur",eq:["Petit couteau","Carte de ta ville natale","Souris apprivoisée","Souvenir de tes parents","Vêtements courants"],po:10,feat:"Secrets de la ville : tu te déplaces deux fois plus vite en ville par les passages cachés",d:"Orphelin qui a grandi dans la rue."},
 "Ermite":{sk:["Médecine","Religion"],xl:1,tools:"Matériel d'herboriste",eq:["Étui à parchemin rempli de notes","Couverture d'hiver","Vêtements courants","Matériel d'herboriste"],po:5,feat:"Découverte : tu détiens un secret important (à voir avec le MJ)",d:"A vécu isolé, en quête de sens."},
 "Héros du peuple":{sk:["Dressage","Survie"],xl:0,tools:"1 type d'outils d'artisan (au choix), véhicules terrestres",eq:["Outils d'artisan","Pelle","Pot en fer","Vêtements courants"],po:10,feat:"Hospitalité rustique : les gens du peuple te cachent et t'aident",d:"Paysan devenu héros local."},
 "Marin":{sk:["Athlétisme","Perception"],xl:0,tools:"Instruments de navigation, véhicules aquatiques",eq:["Cabillot (gourdin)","15 m de corde en soie","Porte-bonheur","Vêtements courants"],po:10,feat:"Passage en bateau : tu obtiens un voyage gratuit sur un navire",d:"A navigué des années."},
 "Noble":{sk:["Histoire","Persuasion"],xl:1,tools:"1 type de jeu (au choix)",eq:["Habits de qualité","Chevalière","Parchemin de lignée"],po:25,feat:"Privilège : tu es bien reçu par la haute société",d:"Né riche et titré."},
 "Sage":{sk:["Arcanes","Histoire"],xl:2,tools:"",eq:["Bouteille d'encre noire","Plume","Petit couteau","Lettre d'un collègue décédé","Vêtements courants"],po:10,feat:"Chercheur : tu sais où trouver une information",d:"Érudit des bibliothèques."},
 "Sauvageon":{sk:["Athlétisme","Survie"],xl:1,tools:"1 instrument de musique (au choix)",eq:["Bâton","Piège à mâchoires","Trophée d'un animal tué","Vêtements de voyage"],po:10,feat:"Vagabond : excellente mémoire des lieux, tu trouves de quoi nourrir 6 personnes",d:"A grandi loin de la civilisation."},
 "Soldat":{sk:["Athlétisme","Intimidation"],xl:0,tools:"1 type de jeu (au choix), véhicules terrestres",eq:["Insigne de grade","Trophée pris à un ennemi","Jeu de dés ou de cartes","Vêtements courants"],po:10,feat:"Grade militaire : les soldats reconnaissent ton autorité",d:"A servi dans une armée."}
};

/* Armes : [dégâts, type, catégorie(s/m), propriétés] */
const W={
 "Bâton":["1d6","contondant","s","polyvalente (1d8)"],"Dague":["1d4","perforant","s","finesse, légère, lancer (6/18 m)"],"Gourdin":["1d4","contondant","s","légère"],
 "Hachette":["1d6","tranchant","s","légère, lancer (6/18 m)"],"Javeline":["1d6","perforant","s","lancer (9/36 m)"],"Lance":["1d6","perforant","s","lancer (6/18 m), polyvalente (1d8)"],
 "Marteau léger":["1d4","contondant","s","légère, lancer (6/18 m)"],"Masse":["1d6","contondant","s",""],"Massue":["1d8","contondant","s","deux mains"],"Serpe":["1d4","tranchant","s","légère"],
 "Arbalète légère":["1d8","perforant","s","munitions (24/96 m), chargement, deux mains"],"Arc court":["1d6","perforant","s","munitions (24/96 m), deux mains"],
 "Fléchette":["1d4","perforant","s","finesse, lancer (6/18 m)"],"Fronde":["1d4","contondant","s","munitions (9/36 m)"],
 "Cimeterre":["1d6","tranchant","m","finesse, légère"],"Coutille":["1d10","tranchant","m","lourde, allonge, deux mains"],"Épée à deux mains":["2d6","tranchant","m","lourde, deux mains"],
 "Épée courte":["1d6","perforant","m","finesse, légère"],"Épée longue":["1d8","tranchant","m","polyvalente (1d10)"],"Fléau":["1d8","contondant","m",""],
 "Fouet":["1d4","tranchant","m","finesse, allonge"],"Hache à deux mains":["1d12","tranchant","m","lourde, deux mains"],"Hache d'armes":["1d8","tranchant","m","polyvalente (1d10)"],
 "Hallebarde":["1d10","tranchant","m","lourde, allonge, deux mains"],"Maillet d'armes":["2d6","contondant","m","lourde, deux mains"],"Marteau de guerre":["1d8","contondant","m","polyvalente (1d10)"],
 "Morgenstern":["1d8","perforant","m",""],"Pic de guerre":["1d8","perforant","m",""],"Pique":["1d10","perforant","m","lourde, allonge, deux mains"],
 "Rapière":["1d8","perforant","m","finesse"],"Trident":["1d6","perforant","m","lancer (6/18 m), polyvalente (1d8)"],
 "Arbalète de poing":["1d6","perforant","m","munitions (9/36 m), légère, chargement"],"Arbalète lourde":["1d10","perforant","m","munitions (30/120 m), lourde, chargement, deux mains"],
 "Arc long":["1d8","perforant","m","munitions (45/180 m), lourde, deux mains"]
};
const RANGED=["Arbalète légère","Arc court","Fronde","Arbalète de poing","Arbalète lourde","Arc long","Fléchette"]; // Fléchette = arme de jet à distance, mais finesse
const isRanged=n=>["Arbalète légère","Arc court","Fronde","Arbalète de poing","Arbalète lourde","Arc long"].includes(n);
const WS=Object.keys(W).filter(k=>W[k][2]=="s"), WM=Object.keys(W).filter(k=>W[k][2]=="m");
const WSmelee=WS.filter(k=>!isRanged(k)), WMmelee=WM.filter(k=>!isRanged(k));

/* Armures : [base, maxDex(null=illimité, 0=aucun), type, note] */
const ARM={"Cuir":[11,null,"légère",""],"Armure d'écailles":[14,2,"intermédiaire","désavantage en Discrétion"],"Cotte de mailles":[16,0,"lourde","FOR 13 requise, désavantage en Discrétion"]};

const PACKS={
 cambrioleur:["Paquetage de cambrioleur","Sac à dos, 1 000 billes, 3 m de ficelle, clochette, 5 bougies, pied-de-biche, marteau, 10 pitons, lanterne à capote, 2 flasques d'huile, 5 jours de rations, boîte d'amadou, gourde, 15 m de corde de chanvre"],
 diplomate:["Paquetage de diplomate","Coffre, 2 étuis à cartes et parchemins, habits de qualité, bouteille d'encre, plume, lampe, 2 flasques d'huile, 5 feuilles de papier, flacon de parfum, cire à cacheter, savon"],
 souterraine:["Paquetage d'exploration souterraine","Sac à dos, pied-de-biche, marteau, 10 pitons, 10 torches, boîte d'amadou, 10 jours de rations, gourde, 15 m de corde de chanvre"],
 artiste:["Paquetage d'artiste","Sac à dos, sac de couchage, 2 costumes, 5 bougies, 5 jours de rations, gourde, kit de déguisement"],
 explorateur:["Paquetage d'explorateur","Sac à dos, sac de couchage, gamelle, boîte d'amadou, 10 torches, 10 jours de rations, gourde, 15 m de corde de chanvre"],
 ecclesiastique:["Paquetage d'ecclésiastique","Sac à dos, couverture, 10 bougies, boîte d'amadou, boîte à aumônes, 2 blocs d'encens, encensoir, habits de cérémonie, 2 jours de rations, gourde"],
 erudit:["Paquetage d'érudit","Sac à dos, livre de connaissances, bouteille d'encre, plume, 10 feuilles de parchemin, petit sac de sable, petit couteau"]
};

/* Équipement de départ : lignes ; chaque option = liste d'items
   items : {w:nom,q:qte} arme | {a:nom} armure | {sh:1} bouclier | {p:clé} paquetage | {t:texte} | {pick:"s"|"m"|"sm"|"mm"|"cls", q:1} arme au choix
   req : "martial" / "heavy" pour désactiver si pas maîtrisé */
const EQUIP={
 Barbare:{lines:[
   [{l:"Hache à deux mains",i:[{w:"Hache à deux mains"}]},{l:"Une arme de guerre de corps-à-corps au choix",i:[{pick:"mm"}]}],
   [{l:"Deux hachettes",i:[{w:"Hachette",q:2}]},{l:"Une arme courante au choix",i:[{pick:"s"}]}]],
   fixed:[{p:"explorateur"},{w:"Javeline",q:4}]},
 Barde:{lines:[
   [{l:"Rapière",i:[{w:"Rapière"}]},{l:"Épée longue",i:[{w:"Épée longue"}]},{l:"Une arme courante au choix",i:[{pick:"s"}]}],
   [{l:"Paquetage de diplomate",i:[{p:"diplomate"}]},{l:"Paquetage d'artiste",i:[{p:"artiste"}]}],
   [{l:"Luth",i:[{t:"Luth"}]},{l:"Un autre instrument de musique",i:[{t:"Instrument de musique (au choix)"}]}]],
   fixed:[{a:"Cuir"},{w:"Dague"}]},
 Clerc:{lines:[
   [{l:"Masse",i:[{w:"Masse"}]},{l:"Marteau de guerre (domaines Tempête ou Guerre)",i:[{w:"Marteau de guerre"}],req:"martial"}],
   [{l:"Armure d'écailles (CA 14 + DEX max 2)",i:[{a:"Armure d'écailles"}]},{l:"Armure de cuir (CA 11 + DEX)",i:[{a:"Cuir"}]},{l:"Cotte de mailles (CA 16) — domaines Vie, Nature, Tempête, Guerre",i:[{a:"Cotte de mailles"}],req:"heavy"}],
   [{l:"Arbalète légère et 20 carreaux",i:[{w:"Arbalète légère"},{t:"20 carreaux"}]},{l:"Une arme courante au choix",i:[{pick:"s"}]}],
   [{l:"Paquetage d'ecclésiastique",i:[{p:"ecclesiastique"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{sh:1},{t:"Symbole sacré"}]},
 Druide:{lines:[
   [{l:"Bouclier en bois",i:[{sh:1,t:"Bouclier en bois"}]},{l:"Une arme courante au choix",i:[{pick:"cls"}]}],
   [{l:"Cimeterre",i:[{w:"Cimeterre"}]},{l:"Une arme courante de corps-à-corps au choix",i:[{pick:"clsm"}]}]],
   fixed:[{a:"Cuir"},{p:"explorateur"},{t:"Focaliseur druidique"}]},
 Ensorceleur:{lines:[
   [{l:"Arbalète légère et 20 carreaux",i:[{w:"Arbalète légère"},{t:"20 carreaux"}]},{l:"Une arme courante au choix",i:[{pick:"cls"}]}],
   [{l:"Sacoche à composantes",i:[{t:"Sacoche à composantes"}]},{l:"Focaliseur arcanique",i:[{t:"Focaliseur arcanique"}]}],
   [{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{w:"Dague",q:2}]},
 Guerrier:{lines:[
   [{l:"Cotte de mailles (CA 16)",i:[{a:"Cotte de mailles"}]},{l:"Armure de cuir, arc long et 20 flèches",i:[{a:"Cuir"},{w:"Arc long"},{t:"20 flèches"}]}],
   [{l:"Une arme de guerre et un bouclier",i:[{pick:"m"},{sh:1}]},{l:"Deux armes de guerre",i:[{pick:"m"},{pick:"m"}]}],
   [{l:"Arbalète légère et 20 carreaux",i:[{w:"Arbalète légère"},{t:"20 carreaux"}]},{l:"Deux hachettes",i:[{w:"Hachette",q:2}]}],
   [{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[]},
 Magicien:{lines:[
   [{l:"Bâton",i:[{w:"Bâton"}]},{l:"Dague",i:[{w:"Dague"}]}],
   [{l:"Sacoche à composantes",i:[{t:"Sacoche à composantes"}]},{l:"Focaliseur arcanique",i:[{t:"Focaliseur arcanique"}]}],
   [{l:"Paquetage d'érudit",i:[{p:"erudit"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{t:"Grimoire"}]},
 Moine:{lines:[
   [{l:"Épée courte",i:[{w:"Épée courte"}]},{l:"Une arme courante au choix",i:[{pick:"s"}]}],
   [{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{w:"Fléchette",q:10}]},
 Occultiste:{lines:[
   [{l:"Arbalète légère et 20 carreaux",i:[{w:"Arbalète légère"},{t:"20 carreaux"}]},{l:"Une arme courante au choix",i:[{pick:"s"}]}],
   [{l:"Sacoche à composantes",i:[{t:"Sacoche à composantes"}]},{l:"Focaliseur arcanique",i:[{t:"Focaliseur arcanique"}]}],
   [{l:"Paquetage d'érudit",i:[{p:"erudit"}]},{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]}]],
   fixed:[{a:"Cuir"},{pick:"s"},{w:"Dague",q:2}]},
 Paladin:{lines:[
   [{l:"Une arme de guerre et un bouclier",i:[{pick:"m"},{sh:1}]},{l:"Deux armes de guerre",i:[{pick:"m"},{pick:"m"}]}],
   [{l:"Cinq javelines",i:[{w:"Javeline",q:5}]},{l:"Une arme courante de corps-à-corps au choix",i:[{pick:"sm"}]}],
   [{l:"Paquetage d'ecclésiastique",i:[{p:"ecclesiastique"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{a:"Cotte de mailles"},{t:"Symbole sacré"}]},
 Rôdeur:{lines:[
   [{l:"Armure d'écailles (CA 14 + DEX max 2)",i:[{a:"Armure d'écailles"}]},{l:"Armure de cuir (CA 11 + DEX)",i:[{a:"Cuir"}]}],
   [{l:"Deux épées courtes",i:[{w:"Épée courte",q:2}]},{l:"Deux armes courantes de corps-à-corps au choix",i:[{pick:"sm"},{pick:"sm"}]}],
   [{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{w:"Arc long"},{t:"Carquois de 20 flèches"}]},
 Roublard:{lines:[
   [{l:"Rapière",i:[{w:"Rapière"}]},{l:"Épée courte",i:[{w:"Épée courte"}]}],
   [{l:"Arc court et carquois de 20 flèches",i:[{w:"Arc court"},{t:"Carquois de 20 flèches"}]},{l:"Épée courte",i:[{w:"Épée courte"}]}],
   [{l:"Paquetage de cambrioleur",i:[{p:"cambrioleur"}]},{l:"Paquetage d'exploration souterraine",i:[{p:"souterraine"}]},{l:"Paquetage d'explorateur",i:[{p:"explorateur"}]}]],
   fixed:[{a:"Cuir"},{w:"Dague",q:2},{t:"Outils de voleur"}]}
};

/* Sorts : nom -> [école/type court, description] */
const SP={
 // Tours de magie
 "Amis":["Enchantement","Avantage aux tests de CHA contre une créature pendant 1 min ; elle t'en veut après."],
 "Aspersion d'acide":["Évocation · attaque","1 ou 2 cibles proches, 1d6 acide (sauvegarde DEX). 18 m."],
 "Assistance":["Divination","Un allié ajoute 1d4 à un test de caractéristique (concentration 1 min)."],
 "Bouffée de poison":["Invocation","1d12 poison à 3 m (sauvegarde CON)."],
 "Contact glacial":["Nécromancie · attaque","Attaque de sort à 36 m, 1d8 nécrotique, la cible ne peut pas regagner de PV pendant 1 tour."],
 "Coup au but":["Divination","Avantage à ta prochaine attaque contre la cible (concentration)."],
 "Décharge occulte":["Évocation · attaque","Le tour de l'occultiste : attaque de sort à 36 m, 1d10 force."],
 "Druidisme":["Transmutation","Petits effets naturels : prévoir la météo, faire éclore une fleur, souffler une bougie."],
 "Épargner les mourants":["Nécromancie","Stabilise une créature à 0 PV au contact."],
 "Flamme sacrée":["Évocation","1d8 radiant à 18 m (sauvegarde DEX), ignore les abris."],
 "Flammes":["Invocation · attaque","Flamme dans ta main (lumière), peut être lancée : 1d8 feu à 9 m."],
 "Gourdin magique":["Transmutation","Ton bâton ou gourdin utilise SAG et fait 1d8. Action bonus."],
 "Illusion mineure":["Illusion","Crée un son ou une image immobile (cube de 1,50 m) pendant 1 min."],
 "Lumière":["Évocation","Un objet émet de la lumière vive sur 6 m pendant 1 heure."],
 "Lumières dansantes":["Évocation","Jusqu'à 4 lumières flottantes que tu déplaces (concentration 1 min)."],
 "Main de mage":["Invocation","Main spectrale à 9 m qui manipule des objets légers (5 kg max)."],
 "Message":["Transmutation","Chuchote un message à une créature à 36 m, elle peut répondre."],
 "Moquerie cruelle":["Enchantement","Insulte magique : 1d4 psychique et désavantage à sa prochaine attaque (sauvegarde SAG)."],
 "Poigne électrique":["Évocation · attaque","Contact, 1d8 foudre, avantage si armure métallique, la cible perd sa réaction."],
 "Prestidigitation":["Transmutation","Petits tours : nettoyer, réchauffer, parfumer, étincelles, petits effets."],
 "Rayon de givre":["Évocation · attaque","Attaque de sort à 18 m, 1d8 froid et -3 m de vitesse."],
 "Réparation":["Transmutation","Répare une cassure ou une déchirure simple."],
 "Résistance":["Abjuration","Un allié ajoute 1d4 à une sauvegarde (concentration 1 min)."],
 "Thaumaturgie":["Transmutation","Petits prodiges : voix tonitruante, flammes qui vacillent, tremblements."],
 "Trait de feu":["Évocation · attaque","Attaque de sort à 36 m, 1d10 feu, enflamme les objets."],
 // Niveau 1
 "Alarme":["Abjuration · rituel","Alerte si une créature entre dans une zone pendant 8 h."],
 "Amitié avec les animaux":["Enchantement","Charme une bête (sauvegarde SAG) pendant 24 h."],
 "Armure d'Agathys":["Abjuration","5 PV temporaires ; qui te frappe au corps-à-corps subit 5 froid."],
 "Armure de mage":["Abjuration","CA = 13 + DEX pendant 8 h (sans armure)."],
 "Baies nourricières":["Transmutation","10 baies qui nourrissent et soignent 1 PV chacune."],
 "Bénédiction":["Enchantement","3 créatures ajoutent 1d4 à leurs attaques et sauvegardes (concentration 1 min)."],
 "Blessure":["Nécromancie · attaque","Contact, 3d10 nécrotique."],
 "Bouclier":["Abjuration · réaction","+5 CA jusqu'à ton prochain tour, bloque Projectile magique."],
 "Bouclier de la foi":["Abjuration · bonus","+2 CA à une créature (concentration 10 min)."],
 "Bras d'Hadar":["Invocation","Tentacules autour de toi : 2d6 nécrotique à 3 m (sauvegarde FOR), plus de réaction."],
 "Charme-personne":["Enchantement","Un humanoïde te considère comme un ami pendant 1 h (sauvegarde SAG)."],
 "Compréhension des langues":["Divination · rituel","Comprends toutes les langues parlées et écrites pendant 1 h."],
 "Couleurs dansantes":["Illusion","Éblouit 6d10 PV de créatures (les plus faibles d'abord)."],
 "Création ou destruction d'eau":["Transmutation","Crée ou détruit jusqu'à 40 litres d'eau."],
 "Déguisement":["Illusion","Change ton apparence pendant 1 h."],
 "Détection de la magie":["Divination · rituel","Sens la magie à 9 m (concentration 10 min)."],
 "Détection du mal et du bien":["Divination","Sens aberrations, célestes, élémentaires, fées, fiélons, morts-vivants à 9 m."],
 "Détection du poison et des maladies":["Divination · rituel","Sens poisons, créatures venimeuses et maladies à 9 m."],
 "Éclair traçant":["Évocation · attaque","Attaque de sort, 4d6 radiant, la prochaine attaque contre la cible a l'avantage."],
 "Enchevêtrement":["Invocation","Plantes qui entravent dans un carré de 6 m (sauvegarde FOR)."],
 "Faveur divine":["Évocation · bonus","+1d4 radiant à tes attaques d'arme (concentration 1 min)."],
 "Feuille morte":["Transmutation · réaction","Jusqu'à 5 créatures tombent lentement, sans dégâts."],
 "Fléau":["Enchantement","3 créatures soustraient 1d4 à leurs attaques et sauvegardes (sauvegarde CHA)."],
 "Fou rire de Tasha":["Enchantement","Une créature se tord de rire, à terre et neutralisée (sauvegarde SAG)."],
 "Graisse":["Invocation","Sol glissant sur 3 m : chute au sol (sauvegarde DEX)."],
 "Grande foulée":["Transmutation","+3 m de vitesse à une créature pendant 1 h."],
 "Héroïsme":["Enchantement","Immunisé à la peur, PV temporaires chaque tour (concentration)."],
 "Identification":["Divination · rituel","Découvre les propriétés d'un objet magique."],
 "Image silencieuse":["Illusion","Image sans son d'un objet ou d'une créature (cube de 4,50 m, concentration)."],
 "Injonction":["Enchantement","Un mot d'ordre : approche, lâche, fuis, à terre, halte (sauvegarde SAG)."],
 "Lueurs féeriques":["Évocation","Les créatures dans un cube de 6 m brillent : avantage pour les attaquer, pas d'invisibilité."],
 "Maléfice":["Enchantement · bonus","+1d6 nécrotique à tes attaques contre la cible, désavantage à une caractéristique (concentration 1 h)."],
 "Mains brûlantes":["Évocation","Cône de feu de 4,50 m, 3d6 feu (sauvegarde DEX)."],
 "Mot de guérison":["Évocation · bonus","Soigne 1d4 + mod. à distance (18 m), en action bonus."],
 "Murmures dissonants":["Enchantement","3d6 psychique et la cible fuit (sauvegarde SAG)."],
 "Nappe de brouillard":["Invocation","Brouillard épais de 6 m de rayon (concentration 1 h)."],
 "Vague tonnante":["Évocation","Cube de 4,50 m, 2d8 tonnerre et repousse de 3 m (sauvegarde CON)."],
 "Orbe chromatique":["Évocation · attaque","Attaque de sort, 3d8 du type de ton choix (acide, froid, feu, foudre, poison, tonnerre)."],
 "Parler avec les animaux":["Divination · rituel","Parle avec les bêtes pendant 10 min."],
 "Projectile magique":["Évocation","3 projectiles qui touchent toujours, 1d4 + 1 force chacun."],
 "Protection contre le mal et le bien":["Abjuration","Protège une créature contre aberrations, fiélons, morts-vivants…"],
 "Purification de nourriture et d'eau":["Transmutation · rituel","Rend nourriture et boisson saines."],
 "Rayon empoisonné":["Nécromancie · attaque","Attaque de sort, 2d8 poison."],
 "Repli expéditif":["Transmutation · bonus","Foncer en action bonus pendant 10 min (concentration)."],
 "Représailles infernales":["Évocation · réaction","Quand on te blesse : 2d10 feu à l'attaquant (sauvegarde DEX)."],
 "Sanctuaire":["Abjuration · bonus","Les ennemis doivent réussir une sauvegarde SAG pour attaquer la cible protégée."],
 "Saut":["Transmutation","Triple la distance de saut pendant 1 min."],
 "Serviteur invisible":["Invocation · rituel","Une force invisible exécute des tâches simples pendant 1 h."],
 "Simulacre de vie":["Nécromancie","1d4 + 4 PV temporaires."],
 "Soins":["Évocation","Contact, soigne 1d8 + mod."],
 "Sommeil":["Enchantement","Endort 5d8 PV de créatures (les plus faibles d'abord)."],
 "Texte illusoire":["Illusion · rituel","Écrit un message secret lisible seulement par ceux que tu choisis."],
 "Disque flottant de Tenser":["Invocation · rituel","Disque de force qui porte 250 kg pendant 1 h."],
 "Trouver un familier":["Invocation · rituel","Invoque un familier (chat, chouette, crapaud…)."]
};
const CANT={
 Barde:["Amis","Coup au but","Illusion mineure","Lumière","Lumières dansantes","Main de mage","Message","Moquerie cruelle","Prestidigitation","Réparation"],
 Clerc:["Assistance","Épargner les mourants","Flamme sacrée","Lumière","Réparation","Résistance","Thaumaturgie"],
 Druide:["Assistance","Bouffée de poison","Druidisme","Flammes","Gourdin magique","Réparation","Résistance"],
 Ensorceleur:["Amis","Aspersion d'acide","Bouffée de poison","Contact glacial","Coup au but","Illusion mineure","Lumière","Lumières dansantes","Main de mage","Message","Poigne électrique","Prestidigitation","Rayon de givre","Réparation","Trait de feu"],
 Occultiste:["Amis","Bouffée de poison","Contact glacial","Coup au but","Décharge occulte","Illusion mineure","Main de mage","Prestidigitation"],
 Magicien:["Amis","Aspersion d'acide","Bouffée de poison","Contact glacial","Coup au but","Illusion mineure","Lumière","Lumières dansantes","Main de mage","Message","Poigne électrique","Prestidigitation","Rayon de givre","Réparation","Trait de feu"]
};
const LVL1={
 Barde:["Amitié avec les animaux","Charme-personne","Compréhension des langues","Déguisement","Détection de la magie","Feuille morte","Fou rire de Tasha","Grande foulée","Héroïsme","Identification","Image silencieuse","Lueurs féeriques","Mot de guérison","Murmures dissonants","Parler avec les animaux","Serviteur invisible","Soins","Sommeil","Texte illusoire","Vague tonnante"],
 Clerc:["Bénédiction","Blessure","Bouclier de la foi","Création ou destruction d'eau","Détection de la magie","Détection du mal et du bien","Détection du poison et des maladies","Éclair traçant","Fléau","Injonction","Mot de guérison","Protection contre le mal et le bien","Purification de nourriture et d'eau","Sanctuaire","Soins"],
 Druide:["Amitié avec les animaux","Baies nourricières","Charme-personne","Création ou destruction d'eau","Détection de la magie","Détection du poison et des maladies","Enchevêtrement","Grande foulée","Lueurs féeriques","Mot de guérison","Nappe de brouillard","Parler avec les animaux","Purification de nourriture et d'eau","Saut","Soins","Vague tonnante"],
 Ensorceleur:["Armure de mage","Bouclier","Charme-personne","Compréhension des langues","Couleurs dansantes","Déguisement","Détection de la magie","Feuille morte","Image silencieuse","Mains brûlantes","Nappe de brouillard","Orbe chromatique","Projectile magique","Rayon empoisonné","Repli expéditif","Saut","Simulacre de vie","Sommeil","Vague tonnante"],
 Occultiste:["Armure d'Agathys","Bras d'Hadar","Charme-personne","Compréhension des langues","Maléfice","Protection contre le mal et le bien","Repli expéditif","Représailles infernales","Serviteur invisible","Texte illusoire"],
 Magicien:["Alarme","Armure de mage","Bouclier","Charme-personne","Compréhension des langues","Couleurs dansantes","Déguisement","Détection de la magie","Disque flottant de Tenser","Feuille morte","Fou rire de Tasha","Graisse","Grande foulée","Identification","Image silencieuse","Mains brûlantes","Nappe de brouillard","Orbe chromatique","Projectile magique","Protection contre le mal et le bien","Rayon empoisonné","Repli expéditif","Saut","Serviteur invisible","Simulacre de vie","Sommeil","Texte illusoire","Trouver un familier","Vague tonnante"]
};
const ALIGN=["Loyal bon","Neutre bon","Chaotique bon","Loyal neutre","Neutre","Chaotique neutre","Loyal mauvais","Neutre mauvais","Chaotique mauvais"];
const IDEAS={
 traits:["Je cite des proverbes pour chaque situation.","Je ne recule jamais devant un défi.","Je suis incroyablement curieux, je touche à tout.","Je parle peu, mais chaque mot compte.","Je fais des blagues même dans les pires moments.","Je me méfie de tout le monde au début.","Je suis toujours poli, même avec mes ennemis.","Je mange comme quatre et je parle de nourriture tout le temps.","Je collectionne des babioles de chaque endroit visité.","Je m'emporte vite, mais je ne garde pas rancune."],
 ideaux:["Liberté : personne ne devrait être enchaîné.","Honneur : je tiens toujours parole.","Pouvoir : un jour, je serai le plus fort.","Connaissance : comprendre le monde est le but ultime.","Famille : je protège les miens avant tout.","Justice : les coupables doivent payer.","Gloire : je veux que des chansons parlent de moi.","Charité : j'aide ceux qui en ont besoin."],
 liens:["Je dois retrouver la personne qui a détruit mon village.","Je protège un objet hérité de ma famille.","J'ai une dette envers un inconnu qui m'a sauvé la vie.","Mon mentor a disparu et je veux savoir pourquoi.","Je me bats pour que ma petite sœur ait une vie meilleure.","Mon ancien groupe m'a trahi, je le retrouverai."],
 defauts:["Je ne résiste pas à une pièce d'or qui traîne.","Je suis trop fier pour demander de l'aide.","Je mens par habitude, même quand c'est inutile.","J'ai une peur panique d'un animal tout bête.","Je fonce sans réfléchir.","Je me méfie de la magie et de ceux qui l'utilisent.","Je parie sur tout, et je perds souvent."]
};

/* Tables de personnalité par historique : traits (d8), idéaux (d6), liens (d6), défauts (d6) */
const PERS={
 "Acolyte":{
  traits:["Je cite des textes sacrés pour la moindre petite chose.","Je vois des présages partout, même dans la soupe.","Je reste calme quand tout s'effondre : ma foi me guide.","Je fais trop vite confiance à ceux qui partagent ma foi.","Je prie à voix haute avant chaque repas, même en pleine taverne.","Je demande à chaque inconnu quel dieu il prie.","Je suis gêné quand on me remercie : c'est ma divinité qu'il faut remercier.","J'ai passé tant de temps au temple que je ne connais presque rien du monde."],
  ideaux:["Tradition (Loyal) : les rites anciens doivent être respectés.","Charité (Bon) : j'aide toujours ceux qui souffrent, quoi qu'il m'en coûte.","Changement (Chaotique) : les dieux veulent que le monde évolue.","Pouvoir (Loyal) : un jour, je dirigerai mon temple.","Foi (Loyal) : ma divinité guide chacun de mes pas.","Aspiration (Tous) : je veux me montrer digne de mon dieu."],
  liens:["Je donnerais ma vie pour retrouver une relique volée à mon temple.","Le prêtre qui m'a élevé a disparu, je dois le retrouver.","Je dois tout au temple qui m'a recueilli enfant.","Je veux punir ceux qui ont profané mon sanctuaire.","Je protège un texte sacré que d'autres veulent détruire.","Un ami d'enfance a renié notre foi, je veux le ramener."],
  defauts:["Je juge durement ceux qui ne partagent pas ma foi.","J'obéis aveuglément à mes supérieurs religieux.","Je suis incapable de changer d'avis.","Je doute en secret de ma propre foi.","Je me crois meilleur que les autres parce que je suis pieux.","Je cache une faute grave commise au temple."]},
 "Artisan de guilde":{
  traits:["Je suis fier de mon travail et je le fais savoir.","Je juge les gens à la qualité de ce qu'ils fabriquent.","Je ne supporte pas le travail bâclé.","Je parle de mon métier à tout le monde, même si personne n'écoute.","Je négocie absolument tout, même le prix d'une pomme.","J'ai toujours un truc à bricoler dans les mains.","J'ai un avis sur la façon dont chaque chose est construite.","Je suis poli, mais je n'oublie jamais une mauvaise affaire."],
  ideaux:["Communauté (Loyal) : la guilde passe avant tout.","Générosité (Bon) : mon savoir-faire doit servir à tous.","Liberté (Chaotique) : chacun devrait pouvoir exercer le métier qu'il veut.","Avidité (Mauvais) : je travaille pour l'or, point.","Excellence (Tous) : je veux créer un vrai chef-d'œuvre.","Indépendance (Chaotique) : je rêve d'ouvrir mon propre atelier."],
  liens:["L'atelier où j'ai appris est ce que j'ai de plus cher.","On m'a volé ma plus belle création, je la retrouverai.","Mon maître d'apprentissage m'a tout appris, je lui suis fidèle.","Je dois de l'argent à la guilde et je compte la rembourser.","Je veux prouver à ma famille que mon métier vaut quelque chose.","Un rival a ruiné ma réputation, il le regrettera."],
  defauts:["Je ferais n'importe quoi pour un matériau ou un outil rare.","Je suis jaloux des artisans plus doués que moi.","Je critique le travail des autres sans arrêt.","Je suis radin.","Je méprise ceux qui ne savent rien faire de leurs mains.","Je promets des délais que je ne tiens jamais."]},
 "Artiste":{
  traits:["J'ai une histoire pour chaque situation.","J'adore être le centre de l'attention.","Je change d'humeur aussi vite qu'un acteur change de rôle.","Je chante ou je fredonne tout le temps.","Je transforme chaque dispute en spectacle.","Je flatte mon public, quel qu'il soit.","Je ne supporte pas l'ennui.","Je garde mon sourire de scène même quand ça va mal."],
  ideaux:["Beauté (Bon) : mon art rend le monde meilleur.","Tradition (Loyal) : les vieilles chansons doivent être transmises.","Créativité (Chaotique) : il faut toujours inventer du neuf.","Gloire (Mauvais) : je veux qu'on m'adore.","Sincérité (Tous) : mon art montre les choses telles qu'elles sont.","Joie (Neutre) : rien ne vaut le sourire d'un public."],
  liens:["Mon instrument est mon bien le plus précieux.","Je rêve de jouer un jour devant un roi.","Un rival m'a volé une chanson, il me le paiera.","Je dois tout à la troupe qui m'a recueilli.","Je cherche l'auteur d'une chanson mystérieuse qui me hante.","Mon ancien amour vit quelque part, je veux le revoir."],
  defauts:["Je ferais tout pour être célèbre.","Je déteste qu'on me vole la vedette.","Je dépense tout ce que je gagne.","Je ne tiens jamais en place.","Je ne prends rien au sérieux.","J'enjolive mes histoires jusqu'au mensonge."]},
 "Charlatan":{
  traits:["Je change de nom comme de chemise.","Je flatte tout le monde, ça ouvre des portes.","J'ai toujours un plan de secours.","Je ne réponds jamais directement à une question.","J'adore faire des farces.","Je suis aimable avec tout le monde : c'est plus facile pour les arnaquer.","Je ne résiste jamais à un bon pari.","Je raconte mes exploits en les gonflant beaucoup."],
  ideaux:["Indépendance (Chaotique) : je ne dois rien à personne.","Équité (Loyal) : je n'arnaque jamais les pauvres.","Charité (Bon) : je redonne aux pauvres ce que je prends aux riches.","Créativité (Chaotique) : une belle arnaque est une œuvre d'art.","Amitié (Bon) : mes amis passent avant le butin.","Ambition (Mauvais) : un jour, je serai riche à millions."],
  liens:["J'ai arnaqué la mauvaise personne et elle me cherche.","Je dois tout au vieil escroc qui m'a appris le métier.","J'ai ruiné une famille par erreur et je l'aide en secret.","Je veux venger un complice qui a été trahi.","J'ai un enfant que je n'ai jamais rencontré.","J'ai caché un magot quelque part et je dois le récupérer."],
  defauts:["Je ne résiste pas à une personne naïve.","Je mens même quand ce n'est pas utile.","Je file dès que ça tourne mal.","Je ne garde aucun secret… sauf les miens.","Je suis beaucoup trop sûr de moi.","Je ne fais confiance à personne."]},
 "Criminel":{
  traits:["J'ai toujours un plan, même pour aller aux toilettes.","Je reste calme sous la pression.","Je repère toujours les sorties en entrant dans une pièce.","Je préfère un ami fiable à un coffre plein d'or.","Je me méfie de tout ce qui porte un uniforme.","Je parle l'argot de la rue.","Je regarde rarement les gens dans les yeux.","Je recompte mon argent chaque soir."],
  ideaux:["Honneur (Loyal) : je ne vole jamais quelqu'un de mon équipe.","Liberté (Chaotique) : les lois sont faites pour être contournées.","Charité (Bon) : je prends aux riches pour aider ceux qui en ont besoin.","Avidité (Mauvais) : l'or avant tout le reste.","Loyauté (Neutre) : je reste fidèle à ceux qui m'ont aidé.","Rédemption (Bon) : je veux changer de vie."],
  liens:["Je dois une grosse somme à un chef de gang.","Mon complice est en prison par ma faute.","Je veux me venger de celui qui m'a dénoncé.","Ce que je vole sert à faire vivre ma famille.","J'ai volé un objet que je n'aurais jamais dû toucher.","Je prépare le coup du siècle."],
  defauts:["Je vole par réflexe, même des trucs inutiles.","Je fuis dès que ça sent le roussi.","Je ne fais confiance à personne.","J'ai des dettes un peu partout.","Je deviens violent quand on me trahit.","Je ne résiste pas à ce qui brille."]},
 "Enfant des rues":{
  traits:["J'ai toujours de quoi manger caché dans mes poches.","Je pose énormément de questions.","Je dors toujours dos au mur.","Je me méfie des gens trop bien habillés.","Je parle la bouche pleine.","Je me débrouille avec trois fois rien.","Je cache mes affaires un peu partout.","Je suis très doux avec les animaux errants."],
  ideaux:["Respect (Bon) : personne ne mérite de vivre dans la rue.","Entraide (Loyal) : entre gens de la rue, on se serre les coudes.","Changement (Chaotique) : les puissants doivent tomber.","Revanche (Mauvais) : je montrerai à tous qu'ils ont eu tort de me mépriser.","Les miens (Neutre) : j'aide d'abord ceux de mon quartier.","Ambition (Tous) : je veux m'en sortir."],
  liens:["Ma ville, c'est ma maison.","Je protège les gamins des rues.","Je veux savoir qui étaient mes parents.","Je dois la vie à un vieux mendiant.","Un garde m'a maltraité, je ne l'oublierai jamais.","Ma souris apprivoisée est ma meilleure amie."],
  defauts:["Je chaparde par habitude.","Je ne partage jamais ma nourriture.","Je préfère fuir plutôt que me battre.","Je mens pour me sortir de tout.","Je suis jaloux de ceux qui ont tout eu.","Je refuse toute aide."]},
 "Ermite":{
  traits:["Je parle très peu.","Je médite aux moments les plus bizarres.","Je parle tout seul.","Je suis mal à l'aise dans un groupe.","J'observe tout en silence.","Je partage des sagesses que personne ne comprend.","Je n'ai aucune idée de la valeur de l'argent.","Je reconnais chaque plante sur mon chemin."],
  ideaux:["Bien commun (Bon) : ma découverte peut aider le monde.","Logique (Loyal) : les émotions trompent, la raison guide.","Liberté (Chaotique) : la pensée ne doit pas avoir de chaînes.","Pouvoir (Mauvais) : le savoir, c'est le pouvoir.","Paix (Neutre) : vivre et laisser vivre.","Connaissance (Tous) : je dois comprendre ce que j'ai découvert."],
  liens:["Je protège l'endroit où j'ai vécu seul.","Ma découverte doit rester secrète.","Je cherche celui qui m'a forcé à l'exil.","Un animal m'a tenu compagnie pendant des années.","Un autre ermite m'a sauvé, je lui dois tout.","J'ai laissé derrière moi un ami que je veux retrouver."],
  defauts:["Je ne comprends rien aux règles de politesse.","Je suis obsédé par ma découverte.","Je suis têtu comme une mule.","Je méprise la vie en ville.","Je garde des secrets même quand c'est inutile.","Je suis très maladroit avec les gens."]},
 "Héros du peuple":{
  traits:["Je juge les gens à leurs actes, pas à leurs paroles.","Je prends toujours la défense des plus faibles.","Je suis têtu.","Je fais confiance aux gens simples.","J'ai les mains calleuses et j'en suis fier.","Je me méfie des nobles.","Je mange comme quatre.","Rien ne me fait reculer."],
  ideaux:["Respect (Bon) : tout le monde mérite la dignité.","Justice (Loyal) : personne n'est au-dessus des lois.","Liberté (Chaotique) : les tyrans doivent tomber.","Force (Mauvais) : un jour, c'est moi qui commanderai.","Franchise (Neutre) : je dis ce que je pense.","Destin (Tous) : je suis fait pour de grandes choses."],
  liens:["Je protège mon village natal.","Ma famille compte sur moi.","Un seigneur m'a fait du tort, je ne l'oublie pas.","Des bandits ont tué mon frère, je veux les retrouver.","Je garde l'outil de mon grand-père comme un trésor.","Les paysans d'une région lointaine ont besoin de moi."],
  defauts:["Je suis trop confiant.","Je fonce sans réfléchir.","Je méprise les nobles, même les gentils.","J'ai un secret dont j'ai honte.","Je suis naïf.","Je crois que tout le monde m'aime."]},
 "Marin":{
  traits:["Je jure comme un charretier.","J'ai une histoire de mer pour tout.","Je suis superstitieux.","Je suis à l'aise en hauteur, même dans la tempête.","Je tiens bien l'alcool… enfin, je crois.","Je travaille dur sans me plaindre.","La terre ferme me rend mal à l'aise.","Je suis toujours de bonne humeur."],
  ideaux:["Respect (Bon) : chaque membre d'équipage compte.","Équité (Loyal) : on partage le butin à parts égales.","Liberté (Chaotique) : la mer n'appartient à personne.","Maîtrise (Mauvais) : un jour, je serai capitaine.","Loyauté (Neutre) : je suis fidèle à mon équipage.","Aspiration (Tous) : je veux voir le monde entier."],
  liens:["Mon navire est ma maison.","Je dois tout à mon capitaine.","J'ai abandonné mon équipage et ça me ronge.","Je cherche un trésor englouti.","Quelqu'un m'attend dans un port lointain.","Un pirate a tué mon meilleur ami."],
  defauts:["Je bois trop.","Je cherche la bagarre.","Je ne tiens pas toujours parole.","Mes superstitions me font faire des bêtises.","Je dépense toute ma paie dès que je pose pied à terre.","Je méprise les gens qui n'ont jamais navigué."]},
 "Noble":{
  traits:["Je suis toujours d'une politesse parfaite.","Je me sens au-dessus du lot.","Je porte toujours mes plus beaux habits.","Je déteste me salir.","Je sais parler à tout le monde, du roi au palefrenier.","Je suis généreux avec ma bourse.","Je n'aime pas qu'on me contredise.","Je fais tout avec élégance, même me battre."],
  ideaux:["Respect (Bon) : je traite chacun avec dignité.","Devoir (Loyal) : mon rang me donne des obligations.","Indépendance (Chaotique) : je veux échapper aux attentes de ma famille.","Pouvoir (Mauvais) : je veux toujours plus d'influence.","Famille (Tous) : ma lignée avant tout.","Noblesse oblige (Bon) : je dois protéger le peuple."],
  liens:["Mon titre est ma plus grande fierté.","Je protégerai ma famille quoi qu'il arrive.","On veut me marier contre ma volonté.","Je veux rendre son honneur à ma maison.","Un vieux serviteur m'est plus cher que mes parents.","Ma famille cache un terrible secret."],
  defauts:["Je suis arrogant.","Je méprise les pauvres.","Je suis capricieux.","J'ai un vice que je cache.","Je dépense sans compter.","Je ne supporte pas d'être humilié."]},
 "Sage":{
  traits:["J'utilise des mots compliqués pour paraître savant.","Je lis tout ce qui me tombe sous la main.","Je corrige les erreurs des autres, même les petites.","Ma curiosité n'a pas de limite.","J'oublie de manger quand j'étudie.","Je pose des questions sur tout.","Je prends des notes sur tout ce que je vois.","Je suis souvent dans la lune."],
  ideaux:["Connaissance (Neutre) : le savoir mène à la sagesse.","Beauté (Bon) : ce qui est beau mène à ce qui est vrai.","Logique (Loyal) : tout s'explique par la raison.","Sans limites (Chaotique) : rien ne doit freiner la recherche.","Pouvoir (Mauvais) : le savoir sert à dominer.","Progrès (Tous) : apprendre pour devenir meilleur."],
  liens:["Ma bibliothèque est mon trésor.","Je dois tout à mon vieux maître.","Je cherche un livre perdu depuis des siècles.","Un rival veut prouver que mes travaux sont faux.","Je protège un élève prometteur.","J'ai découvert un secret qui pourrait changer le monde."],
  defauts:["Je suis distrait au pire moment.","Je me crois plus intelligent que tout le monde.","Je ne sais pas garder un secret.","Je deviens obsédé par une énigme.","Je suis un peu lâche.","Je méprise ceux qui ne lisent pas."]},
 "Sauvageon":{
  traits:["Je me sens mieux dehors que sous un toit.","Je parle aux animaux comme à des amis.","Je mange tout ce qui se mange, même cru.","Je suis mal à l'aise en ville.","Je me lave rarement.","Je suis direct, je ne tourne pas autour du pot.","Je connais des histoires de mon peuple pour tout.","Je dors à même le sol, même s'il y a un lit."],
  ideaux:["Changement (Chaotique) : la vie est comme les saisons, tout bouge.","Bien commun (Bon) : chacun doit aider sa tribu.","Honneur (Loyal) : je respecte les coutumes de mon peuple.","Force (Mauvais) : le plus fort mérite de commander.","Nature (Neutre) : la nature est plus importante que les villes.","Gloire (Tous) : je veux que mon nom soit chanté."],
  liens:["Ma tribu est ma famille.","Je protège une forêt sacrée.","Mon peuple a été chassé de ses terres.","Je cherche un animal légendaire.","Mon trophée me rappelle mon premier combat.","Je dois venger mon clan."],
  defauts:["Je ne comprends pas les règles des villes.","Je suis violent quand je suis en colère.","Je bois trop quand je fête.","Je méprise les gens faibles.","Je fais confiance à mon instinct, même à tort.","Je n'aime pas les étrangers."]},
 "Soldat":{
  traits:["Je suis toujours poli et respectueux.","Je raconte mes batailles à qui veut l'entendre.","Je peux dormir n'importe où.","J'ai l'habitude d'obéir aux ordres.","J'aime les blagues de caserne.","Je reste calme face au danger.","Je suis toujours prêt à me battre.","J'ai un tic depuis une blessure."],
  ideaux:["Bien commun (Bon) : je me bats pour protéger les autres.","Devoir (Loyal) : j'obéis aux ordres.","Indépendance (Chaotique) : je ne veux plus de chefs.","Force (Mauvais) : le plus fort l'emporte.","Camaraderie (Neutre) : mes frères d'armes avant tout.","Gloire (Tous) : je veux devenir un héros."],
  liens:["Mon ancien régiment compte pour moi.","Un compagnon tombé au combat me hante.","Je dois la vie à mon capitaine.","Je protège ma patrie.","Mon trophée me rappelle ma plus grande victoire.","Je veux me venger d'un ennemi qui m'a humilié."],
  defauts:["J'obéis même aux ordres injustes.","Je ne fais pas confiance aux civils.","Je fais des cauchemars de guerre.","Je suis bagarreur.","Je me méfie de la magie.","Je ne reconnais jamais mes erreurs."]}
};
const PCATS=[["traits","Traits de personnalité",2,8],["ideaux","Idéaux",2,6],["liens","Liens",1,6],["defauts","Défauts",2,6]];
function syncPers(){if(!S.bg)return;const T=PERS[S.bg];PCATS.forEach(([k])=>{S[k]=S.pers[k].map(i=>T[k][i]).join(" ")})}
function pPersBg(){
  if(!S.bg)return "";const T=PERS[S.bg];
  let h=`<div class="card"><h2>Personnalité de ${S.bg.toLowerCase()}</h2><div class="hint">Lance les dés pour chaque table, ou clique directement sur les lignes qui te plaisent. Tu pourras tout modifier à l'étape Personnalité.</div></div>`;
  PCATS.forEach(([k,label,n,die])=>{const sel=S.pers[k];const rolled=S.persRoll[k]||[];
    h+=`<div class="card"><h3>${label} — ${n} × d${die} <span class="count">${sel.length}/${n}</span></h3>
    <div style="margin-bottom:8px"><button class="btn sec" data-proll="${k}">🎲 Lancer ${n>1?n+" ":""}d${die}</button>${rolled.length?` <span class="small">Résultat : ${rolled.join(" et ")}</span>`:""}</div><div class="grid" style="grid-template-columns:1fr">`;
    T[k].forEach((txt,i)=>{const on=sel.includes(i);h+=`<label class="opt ${on?"sel":""}"><input type="checkbox" data-pchoose="${k}:${i}" ${on?"checked":""}><b>${i+1}. ${esc(txt)}</b></label>`});
    h+=`</div></div>`});
  return h}

/* ===================== PRÉBUILDS ===================== */
const STD=["15","14","13","12","10","8"];
const A=(...order)=>Object.fromEntries(order.map((a,i)=>[a,i])); // A("DEX","CON",...) -> 15 en DEX, 14 en CON…
const PRESETS=[
 {id:"discretion",title:"Discrétion",cls:"Roublard",tag:"Halfelin pied-léger · Criminel",d:"Se faufile partout, crochète les serrures et frappe dans le dos avec l'attaque sournoise.",
  s:{race:"Halfelin pied-léger",cls:"Roublard",bg:"Criminel",rolls:STD,assign:A("DEX","CON","SAG","INT","CHA","FOR"),
   skills:["Acrobaties","Perception","Escamotage","Investigation"],expert:["Discrétion","Perception"],
   eq:{0:0,1:0,2:0},name:"Pip Pas-de-Velours",align:"Chaotique neutre",
   pers:{traits:[2,0],ideaux:[1],liens:[4],defauts:[5,0]}}},
 {id:"tank",title:"Tank",cls:"Paladin",tag:"Nain des montagnes · Soldat",d:"Cotte de mailles et bouclier (CA 18), beaucoup de PV, protège le groupe et soigne avec ses mains.",
  s:{race:"Nain des montagnes",cls:"Paladin",bg:"Soldat",rolls:STD,assign:A("FOR","CON","CHA","SAG","DEX","INT"),
   skills:["Intuition","Persuasion"],eq:{0:0,1:0,2:0},picks:{"0-0-0":"Marteau de guerre"},name:"Thorgar Brise-Enclume",align:"Loyal bon",
   pers:{traits:[5,2],ideaux:[0,4],liens:[3],defauts:[3,4]}}},
 {id:"heal",title:"Soin",cls:"Clerc",tag:"Nain des collines · Acolyte · Domaine de la Vie",d:"Le meilleur soigneur : sorts de soin boostés, armure lourde, très solide.",
  s:{race:"Nain des collines",cls:"Clerc",sub:"Vie",bg:"Acolyte",langs:["Céleste","Halfelin"],rolls:STD,assign:A("SAG","CON","FOR","CHA","DEX","INT"),
   skills:["Médecine","Persuasion"],eq:{0:0,1:2,2:0,3:0},
   cants:["Épargner les mourants","Flamme sacrée","Assistance"],prepared:["Mot de guérison","Sanctuaire","Bouclier de la foi","Injonction"],
   name:"Brunhilde Cœur-de-Pierre",align:"Neutre bon",pers:{traits:[2,6],ideaux:[1,5],liens:[2],defauts:[3,1]}}},
 {id:"archer",title:"Archer",cls:"Rôdeur",tag:"Elfe des bois · Sauvageon",d:"Arc long à 45 m, pisteur hors pair, rapide et discret en forêt.",
  s:{race:"Elfe des bois",cls:"Rôdeur",bg:"Sauvageon",langs:["Sylvestre"],enemy:"Monstruosités",terrain:"Forêt",rolls:STD,assign:A("DEX","SAG","CON","FOR","INT","CHA"),
   skills:["Discrétion","Nature","Dressage"],eq:{0:1,1:0,2:1},name:"Sylvaën Œil-de-Faucon",align:"Chaotique bon",
   pers:{traits:[0,1],ideaux:[4,0],liens:[1],defauts:[4,5]}}},
 {id:"mage",title:"Mage",cls:"Magicien",tag:"Haut-elfe · Sage",d:"Gros dégâts magiques, Sommeil et Bouclier, le plus grand choix de sorts.",
  s:{race:"Haut-elfe",raceCantrip:"Lumière",cls:"Magicien",bg:"Sage",langs:["Draconique","Céleste","Primordial"],rolls:STD,assign:A("INT","CON","DEX","SAG","CHA","FOR"),
   skills:["Investigation","Intuition"],eq:{0:0,1:1,2:0},
   cants:["Trait de feu","Rayon de givre","Prestidigitation"],book:["Projectile magique","Bouclier","Armure de mage","Mains brûlantes","Sommeil","Détection de la magie"],
   prepared:["Projectile magique","Bouclier","Armure de mage","Sommeil"],name:"Elandril Vent-d'Étoiles",align:"Neutre",
   pers:{traits:[3,6],ideaux:[0,5],liens:[2],defauts:[0,1]}}},
 {id:"brute",title:"Brute",cls:"Barbare",tag:"Demi-orc · Héros du peuple",d:"Hache à deux mains et Rage : énormes dégâts au corps-à-corps et très dur à tuer.",
  s:{race:"Demi-orc",cls:"Barbare",bg:"Héros du peuple",rolls:STD,assign:A("FOR","CON","DEX","SAG","CHA","INT"),
   skills:["Athlétisme","Perception"],eq:{0:0,1:0},name:"Grok Mâchoire-d'Acier",align:"Chaotique neutre",
   pers:{traits:[7,6],ideaux:[2,0],liens:[3],defauts:[1,2]}}},
 {id:"soutien",title:"Soutien",cls:"Barde",tag:"Demi-elfe · Artiste",d:"Inspire ses alliés, soigne un peu, embrouille les ennemis et gère les discussions.",
  s:{race:"Demi-elfe",plus2:["DEX","CON"],cls:"Barde",bg:"Artiste",langs:["Halfelin"],rolls:STD,assign:A("CHA","DEX","CON","SAG","INT","FOR"),
   skills:["Persuasion","Tromperie","Intuition"],extraSk:["Perception","Discrétion"],eq:{0:0,1:1,2:0},
   cants:["Moquerie cruelle","Main de mage"],spells:["Mot de guérison","Fou rire de Tasha","Charme-personne","Murmures dissonants"],
   name:"Lyra Chante-Brise",align:"Chaotique bon",pers:{traits:[0,3],ideaux:[0,5],liens:[0],defauts:[1,5]}}},
 {id:"occulte",title:"Magie sombre",cls:"Occultiste",tag:"Tieffelin · Charlatan · Fiélon",d:"Décharge occulte et Maléfice : des dégâts réguliers, et des PV bonus à chaque ennemi tué.",
  s:{race:"Tieffelin",cls:"Occultiste",sub:"Fiélon",bg:"Charlatan",rolls:STD,assign:A("CHA","CON","DEX","SAG","INT","FOR"),
   skills:["Arcanes","Intimidation"],eq:{0:0,1:1,2:1},picks:{"f-1":"Bâton"},
   cants:["Décharge occulte","Main de mage"],spells:["Maléfice","Armure d'Agathys"],name:"Malkaris",align:"Chaotique neutre",
   pers:{traits:[2,3],ideaux:[5,0],liens:[0],defauts:[2,4]}}}
];
function applyPreset(id){const P=PRESETS.find(p=>p.id===id);S=Object.assign(blank(),JSON.parse(JSON.stringify(P.s)),{preset:P.title+" — "+P.cls});
  syncPers();S.step=8;render();window.scrollTo(0,0);toast("Prébuild chargé !")}
function pPresets(){
  let h=`<div class="card"><h2>⚡ Partir d'un prébuild</h2><div class="small">Un perso complet en un clic, que tu peux ensuite modifier étape par étape. Les caractéristiques utilisent la série standard (15, 14, 13, 12, 10, 8) : remplace-les par tes jets à l'étape 4 si tu veux.</div><div class="grid" style="margin-top:10px">`;
  PRESETS.forEach(p=>h+=`<button class="opt preset" data-preset="${p.id}"><b>${p.title} · ${p.cls}</b><span>${esc(p.d)}</span><span class="tag">${esc(p.tag)}</span></button>`);
  return h+`</div><div class="small" style="margin-top:8px">⚠ Ça remplace le perso en cours.</div></div>`}

/* ===================== ÉTAT ===================== */
const STEPS=["Race","Classe","Historique","Caractéristiques","Compétences","Équipement","Sorts","Personnalité","Récap","🎮 En partie"];
const blank=()=>({step:0,saveId:null,level:1,hpRolls:{},token:null,items:[],asis:{},sub2:null,invoc:[],meta:[],asi:[null,null],race:null,dragon:"Rouge",plus2:[],raceCantrip:"Prestidigitation",cls:null,sub:null,style:null,enemy:null,terrain:null,sdragon:"Rouge",
  bg:null,langs:[],rolls:["","","","","",""],assign:{FOR:null,DEX:null,CON:null,INT:null,SAG:null,CHA:null},
  skills:[],extraSk:[],subSk:[],expert:[],eq:{},picks:{},cants:[],spells:[],book:[],prepared:[],domCant:null,
  name:"",player:"",align:"",age:"",height:"",weight:"",eyes:"",skin:"",hair:"",traits:"",ideaux:"",liens:"",defauts:"",pers:{traits:[],ideaux:[],liens:[],defauts:[]},persRoll:{},histoire:"",apparence:""});
let S=blank();
try{const saved=localStorage.getItem("dnd-perso");if(saved)S=Object.assign(blank(),JSON.parse(saved));}catch(e){}
function save(){try{localStorage.setItem("dnd-perso",JSON.stringify(Object.assign({},S,{confirmReset:false})));}catch(e){}}

/* ===================== CALCULS ===================== */
const mod=v=>Math.floor((v-10)/2);
const sgn=n=>(n>=0?"+":"")+n;
let PB=2;
function R(){return S.race?RACES[S.race]:null}
function C(){return S.cls?CLASSES[S.cls]:null}
function SUB(){const c=C();if(!c||!c.sub||!S.sub)return null;return SUBS[c.sub].opts[S.sub]}
function raceBonus(){const r=R();const b={};AB.forEach(a=>b[a]=0);if(!r)return b;Object.entries(r.bon).forEach(([k,v])=>b[k]+=v);if(r.plus2)S.plus2.forEach(a=>b[a]+=1);return b}
function base(a){const i=S.assign[a];if(i===null||i===undefined)return null;const v=parseInt(S.rolls[i]);return isNaN(v)?null:v}
function score(a){const b=base(a);if(b===null)return null;return b+raceBonus()[a]+asiBonus(a)}
function M(a){const s=score(a);return s===null?0:mod(s)}
function armorProf(){const c=C(),r=R(),sb=SUB();let l=c?[...c.armor]:[];if(r&&r.armor)l=l.concat(r.armor);if(sb&&sb.armor)l=l.concat(sb.armor);if(S.sub2==="Collège de la vaillance"&&sub2())l=l.concat(["intermédiaire","bouclier"]);return l}
function hasMartial(){const c=C(),sb=SUB();return (c&&c.weap==="all")||(sb&&sb.martial)||(S.sub2==="Collège de la vaillance"&&!!sub2())}
function weapProf(n){const c=C(),r=R(),sb=SUB();if(!c)return false;const w=W[n];if(!w)return false;
  if(r&&r.weap&&r.weap.includes(n))return true;
  if(c.weap==="all")return true;
  if(Array.isArray(c.weap))return c.weap.includes(n);
  if(w[2]==="s")return true; // simple, rogue, monk
  if(sb&&sb.martial)return true;
  if(S.sub2==="Collège de la vaillance"&&sub2())return true;
  if(c.weap==="rogue")return ["Arbalète de poing","Épée longue","Rapière","Épée courte"].includes(n);
  if(c.weap==="monk")return n==="Épée courte";
  return false}
function fixedSkills(){ // [skill, source]
  const out=[];const r=R(),b=S.bg?BGS[S.bg]:null;
  if(b)b.sk.forEach(s=>out.push([s,"historique"]));
  if(r&&r.sk)r.sk.forEach(s=>out.push([s,"race"]));
  return out}
function extraSkN(){return (R()&&R().anySk||0)+dupCount()+(S.sub2==="Collège du savoir"&&sub2()?3:0)}
function dupCount(){const f=fixedSkills().map(x=>x[0]);return f.length-new Set(f).size}
function allSkills(){const s=new Set(fixedSkills().map(x=>x[0]));S.skills.forEach(x=>s.add(x));S.extraSk.forEach(x=>s.add(x));S.subSk.forEach(x=>s.add(x));return s}
function expertSet(){const e=new Set(S.expert);const sb=SUB();if(sb&&sb.know)S.subSk.forEach(x=>e.add(x));return e}
function skillTotal(sk){const p=allSkills().has(sk),e=expertSet().has(sk);return M(SKAB[sk])+(p?PB:0)+(e?PB:0)}
function hp(){return hpLevels()}
function chosenItems(){ // liste plate d'items avec arme résolue
  const c=C();if(!c)return [];const E=EQUIP[S.cls];const out=[];
  E.lines.forEach((ln,li)=>{const oi=S.eq[li];if(oi===undefined)return;const o=ln[oi];if(!o)return;
    o.i.forEach((it,ii)=>{if(it.pick){const w=S.picks[li+"-"+oi+"-"+ii];out.push({w:w||null,q:1,pick:true})}else out.push(it)})});
  E.fixed.forEach((it,ii)=>{if(it.pick){out.push({w:S.picks["f-"+ii]||null,q:1,pick:true})}else out.push(it)});
  return out}
function armorClass(){
  const items=chosenItems();const c=C(),sb=SUB();const dex=M("DEX");
  const armor=items.find(i=>i.a);const shield=items.some(i=>i.sh);
  const opts=[];
  const prof=armorProf();
  if(armor){const a=ARM[armor.a];const ok=prof.includes(a[2]);let v=a[0]+(a[1]===null?dex:Math.min(dex,a[1]));
    if(S.style==="Défense")v+=1;opts.push({v,txt:armor.a+(ok?"":" (non maîtrisée !)")})}
  let un=10+dex,ut="sans armure (10 + DEX)";
  if(S.cls==="Barbare"){un=10+dex+M("CON");ut="Défense sans armure (10 + DEX + CON)"}
  if(S.cls==="Moine"){un=10+dex+M("SAG");ut="Défense sans armure (10 + DEX + SAG)"}
  if(sb&&sb.dragon){un=13+dex;ut="Résistance draconique (13 + DEX)"}
  opts.push({v:un,txt:ut,unarmored:true});
  let best=opts.reduce((a,b)=>b.v>a.v?b:a);
  let v=best.v,txt=best.txt;
  if(shield&&prof.includes("bouclier")&&S.cls!=="Moine"){v+=2;txt+=" + bouclier"}
  return {v,txt,alt:opts.length>1?opts:null}}
function attacks(){
  const out=[];const items=chosenItems();const seen=new Set();
  items.forEach(it=>{if(!it.w||seen.has(it.w))return;seen.add(it.w);const w=W[it.w];
    const fin=w[3].includes("finesse"),rng=isRanged(it.w);
    let ab=rng?"DEX":(fin?(M("DEX")>M("FOR")?"DEX":"FOR"):"FOR");
    if(S.cls==="Moine"&&!rng&&(w[2]==="s"&&!w[3].includes("deux mains")&&!w[3].includes("lourde")||it.w==="Épée courte")&&M("DEX")>M(ab))ab="DEX";
    const prof=weapProf(it.w);let atk=M(ab)+(prof?PB:0);if(rng&&S.style==="Archerie")atk+=2;
    let dmgMod=M(ab);let dice=w[0];
    if(S.cls==="Moine"&&!rng&&dice==="1d4"&&(w[2]==="s"||it.w==="Épée courte"))dice="1d4";
    const oneHandMelee=!rng&&!w[3].includes("deux mains");
    let dmg=dice+(dmgMod?sgn(dmgMod):"")+" "+w[1];
    if(S.style==="Duel"&&oneHandMelee)dmg=dice+sgn(dmgMod+2)+" "+w[1]+" (Duel)";
    if(w[3].includes("polyvalente")){const m=w[3].match(/\((1d\d+)\)/);if(m)dmg+=" / "+m[1]+(dmgMod?sgn(dmgMod):"")+" à deux mains"}
    out.push({n:it.w,atk:sgn(atk)+(prof?"":" (non maîtrisée)"),dmg,props:w[3]})});
  if(S.cls==="Moine"){const d=M("DEX")>M("FOR")?"DEX":"FOR";out.push({n:"Mains nues",atk:sgn(M(d)+PB),dmg:(LV()>=5?"1d6":"1d4")+sgn(M(d))+" contondant",props:"arts martiaux, action bonus possible"})}
  else out.push({n:"Mains nues",atk:sgn(M("FOR")+PB),dmg:(1+M("FOR")>0?1+M("FOR"):1)+" contondant",props:""});
  if(S.race==="Drakéide"){const d=DRAGONS[S.dragon];out.push({n:"Souffle ("+d[0].toLowerCase()+")",atk:"DD "+(8+M("CON")+PB)+" "+d[2],dmg:"2d6 "+d[0].toLowerCase(),props:d[1]+", moitié si réussite, 1 fois par repos court"})}
  return out}
function spellInfo(){return spellInfoL()}
function languages(){const r=R(),c=C(),sb=SUB();let l=[];if(r)l=l.concat(r.lang);if(c&&c.lang)l=l.concat(c.lang);
  if(sb&&sb.dragon&&!l.includes("Draconique"))l.push("Draconique");
  S.langs.filter(Boolean).forEach(x=>{if(!l.includes(x))l.push(x)});return l}
function extraLangCount(){const r=R(),b=S.bg?BGS[S.bg]:null,sb=SUB();return (r&&r.xl||0)+(b?b.xl:0)+(sb&&sb.lang||0)}

/* ===================== RENDU ===================== */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function radio(name,val,cur,title,sub,dis,tags){return `<label class="opt ${cur===val?"sel":""} ${dis?"dis":""}"><input type="radio" name="${name}" value="${esc(val)}" ${cur===val?"checked":""} ${dis?"disabled":""}><b>${esc(title)}</b>${sub?`<span>${sub}</span>`:""}${tags||""}</label>`}
function stepVisible(i){if(i===6){return !!spellInfo()||!!(R()&&R().cantrip)}return true}

const unlocked=()=>!!(S.race&&S.cls);
function renderSteps(){$("#steps").innerHTML=STEPS.map((s,i)=>{if(!stepVisible(i))return "";const lock=i>=2&&!unlocked();
  const done=i===0?!!S.race:i===1?!!S.cls:i<S.step;
  return `<button class="${i===S.step?"on":(done?"done":"")} ${lock?"lock":""}" data-go="${i}" ${lock?'title="Choisis d\'abord ta race et ta classe"':""}>${lock?"🔒 ":""}${i+1}. ${s}</button>`}).join("")}
function lockMsg(){return !S.race&&!S.cls?"Choisis d'abord ta race et ta classe.":!S.race?"Choisis d'abord ta race (étape 1).":"Choisis d'abord ta classe (étape 2)."}

function pRace(){
  const groups={};Object.entries(RACES).forEach(([k,v])=>{(groups[v.grp]=groups[v.grp]||[]).push(k)});
  let h=pPresets()+`<div class="card"><h2>Choisis ta race</h2><div class="hint">Les bonus s'ajoutent à tes caractéristiques. Les « classes conseillées » ne sont que des suggestions : toutes les combinaisons marchent.</div><div class="grid">`;
  Object.entries(RACES).forEach(([k,v])=>{const bon=Object.entries(v.bon).map(([a,n])=>a+" +"+n).join(", ")+(v.plus2?", +1 à deux autres":"");
    h+=radio("race",k,S.race,k,esc(v.desc),false,`<span class="tag">${bon}</span><span class="tag">${v.spd}</span><span class="tag">Taille ${v.size}</span>`)});
  h+=`</div></div>`;
  const r=R();
  if(r&&r.dragon){h+=`<div class="card"><h3>Ascendance draconique</h3><div class="grid">`;
    Object.entries(DRAGONS).forEach(([k,d])=>h+=radio("dragon",k,S.dragon,"Dragon "+k.toLowerCase(),`${d[0]} · ${d[1]} · sauvegarde ${d[2]}`));h+=`</div></div>`}
  if(r&&r.plus2){h+=`<div class="card"><h3>Demi-elfe : +1 à deux caractéristiques <span class="count">${S.plus2.length}/2</span></h3><div class="chk">`;
    AB.filter(a=>a!=="CHA").forEach(a=>{const on=S.plus2.includes(a);h+=`<label class="${on?"sel":""}"><input type="checkbox" data-plus2="${a}" ${on?"checked":""}>${ABN[a]}</label>`});h+=`</div></div>`}
  if(r&&r.cantrip){h+=`<div class="card"><h3>Haut-elfe : ton tour de magie de magicien (INT)</h3><div class="grid">`;
    CANT.Magicien.forEach(s=>h+=radio("rc",s,S.raceCantrip,s,esc(SP[s][1])));h+=`</div></div>`}
  return h}

function pClass(){
  let h=`<div class="card"><h2>Choisis ta classe</h2><div class="grid">`;
  Object.entries(CLASSES).forEach(([k,v])=>{h+=radio("cls",k,S.cls,k,esc(v.desc),false,`<span class="tag">${v.role}</span><span class="tag">d${v.hd}</span><span class="tag">Sauv. ${v.saves.join(" ")}</span>${v.caster?'<span class="tag">Sorts dès niv. 1</span>':""}`)});
  h+=`</div></div>`;const c=C();h+=levelChoicesHtml();
  if(c&&c.sub){const sd=SUBS[c.sub];h+=`<div class="card"><h3>${sd.label}</h3><div class="grid">`;
    Object.entries(sd.opts).forEach(([k,v])=>h+=radio("sub",k,S.sub,k,esc(v.d)+"<br><i>"+esc(v.feat)+"</i>"));h+=`</div></div>`;
    const sb=SUB();if(sb&&sb.dragon){h+=`<div class="card"><h3>Ton ancêtre dragon</h3><div class="grid">`;Object.entries(DRAGONS).forEach(([k,d])=>h+=radio("sdragon",k,S.sdragon,"Dragon "+k.toLowerCase(),d[0]));h+=`</div></div>`}}
  if(styleNeeded()){h+=`<div class="card"><h3>Style de combat${STYLE_AT[S.cls]>1?" (niveau "+STYLE_AT[S.cls]+")":""}</h3><div class="grid">`;STYLE_OK[S.cls].forEach(k=>h+=radio("style",k,S.style,k,esc(STYLES[k])));h+=`</div></div>`}
  if(c&&c.ranger){h+=`<div class="card"><h3>Ennemi juré</h3><div class="small">Avantage pour pister ces créatures (Survie) et se souvenir d'infos sur elles (INT). Tu apprends une langue qu'elles parlent si elles en ont une.</div><div class="grid">`;ENEMIES.forEach(e=>h+=radio("enemy",e,S.enemy,e));h+=`</div></div>
     <div class="card"><h3>Explorateur-né : terrain favori</h3><div class="small">Sur ce terrain : maîtrise doublée sur INT et SAG liés, pas ralenti, pistage et fourrage facilités.</div><div class="grid">`;TERRAINS.forEach(e=>h+=radio("terrain",e,S.terrain,e));h+=`</div></div>`}
  return h}

function pBg(){
  let h=`<div class="card"><h2>Choisis ton historique</h2><div class="hint">L'historique, c'est ce que faisait ton perso avant l'aventure. Il donne 2 compétences, des outils ou langues, de l'équipement et une capacité spéciale.</div><div class="grid">`;
  Object.entries(BGS).forEach(([k,v])=>h+=radio("bg",k,S.bg,k,esc(v.d),false,`<span class="tag">${v.sk.join(", ")}</span>${v.xl?`<span class="tag">+${v.xl} langue${v.xl>1?"s":""}</span>`:""}`));
  h+=`</div></div>`;
  const n=extraLangCount();
  if(S.bg&&n>0){const known=languages();h+=`<div class="card"><h3>Langues supplémentaires <span class="count">${n} à choisir</span></h3><div class="small">Tu parles déjà : ${known.filter(x=>!S.langs.includes(x)).join(", ")}</div><div class="row">`;
    for(let i=0;i<n;i++){h+=`<label class="f"><span>Langue ${i+1}</span><select data-lang="${i}"><option value="">—</option>${LANGS.map(l=>`<option ${S.langs[i]===l?"selected":""} ${(!S.langs.includes(l)||S.langs[i]===l)&&!(R()&&R().lang.includes(l))?"":"disabled"}>${l}</option>`).join("")}</select></label>`}h+=`</div></div>`}
  h+=pPersBg();
  return h}

function pAbil(){
  const bon=raceBonus();const c=C();
  let h=`<div class="card"><h2>Tes jets de dés</h2><div class="hint">Lance 4d6, retire le plus petit dé et additionne les 3 autres. Fais-le 6 fois et note les totaux ici.</div>
  <div class="rolls">${S.rolls.map((r,i)=>`<input type="number" min="3" max="18" data-roll="${i}" value="${esc(r)}" placeholder="?">`).join("")}
  <button class="btn sec" id="rollFor">Lancer pour moi</button></div><div class="small" id="rollDetail"></div></div>`;
  h+=`<div class="card"><h2>Répartis tes résultats</h2><div class="small">Choisis quel résultat va dans quelle caractéristique.${c?` Pour un ${S.cls.toLowerCase()}, mets tes meilleurs scores en <b>${c.prio.slice(0,2).join(" puis ")}</b>.`:""}</div>
  <div style="margin:8px 0"><button class="btn sec" id="autoAssign">Répartir automatiquement selon ma classe</button></div><div class="abil">`;
  AB.forEach(a=>{const s=score(a);const used=Object.entries(S.assign).filter(([k,v])=>k!==a&&v!==null).map(([k,v])=>v);
    h+=`<div class="ab"><div class="n">${ABN[a]}</div><select data-assign="${a}"><option value="">—</option>${S.rolls.map((r,i)=>r!==""?`<option value="${i}" ${S.assign[a]===i?"selected":""} ${used.includes(i)?"disabled":""}>${r}</option>`:"").join("")}</select>
    <div class="small">bonus race ${bon[a]?"+"+bon[a]:"—"}</div><div class="v">${s??"–"}</div><span class="m">${s===null?"–":sgn(mod(s))}</span>${c&&c.saves.includes(a)?'<div class="small">jet de sauvegarde maîtrisé</div>':""}</div>`});
  h+=`</div></div>`;return h}

function pSkills(){
  const c=C();if(!c)return `<div class="card">Choisis d'abord une classe.</div>`;
  const fixed=fixedSkills();const fixedSet=new Set(fixed.map(x=>x[0]));
  const list=c.sk==="any"?ALLSK:c.sk;
  let h=`<div class="card"><h2>Tes compétences</h2><div class="small">En vert : déjà données par ta race ou ton historique.</div><div class="chk" style="margin-top:8px">${[...fixedSet].map(s=>`<label class="lock">✔ ${s} (${SKAB[s]})</label>`).join("")||"<i>aucune</i>"}</div></div>`;
  h+=`<div class="card"><h3>Compétences de ${S.cls.toLowerCase()} <span class="count">${S.skills.length}/${c.n}</span></h3><div class="chk">`;
  list.forEach(s=>{const lk=fixedSet.has(s)||S.extraSk.includes(s)||S.subSk.includes(s);const on=S.skills.includes(s);
    h+=`<label class="${on?"sel":""} ${lk?"dis":""}"><input type="checkbox" data-sk="${s}" ${on?"checked":""} ${lk?"disabled":""}>${s} <span class="small">(${SKAB[s]})</span></label>`});h+=`</div></div>`;
  const extra=extraSkN();
  if(extra){h+=`<div class="card"><h3>Compétences au choix parmi toutes : ${extra} <span class="count">${S.extraSk.length}/${extra}</span></h3>${dupCount()?'<div class="small">Ta race et ton historique donnent la même compétence : tu en choisis une autre.</div>':""}<div class="chk">`;
    ALLSK.forEach(s=>{const lk=fixedSet.has(s)||S.skills.includes(s)||S.subSk.includes(s);const on=S.extraSk.includes(s);h+=`<label class="${on?"sel":""} ${lk?"dis":""}"><input type="checkbox" data-xsk="${s}" ${on?"checked":""} ${lk?"disabled":""}>${s}</label>`});h+=`</div></div>`}
  const sb=SUB();
  if(sb&&(sb.know||sb.natsk)){const pool=sb.know?["Arcanes","Histoire","Nature","Religion"]:["Dressage","Nature","Survie"];const n=sb.know?2:1;
    h+=`<div class="card"><h3>Domaine ${S.sub} : ${n} compétence${n>1?"s":""}${sb.know?" (maîtrise doublée)":""} <span class="count">${S.subSk.length}/${n}</span></h3><div class="chk">`;
    pool.forEach(s=>{const lk=fixedSet.has(s)&&!sb.know||S.skills.includes(s)||S.extraSk.includes(s);const on=S.subSk.includes(s);h+=`<label class="${on?"sel":""} ${lk&&!on?"dis":""}"><input type="checkbox" data-ssk="${s}" ${on?"checked":""} ${lk&&!on?"disabled":""}>${s}</label>`});h+=`</div></div>`}
  if(expertN()){const prof=[...allSkills()].concat(S.cls==="Roublard"?["Outils de voleur"]:[]);h+=`<div class="card"><h3>Expertise (maîtrise doublée) <span class="count">${S.expert.length}/${expertN()}</span></h3><div class="small">Choisis ${expertN()} compétences que tu maîtrises déjà${S.cls==="Roublard"?" (ou tes outils de voleur)":""}.</div><div class="chk">`;
    prof.forEach(s=>{const on=S.expert.includes(s);h+=`<label class="${on?"sel":""}"><input type="checkbox" data-exp="${s}" ${on?"checked":""}>${s}</label>`});h+=`</div></div>`}
  return h}

function pickOptions(kind){const c=C();let l;
  if(kind==="s")l=WS;else if(kind==="m")l=WM;else if(kind==="sm")l=WSmelee;else if(kind==="mm")l=WMmelee;
  else if(kind==="cls")l=WS.filter(w=>weapProf(w));else if(kind==="clsm")l=WSmelee.filter(w=>weapProf(w));
  return l}
function pEquip(){
  const c=C();if(!c)return `<div class="card">Choisis d'abord une classe.</div>`;const E=EQUIP[S.cls];
  let h=`<div class="card"><h2>Équipement de départ</h2><div class="hint">Pour chaque ligne, choisis une option. L'équipement de ton historique (${S.bg||"?"}) s'ajoute automatiquement.</div></div>`;
  E.lines.forEach((ln,li)=>{h+=`<div class="card"><h3>Choix ${li+1}</h3><div class="grid">`;
    ln.forEach((o,oi)=>{const dis=(o.req==="martial"&&!hasMartial())||(o.req==="heavy"&&!armorProf().includes("lourde"));
      let extra="";if(S.eq[li]===oi){o.i.forEach((it,ii)=>{if(it.pick){const key=li+"-"+oi+"-"+ii;extra+=`<select data-pick="${key}" style="margin-top:6px"><option value="">— arme —</option>${pickOptions(it.pick).map(w=>`<option ${S.picks[key]===w?"selected":""}>${w}</option>`).join("")}</select>`}})}
      const pk=o.i.filter(it=>it.p).map(it=>packList(it.p)).join("");
      h+=`<div>${radio("eq"+li,String(oi),S.eq[li]===undefined?null:String(S.eq[li]),o.l,(dis?"Non maîtrisé avec tes choix":"")+pk,dis)}${extra}</div>`});
    h+=`</div></div>`});
  const fx=E.fixed;h+=`<div class="card"><h3>Ajouté automatiquement</h3><ul class="tight">`;
  fx.forEach((it,ii)=>{if(it.pick){const key="f-"+ii;h+=`<li>Une arme courante au choix : <select data-pick="${key}" style="width:auto"><option value="">—</option>${pickOptions(it.pick).map(w=>`<option ${S.picks[key]===w?"selected":""}>${w}</option>`).join("")}</select></li>`}else h+=`<li>${itemLabel(it)}${it.p?packList(it.p):""}</li>`});
  if(S.bg)BGS[S.bg].eq.forEach(e=>h+=`<li>${esc(e)} <span class="small">(historique)</span></li>`);
  if(S.bg)h+=`<li>Bourse : ${BGS[S.bg].po} po <span class="small">(historique)</span></li>`;
  h+=`</ul></div>`;
  const ac=armorClass();h+=`<div class="card"><h3>Résultat</h3><div class="stat3"><div><small>Classe d'armure</small><span class="big">${ac.v}</span><span class="small" style="display:block">${esc(ac.txt)}</span></div></div></div>`;
  return h}
function packList(k){return `<ul class="pack">${PACKS[k][1].split(", ").map(x=>`<li>${esc(x.charAt(0).toUpperCase()+x.slice(1))}</li>`).join("")}</ul>`}
function itemLabel(it){if(it.p)return PACKS[it.p][0];if(it.a)return it.a==="Cuir"?"Armure de cuir":it.a;if(it.sh)return it.t||"Bouclier";if(it.w)return (it.q>1?it.q+" × ":"")+it.w;return esc(it.t)}

function spellCard(title,pool,arr,max,key,lockList){lockList=lockList||[];
  const lvls=[...new Set(pool.map(spellLevelOf))];
  let h=`<div class="card"><h3>${title} <span class="count">${arr.length}/${max}</span></h3>`;
  lvls.forEach(l=>{const sub=pool.filter(x=>spellLevelOf(x)===l);if(lvls.length>1||key==="cant")h+=key==="cant"?"":`<div class="where" style="margin:8px 0 4px">Sorts de niveau ${l}</div>`;
    h+=`<div class="grid">`;sub.forEach(s=>{const on=arr.includes(s),lk=lockList.includes(s);const d=key==="cant"?(SP[s]||["",""]):spellDesc(s);
      h+=`<label class="opt ${on?"sel":""} ${lk?"dis":""}"><input type="checkbox" data-${key}="${esc(s)}" ${on?"checked":""} ${lk?"disabled":""}><b>${esc(s)}</b><span>${esc(d[0])} — ${esc(d[1])}</span></label>`});h+=`</div>`});
  return h+`</div>`}
function pSpells(){
  const c=C();const si=spellInfo();const r=R();const sb=SUB();
  if(!si&&!(r&&r.cantrip))return `<div class="card"><h2>Sorts</h2><p>Ta classe ne lance pas de sorts à ce niveau${S.cls==="Paladin"||S.cls==="Rôdeur"?" (ça arrive au niveau 2)":""}. Tu peux passer à la suite.</p></div>`;
  let h="";
  if(si){const extra=sb&&sb.extra?sb.extra:null;const pool=spellPool(S.cls,si.max,extra);
    h+=`<div class="card"><h2>Magie de ${S.cls.toLowerCase()} — niveau ${LV()}</h2><div class="stat3"><div><small>Caractéristique</small><span class="big">${ABN[si.ab]}</span></div><div><small>DD des sorts</small><span class="big">${si.dc}</span></div><div><small>Attaque de sort</small><span class="big">${si.atk}</span></div><div><small>Emplacements</small><span class="big" style="font-size:1rem">${si.slots}</span></div></div>
    <div class="hint">Les <b>tours de magie</b> s'utilisent à volonté. Les autres sorts consomment un emplacement de leur niveau ou plus (récupérés après un repos ${si.pact?"court ou long":"long"}). Tu peux choisir des sorts jusqu'au niveau ${si.max}.</div></div>`;
    const domLock=[];if(sb&&sb.cantrip)domLock.push(sb.cantrip);
    if(si.cant)h+=spellCard("Tours de magie",CANT[S.cls],S.cants,si.cant,"cant",domLock);
    if(sb&&sb.druidCant){h+=`<div class="card"><h3>Domaine de la Nature : 1 tour de magie de druide</h3><div class="grid">${CANT.Druide.map(s=>radio("domCant",s,S.domCant,s,esc(SP[s][1]))).join("")}</div></div>`}
    if(si.known)h+=spellCard("Sorts connus",pool,S.spells,si.known,"sp");
    if(si.book){h+=spellCard(`Grimoire : ${si.book} sorts`,pool,S.book,si.book,"book");
      if(S.book.length)h+=spellCard(`Sorts préparés aujourd'hui (niveau ${LV()} + mod. INT = ${si.prep})`,S.book,S.prepared,si.prep,"prep")}
    else if(si.prep){const dom=domSpells();
      if(dom.length)h+=`<div class="card"><h3>Sorts de domaine (toujours préparés, gratuits)</h3><div class="chk">${dom.map(s=>`<label class="lock">✔ ${s}</label>`).join("")}</div></div>`;
      h+=spellCard(`Sorts préparés (${S.cls==="Paladin"?"moitié du niveau":"niveau "+LV()} + mod. ${si.ab} = ${si.prep})`,pool.filter(s=>!dom.includes(s)),S.prepared,si.prep,"prep");
      h+=`<div class="small" style="margin:-6px 0 12px">Tu pourras changer tes sorts préparés après chaque repos long.</div>`}}
  if(r&&r.cantrip)h+=`<div class="card"><h3>Tour de magie du haut-elfe</h3><p>${esc(S.raceCantrip)} (INT) — déjà choisi à l'étape Race.</p></div>`;
  return h}

function pPerso(){
  const f=(k,l,ph)=>`<label class="f"><span>${l}</span><input type="text" data-f="${k}" value="${esc(S[k])}" placeholder="${esc(ph||"")}"></label>`;
  const t=(k,l,pool)=>`<label class="f"><span>${l} ${pool?`<a href="#" data-idea="${k}" style="color:var(--amber2)">💡 une idée</a>`:""}</span><textarea data-f="${k}">${esc(S[k])}</textarea></label>`;
  let h=`<div class="card"><h2>Identité</h2><div class="row" style="align-items:center">${f("name","Nom du personnage")}${f("player","Nom du joueur")}<div class="tokpick" style="flex:0;min-width:0">${S.token?`<img src="${S.token}" class="tokprev">`:`<div class="tokprev empty">?</div>`}<label class="mini" style="cursor:pointer">🖼️ Jeton de carte<input type="file" accept="image/*" id="persoTok" hidden></label>${S.token?`<button class="mini" id="persoTokDel">✕</button>`:""}</div></div>
   <h3>Alignement</h3><div class="grid">${ALIGN.map(a=>radio("align",a,S.align,a)).join("")}</div></div>
   <div class="card"><h2>Apparence</h2><div class="row">${f("age","Âge")}${f("height","Taille")}${f("weight","Poids")}</div><div class="row">${f("eyes","Yeux")}${f("skin","Peau")}${f("hair","Cheveux")}</div>${t("apparence","Description")}</div>
   <div class="card"><h2>Personnalité</h2>${t("traits","Traits de personnalité","traits")}${t("ideaux","Idéaux","ideaux")}${t("liens","Liens","liens")}${t("defauts","Défauts","defauts")}${t("histoire","Histoire du personnage")}</div>`;
  return h}

function pRecap(){
  const c=C(),r=R(),b=S.bg?BGS[S.bg]:null,sb=SUB();
  if(!c||!r||!b)return `<div class="card">Il manque la race, la classe ou l'historique.</div>`;
  const ac=armorClass(),si=spellInfo();
  const saves=AB.map(a=>{const p=c.saves.includes(a);return `<tr><td><span class="dot ${p?"on":""}"></span>${ABN[a]}</td><td><b>${sgn(saveBonus(a))}</b></td></tr>`}).join("");
  const sk=SKILLS.map(([s,a])=>{const p=allSkills().has(s),e=expertSet().has(s);return `<tr><td><span class="dot ${p?"on":""}"></span>${s==="Intuition"?"Perspicacité / Intuition":s} <span class="small">(${a.toLowerCase()})</span>${e?' <span class="tag">expertise</span>':""}</td><td><b>${sgn(skillTotal(s))}</b></td></tr>`}).join("");
  const atks=attacks().map(a=>`<tr><td>${esc(a.n)}</td><td><b>${esc(a.atk)}</b></td><td>${esc(a.dmg)}${a.props?`<div class="small">${esc(a.props)}</div>`:""}</td></tr>`).join("");
  // maîtrises
  const ap=armorProf();const armTxt=ap.length?("Armures : "+[...new Set(ap)].map(x=>x==="bouclier"?"boucliers":x+"s").join(", ")):"Armures : aucune";
  let wTxt="Armes : ";if(c.weap==="all")wTxt+="courantes et de guerre";else if(Array.isArray(c.weap))wTxt+=c.weap.join(", ").toLowerCase();else if(c.weap==="simple")wTxt+="courantes"+(sb&&sb.martial?" et de guerre":"");else if(c.weap==="rogue")wTxt+="courantes, arbalète de poing, épée longue, rapière, épée courte";else if(c.weap==="monk")wTxt+="courantes, épée courte";
  if(r.weap)wTxt+=", "+r.weap.join(", ").toLowerCase();
  const tools=[b.tools,c.tools,r.tools].filter(Boolean).filter((t,i,a)=>!a.some((o,j)=>j!==i&&o.length>t.length&&o.includes(t)));
  // équipement
  const eq=[];chosenItems().forEach(it=>{if(it.p)eq.push(`<li><b>${PACKS[it.p][0]}</b> : ${PACKS[it.p][1]}</li>`);else if(it.pick)eq.push(`<li>${esc(it.w||"Arme au choix (non choisie)")}</li>`);else eq.push(`<li>${itemLabel(it)}</li>`)});
  b.eq.forEach(e=>{const li=`<li>${esc(e)}</li>`;if(!eq.includes(li))eq.push(li)});
  // capacités
  const feats=featList();
  const featHtml=feats.map(f=>`<li><b>${esc(f[0])}</b> — ${esc(f[1])}</li>`).join("");
  // sorts
  let spellHtml="";
  const cants=[...S.cants];if(sb&&sb.cantrip)cants.push(sb.cantrip+" (domaine)");if(S.domCant)cants.push(S.domCant+" (domaine)");
  if(r.spells)r.spells.forEach(s=>cants.push(s+" (race)"));if(r.cantrip)cants.push(S.raceCantrip+" (race, INT)");
  if(si||cants.length){
    let lvl1=[];if(si){if(si.known)lvl1=S.spells.map(s=>s+" (connu)");else if(si.book)lvl1=S.book.map(s=>s+(S.prepared.includes(s)?" ✔ préparé":" (grimoire)"));else{lvl1=S.prepared.map(s=>s+" ✔ préparé");if(domSpells().length)lvl1=domSpells().map(s=>s+" ✔ domaine").concat(lvl1)}}
    spellHtml=`<div class="card"><div class="where">Page 3 de la fiche</div><h2>Sorts</h2>
    ${si?`<div class="stat3"><div><small>Classe de lanceur</small>${S.cls}</div><div><small>Caractéristique</small>${ABN[si.ab]}</div><div><small>DD de sauvegarde</small><span class="big">${si.dc}</span></div><div><small>Bonus d'attaque</small><span class="big">${si.atk}</span></div>${si.prep&&!si.known?`<div><small>Sorts à préparer / jour</small><span class="big">${si.prep}</span></div>`:""}<div><small>Emplacements</small><span class="big" style="font-size:1rem">${si.slots}</span></div></div>`:""}
    <h3 style="margin-top:12px">0 — Tours de magie</h3><ul class="tight">${cants.map(s=>`<li>${esc(s)}</li>`).join("")||"<li>—</li>"}</ul>
    ${si?[1,2,3,4,5].filter(l=>l<=si.max).map(l=>{const L=lvl1.filter(x=>spellLevelOf(x.replace(/ (\(|✔).*$/,""))===l);return `<h3>${l} — Sorts de niveau ${l} <span class="small">(${si.slotsArr[l-1]||0} emplacement${(si.slotsArr[l-1]||0)>1?"s":""})</span></h3><ul class="tight">${L.map(s=>`<li>${esc(s)}</li>`).join("")||"<li>—</li>"}</ul>`}).join(""):""}</div>`}
  const perc=10+skillTotal("Perception");
  const hd=LV()+"d"+c.hd;
  let h=(S.preset?`<div class="hint">Prébuild <b>${esc(S.preset)}</b> chargé. Clique sur une étape en haut pour modifier ce que tu veux (race, sorts, jets de dés…).</div>`:"")+`<div class="card"><div class="row"><div><h2>${esc(S.name||"Sans nom")}</h2><div class="small">Joueur : ${esc(S.player||"—")}</div></div><div style="text-align:right"><button class="btn sec" id="copyBtn">Copier en texte</button> <button class="btn sec" id="pdfBtn">📄 Remplir ma fiche PDF</button> <button class="btn" id="playBtn">🎮 Jouer avec ce perso</button> ${LV()<MAXLV?`<button class="btn sec" data-lvup="1">⬆️ Passer au niveau ${LV()+1}</button>`:""}</div></div>
  <div class="where">En-tête de la fiche</div>
  <table class="rec"><tr><th>Classe & niveau</th><th>Historique</th><th>Race</th><th>Alignement</th><th>XP</th></tr>
  <tr><td>${S.cls}${S.sub?" ("+S.sub+")":""}${S.sub2&&sub2()?" ("+S.sub2+")":""} ${LV()}</td><td>${S.bg}</td><td>${S.race}</td><td>${esc(S.align||"—")}</td><td>0</td></tr></table></div>
  <div class="recgrid">
   <div class="card"><div class="where">Colonne de gauche</div><h3>Caractéristiques</h3><table class="rec">${AB.map(a=>`<tr><td>${ABN[a]}</td><td><b>${score(a)??"?"}</b></td><td>mod. <b>${sgn(M(a))}</b></td></tr>`).join("")}</table>
    <div class="stat3" style="margin-top:10px"><div><small>Inspiration</small>—</div><div><small>Bonus de maîtrise</small><span class="big">+${PB}</span></div><div><small>Perception passive</small><span class="big">${perc}</span></div></div></div>
   <div class="card"><div class="where">Jets de sauvegarde</div><h3>Sauvegardes</h3><table class="rec">${saves}</table><div class="small" style="margin-top:6px">Coche (●) les ronds des sauvegardes maîtrisées.</div></div>
   <div class="card" style="grid-row:span 2"><div class="where">Compétences</div><h3>Compétences</h3><table class="rec">${sk}</table></div>
   <div class="card"><div class="where">Colonne du milieu</div><h3>Combat</h3><div class="stat3"><div><small>Classe d'armure</small><span class="big">${ac.v}</span></div><div><small>Initiative</small><span class="big">${sgn(M("DEX"))}</span></div><div><small>Vitesse</small><span class="big">${r.spd}</span></div><div><small>PV max</small><span class="big">${hp()}</span></div><div><small>Dés de vie</small><span class="big">${hd}</span></div></div><div class="small" style="margin-top:6px">CA : ${esc(ac.txt)}</div></div>
  </div>
  <div class="card"><div class="where">Attaques et incantations</div><h3>Attaques</h3><table class="rec"><tr><th>Nom</th><th>Bonus att.</th><th>Dégâts / type</th></tr>${atks}</table></div>
  <div class="recgrid">
   <div class="card"><div class="where">Autres maîtrises et langues</div><h3>Maîtrises & langues</h3><ul class="tight"><li>Langues : ${languages().join(", ")}${S.langs.filter(Boolean).length<extraLangCount()?" <i>(+ langue à choisir)</i>":""}</li><li>${armTxt}</li><li>${wTxt}</li>${tools.map(t=>`<li>Outils : ${esc(t)}</li>`).join("")}</ul></div>
   <div class="card"><div class="where">Équipement</div><h3>Équipement</h3><ul class="tight">${eq.join("")}</ul><p><b>Pièces :</b> ${b.po} po (PO), 0 pc, 0 pa, 0 pe, 0 pp</p></div>
  </div>
  <div class="card"><div class="where">Traits, idéaux, liens, défauts (colonne de droite)</div><table class="rec"><tr><th>Traits</th><td>${esc(S.traits||"—")}</td></tr><tr><th>Idéaux</th><td>${esc(S.ideaux||"—")}</td></tr><tr><th>Liens</th><td>${esc(S.liens||"—")}</td></tr><tr><th>Défauts</th><td>${esc(S.defauts||"—")}</td></tr></table></div>
  <div class="card"><div class="where">Capacités et traits (page 1, en bas à droite, et page 2)</div><h3>Capacités</h3><ul class="tight">${featHtml}</ul></div>
  <div class="card"><div class="where">Page 2 de la fiche</div><h3>Apparence & histoire</h3><table class="rec"><tr><th>Âge</th><td>${esc(S.age||"—")}</td><th>Taille</th><td>${esc(S.height||"—")}</td><th>Poids</th><td>${esc(S.weight||"—")}</td></tr><tr><th>Yeux</th><td>${esc(S.eyes||"—")}</td><th>Peau</th><td>${esc(S.skin||"—")}</td><th>Cheveux</th><td>${esc(S.hair||"—")}</td></tr></table>
  <p><b>Apparence :</b> ${esc(S.apparence||"—")}</p><p><b>Histoire :</b> ${esc(S.histoire||"—")}</p></div>
  ${spellHtml}`;
  return h}

function featList(){const c=C(),r=R(),b=BGS[S.bg],sb=SUB();
  const feats=[];
  if(r.traits.length)r.traits.forEach(t=>feats.push(["Race",t]));
  if(S.race==="Drakéide"){const d=DRAGONS[S.dragon];feats.push(["Race","Ascendance draconique : dragon "+S.dragon.toLowerCase()],["Race","Souffle : "+d[1]+", "+(LV()>=6?3:2)+"d6 "+d[0].toLowerCase()+", sauvegarde "+d[2]+" DD "+(8+M("CON")+PB)+" (1 fois par repos court)"],["Race","Résistance aux dégâts de "+d[0].toLowerCase()])}
  c.feats.forEach(t=>feats.push([S.cls,t]));
  if(sb)feats.push([S.sub,sb.feat]);
  if(sb&&sb.dragon)feats.push([S.sub,"Ancêtre : dragon "+S.sdragon.toLowerCase()+" ("+DRAGONS[S.sdragon][0].toLowerCase()+")"]);
  levelFeats().forEach(f=>feats.push(f));
  if(S.style&&styleNeeded())feats.push(["Style de combat",S.style+" : "+STYLES[S.style]]);
  if(c.ranger){feats.push(["Rôdeur","Ennemi juré : "+(S.enemy||"?")],["Rôdeur","Explorateur-né : "+(S.terrain||"?")])}
  feats.push(["Historique",b.feat]);
  return feats}
function recapText(){
  const c=C(),r=R(),b=BGS[S.bg],sb=SUB(),ac=armorClass(),si=spellInfo();const L=[];
  L.push(`${S.name||"Sans nom"} — ${S.race}, ${S.cls}${S.sub?" ("+S.sub+")":""}${S.sub2&&sub2()?" ("+S.sub2+")":""} niv. ${LV()}, ${S.bg}, ${S.align||"?"}`);
  L.push("");L.push("CARACTÉRISTIQUES : "+AB.map(a=>`${a} ${score(a)} (${sgn(M(a))})`).join(" · "));
  L.push(`Maîtrise +${PB} · CA ${ac.v} (${ac.txt}) · Initiative ${sgn(M("DEX"))} · Vitesse ${r.spd} · PV ${hp()} · DV ${LV()}d${c.hd} · Perception passive ${10+skillTotal("Perception")}`);
  L.push("SAUVEGARDES : "+AB.map(a=>`${a} ${sgn(saveBonus(a))}${c.saves.includes(a)?"●":""}`).join(" · "));
  L.push("COMPÉTENCES : "+SKILLS.map(([s])=>`${s} ${sgn(skillTotal(s))}${allSkills().has(s)?"●":""}${expertSet().has(s)?"●":""}`).join(" · "));
  L.push("ATTAQUES : "+attacks().map(a=>`${a.n} ${a.atk}, ${a.dmg}`).join(" | "));
  L.push("LANGUES : "+languages().join(", "));
  L.push("ÉQUIPEMENT : "+chosenItems().map(it=>it.p?PACKS[it.p][0]+" ("+PACKS[it.p][1]+")":it.pick?(it.w||"arme au choix"):itemLabel(it).replace(/&amp;/g,"&")).concat(b.eq).filter((x,i,a)=>a.indexOf(x)===i).join(", ")+` · ${b.po} po`);
  if(si){L.push(`SORTS : DD ${si.dc}, attaque ${si.atk}, emplacements : ${si.slots}`);L.push("  Tours de magie : "+S.cants.concat(sb&&sb.cantrip?[sb.cantrip]:[],S.domCant?[S.domCant]:[],r.spells||[],r.cantrip?[S.raceCantrip]:[]).join(", "));
    L.push("  Sorts : "+(si.known?S.spells:si.book?S.book.map(s=>s+(S.prepared.includes(s)?"*":"")):domSpells().concat(S.prepared)).join(", "))}
  else if(r.spells||r.cantrip)L.push("TOURS DE MAGIE (race) : "+(r.spells||[]).concat(r.cantrip?[S.raceCantrip]:[]).join(", "));
  L.push("CAPACITÉS :");featList().forEach(f=>L.push("  - "+f[0]+" : "+f[1]));
  L.push("");L.push("Traits : "+S.traits);L.push("Idéaux : "+S.ideaux);L.push("Liens : "+S.liens);L.push("Défauts : "+S.defauts);
  return L.join("\n")}

/* ===================== VALIDATION ===================== */
function validate(i){
  const c=C(),r=R(),sb=SUB();
  if(i===0){if(!S.race)return "Choisis une race.";if(r&&r.plus2&&S.plus2.length!==2)return "Demi-elfe : choisis 2 caractéristiques pour le +1."}
  if(i===1){if(!S.cls)return "Choisis une classe.";if(c.sub&&!S.sub)return "Choisis ton "+SUBS[c.sub].label.toLowerCase()+".";if(styleNeeded()&&!S.style)return "Choisis un style de combat.";if(c.ranger&&(!S.enemy||!S.terrain))return "Choisis ton ennemi juré et ton terrain favori.";const lv=validateLevel();if(lv)return lv}
  if(i===2){if(!S.bg)return "Choisis un historique."}
  if(i===3){if(S.rolls.some(x=>x===""||isNaN(parseInt(x))))return "Entre tes 6 résultats de dés.";if(AB.some(a=>S.assign[a]===null))return "Attribue un résultat à chaque caractéristique."}
  if(i===4){if(S.skills.length!==c.n)return `Choisis ${c.n} compétences de classe.`;const ex=extraSkN();if(S.extraSk.length!==ex)return `Choisis ${ex} compétence(s) supplémentaire(s).`;
    if(sb&&sb.know&&S.subSk.length!==2)return "Choisis 2 compétences de domaine.";if(sb&&sb.natsk&&S.subSk.length!==1)return "Choisis 1 compétence de domaine.";if(expertN()&&S.expert.length!==expertN())return `Choisis ${expertN()} expertises.`}
  if(i===5){const E=EQUIP[S.cls];for(let li=0;li<E.lines.length;li++){if(S.eq[li]===undefined)return "Fais un choix pour chaque ligne d'équipement.";const o=E.lines[li][S.eq[li]];
      for(let ii=0;ii<o.i.length;ii++)if(o.i[ii].pick&&!S.picks[li+"-"+S.eq[li]+"-"+ii])return "Choisis l'arme dans le menu déroulant."}
    for(let ii=0;ii<E.fixed.length;ii++)if(E.fixed[ii].pick&&!S.picks["f-"+ii])return "Choisis l'arme courante en bas de page."}
  if(i===6){const si=spellInfo();if(si){if(S.cants.length!==si.cant)return `Choisis ${si.cant} tours de magie.`;if(si.known&&S.spells.length!==si.known)return `Choisis ${si.known} sorts connus.`;
    if(si.book){if(S.book.length!==si.book)return `Choisis ${si.book} sorts pour ton grimoire.`;if(S.prepared.length!==si.prep)return `Prépare ${si.prep} sort(s).`}
    else if(si.prep&&S.prepared.length!==si.prep)return `Prépare ${si.prep} sort(s).`;if(sb&&sb.druidCant&&!S.domCant)return "Choisis ton tour de magie de druide."}}
  return ""}

/* ===================== NAVIGATION ===================== */
function render(){
  PB=pbFor(LV());renderSteps();const p=[pRace,pClass,pBg,pAbil,pSkills,pEquip,pSpells,pPerso,pRecap,pPlay][S.step]();$("#page").innerHTML=(S.confirmReset?`<div class="card confirm"><h2>Effacer ${esc(S.name||"ce perso")} ?</h2><p>Tout le perso en cours sera effacé pour en commencer un nouveau. Pense à copier le récap avant si tu en as besoin.</p><div class="row" style="flex:0"><button class="btn" id="resetYes">Oui, nouveau perso</button><button class="btn sec" id="resetNo">Annuler</button></div></div>`:"")+p;$("#err").textContent="";
  $("#prevBtn").disabled=S.step===0;$("#nextBtn").style.display=S.step===STEPS.length-1?"none":"";save()}
function go(n){S.step=n;S.confirmReset=false;render();window.scrollTo(0,0)}
function next(){
  if(S.step===0){if(S.race){const e=validate(0);if(e){$("#err").textContent=e;return}}go(1);return}
  if(S.step===1){const e=validate(1)||(S.race?validate(0):"");if(e){$("#err").textContent=e;return}if(!unlocked()){$("#err").textContent=lockMsg();return}go(2);return}
  const e=validate(S.step);if(e){$("#err").textContent=e;return}let n=S.step+1;while(n<STEPS.length&&!stepVisible(n))n++;go(n)}
function prev(){let n=S.step-1;while(n>0&&!stepVisible(n))n--;go(Math.max(0,n))}
$("#preBtn").onclick=()=>go(0);$("#nextBtn").onclick=next;$("#prevBtn").onclick=prev;
$("#steps").onclick=e=>{const b=e.target.closest("[data-go]");if(!b)return;const t=+b.dataset.go;
  if(t<=1){go(t);return}
  if(!unlocked()){$("#err").textContent=lockMsg();return}
  if(t<=S.step){go(t);return}for(let i=Math.max(0,S.step);i<t;i++){if(!stepVisible(i))continue;const er=validate(i);if(er){go(i);$("#err").textContent=er;return}}go(t)};
$("#resetBtn").onclick=()=>{const empty=!S.race&&!S.cls&&!S.bg&&!S.name;
  if(empty){S=blank();render();window.scrollTo(0,0);toast("Nouveau perso prêt !");return}
  S.confirmReset=true;render();window.scrollTo(0,0)};
let toastT;function toast(t,ms){const el=$("#toast");el.textContent=t;el.style.display="block";clearTimeout(toastT);toastT=setTimeout(()=>el.style.display="none",ms||1800)}

function toggle(arr,v,max){const i=arr.indexOf(v);if(i>=0)arr.splice(i,1);else if(arr.length<max)arr.push(v);else{toast("Maximum atteint ("+max+")");return false}return true}

document.addEventListener("change",async e=>{const t=e.target;
  if(t.id==="persoTok"&&t.files[0]){S.token=await window.tokImg(t.files[0]);render();return}
  if(t.name==="race"){S.race=t.value;S.plus2=[];S.skills=[];S.extraSk=[];S.expert=[];S.langs=[]}
  else if(t.name==="dragon")S.dragon=t.value;
  else if(t.name==="rc")S.raceCantrip=t.value;
  else if(t.name==="cls"){if(S.cls!==t.value){S.cls=t.value;S.sub=null;S.sub2=null;S.invoc=[];S.meta=[];S.style=null;S.enemy=null;S.terrain=null;S.skills=[];S.subSk=[];S.expert=[];S.eq={};S.picks={};S.cants=[];S.spells=[];S.book=[];S.prepared=[];S.domCant=null;S.langs=[]}}
  else if(t.name==="sub"){S.sub=t.value;S.subSk=[];S.cants=S.cants.filter(x=>x!=="Lumière"||t.value!=="Lumière");S.eq={};S.picks={};S.prepared=[];S.spells=[];S.langs=[]}
  else if(t.name==="sdragon")S.sdragon=t.value;
  else if(t.name==="level"){S.level=+t.value;if(!sub2())S.sub2=null;if(!styleNeeded())S.style=null}
  else if(t.name==="sub2"){S.sub2=t.value;S.extraSk=[]}
  else if(t.dataset.invoc){S.invoc=S.invoc||[];if(!toggle(S.invoc,t.dataset.invoc,invocCount()))t.checked=false}
  else if(t.dataset.meta){S.meta=S.meta||[];if(!toggle(S.meta,t.dataset.meta,metaCount()))t.checked=false}
  else if(t.dataset.asi!==undefined){S.asi=S.asi||[null,null];S.asi[+t.dataset.asi]=t.value||null}
  else if(t.name==="style")S.style=t.value;else if(t.name==="enemy")S.enemy=t.value;else if(t.name==="terrain")S.terrain=t.value;
  else if(t.name==="bg"){if(S.bg!==t.value){S.pers={traits:[],ideaux:[],liens:[],defauts:[]};S.persRoll={};}S.bg=t.value;S.langs=[];S.extraSk=[];S.skills=S.skills.filter(s=>!BGS[t.value].sk.includes(s))}
  else if(t.name==="align")S.align=t.value;
  else if(t.name==="domCant")S.domCant=t.value;
  else if(t.name&&t.name.startsWith("eq")){S.eq[+t.name.slice(2)]=+t.value}
  else if(t.dataset.plus2){if(!toggle(S.plus2,t.dataset.plus2,2))t.checked=false}
  else if(t.dataset.lang!==undefined){S.langs[+t.dataset.lang]=t.value}
  else if(t.dataset.assign){S.assign[t.dataset.assign]=t.value===""?null:+t.value}
  else if(t.dataset.sk){toggle(S.skills,t.dataset.sk,C().n);S.expert=S.expert.filter(x=>allSkills().has(x)||x==="Outils de voleur")}
  else if(t.dataset.xsk){toggle(S.extraSk,t.dataset.xsk,extraSkN())}
  else if(t.dataset.ssk){toggle(S.subSk,t.dataset.ssk,SUB().know?2:1)}
  else if(t.dataset.exp){toggle(S.expert,t.dataset.exp,expertN())}
  else if(t.dataset.pchoose){const [k,i]=t.dataset.pchoose.split(":");const n=PCATS.find(c=>c[0]===k)[2];{const a=S.pers[k],x=+i,j=a.indexOf(x);if(j>=0)a.splice(j,1);else{if(a.length>=n)a.shift();a.push(x)}}S.persRoll[k]=[];syncPers()}
  else if(t.dataset.pick){S.picks[t.dataset.pick]=t.value}
  else if(t.dataset.cant){toggle(S.cants,t.dataset.cant,spellInfo().cant)}
  else if(t.dataset.sp){toggle(S.spells,t.dataset.sp,spellInfo().known)}
  else if(t.dataset.book){toggle(S.book,t.dataset.book,(spellInfo()||{}).book||6);S.prepared=S.prepared.filter(x=>S.book.includes(x))}
  else if(t.dataset.prep){toggle(S.prepared,t.dataset.prep,spellInfo().prep)}
  else if(t.dataset.roll!==undefined){S.rolls[+t.dataset.roll]=t.value;}
  else if(t.dataset.f){S[t.dataset.f]=t.value;save();return}
  else return;
  const y=window.scrollY;render();window.scrollTo(0,y);if(t.dataset.roll!==undefined){const n=document.querySelector(`[data-roll="${+t.dataset.roll+1}"]`);if(n)n.focus()}});
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.f){S[t.dataset.f]=t.value;save()}});
document.addEventListener("click",e=>{const t=e.target;
  if(t.dataset&&t.dataset.proll){const k=t.dataset.proll;const [,,n,die]=PCATS.find(c=>c[0]===k);const res=[];while(res.length<n){const r=1+Math.floor(Math.random()*die);if(!res.includes(r))res.push(r)}S.persRoll[k]=res;S.pers[k]=res.map(r=>r-1);syncPers();const y=window.scrollY;render();window.scrollTo(0,y)}
  {const pb=t.closest&&t.closest("[data-preset]");if(pb){applyPreset(pb.dataset.preset);return}}
  if(t.id==="playBtn"){go(9);return}
  if(t.id==="persoTokDel"){S.token=null;render();return}
  if(t.id==="resetYes"){S=blank();render();window.scrollTo(0,0);toast("Nouveau perso prêt !");return}
  if(t.id==="resetNo"){S.confirmReset=false;render();return}
  if(t.id==="rollFor"){const det=[];S.rolls=S.rolls.map(()=>{const d=[1,2,3,4].map(()=>1+Math.floor(Math.random()*6)).sort((a,b)=>b-a);det.push(d.join("+").replace(/\+(\d)$/," (sans $1)"));return String(d[0]+d[1]+d[2])});
    S.assign={FOR:null,DEX:null,CON:null,INT:null,SAG:null,CHA:null};render();$("#rollDetail").textContent="Dés : "+det.join(" · ")}
  if(t.id==="autoAssign"){const c=C();if(!c){toast("Choisis d'abord une classe");return}if(S.rolls.some(x=>x===""))return toast("Entre d'abord tes 6 résultats");
    const idx=S.rolls.map((v,i)=>[+v,i]).sort((a,b)=>b[0]-a[0]);c.prio.forEach((a,k)=>S.assign[a]=idx[k][1]);render()}
  if(t.id==="copyBtn"){const txt=recapText();navigator.clipboard.writeText(txt).then(()=>toast("Copié !"),()=>toast("Copie impossible ici"))}
  if(t.dataset&&t.dataset.idea){e.preventDefault();const k=t.dataset.idea;const pool=IDEAS[k];const pick=pool[Math.floor(Math.random()*pool.length)];S[k]=S[k]?S[k]+" "+pick:pick;const y=window.scrollY;render();window.scrollTo(0,y)}
});

/* ===================== SAUVEGARDE DES PERSOS ===================== */
let PS={show:false,items:null};
const persoSummary=()=>[S.race,S.cls&&(S.cls+(S.sub?" ("+S.sub+")":"")),S.bg].filter(Boolean).join(" · ")||"en cours de création";
function renderPS(){$("#savesBox").innerHTML=PS.show?savesPanel("perso",PS.items,S.saveId,"persos"):""}
async function refreshPS(){PS.items=null;renderPS();PS.items=await Store.list("perso");renderPS()}
$("#saveBtn").onclick=async()=>{if(!S.race&&!S.cls&&!S.name)return toast("Rien à sauvegarder pour l'instant");
  try{const data=JSON.parse(JSON.stringify(Object.assign({},S,{confirmReset:false})));const r=await Store.save("perso",S.saveId,S.name,persoSummary(),data);
    S.saveId=r.id;save();toast(r.where==="api"?"« "+(S.name||"Sans nom")+" » sauvegardé dans la base !":r.where==="cloud"?"« "+(S.name||"Sans nom")+" » sauvegardé en ligne !":"Sauvegardé sur cet appareil");if(PS.show)refreshPS()}
  catch(e){toast("Échec de la sauvegarde")}};
$("#loadBtn").onclick=()=>{PS.show=!PS.show;if(PS.show)refreshPS();else renderPS()};
$("#savesBox").addEventListener("click",async e=>{const t=e.target;const it=id=>(PS.items||[]).find(x=>x.id===id);
  if(t.dataset.sload){const x=it(t.dataset.sload);S=Object.assign(blank(),x.data,{saveId:x.id,step:8,confirmReset:false});PS.show=false;renderPS();render();window.scrollTo(0,0);toast("« "+x.name+" » ouvert")}
  else if(t.dataset.scode){const x=it(t.dataset.scode);$("#savesBox #codeOut").innerHTML=`<div class="hint">Code de <b>${esc(x.name)}</b> : envoie-le à un pote, il le colle dans « Importer ».</div><textarea readonly onclick="this.select()">${Store.exportCode({kind:"perso",name:x.name,data:x.data})}</textarea>`}
  else if(t.dataset.sdel){if(!t.dataset.c){t.dataset.c=1;t.textContent="Sûr ?";return}await Store.remove(t.dataset.sdel,"perso");if(t.dataset.sdel===S.saveId){S.saveId=null;save()}refreshPS();toast("Supprimé")}
  else if(t.id==="importBtn"){try{const o=Store.importCode($("#savesBox #importBox").value);if(o.kind!=="perso")return toast("Ce code est celui d'une créature : importe-le dans Ennemis & alliés");
    S=Object.assign(blank(),o.data,{saveId:null,step:8,confirmReset:false});PS.show=false;renderPS();render();toast("Importé ! Pense à sauvegarder")}catch(err){toast("Code invalide")}}});
Store.onReady(()=>{if(PS.show)refreshPS()});
