-- =====================================================================
-- Base de données « dnd » pour le Créateur de personnage D&D 5e (XAMPP / MariaDB)
-- Import : phpMyAdmin > Importer > dnd.sql   (ou : mysql -u root < dnd.sql)
-- =====================================================================
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS dnd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dnd;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS sort_classe;
DROP TABLE IF EXISTS sorts;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS modeles_creatures;
DROP TABLE IF EXISTS objets_magiques;
SET FOREIGN_KEY_CHECKS=1;

-- ---------- Référentiel (rechargé à chaque import) ----------
CREATE TABLE classes (
  id    TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom   VARCHAR(40) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE sorts (
  id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(80)  NOT NULL UNIQUE,
  niveau        TINYINT UNSIGNED NOT NULL,            -- 0 = tour de magie
  ecole         VARCHAR(40)  NOT NULL,
  mots_cles     VARCHAR(120) NOT NULL DEFAULT '',     -- ex. « attaque · concentration »
  concentration BOOLEAN NOT NULL DEFAULT 0,
  rituel        BOOLEAN NOT NULL DEFAULT 0,
  description   TEXT NOT NULL,
  INDEX idx_niveau (niveau)
) ENGINE=InnoDB;

CREATE TABLE sort_classe (
  sort_id   SMALLINT UNSIGNED NOT NULL,
  classe_id TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (sort_id, classe_id),
  FOREIGN KEY (sort_id)   REFERENCES sorts(id)   ON DELETE CASCADE,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE modeles_creatures (
  id        SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom       VARCHAR(80) NOT NULL UNIQUE,
  role      ENUM('ennemi','allie','neutre') NOT NULL DEFAULT 'ennemi',
  type      VARCHAR(60) NOT NULL,
  fp        VARCHAR(5)  NOT NULL,                    -- facteur de puissance (1/4, 2…)
  donnees   LONGTEXT NOT NULL CHECK (JSON_VALID(donnees))
) ENGINE=InnoDB;

CREATE TABLE objets_magiques (
  id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(80) NOT NULL UNIQUE,
  type          VARCHAR(30) NOT NULL,
  rarete        VARCHAR(20) NOT NULL,
  harmonisation BOOLEAN NOT NULL DEFAULT 0,
  effet         TEXT NOT NULL,
  mods          LONGTEXT NULL CHECK (mods IS NULL OR JSON_VALID(mods))   -- effets chiffrés : {"ac":1,"save":1}, {"weapon":1}, {"set":{"FOR":19}}, {"heal":"2d4+2"}…
) ENGINE=InnoDB;

-- ---------- Tes données (jamais effacées par un nouvel import) ----------
CREATE TABLE IF NOT EXISTS personnages (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom          VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  joueur       VARCHAR(100) NOT NULL DEFAULT '',
  race         VARCHAR(40)  NULL,
  classe       VARCHAR(40)  NULL,
  niveau       TINYINT UNSIGNED NOT NULL DEFAULT 1,
  historique   VARCHAR(40)  NULL,
  resume       VARCHAR(255) NOT NULL DEFAULT '',
  dans_groupe  BOOLEAN NOT NULL DEFAULT 0,          -- affiché dans l'onglet Groupe
  donnees      LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),  -- tout le perso (état du créateur + partie)
  cree_le      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS creatures (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  role        VARCHAR(10)  NOT NULL DEFAULT 'ennemi',
  type        VARCHAR(60)  NOT NULL DEFAULT '',
  fp          VARCHAR(5)   NOT NULL DEFAULT '0',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS groupes (                 -- groupes sauvegardés (liste des persos d'une campagne)
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),  -- {membres:[{id,nom}], cartes:[...]}
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cartes (                  -- cartes : image de fond, grille, jetons, brouillard (JSON)
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS journaux (                -- journaux de campagne : sessions, quêtes, PNJ (JSON)
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jetons (                    -- bibliothèque de jetons
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rencontres (                    -- rencontres préparées
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume      VARCHAR(255) NOT NULL DEFAULT '',
  donnees     LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS etat (                    -- petites données du site (combat en cours…)
  cle         VARCHAR(40) PRIMARY KEY,
  valeur      LONGTEXT NOT NULL CHECK (JSON_VALID(valeur)),
  modifie_le  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO classes (nom) VALUES
  ('Barbare'),
  ('Barde'),
  ('Clerc'),
  ('Druide'),
  ('Ensorceleur'),
  ('Guerrier'),
  ('Magicien'),
  ('Moine'),
  ('Occultiste'),
  ('Paladin'),
  ('Rôdeur'),
  ('Roublard');

INSERT INTO sorts (nom,niveau,ecole,mots_cles,concentration,rituel,description) VALUES
  ('Amis',0,'Enchantement','',0,0,'Avantage aux tests de CHA contre une créature pendant 1 min ; elle t''en veut après.'),
  ('Aspersion d''acide',0,'Évocation','attaque',0,0,'1 ou 2 cibles proches, 1d6 acide (sauvegarde DEX). 18 m.'),
  ('Assistance',0,'Divination','',0,0,'Un allié ajoute 1d4 à un test de caractéristique (concentration 1 min).'),
  ('Bouffée de poison',0,'Invocation','',0,0,'1d12 poison à 3 m (sauvegarde CON).'),
  ('Contact glacial',0,'Nécromancie','attaque',0,0,'Attaque de sort à 36 m, 1d8 nécrotique, la cible ne peut pas regagner de PV pendant 1 tour.'),
  ('Coup au but',0,'Divination','',0,0,'Avantage à ta prochaine attaque contre la cible (concentration).'),
  ('Décharge occulte',0,'Évocation','attaque',0,0,'Le tour de l''occultiste : attaque de sort à 36 m, 1d10 force.'),
  ('Druidisme',0,'Transmutation','',0,0,'Petits effets naturels : prévoir la météo, faire éclore une fleur, souffler une bougie.'),
  ('Épargner les mourants',0,'Nécromancie','',0,0,'Stabilise une créature à 0 PV au contact.'),
  ('Flamme sacrée',0,'Évocation','',0,0,'1d8 radiant à 18 m (sauvegarde DEX), ignore les abris.'),
  ('Flammes',0,'Invocation','attaque',0,0,'Flamme dans ta main (lumière), peut être lancée : 1d8 feu à 9 m.'),
  ('Gourdin magique',0,'Transmutation','',0,0,'Ton bâton ou gourdin utilise SAG et fait 1d8. Action bonus.'),
  ('Illusion mineure',0,'Illusion','',0,0,'Crée un son ou une image immobile (cube de 1,50 m) pendant 1 min.'),
  ('Lumière',0,'Évocation','',0,0,'Un objet émet de la lumière vive sur 6 m pendant 1 heure.'),
  ('Lumières dansantes',0,'Évocation','',0,0,'Jusqu''à 4 lumières flottantes que tu déplaces (concentration 1 min).'),
  ('Main de mage',0,'Invocation','',0,0,'Main spectrale à 9 m qui manipule des objets légers (5 kg max).'),
  ('Message',0,'Transmutation','',0,0,'Chuchote un message à une créature à 36 m, elle peut répondre.'),
  ('Moquerie cruelle',0,'Enchantement','',0,0,'Insulte magique : 1d4 psychique et désavantage à sa prochaine attaque (sauvegarde SAG).'),
  ('Poigne électrique',0,'Évocation','attaque',0,0,'Contact, 1d8 foudre, avantage si armure métallique, la cible perd sa réaction.'),
  ('Prestidigitation',0,'Transmutation','',0,0,'Petits tours : nettoyer, réchauffer, parfumer, étincelles, petits effets.'),
  ('Rayon de givre',0,'Évocation','attaque',0,0,'Attaque de sort à 18 m, 1d8 froid et -3 m de vitesse.'),
  ('Réparation',0,'Transmutation','',0,0,'Répare une cassure ou une déchirure simple.'),
  ('Résistance',0,'Abjuration','',0,0,'Un allié ajoute 1d4 à une sauvegarde (concentration 1 min).'),
  ('Thaumaturgie',0,'Transmutation','',0,0,'Petits prodiges : voix tonitruante, flammes qui vacillent, tremblements.'),
  ('Trait de feu',0,'Évocation','attaque',0,0,'Attaque de sort à 36 m, 1d10 feu, enflamme les objets.'),
  ('Alarme',1,'Abjuration','rituel',0,1,'Alerte si une créature entre dans une zone pendant 8 h.'),
  ('Amitié avec les animaux',1,'Enchantement','',0,0,'Charme une bête (sauvegarde SAG) pendant 24 h.'),
  ('Armure d''Agathys',1,'Abjuration','',0,0,'5 PV temporaires ; qui te frappe au corps-à-corps subit 5 froid.'),
  ('Armure de mage',1,'Abjuration','',0,0,'CA = 13 + DEX pendant 8 h (sans armure).'),
  ('Baies nourricières',1,'Transmutation','',0,0,'10 baies qui nourrissent et soignent 1 PV chacune.'),
  ('Bénédiction',1,'Enchantement','',0,0,'3 créatures ajoutent 1d4 à leurs attaques et sauvegardes (concentration 1 min).'),
  ('Blessure',1,'Nécromancie','attaque',0,0,'Contact, 3d10 nécrotique.'),
  ('Bouclier',1,'Abjuration','réaction',0,0,'+5 CA jusqu''à ton prochain tour, bloque Projectile magique.'),
  ('Bouclier de la foi',1,'Abjuration','bonus',0,0,'+2 CA à une créature (concentration 10 min).'),
  ('Bras d''Hadar',1,'Invocation','',0,0,'Tentacules autour de toi : 2d6 nécrotique à 3 m (sauvegarde FOR), plus de réaction.'),
  ('Charme-personne',1,'Enchantement','',0,0,'Un humanoïde te considère comme un ami pendant 1 h (sauvegarde SAG).'),
  ('Châtiment ardent',1,'Évocation','bonus',0,0,'Ta prochaine attaque d''arme qui touche ajoute 1d6 feu et enflamme la cible.'),
  ('Châtiment courroucé',1,'Évocation','bonus',0,0,'Ta prochaine attaque d''arme qui touche ajoute 1d6 psychique et effraie la cible (SAG).'),
  ('Châtiment tonitruant',1,'Évocation','bonus',0,0,'Ta prochaine attaque d''arme qui touche ajoute 2d6 tonnerre et repousse de 3 m (FOR).'),
  ('Compréhension des langues',1,'Divination','rituel',0,1,'Comprends toutes les langues parlées et écrites pendant 1 h.'),
  ('Couleurs dansantes',1,'Illusion','',0,0,'Éblouit 6d10 PV de créatures (les plus faibles d''abord).'),
  ('Création ou destruction d''eau',1,'Transmutation','',0,0,'Crée ou détruit jusqu''à 40 litres d''eau.'),
  ('Déguisement',1,'Illusion','',0,0,'Change ton apparence pendant 1 h.'),
  ('Détection de la magie',1,'Divination','rituel',0,1,'Sens la magie à 9 m (concentration 10 min).'),
  ('Détection du mal et du bien',1,'Divination','',0,0,'Sens aberrations, célestes, élémentaires, fées, fiélons, morts-vivants à 9 m.'),
  ('Détection du poison et des maladies',1,'Divination','rituel',0,1,'Sens poisons, créatures venimeuses et maladies à 9 m.'),
  ('Disque flottant de Tenser',1,'Invocation','rituel',0,1,'Disque de force qui porte 250 kg pendant 1 h.'),
  ('Éclair traçant',1,'Évocation','attaque',0,0,'Attaque de sort, 4d6 radiant, la prochaine attaque contre la cible a l''avantage.'),
  ('Enchevêtrement',1,'Invocation','',0,0,'Plantes qui entravent dans un carré de 6 m (sauvegarde FOR).'),
  ('Faveur divine',1,'Évocation','bonus',0,0,'+1d4 radiant à tes attaques d''arme (concentration 1 min).'),
  ('Feuille morte',1,'Transmutation','réaction',0,0,'Jusqu''à 5 créatures tombent lentement, sans dégâts.'),
  ('Fléau',1,'Enchantement','',0,0,'3 créatures soustraient 1d4 à leurs attaques et sauvegardes (sauvegarde CHA).'),
  ('Fou rire de Tasha',1,'Enchantement','',0,0,'Une créature se tord de rire, à terre et neutralisée (sauvegarde SAG).'),
  ('Frappe piégeuse',1,'Invocation','bonus',0,0,'Ta prochaine attaque qui touche fait pousser des ronces qui entravent la cible (FOR).'),
  ('Graisse',1,'Invocation','',0,0,'Sol glissant sur 3 m : chute au sol (sauvegarde DEX).'),
  ('Grande foulée',1,'Transmutation','',0,0,'+3 m de vitesse à une créature pendant 1 h.'),
  ('Grêle d''épines',1,'Invocation','bonus',0,0,'Ta prochaine attaque à distance qui touche fait exploser des épines : 1d10 perforants autour (DEX).'),
  ('Héroïsme',1,'Enchantement','',0,0,'Immunisé à la peur, PV temporaires chaque tour (concentration).'),
  ('Identification',1,'Divination','rituel',0,1,'Découvre les propriétés d''un objet magique.'),
  ('Image silencieuse',1,'Illusion','',0,0,'Image sans son d''un objet ou d''une créature (cube de 4,50 m, concentration).'),
  ('Injonction',1,'Enchantement','',0,0,'Un mot d''ordre : approche, lâche, fuis, à terre, halte (sauvegarde SAG).'),
  ('Lueurs féeriques',1,'Évocation','',0,0,'Les créatures dans un cube de 6 m brillent : avantage pour les attaquer, pas d''invisibilité.'),
  ('Mains brûlantes',1,'Évocation','',0,0,'Cône de feu de 4,50 m, 3d6 feu (sauvegarde DEX).'),
  ('Maléfice',1,'Enchantement','bonus',0,0,'+1d6 nécrotique à tes attaques contre la cible, désavantage à une caractéristique (concentration 1 h).'),
  ('Marque du chasseur',1,'Divination','bonus',0,0,'+1d6 dégâts à tes attaques d''arme contre la cible marquée (concentration 1 h).'),
  ('Mot de guérison',1,'Évocation','bonus',0,0,'Soigne 1d4 + mod. à distance (18 m), en action bonus.'),
  ('Murmures dissonants',1,'Enchantement','',0,0,'3d6 psychique et la cible fuit (sauvegarde SAG).'),
  ('Nappe de brouillard',1,'Invocation','',0,0,'Brouillard épais de 6 m de rayon (concentration 1 h).'),
  ('Orbe chromatique',1,'Évocation','attaque',0,0,'Attaque de sort, 3d8 du type de ton choix (acide, froid, feu, foudre, poison, tonnerre).'),
  ('Parler avec les animaux',1,'Divination','rituel',0,1,'Parle avec les bêtes pendant 10 min.'),
  ('Projectile magique',1,'Évocation','',0,0,'3 projectiles qui touchent toujours, 1d4 + 1 force chacun.'),
  ('Protection contre le mal et le bien',1,'Abjuration','',0,0,'Protège une créature contre aberrations, fiélons, morts-vivants…'),
  ('Purification de nourriture et d''eau',1,'Transmutation','rituel',0,1,'Rend nourriture et boisson saines.'),
  ('Rayon empoisonné',1,'Nécromancie','attaque',0,0,'Attaque de sort, 2d8 poison.'),
  ('Repli expéditif',1,'Transmutation','bonus',0,0,'Foncer en action bonus pendant 10 min (concentration).'),
  ('Représailles infernales',1,'Évocation','réaction',0,0,'Quand on te blesse : 2d10 feu à l''attaquant (sauvegarde DEX).'),
  ('Sanctuaire',1,'Abjuration','bonus',0,0,'Les ennemis doivent réussir une sauvegarde SAG pour attaquer la cible protégée.'),
  ('Saut',1,'Transmutation','',0,0,'Triple la distance de saut pendant 1 min.'),
  ('Serviteur invisible',1,'Invocation','rituel',0,1,'Une force invisible exécute des tâches simples pendant 1 h.'),
  ('Simulacre de vie',1,'Nécromancie','',0,0,'1d4 + 4 PV temporaires.'),
  ('Soins',1,'Évocation','',0,0,'Contact, soigne 1d8 + mod.'),
  ('Sommeil',1,'Enchantement','',0,0,'Endort 5d8 PV de créatures (les plus faibles d''abord).'),
  ('Texte illusoire',1,'Illusion','rituel',0,1,'Écrit un message secret lisible seulement par ceux que tu choisis.'),
  ('Trouver un familier',1,'Invocation','rituel',0,1,'Invoque un familier (chat, chouette, crapaud…).'),
  ('Vague tonnante',1,'Évocation','',0,0,'Cube de 4,50 m, 2d8 tonnerre et repousse de 3 m (sauvegarde CON).'),
  ('Agrandissement/Rapetissement',2,'Transmutation','concentration',1,0,'Une créature ou un objet double de taille (+1d4 dégâts, avantage FOR) ou rétrécit (−1d4 dégâts) pendant 1 min (CON).'),
  ('Aide',2,'Abjuration','',0,0,'Jusqu''à 3 créatures gagnent +5 PV max et actuels pendant 8 h.'),
  ('Amélioration de caractéristique',2,'Transmutation','concentration',1,0,'Une créature gagne un bonus selon l''animal choisi : avantage aux tests d''une caractéristique, PV temporaires (ours)…'),
  ('Apaisement des émotions',2,'Enchantement','concentration',1,0,'Supprime la peur, le charme ou l''hostilité des humanoïdes dans une sphère de 6 m (CHA).'),
  ('Arme magique',2,'Transmutation','bonus · concentration',1,0,'Une arme devient magique avec +1 au toucher et aux dégâts pendant 1 h.'),
  ('Arme spirituelle',2,'Évocation','bonus',0,0,'Une arme spectrale flotte à 18 m : attaque de sort en action bonus, 1d8 + mod. force, pendant 1 min.'),
  ('Augure',2,'Divination','rituel',0,1,'Demande si un plan des 30 prochaines minutes sera bénéfique, néfaste, les deux ou rien.'),
  ('Aura magique de Nystul',2,'Illusion','',0,0,'Masque ou falsifie l''aura magique d''un objet ou d''une créature pendant 24 h.'),
  ('Bouche magique',2,'Illusion','rituel',0,1,'Un objet récite un message quand une condition choisie se produit.'),
  ('Bourrasque',2,'Évocation','concentration',1,0,'Ligne de vent de 18 m : repousse de 4,5 m (FOR), disperse gaz et brouillard, double le coût de déplacement face au vent.'),
  ('Cécité/Surdité',2,'Nécromancie','',0,0,'Une créature devient aveugle ou sourde pendant 1 min (CON, nouveau jet à chaque tour).'),
  ('Châtiment révélateur',2,'Évocation','bonus · concentration',1,0,'Ta prochaine attaque d''arme qui touche ajoute 2d6 radiants et rend la cible visible et lumineuse.'),
  ('Corde enchantée',2,'Transmutation','',0,0,'Une corde s''élève et ouvre un espace extradimensionnel caché pour 8 créatures pendant 1 h.'),
  ('Cordon de flèches',2,'Transmutation','',0,0,'Des munitions plantées au sol tirent sur les ennemis qui s''approchent (1d6 perforants, DEX) pendant 8 h.'),
  ('Couronne du dément',2,'Enchantement','concentration',1,0,'Un humanoïde charmé attaque la créature de ton choix à chaque tour (SAG).'),
  ('Croissance d''épines',2,'Transmutation','concentration',1,0,'Terrain de 6 m de rayon couvert d''épines cachées : 2d4 perforants tous les 1,50 m parcourus.'),
  ('Déblocage',2,'Transmutation','',0,0,'Ouvre une serrure, une porte coincée ou une barre, avec un grand bruit.'),
  ('Détection des pensées',2,'Divination','concentration',1,0,'Lis les pensées de surface des créatures proches, puis sonde plus profond (SAG).'),
  ('Discours captivant',2,'Enchantement','',0,0,'Les créatures qui t''entendent ont un désavantage en Perception pour remarquer autre chose que toi pendant 1 min (SAG).'),
  ('Flamme éternelle',2,'Évocation','',0,0,'Une flamme magique sans chaleur brûle pour toujours sur un objet.'),
  ('Flèche acide de Melf',2,'Évocation','attaque',0,0,'Attaque de sort à 27 m : 4d4 acide tout de suite et 2d4 au tour suivant.'),
  ('Flou',2,'Illusion','concentration',1,0,'Ton corps devient flou : les attaquants ont un désavantage contre toi pendant 1 min.'),
  ('Force fantasmagorique',2,'Illusion','concentration',1,0,'Une créature croit voir une illusion réelle qui peut lui infliger 1d6 psychiques par tour (INT).'),
  ('Fracassement',2,'Évocation','',0,0,'Explosion sonore de 3 m de rayon : 3d8 tonnerre (CON), dégâts doublés contre les créatures de pierre ou de métal.'),
  ('Image miroir',2,'Illusion','',0,0,'3 doubles illusoires de toi détournent les attaques pendant 1 min.'),
  ('Immobilisation de personne',2,'Enchantement','concentration',1,0,'Un humanoïde est paralysé (SAG, nouveau jet chaque tour) : les attaques au contact sont des critiques.'),
  ('Invisibilité',2,'Illusion','concentration',1,0,'Une créature devient invisible pendant 1 h, jusqu''à ce qu''elle attaque ou lance un sort.'),
  ('Lame de feu',2,'Évocation','bonus · concentration',1,0,'Une lame de feu apparaît dans ta main : attaque de sort au contact, 3d6 feu, pendant 10 min.'),
  ('Lévitation',2,'Transmutation','concentration',1,0,'Une créature ou un objet flotte et monte ou descend de 6 m par tour (CON si réticent).'),
  ('Lien de protection',2,'Abjuration','',0,0,'Un allié gagne +1 CA, +1 aux sauvegardes et une résistance à tous les dégâts, mais tu subis les mêmes dégâts que lui.'),
  ('Localisation d''animaux ou de plantes',2,'Divination','rituel',0,1,'Trouve la direction et la distance du type d''animal ou de plante le plus proche à 7,5 km.'),
  ('Localisation d''objet',2,'Divination','concentration',1,0,'Sens la direction d''un objet connu ou d''un type d''objet à 300 m.'),
  ('Messager animal',2,'Enchantement','rituel',0,1,'Un petit animal porte un message de 25 mots jusqu''à quelqu''un, pendant 24 h.'),
  ('Métal brûlant',2,'Transmutation','bonus · concentration',1,0,'Un objet en métal devient brûlant : 2d8 feu par tour à celui qui le tient ou le porte (lâcher ou désavantage).'),
  ('Nuage de dagues',2,'Invocation','concentration',1,0,'Cube de 1,50 m de dagues tourbillonnantes : 4d4 tranchants à qui y entre ou y commence son tour.'),
  ('Pas brumeux',2,'Invocation','bonus',0,0,'Téléporte-toi de 9 m vers un endroit que tu vois.'),
  ('Passage sans trace',2,'Abjuration','concentration',1,0,'Le groupe gagne +10 en Discrétion et ne laisse aucune trace pendant 1 h.'),
  ('Pattes d''araignée',2,'Transmutation','concentration',1,0,'Une créature marche sur les murs et au plafond, mains libres, pendant 1 h.'),
  ('Peau d''écorce',2,'Transmutation','concentration',1,0,'La CA d''une créature ne peut pas descendre sous 16 pendant 1 h.'),
  ('Préservation des morts',2,'Nécromancie','rituel',0,1,'Un cadavre ne pourrit pas et ne peut pas devenir mort-vivant pendant 10 jours.'),
  ('Prière de guérison',2,'Évocation','',0,0,'Jusqu''à 6 créatures regagnent 2d8 + mod. PV (10 minutes d''incantation).'),
  ('Protection contre le poison',2,'Abjuration','',0,0,'Neutralise un poison, donne l''avantage contre le poison et la résistance aux dégâts de poison pendant 1 h.'),
  ('Rayon affaiblissant',2,'Nécromancie','attaque · concentration',1,0,'Les attaques d''arme de la cible basées sur la FOR font moitié moins de dégâts (CON chaque tour).'),
  ('Rayon ardent',2,'Évocation','attaque',0,0,'3 rayons de feu, une attaque de sort chacun : 2d6 feu par rayon.'),
  ('Rayon de lune',2,'Évocation','concentration',1,0,'Cylindre de lumière lunaire de 1,50 m : 2d10 radiants (CON), déplaçable chaque tour, pendant 1 min.'),
  ('Restauration partielle',2,'Abjuration','',0,0,'Met fin à une maladie ou à un état : aveuglé, assourdi, paralysé ou empoisonné.'),
  ('Sens animal',2,'Divination','rituel · concentration',1,1,'Vois et entends à travers les sens d''une bête consentante pendant 1 h.'),
  ('Serrure magique',2,'Abjuration','',0,0,'Verrouille magiquement une porte ou un coffre, toi seul (et ceux que tu choisis) peux l''ouvrir.'),
  ('Silence',2,'Illusion','rituel · concentration',1,1,'Sphère de 6 m de rayon sans aucun son : impossible d''y lancer des sorts à composante verbale, pendant 10 min.'),
  ('Sphère de feu',2,'Invocation','bonus · concentration',1,0,'Boule de feu de 1,50 m que tu roules de 9 m chaque tour : 2d6 feu (DEX), pendant 1 min.'),
  ('Suggestion',2,'Enchantement','concentration',1,0,'Une créature suit une suggestion raisonnable de ta part pendant 8 h (SAG).'),
  ('Ténèbres',2,'Évocation','concentration',1,0,'Sphère de 4,50 m de ténèbres magiques que la vision dans le noir ne perce pas, pendant 10 min.'),
  ('Toile d''araignée',2,'Invocation','concentration',1,0,'Cube de 6 m de toiles collantes : terrain difficile et créatures entravées (DEX), pendant 1 h.'),
  ('Trouver des pièges',2,'Divination','',0,0,'Sens la présence de pièges à portée de vue (sans savoir exactement où ils sont).'),
  ('Vision dans le noir',2,'Transmutation','',0,0,'Une créature voit dans le noir à 18 m pendant 8 h.'),
  ('Zone de vérité',2,'Enchantement','',0,0,'Les créatures dans une sphère de 4,50 m ne peuvent pas mentir délibérément pendant 10 min (CHA).'),
  ('Animation des morts',3,'Nécromancie','',0,0,'Crée un squelette ou un zombie qui t''obéit pendant 24 h (il faut relancer le sort pour le garder).'),
  ('Antidétection',3,'Abjuration','',0,0,'Une créature ou un objet ne peut pas être localisé par la divination magique pendant 8 h.'),
  ('Appel de la foudre',3,'Invocation','concentration',1,0,'Un nuage d''orage : chaque tour, un éclair de 3d10 foudre (DEX) dans un rayon de 1,50 m, pendant 10 min.'),
  ('Arme élémentaire',3,'Transmutation','concentration',1,0,'Une arme gagne +1 au toucher et +1d4 dégâts d''acide, froid, feu, foudre ou tonnerre pendant 1 h.'),
  ('Aura de vitalité',3,'Évocation','concentration',1,0,'Pendant 1 min, en action bonus, soigne 2d6 PV à une créature à 9 m de toi.'),
  ('Boule de feu',3,'Évocation','',0,0,'Explosion de 6 m de rayon à 45 m : 8d6 feu (DEX, moitié si réussite).'),
  ('Cercle magique',3,'Abjuration','',0,0,'Cylindre de 3 m qui bloque un type de créature (fiélons, morts-vivants…) pendant 1 h.'),
  ('Châtiment aveuglant',3,'Évocation','bonus · concentration',1,0,'Ta prochaine attaque d''arme qui touche ajoute 3d8 radiants et aveugle la cible (CON).'),
  ('Clairvoyance',3,'Divination','concentration',1,0,'Crée un œil ou une oreille invisible dans un lieu que tu connais, jusqu''à 1,5 km, pendant 10 min.'),
  ('Clignotement',3,'Transmutation','',0,0,'À la fin de chaque tour, 50 % de chances de passer dans le plan éthéré (intouchable) pendant 1 min.'),
  ('Communication avec les morts',3,'Nécromancie','',0,0,'Un cadavre répond à 5 questions sur ce qu''il savait de son vivant.'),
  ('Communication avec les plantes',3,'Transmutation','',0,0,'Parle avec les plantes à 9 m et les fait bouger ou dégager le passage pendant 10 min.'),
  ('Contresort',3,'Abjuration','réaction',0,0,'Interromps un sort ennemi de niveau 3 ou moins (test pour les niveaux supérieurs).'),
  ('Création de nourriture et d''eau',3,'Invocation','',0,0,'Crée de quoi nourrir 15 personnes ou 5 montures pendant une journée.'),
  ('Croissance végétale',3,'Transmutation','',0,0,'Les plantes d''une zone de 30 m deviennent si denses que le déplacement y coûte 4 fois plus, ou un champ donne une récolte double pendant un an.'),
  ('Délivrance des malédictions',3,'Abjuration','',0,0,'Met fin aux malédictions qui affectent une créature ou un objet.'),
  ('Dissipation de la magie',3,'Abjuration','',0,0,'Met fin aux sorts de niveau 3 ou moins sur une cible (test pour les niveaux supérieurs).'),
  ('Éclair',3,'Évocation','',0,0,'Ligne de foudre de 30 m : 8d6 foudre (DEX, moitié si réussite).'),
  ('Envoi de message',3,'Évocation','',0,0,'Envoie un message de 25 mots à une créature que tu connais, n''importe où sur le même plan ; elle peut répondre.'),
  ('Esprits gardiens',3,'Invocation','concentration',1,0,'Des esprits t''entourent sur 4,50 m : vitesse des ennemis réduite de moitié et 3d8 radiants ou nécrotiques (SAG), pendant 10 min.'),
  ('Faim de Hadar',3,'Invocation','concentration',1,0,'Sphère de 6 m de vide glacial et aveuglant : 2d6 froid au début du tour, 2d6 acide à la fin (DEX).'),
  ('Flèche de foudre',3,'Transmutation','bonus',0,0,'Ta prochaine flèche devient un éclair : 4d8 foudre à la cible et 2d8 autour (DEX).'),
  ('Forme gazeuse',3,'Transmutation','concentration',1,0,'Une créature devient une brume volante (vol 3 m) qui passe par les fissures, avec résistance aux dégâts non magiques.'),
  ('Fusion dans la pierre',3,'Transmutation','rituel',0,1,'Entre dans un bloc de pierre et caches-y toi pendant 8 h.'),
  ('Glyphe de garde',3,'Abjuration','',0,0,'Un symbole piège une surface : explosion de 5d8 dégâts (DEX) ou un sort stocké se déclenche quand on le touche.'),
  ('Hâte',3,'Transmutation','concentration',1,0,'Une créature : vitesse doublée, +2 CA, avantage DEX et une action en plus par tour. Léthargie à la fin du sort.'),
  ('Image majeure',3,'Illusion','concentration',1,0,'Illusion avec son, odeur et température dans un cube de 6 m, pendant 10 min.'),
  ('Invocation d''animaux',3,'Invocation','concentration',1,0,'Invoque des esprits de bêtes (une de FP 2, deux de FP 1, quatre de FP 1/2 ou huit de FP 1/4) pendant 1 h.'),
  ('Langues',3,'Divination','',0,0,'Une créature comprend et parle toutes les langues pendant 1 h.'),
  ('Lenteur',3,'Transmutation','concentration',1,0,'Jusqu''à 6 créatures : vitesse divisée par deux, −2 CA et DEX, une seule action ou action bonus par tour (SAG).'),
  ('Lueur d''espoir',3,'Abjuration','concentration',1,0,'Les alliés ont l''avantage aux sauvegardes de SAG et contre la mort, et leurs soins sont maximisés pendant 1 min.'),
  ('Lumière du jour',3,'Évocation','',0,0,'Sphère de 18 m de lumière du jour qui dissipe les ténèbres magiques de niveau 3 ou moins, pendant 1 h.'),
  ('Malédiction',3,'Nécromancie','concentration',1,0,'Une créature touchée subit une malédiction au choix : désavantage, +1d8 nécrotique, perd des actions… (SAG).'),
  ('Manteau du croisé',3,'Évocation','concentration',1,0,'Les alliés à 9 m font +1d4 radiants avec leurs attaques d''arme pendant 1 min.'),
  ('Marche sur l''eau',3,'Transmutation','rituel',0,1,'Jusqu''à 10 créatures marchent sur l''eau, la lave ou tout liquide pendant 1 h.'),
  ('Monture fantôme',3,'Illusion','rituel',0,1,'Un cheval spectral très rapide (30 m) apparaît pour 1 h.'),
  ('Mot de guérison de groupe',3,'Évocation','bonus',0,0,'Jusqu''à 6 créatures regagnent 1d4 + mod. PV, en action bonus.'),
  ('Motif hypnotique',3,'Illusion','concentration',1,0,'Cube de 9 m de couleurs : les créatures sont charmées et neutralisées (SAG) pendant 1 min.'),
  ('Mur de vent',3,'Évocation','concentration',1,0,'Mur de vent de 15 m : 3d8 contondants (FOR), bloque les flèches, les gaz et les petites créatures volantes.'),
  ('Nuage nauséabond',3,'Invocation','concentration',1,0,'Sphère de 6 m de gaz : les créatures dedans perdent leur action en se tordant (CON), pendant 1 min.'),
  ('Petite hutte de Léomund',3,'Évocation','rituel',0,1,'Un dôme de 3 m protège 9 créatures des intempéries et de l''extérieur pendant 8 h.'),
  ('Peur',3,'Illusion','concentration',1,0,'Cône de 9 m : les créatures lâchent leur arme et fuient, effrayées (SAG).'),
  ('Protection contre une énergie',3,'Abjuration','concentration',1,0,'Une créature gagne la résistance à l''acide, au froid, au feu, à la foudre ou au tonnerre pendant 1 h.'),
  ('Respiration aquatique',3,'Transmutation','rituel',0,1,'Jusqu''à 10 créatures respirent sous l''eau pendant 24 h.'),
  ('Retour à la vie',3,'Nécromancie','',0,0,'Ramène à 1 PV une créature morte depuis moins d''une minute (diamant de 300 po).'),
  ('Tempête de neige',3,'Invocation','concentration',1,0,'Cylindre de 6 m de neige et de grêle : terrain difficile, glissant, vision masquée, peut briser la concentration.'),
  ('Tir de barrage',3,'Invocation','',0,0,'Cône de 18 m de projectiles : 3d8 dégâts du type de ta munition (DEX).'),
  ('Toucher vampirique',3,'Nécromancie','attaque · concentration',1,0,'Attaque de sort au contact : 3d6 nécrotique, et tu regagnes la moitié des dégâts en PV. Répétable chaque tour.'),
  ('Vol',3,'Transmutation','concentration',1,0,'Une créature gagne une vitesse de vol de 18 m pendant 10 min.'),
  ('Assassin imaginaire',4,'Illusion','concentration',1,0,'La cible voit sa pire peur : effrayée et 4d10 psychiques par tour (SAG).'),
  ('Bannissement',4,'Abjuration','concentration',1,0,'Envoie une créature dans un demi-plan ; une créature d''un autre plan peut y rester pour de bon (CHA).'),
  ('Bouclier de feu',4,'Évocation','',0,0,'Flammes chaudes ou froides autour de toi : résistance au froid ou au feu, 2d8 dégâts à qui te frappe au contact.'),
  ('Chien de garde de Mordenkainen',4,'Invocation','',0,0,'Un chien spectral invisible garde une zone pendant 8 h et mord les intrus (4d8 perforants).'),
  ('Coffre secret de Léomund',4,'Invocation','',0,0,'Cache un coffre et son contenu dans le plan éthéré, rappelé avec sa miniature.'),
  ('Compulsion',4,'Enchantement','concentration',1,0,'Les créatures choisies doivent se déplacer dans la direction que tu indiques (SAG).'),
  ('Confusion',4,'Enchantement','concentration',1,0,'Sphère de 3 m : les créatures agissent au hasard chaque tour (SAG).'),
  ('Contrôle de l''eau',4,'Transmutation','concentration',1,0,'Contrôle l''eau d''un cube de 30 m : inondation, partage des eaux, courant, tourbillon.'),
  ('Divination',4,'Divination','rituel',0,1,'Pose une question sur un événement des 7 prochains jours, ta divinité répond par une phrase.'),
  ('Domination de bête',4,'Enchantement','concentration',1,0,'Une bête t''obéit pendant 1 min (SAG).'),
  ('Fabrication',4,'Transmutation','',0,0,'Transforme des matériaux bruts en objet fini (pont, vêtements, armes…).'),
  ('Façonnage de la pierre',4,'Transmutation','',0,0,'Modèle un bloc de pierre (porte, passage, arme…).'),
  ('Flétrissement',4,'Nécromancie','',0,0,'8d8 nécrotiques à une créature (CON, moitié si réussite) ; les plantes subissent le maximum.'),
  ('Gardien de la foi',4,'Invocation','',0,0,'Un gardien spectral garde une zone pendant 8 h : 20 radiants aux ennemis qui approchent (DEX), jusqu''à 60 au total.'),
  ('Insecte géant',4,'Transmutation','concentration',1,0,'Change des insectes en géants (araignées, guêpes, mille-pattes…) qui t''obéissent.'),
  ('Invisibilité supérieure',4,'Illusion','concentration',1,0,'Une créature est invisible pendant 1 min, même si elle attaque ou lance des sorts.'),
  ('Invocation d''élémentaires mineurs',4,'Invocation','concentration',1,0,'Invoque des élémentaires (une de FP 2, deux de FP 1, quatre de FP 1/2 ou huit de FP 1/4).'),
  ('Invocation d''êtres des bois',4,'Invocation','concentration',1,0,'Invoque des fées (une de FP 2, deux de FP 1, quatre de FP 1/2 ou huit de FP 1/4).'),
  ('Liane avide',4,'Invocation','bonus · concentration',1,0,'Une liane tire une créature de 6 m vers elle à chaque tour (DEX).'),
  ('Liberté de mouvement',4,'Abjuration','',0,0,'Pendant 1 h, la créature ignore le terrain difficile, la paralysie et l''entrave magiques.'),
  ('Localisation de créature',4,'Divination','concentration',1,0,'Sens la direction d''une créature connue à 300 m.'),
  ('Métamorphose',4,'Transmutation','concentration',1,0,'Transforme une créature en bête de FP inférieur ou égal à son niveau (SAG si réticente), pendant 1 h.'),
  ('Mur de feu',4,'Évocation','concentration',1,0,'Mur de feu de 18 m : 5d8 feu à qui le traverse ou s''en approche du côté chaud (DEX).'),
  ('Œil magique',4,'Divination','concentration',1,0,'Un œil invisible que tu déplaces pour voir à distance pendant 1 h.'),
  ('Peau de pierre',4,'Abjuration','concentration',1,0,'Résistance aux dégâts contondants, perforants et tranchants non magiques pendant 1 h.'),
  ('Porte dimensionnelle',4,'Invocation','',0,0,'Téléporte-toi (et un passager) jusqu''à 150 m.'),
  ('Protection contre la mort',4,'Abjuration','',0,0,'La prochaine fois que la créature tombe à 0 PV, elle reste à 1 PV (dure 8 h).'),
  ('Sanctuaire privé de Mordenkainen',4,'Abjuration','',0,0,'Protège une zone contre la vue, le son, la téléportation et la divination pendant 24 h.'),
  ('Sphère résiliente d''Otiluke',4,'Évocation','concentration',1,0,'Une sphère de force indestructible enferme une créature (DEX).'),
  ('Tempête de grêle',4,'Invocation','',0,0,'Cylindre de 6 m : 2d8 contondants + 4d6 froid (DEX), le sol devient glissant.'),
  ('Tentacules noirs d''Evard',4,'Invocation','concentration',1,0,'Carré de 6 m de tentacules : 3d6 contondants et créatures entravées (DEX).'),
  ('Terrain hallucinatoire',4,'Illusion','',0,0,'Un terrain de 45 m prend l''apparence d''un autre (marais, forêt, route…) pendant 24 h.'),
  ('Animation des objets',5,'Transmutation','concentration',1,0,'Jusqu''à 10 objets prennent vie et attaquent selon tes ordres pendant 1 min.'),
  ('Apparence trompeuse',5,'Illusion','',0,0,'Change l''apparence de plusieurs créatures pendant 8 h (CHA si réticentes).'),
  ('Cercle de téléportation',5,'Invocation','',0,0,'Crée un cercle qui téléporte vers un cercle permanent connu.'),
  ('Colonne de flamme',5,'Évocation','',0,0,'Colonne de feu divin : 4d6 feu + 4d6 radiants (DEX).'),
  ('Communion',5,'Divination','rituel',0,1,'Pose 3 questions par oui ou non à ta divinité.'),
  ('Communion avec la nature',5,'Divination','rituel',0,1,'Apprends 3 faits sur le terrain qui t''entoure (eau, créatures, plantes…).'),
  ('Cône de froid',5,'Évocation','',0,0,'Cône de 18 m : 8d8 froid (CON, moitié si réussite).'),
  ('Contact avec un autre plan',5,'Divination','rituel',0,1,'Pose 5 questions à une entité d''un autre plan (risque de folie, INT DD 15).'),
  ('Contagion',5,'Nécromancie','attaque',0,0,'Attaque au contact : la cible est empoisonnée puis peut contracter une maladie grave.'),
  ('Création',5,'Illusion','',0,0,'Crée un objet non vivant en matière végétale ou minérale pour une durée limitée.'),
  ('Dissipation du mal et du bien',5,'Abjuration','concentration',1,0,'Protège contre célestes, élémentaires, fées, fiélons et morts-vivants, peut les renvoyer chez eux.'),
  ('Domination de personne',5,'Enchantement','concentration',1,0,'Un humanoïde t''obéit pendant 1 min (SAG).'),
  ('Double illusoire',5,'Illusion','concentration',1,0,'Tu deviens invisible et un double illusoire apparaît à ta place.'),
  ('Éveil',5,'Transmutation','',0,0,'Une bête ou une plante gagne une intelligence humaine et devient ton amie.'),
  ('Fléau d''insectes',5,'Invocation','concentration',1,0,'Sphère de 6 m d''insectes : 4d10 perforants par tour (CON).'),
  ('Immobilisation de monstre',5,'Enchantement','concentration',1,0,'Une créature est paralysée (SAG, nouveau jet chaque tour).'),
  ('Invocation d''élémentaire',5,'Invocation','concentration',1,0,'Invoque un élémentaire de FP 5 ou moins pendant 1 h.'),
  ('Lien planaire',5,'Abjuration','',0,0,'Oblige une créature d''un autre plan à te servir pendant 24 h (CHA).'),
  ('Lien télépathique de Rary',5,'Divination','rituel',0,1,'Relie par télépathie jusqu''à 8 créatures pendant 1 h.'),
  ('Main de Bigby',5,'Évocation','concentration',1,0,'Une main de force géante frappe, pousse, agrippe ou protège pendant 1 min (4d8 force au poing).'),
  ('Modification de mémoire',5,'Enchantement','concentration',1,0,'Modifie les souvenirs d''une créature sur les dernières 24 h (SAG).'),
  ('Mur de force',5,'Évocation','concentration',1,0,'Mur invisible et indestructible pendant 10 min.'),
  ('Mur de pierre',5,'Évocation','concentration',1,0,'Crée un mur de pierre qui peut devenir permanent.'),
  ('Mythes et légendes',5,'Divination','',0,0,'Apprends ce que les légendes racontent sur une personne, un lieu ou un objet.'),
  ('Nuage mortel',5,'Invocation','concentration',1,0,'Sphère de 6 m de brouillard toxique qui avance : 5d8 poison par tour (CON).'),
  ('Passage par les arbres',5,'Invocation','concentration',1,0,'Entre dans un arbre et sors par un autre de la même espèce à 150 m.'),
  ('Passe-muraille',5,'Transmutation','',0,0,'Ouvre un passage à travers un mur de bois, de plâtre ou de pierre pendant 1 h.'),
  ('Quête',5,'Enchantement','',0,0,'Donne un ordre magique à une créature, qui souffre 5d10 psychiques si elle désobéit (SAG).'),
  ('Rappel à la vie',5,'Nécromancie','',0,0,'Ramène à la vie une créature morte depuis moins de 10 jours (diamant de 500 po).'),
  ('Réincarnation',5,'Transmutation','',0,0,'Ramène un mort à la vie dans un nouveau corps d''une race tirée au hasard.'),
  ('Restauration supérieure',5,'Abjuration','',0,0,'Met fin à un charme, une pétrification, une malédiction, une réduction de caractéristique ou un niveau d''épuisement.'),
  ('Rêve',5,'Illusion','',0,0,'Envoie un message (ou un cauchemar de 3d6 psychiques) dans les rêves d''une créature.'),
  ('Sanctification',5,'Évocation','',0,0,'Consacre ou profane une zone pendant 24 h avec un effet choisi (10 minutes d''incantation).'),
  ('Scrutation',5,'Divination','concentration',1,0,'Espionne une créature à distance grâce à un capteur invisible (SAG).'),
  ('Soins de groupe',5,'Évocation','',0,0,'Jusqu''à 6 créatures regagnent 3d8 + mod. PV.'),
  ('Télékinésie',5,'Transmutation','concentration',1,0,'Déplace par la pensée une créature ou un objet de 500 kg maximum.'),
  ('Vague destructrice',5,'Évocation','',0,0,'Onde de choc de 9 m : 5d6 tonnerre + 5d6 radiants ou nécrotiques, à terre (CON).');

INSERT INTO sort_classe (sort_id,classe_id)
SELECT s.id,c.id FROM (
  SELECT NULL AS sn, NULL AS cn
  UNION ALL SELECT 'Amis','Barde'
  UNION ALL SELECT 'Amis','Ensorceleur'
  UNION ALL SELECT 'Amis','Occultiste'
  UNION ALL SELECT 'Amis','Magicien'
  UNION ALL SELECT 'Coup au but','Barde'
  UNION ALL SELECT 'Coup au but','Ensorceleur'
  UNION ALL SELECT 'Coup au but','Occultiste'
  UNION ALL SELECT 'Coup au but','Magicien'
  UNION ALL SELECT 'Illusion mineure','Barde'
  UNION ALL SELECT 'Illusion mineure','Ensorceleur'
  UNION ALL SELECT 'Illusion mineure','Occultiste'
  UNION ALL SELECT 'Illusion mineure','Magicien'
  UNION ALL SELECT 'Lumière','Barde'
  UNION ALL SELECT 'Lumière','Clerc'
  UNION ALL SELECT 'Lumière','Ensorceleur'
  UNION ALL SELECT 'Lumière','Magicien'
  UNION ALL SELECT 'Lumières dansantes','Barde'
  UNION ALL SELECT 'Lumières dansantes','Ensorceleur'
  UNION ALL SELECT 'Lumières dansantes','Magicien'
  UNION ALL SELECT 'Main de mage','Barde'
  UNION ALL SELECT 'Main de mage','Ensorceleur'
  UNION ALL SELECT 'Main de mage','Occultiste'
  UNION ALL SELECT 'Main de mage','Magicien'
  UNION ALL SELECT 'Message','Barde'
  UNION ALL SELECT 'Message','Ensorceleur'
  UNION ALL SELECT 'Message','Magicien'
  UNION ALL SELECT 'Moquerie cruelle','Barde'
  UNION ALL SELECT 'Prestidigitation','Barde'
  UNION ALL SELECT 'Prestidigitation','Ensorceleur'
  UNION ALL SELECT 'Prestidigitation','Occultiste'
  UNION ALL SELECT 'Prestidigitation','Magicien'
  UNION ALL SELECT 'Réparation','Barde'
  UNION ALL SELECT 'Réparation','Clerc'
  UNION ALL SELECT 'Réparation','Druide'
  UNION ALL SELECT 'Réparation','Ensorceleur'
  UNION ALL SELECT 'Réparation','Magicien'
  UNION ALL SELECT 'Assistance','Clerc'
  UNION ALL SELECT 'Assistance','Druide'
  UNION ALL SELECT 'Épargner les mourants','Clerc'
  UNION ALL SELECT 'Flamme sacrée','Clerc'
  UNION ALL SELECT 'Résistance','Clerc'
  UNION ALL SELECT 'Résistance','Druide'
  UNION ALL SELECT 'Thaumaturgie','Clerc'
  UNION ALL SELECT 'Bouffée de poison','Druide'
  UNION ALL SELECT 'Bouffée de poison','Ensorceleur'
  UNION ALL SELECT 'Bouffée de poison','Occultiste'
  UNION ALL SELECT 'Bouffée de poison','Magicien'
  UNION ALL SELECT 'Druidisme','Druide'
  UNION ALL SELECT 'Flammes','Druide'
  UNION ALL SELECT 'Gourdin magique','Druide'
  UNION ALL SELECT 'Aspersion d''acide','Ensorceleur'
  UNION ALL SELECT 'Aspersion d''acide','Magicien'
  UNION ALL SELECT 'Contact glacial','Ensorceleur'
  UNION ALL SELECT 'Contact glacial','Occultiste'
  UNION ALL SELECT 'Contact glacial','Magicien'
  UNION ALL SELECT 'Poigne électrique','Ensorceleur'
  UNION ALL SELECT 'Poigne électrique','Magicien'
  UNION ALL SELECT 'Rayon de givre','Ensorceleur'
  UNION ALL SELECT 'Rayon de givre','Magicien'
  UNION ALL SELECT 'Trait de feu','Ensorceleur'
  UNION ALL SELECT 'Trait de feu','Magicien'
  UNION ALL SELECT 'Décharge occulte','Occultiste'
  UNION ALL SELECT 'Amitié avec les animaux','Barde'
  UNION ALL SELECT 'Amitié avec les animaux','Druide'
  UNION ALL SELECT 'Amitié avec les animaux','Rôdeur'
  UNION ALL SELECT 'Charme-personne','Barde'
  UNION ALL SELECT 'Charme-personne','Druide'
  UNION ALL SELECT 'Charme-personne','Ensorceleur'
  UNION ALL SELECT 'Charme-personne','Occultiste'
  UNION ALL SELECT 'Charme-personne','Magicien'
  UNION ALL SELECT 'Compréhension des langues','Barde'
  UNION ALL SELECT 'Compréhension des langues','Ensorceleur'
  UNION ALL SELECT 'Compréhension des langues','Occultiste'
  UNION ALL SELECT 'Compréhension des langues','Magicien'
  UNION ALL SELECT 'Déguisement','Barde'
  UNION ALL SELECT 'Déguisement','Ensorceleur'
  UNION ALL SELECT 'Déguisement','Magicien'
  UNION ALL SELECT 'Détection de la magie','Barde'
  UNION ALL SELECT 'Détection de la magie','Clerc'
  UNION ALL SELECT 'Détection de la magie','Druide'
  UNION ALL SELECT 'Détection de la magie','Ensorceleur'
  UNION ALL SELECT 'Détection de la magie','Magicien'
  UNION ALL SELECT 'Détection de la magie','Paladin'
  UNION ALL SELECT 'Détection de la magie','Rôdeur'
  UNION ALL SELECT 'Feuille morte','Barde'
  UNION ALL SELECT 'Feuille morte','Ensorceleur'
  UNION ALL SELECT 'Feuille morte','Magicien'
  UNION ALL SELECT 'Fou rire de Tasha','Barde'
  UNION ALL SELECT 'Fou rire de Tasha','Magicien'
  UNION ALL SELECT 'Grande foulée','Barde'
  UNION ALL SELECT 'Grande foulée','Druide'
  UNION ALL SELECT 'Grande foulée','Magicien'
  UNION ALL SELECT 'Grande foulée','Rôdeur'
  UNION ALL SELECT 'Héroïsme','Barde'
  UNION ALL SELECT 'Héroïsme','Paladin'
  UNION ALL SELECT 'Identification','Barde'
  UNION ALL SELECT 'Identification','Magicien'
  UNION ALL SELECT 'Image silencieuse','Barde'
  UNION ALL SELECT 'Image silencieuse','Ensorceleur'
  UNION ALL SELECT 'Image silencieuse','Magicien'
  UNION ALL SELECT 'Lueurs féeriques','Barde'
  UNION ALL SELECT 'Lueurs féeriques','Druide'
  UNION ALL SELECT 'Mot de guérison','Barde'
  UNION ALL SELECT 'Mot de guérison','Clerc'
  UNION ALL SELECT 'Mot de guérison','Druide'
  UNION ALL SELECT 'Murmures dissonants','Barde'
  UNION ALL SELECT 'Parler avec les animaux','Barde'
  UNION ALL SELECT 'Parler avec les animaux','Druide'
  UNION ALL SELECT 'Parler avec les animaux','Rôdeur'
  UNION ALL SELECT 'Serviteur invisible','Barde'
  UNION ALL SELECT 'Serviteur invisible','Occultiste'
  UNION ALL SELECT 'Serviteur invisible','Magicien'
  UNION ALL SELECT 'Soins','Barde'
  UNION ALL SELECT 'Soins','Clerc'
  UNION ALL SELECT 'Soins','Druide'
  UNION ALL SELECT 'Soins','Paladin'
  UNION ALL SELECT 'Soins','Rôdeur'
  UNION ALL SELECT 'Sommeil','Barde'
  UNION ALL SELECT 'Sommeil','Ensorceleur'
  UNION ALL SELECT 'Sommeil','Magicien'
  UNION ALL SELECT 'Texte illusoire','Barde'
  UNION ALL SELECT 'Texte illusoire','Occultiste'
  UNION ALL SELECT 'Texte illusoire','Magicien'
  UNION ALL SELECT 'Vague tonnante','Barde'
  UNION ALL SELECT 'Vague tonnante','Druide'
  UNION ALL SELECT 'Vague tonnante','Ensorceleur'
  UNION ALL SELECT 'Vague tonnante','Magicien'
  UNION ALL SELECT 'Bénédiction','Clerc'
  UNION ALL SELECT 'Bénédiction','Paladin'
  UNION ALL SELECT 'Blessure','Clerc'
  UNION ALL SELECT 'Bouclier de la foi','Clerc'
  UNION ALL SELECT 'Bouclier de la foi','Paladin'
  UNION ALL SELECT 'Création ou destruction d''eau','Clerc'
  UNION ALL SELECT 'Création ou destruction d''eau','Druide'
  UNION ALL SELECT 'Détection du mal et du bien','Clerc'
  UNION ALL SELECT 'Détection du mal et du bien','Paladin'
  UNION ALL SELECT 'Détection du poison et des maladies','Clerc'
  UNION ALL SELECT 'Détection du poison et des maladies','Druide'
  UNION ALL SELECT 'Détection du poison et des maladies','Paladin'
  UNION ALL SELECT 'Détection du poison et des maladies','Rôdeur'
  UNION ALL SELECT 'Éclair traçant','Clerc'
  UNION ALL SELECT 'Fléau','Clerc'
  UNION ALL SELECT 'Injonction','Clerc'
  UNION ALL SELECT 'Injonction','Paladin'
  UNION ALL SELECT 'Protection contre le mal et le bien','Clerc'
  UNION ALL SELECT 'Protection contre le mal et le bien','Occultiste'
  UNION ALL SELECT 'Protection contre le mal et le bien','Magicien'
  UNION ALL SELECT 'Protection contre le mal et le bien','Paladin'
  UNION ALL SELECT 'Purification de nourriture et d''eau','Clerc'
  UNION ALL SELECT 'Purification de nourriture et d''eau','Druide'
  UNION ALL SELECT 'Purification de nourriture et d''eau','Paladin'
  UNION ALL SELECT 'Sanctuaire','Clerc'
  UNION ALL SELECT 'Baies nourricières','Druide'
  UNION ALL SELECT 'Baies nourricières','Rôdeur'
  UNION ALL SELECT 'Enchevêtrement','Druide'
  UNION ALL SELECT 'Nappe de brouillard','Druide'
  UNION ALL SELECT 'Nappe de brouillard','Ensorceleur'
  UNION ALL SELECT 'Nappe de brouillard','Magicien'
  UNION ALL SELECT 'Nappe de brouillard','Rôdeur'
  UNION ALL SELECT 'Saut','Druide'
  UNION ALL SELECT 'Saut','Ensorceleur'
  UNION ALL SELECT 'Saut','Magicien'
  UNION ALL SELECT 'Saut','Rôdeur'
  UNION ALL SELECT 'Armure de mage','Ensorceleur'
  UNION ALL SELECT 'Armure de mage','Magicien'
  UNION ALL SELECT 'Bouclier','Ensorceleur'
  UNION ALL SELECT 'Bouclier','Magicien'
  UNION ALL SELECT 'Couleurs dansantes','Ensorceleur'
  UNION ALL SELECT 'Couleurs dansantes','Magicien'
  UNION ALL SELECT 'Mains brûlantes','Ensorceleur'
  UNION ALL SELECT 'Mains brûlantes','Magicien'
  UNION ALL SELECT 'Orbe chromatique','Ensorceleur'
  UNION ALL SELECT 'Orbe chromatique','Magicien'
  UNION ALL SELECT 'Projectile magique','Ensorceleur'
  UNION ALL SELECT 'Projectile magique','Magicien'
  UNION ALL SELECT 'Rayon empoisonné','Ensorceleur'
  UNION ALL SELECT 'Rayon empoisonné','Magicien'
  UNION ALL SELECT 'Repli expéditif','Ensorceleur'
  UNION ALL SELECT 'Repli expéditif','Occultiste'
  UNION ALL SELECT 'Repli expéditif','Magicien'
  UNION ALL SELECT 'Simulacre de vie','Ensorceleur'
  UNION ALL SELECT 'Simulacre de vie','Magicien'
  UNION ALL SELECT 'Armure d''Agathys','Occultiste'
  UNION ALL SELECT 'Bras d''Hadar','Occultiste'
  UNION ALL SELECT 'Maléfice','Occultiste'
  UNION ALL SELECT 'Représailles infernales','Occultiste'
  UNION ALL SELECT 'Alarme','Magicien'
  UNION ALL SELECT 'Alarme','Rôdeur'
  UNION ALL SELECT 'Disque flottant de Tenser','Magicien'
  UNION ALL SELECT 'Graisse','Magicien'
  UNION ALL SELECT 'Trouver un familier','Magicien'
  UNION ALL SELECT 'Châtiment ardent','Paladin'
  UNION ALL SELECT 'Châtiment courroucé','Paladin'
  UNION ALL SELECT 'Châtiment tonitruant','Paladin'
  UNION ALL SELECT 'Faveur divine','Paladin'
  UNION ALL SELECT 'Frappe piégeuse','Rôdeur'
  UNION ALL SELECT 'Grêle d''épines','Rôdeur'
  UNION ALL SELECT 'Marque du chasseur','Rôdeur'
  UNION ALL SELECT 'Amélioration de caractéristique','Barde'
  UNION ALL SELECT 'Amélioration de caractéristique','Clerc'
  UNION ALL SELECT 'Amélioration de caractéristique','Druide'
  UNION ALL SELECT 'Amélioration de caractéristique','Ensorceleur'
  UNION ALL SELECT 'Bouche magique','Barde'
  UNION ALL SELECT 'Bouche magique','Magicien'
  UNION ALL SELECT 'Cécité/Surdité','Barde'
  UNION ALL SELECT 'Cécité/Surdité','Clerc'
  UNION ALL SELECT 'Cécité/Surdité','Ensorceleur'
  UNION ALL SELECT 'Cécité/Surdité','Magicien'
  UNION ALL SELECT 'Couronne du dément','Barde'
  UNION ALL SELECT 'Couronne du dément','Ensorceleur'
  UNION ALL SELECT 'Couronne du dément','Occultiste'
  UNION ALL SELECT 'Couronne du dément','Magicien'
  UNION ALL SELECT 'Détection des pensées','Barde'
  UNION ALL SELECT 'Détection des pensées','Ensorceleur'
  UNION ALL SELECT 'Détection des pensées','Magicien'
  UNION ALL SELECT 'Discours captivant','Barde'
  UNION ALL SELECT 'Discours captivant','Occultiste'
  UNION ALL SELECT 'Fracassement','Barde'
  UNION ALL SELECT 'Fracassement','Ensorceleur'
  UNION ALL SELECT 'Fracassement','Occultiste'
  UNION ALL SELECT 'Fracassement','Magicien'
  UNION ALL SELECT 'Immobilisation de personne','Barde'
  UNION ALL SELECT 'Immobilisation de personne','Clerc'
  UNION ALL SELECT 'Immobilisation de personne','Ensorceleur'
  UNION ALL SELECT 'Immobilisation de personne','Occultiste'
  UNION ALL SELECT 'Immobilisation de personne','Magicien'
  UNION ALL SELECT 'Invisibilité','Barde'
  UNION ALL SELECT 'Invisibilité','Ensorceleur'
  UNION ALL SELECT 'Invisibilité','Occultiste'
  UNION ALL SELECT 'Invisibilité','Magicien'
  UNION ALL SELECT 'Localisation d''animaux ou de plantes','Barde'
  UNION ALL SELECT 'Localisation d''animaux ou de plantes','Druide'
  UNION ALL SELECT 'Localisation d''animaux ou de plantes','Rôdeur'
  UNION ALL SELECT 'Localisation d''objet','Barde'
  UNION ALL SELECT 'Localisation d''objet','Clerc'
  UNION ALL SELECT 'Localisation d''objet','Druide'
  UNION ALL SELECT 'Localisation d''objet','Magicien'
  UNION ALL SELECT 'Localisation d''objet','Paladin'
  UNION ALL SELECT 'Localisation d''objet','Rôdeur'
  UNION ALL SELECT 'Messager animal','Barde'
  UNION ALL SELECT 'Messager animal','Druide'
  UNION ALL SELECT 'Messager animal','Rôdeur'
  UNION ALL SELECT 'Métal brûlant','Barde'
  UNION ALL SELECT 'Métal brûlant','Druide'
  UNION ALL SELECT 'Restauration partielle','Barde'
  UNION ALL SELECT 'Restauration partielle','Clerc'
  UNION ALL SELECT 'Restauration partielle','Druide'
  UNION ALL SELECT 'Restauration partielle','Paladin'
  UNION ALL SELECT 'Restauration partielle','Rôdeur'
  UNION ALL SELECT 'Silence','Barde'
  UNION ALL SELECT 'Silence','Clerc'
  UNION ALL SELECT 'Silence','Rôdeur'
  UNION ALL SELECT 'Suggestion','Barde'
  UNION ALL SELECT 'Suggestion','Ensorceleur'
  UNION ALL SELECT 'Suggestion','Occultiste'
  UNION ALL SELECT 'Suggestion','Magicien'
  UNION ALL SELECT 'Zone de vérité','Barde'
  UNION ALL SELECT 'Zone de vérité','Clerc'
  UNION ALL SELECT 'Zone de vérité','Paladin'
  UNION ALL SELECT 'Aide','Clerc'
  UNION ALL SELECT 'Aide','Paladin'
  UNION ALL SELECT 'Arme spirituelle','Clerc'
  UNION ALL SELECT 'Augure','Clerc'
  UNION ALL SELECT 'Flamme éternelle','Clerc'
  UNION ALL SELECT 'Lien de protection','Clerc'
  UNION ALL SELECT 'Préservation des morts','Clerc'
  UNION ALL SELECT 'Préservation des morts','Magicien'
  UNION ALL SELECT 'Prière de guérison','Clerc'
  UNION ALL SELECT 'Protection contre le poison','Clerc'
  UNION ALL SELECT 'Protection contre le poison','Druide'
  UNION ALL SELECT 'Protection contre le poison','Paladin'
  UNION ALL SELECT 'Protection contre le poison','Rôdeur'
  UNION ALL SELECT 'Bourrasque','Druide'
  UNION ALL SELECT 'Bourrasque','Ensorceleur'
  UNION ALL SELECT 'Bourrasque','Magicien'
  UNION ALL SELECT 'Croissance d''épines','Druide'
  UNION ALL SELECT 'Croissance d''épines','Rôdeur'
  UNION ALL SELECT 'Lame de feu','Druide'
  UNION ALL SELECT 'Passage sans trace','Druide'
  UNION ALL SELECT 'Passage sans trace','Rôdeur'
  UNION ALL SELECT 'Peau d''écorce','Druide'
  UNION ALL SELECT 'Peau d''écorce','Rôdeur'
  UNION ALL SELECT 'Rayon de lune','Druide'
  UNION ALL SELECT 'Rayon de lune','Rôdeur'
  UNION ALL SELECT 'Sens animal','Druide'
  UNION ALL SELECT 'Sens animal','Rôdeur'
  UNION ALL SELECT 'Sphère de feu','Druide'
  UNION ALL SELECT 'Trouver des pièges','Druide'
  UNION ALL SELECT 'Trouver des pièges','Rôdeur'
  UNION ALL SELECT 'Vision dans le noir','Druide'
  UNION ALL SELECT 'Vision dans le noir','Ensorceleur'
  UNION ALL SELECT 'Vision dans le noir','Magicien'
  UNION ALL SELECT 'Vision dans le noir','Rôdeur'
  UNION ALL SELECT 'Agrandissement/Rapetissement','Ensorceleur'
  UNION ALL SELECT 'Agrandissement/Rapetissement','Magicien'
  UNION ALL SELECT 'Déblocage','Ensorceleur'
  UNION ALL SELECT 'Déblocage','Magicien'
  UNION ALL SELECT 'Flou','Ensorceleur'
  UNION ALL SELECT 'Flou','Magicien'
  UNION ALL SELECT 'Image miroir','Ensorceleur'
  UNION ALL SELECT 'Image miroir','Occultiste'
  UNION ALL SELECT 'Image miroir','Magicien'
  UNION ALL SELECT 'Lévitation','Ensorceleur'
  UNION ALL SELECT 'Lévitation','Magicien'
  UNION ALL SELECT 'Nuage de dagues','Ensorceleur'
  UNION ALL SELECT 'Nuage de dagues','Occultiste'
  UNION ALL SELECT 'Nuage de dagues','Magicien'
  UNION ALL SELECT 'Pas brumeux','Ensorceleur'
  UNION ALL SELECT 'Pas brumeux','Occultiste'
  UNION ALL SELECT 'Pas brumeux','Magicien'
  UNION ALL SELECT 'Pattes d''araignée','Ensorceleur'
  UNION ALL SELECT 'Pattes d''araignée','Occultiste'
  UNION ALL SELECT 'Pattes d''araignée','Magicien'
  UNION ALL SELECT 'Rayon ardent','Ensorceleur'
  UNION ALL SELECT 'Rayon ardent','Magicien'
  UNION ALL SELECT 'Ténèbres','Ensorceleur'
  UNION ALL SELECT 'Ténèbres','Occultiste'
  UNION ALL SELECT 'Ténèbres','Magicien'
  UNION ALL SELECT 'Toile d''araignée','Ensorceleur'
  UNION ALL SELECT 'Toile d''araignée','Magicien'
  UNION ALL SELECT 'Rayon affaiblissant','Occultiste'
  UNION ALL SELECT 'Rayon affaiblissant','Magicien'
  UNION ALL SELECT 'Arme magique','Magicien'
  UNION ALL SELECT 'Arme magique','Paladin'
  UNION ALL SELECT 'Aura magique de Nystul','Magicien'
  UNION ALL SELECT 'Corde enchantée','Magicien'
  UNION ALL SELECT 'Flèche acide de Melf','Magicien'
  UNION ALL SELECT 'Serrure magique','Magicien'
  UNION ALL SELECT 'Châtiment révélateur','Paladin'
  UNION ALL SELECT 'Cordon de flèches','Rôdeur'
  UNION ALL SELECT 'Antidétection','Barde'
  UNION ALL SELECT 'Antidétection','Magicien'
  UNION ALL SELECT 'Antidétection','Rôdeur'
  UNION ALL SELECT 'Clairvoyance','Barde'
  UNION ALL SELECT 'Clairvoyance','Clerc'
  UNION ALL SELECT 'Clairvoyance','Ensorceleur'
  UNION ALL SELECT 'Clairvoyance','Magicien'
  UNION ALL SELECT 'Communication avec les morts','Barde'
  UNION ALL SELECT 'Communication avec les morts','Clerc'
  UNION ALL SELECT 'Communication avec les plantes','Barde'
  UNION ALL SELECT 'Communication avec les plantes','Druide'
  UNION ALL SELECT 'Communication avec les plantes','Rôdeur'
  UNION ALL SELECT 'Dissipation de la magie','Barde'
  UNION ALL SELECT 'Dissipation de la magie','Clerc'
  UNION ALL SELECT 'Dissipation de la magie','Druide'
  UNION ALL SELECT 'Dissipation de la magie','Ensorceleur'
  UNION ALL SELECT 'Dissipation de la magie','Occultiste'
  UNION ALL SELECT 'Dissipation de la magie','Magicien'
  UNION ALL SELECT 'Dissipation de la magie','Paladin'
  UNION ALL SELECT 'Envoi de message','Barde'
  UNION ALL SELECT 'Envoi de message','Clerc'
  UNION ALL SELECT 'Envoi de message','Magicien'
  UNION ALL SELECT 'Glyphe de garde','Barde'
  UNION ALL SELECT 'Glyphe de garde','Clerc'
  UNION ALL SELECT 'Glyphe de garde','Magicien'
  UNION ALL SELECT 'Image majeure','Barde'
  UNION ALL SELECT 'Image majeure','Ensorceleur'
  UNION ALL SELECT 'Image majeure','Magicien'
  UNION ALL SELECT 'Langues','Barde'
  UNION ALL SELECT 'Langues','Clerc'
  UNION ALL SELECT 'Langues','Ensorceleur'
  UNION ALL SELECT 'Langues','Occultiste'
  UNION ALL SELECT 'Langues','Magicien'
  UNION ALL SELECT 'Malédiction','Barde'
  UNION ALL SELECT 'Malédiction','Clerc'
  UNION ALL SELECT 'Malédiction','Magicien'
  UNION ALL SELECT 'Motif hypnotique','Barde'
  UNION ALL SELECT 'Motif hypnotique','Ensorceleur'
  UNION ALL SELECT 'Motif hypnotique','Occultiste'
  UNION ALL SELECT 'Motif hypnotique','Magicien'
  UNION ALL SELECT 'Petite hutte de Léomund','Barde'
  UNION ALL SELECT 'Petite hutte de Léomund','Magicien'
  UNION ALL SELECT 'Peur','Barde'
  UNION ALL SELECT 'Peur','Ensorceleur'
  UNION ALL SELECT 'Peur','Occultiste'
  UNION ALL SELECT 'Peur','Magicien'
  UNION ALL SELECT 'Animation des morts','Clerc'
  UNION ALL SELECT 'Animation des morts','Magicien'
  UNION ALL SELECT 'Cercle magique','Clerc'
  UNION ALL SELECT 'Cercle magique','Occultiste'
  UNION ALL SELECT 'Cercle magique','Magicien'
  UNION ALL SELECT 'Cercle magique','Paladin'
  UNION ALL SELECT 'Création de nourriture et d''eau','Clerc'
  UNION ALL SELECT 'Création de nourriture et d''eau','Paladin'
  UNION ALL SELECT 'Délivrance des malédictions','Clerc'
  UNION ALL SELECT 'Délivrance des malédictions','Occultiste'
  UNION ALL SELECT 'Délivrance des malédictions','Magicien'
  UNION ALL SELECT 'Délivrance des malédictions','Paladin'
  UNION ALL SELECT 'Esprits gardiens','Clerc'
  UNION ALL SELECT 'Fusion dans la pierre','Clerc'
  UNION ALL SELECT 'Fusion dans la pierre','Druide'
  UNION ALL SELECT 'Lumière du jour','Clerc'
  UNION ALL SELECT 'Lumière du jour','Druide'
  UNION ALL SELECT 'Lumière du jour','Ensorceleur'
  UNION ALL SELECT 'Lumière du jour','Paladin'
  UNION ALL SELECT 'Lumière du jour','Rôdeur'
  UNION ALL SELECT 'Marche sur l''eau','Clerc'
  UNION ALL SELECT 'Marche sur l''eau','Druide'
  UNION ALL SELECT 'Marche sur l''eau','Ensorceleur'
  UNION ALL SELECT 'Marche sur l''eau','Rôdeur'
  UNION ALL SELECT 'Mot de guérison de groupe','Clerc'
  UNION ALL SELECT 'Protection contre une énergie','Clerc'
  UNION ALL SELECT 'Protection contre une énergie','Druide'
  UNION ALL SELECT 'Protection contre une énergie','Ensorceleur'
  UNION ALL SELECT 'Protection contre une énergie','Magicien'
  UNION ALL SELECT 'Protection contre une énergie','Rôdeur'
  UNION ALL SELECT 'Retour à la vie','Clerc'
  UNION ALL SELECT 'Retour à la vie','Paladin'
  UNION ALL SELECT 'Appel de la foudre','Druide'
  UNION ALL SELECT 'Croissance végétale','Druide'
  UNION ALL SELECT 'Croissance végétale','Rôdeur'
  UNION ALL SELECT 'Invocation d''animaux','Druide'
  UNION ALL SELECT 'Mur de vent','Druide'
  UNION ALL SELECT 'Mur de vent','Rôdeur'
  UNION ALL SELECT 'Respiration aquatique','Druide'
  UNION ALL SELECT 'Respiration aquatique','Ensorceleur'
  UNION ALL SELECT 'Respiration aquatique','Magicien'
  UNION ALL SELECT 'Respiration aquatique','Rôdeur'
  UNION ALL SELECT 'Tempête de neige','Druide'
  UNION ALL SELECT 'Tempête de neige','Ensorceleur'
  UNION ALL SELECT 'Tempête de neige','Magicien'
  UNION ALL SELECT 'Boule de feu','Ensorceleur'
  UNION ALL SELECT 'Boule de feu','Magicien'
  UNION ALL SELECT 'Clignotement','Ensorceleur'
  UNION ALL SELECT 'Clignotement','Magicien'
  UNION ALL SELECT 'Contresort','Ensorceleur'
  UNION ALL SELECT 'Contresort','Occultiste'
  UNION ALL SELECT 'Contresort','Magicien'
  UNION ALL SELECT 'Éclair','Ensorceleur'
  UNION ALL SELECT 'Éclair','Magicien'
  UNION ALL SELECT 'Forme gazeuse','Ensorceleur'
  UNION ALL SELECT 'Forme gazeuse','Occultiste'
  UNION ALL SELECT 'Forme gazeuse','Magicien'
  UNION ALL SELECT 'Hâte','Ensorceleur'
  UNION ALL SELECT 'Hâte','Magicien'
  UNION ALL SELECT 'Lenteur','Ensorceleur'
  UNION ALL SELECT 'Lenteur','Magicien'
  UNION ALL SELECT 'Nuage nauséabond','Ensorceleur'
  UNION ALL SELECT 'Nuage nauséabond','Magicien'
  UNION ALL SELECT 'Vol','Ensorceleur'
  UNION ALL SELECT 'Vol','Occultiste'
  UNION ALL SELECT 'Vol','Magicien'
  UNION ALL SELECT 'Faim de Hadar','Occultiste'
  UNION ALL SELECT 'Toucher vampirique','Occultiste'
  UNION ALL SELECT 'Toucher vampirique','Magicien'
  UNION ALL SELECT 'Monture fantôme','Magicien'
  UNION ALL SELECT 'Arme élémentaire','Paladin'
  UNION ALL SELECT 'Aura de vitalité','Paladin'
  UNION ALL SELECT 'Châtiment aveuglant','Paladin'
  UNION ALL SELECT 'Manteau du croisé','Paladin'
  UNION ALL SELECT 'Flèche de foudre','Rôdeur'
  UNION ALL SELECT 'Tir de barrage','Rôdeur'
  UNION ALL SELECT 'Compulsion','Barde'
  UNION ALL SELECT 'Confusion','Barde'
  UNION ALL SELECT 'Confusion','Druide'
  UNION ALL SELECT 'Confusion','Ensorceleur'
  UNION ALL SELECT 'Confusion','Magicien'
  UNION ALL SELECT 'Invisibilité supérieure','Barde'
  UNION ALL SELECT 'Invisibilité supérieure','Ensorceleur'
  UNION ALL SELECT 'Invisibilité supérieure','Magicien'
  UNION ALL SELECT 'Liberté de mouvement','Barde'
  UNION ALL SELECT 'Liberté de mouvement','Clerc'
  UNION ALL SELECT 'Liberté de mouvement','Druide'
  UNION ALL SELECT 'Localisation de créature','Barde'
  UNION ALL SELECT 'Localisation de créature','Clerc'
  UNION ALL SELECT 'Localisation de créature','Druide'
  UNION ALL SELECT 'Localisation de créature','Magicien'
  UNION ALL SELECT 'Métamorphose','Barde'
  UNION ALL SELECT 'Métamorphose','Druide'
  UNION ALL SELECT 'Métamorphose','Ensorceleur'
  UNION ALL SELECT 'Métamorphose','Magicien'
  UNION ALL SELECT 'Porte dimensionnelle','Barde'
  UNION ALL SELECT 'Porte dimensionnelle','Ensorceleur'
  UNION ALL SELECT 'Porte dimensionnelle','Occultiste'
  UNION ALL SELECT 'Porte dimensionnelle','Magicien'
  UNION ALL SELECT 'Terrain hallucinatoire','Barde'
  UNION ALL SELECT 'Terrain hallucinatoire','Druide'
  UNION ALL SELECT 'Terrain hallucinatoire','Occultiste'
  UNION ALL SELECT 'Terrain hallucinatoire','Magicien'
  UNION ALL SELECT 'Bannissement','Clerc'
  UNION ALL SELECT 'Bannissement','Ensorceleur'
  UNION ALL SELECT 'Bannissement','Occultiste'
  UNION ALL SELECT 'Bannissement','Magicien'
  UNION ALL SELECT 'Contrôle de l''eau','Clerc'
  UNION ALL SELECT 'Contrôle de l''eau','Druide'
  UNION ALL SELECT 'Contrôle de l''eau','Magicien'
  UNION ALL SELECT 'Divination','Clerc'
  UNION ALL SELECT 'Façonnage de la pierre','Clerc'
  UNION ALL SELECT 'Façonnage de la pierre','Druide'
  UNION ALL SELECT 'Façonnage de la pierre','Magicien'
  UNION ALL SELECT 'Gardien de la foi','Clerc'
  UNION ALL SELECT 'Protection contre la mort','Clerc'
  UNION ALL SELECT 'Domination de bête','Druide'
  UNION ALL SELECT 'Domination de bête','Ensorceleur'
  UNION ALL SELECT 'Flétrissement','Druide'
  UNION ALL SELECT 'Flétrissement','Ensorceleur'
  UNION ALL SELECT 'Flétrissement','Occultiste'
  UNION ALL SELECT 'Flétrissement','Magicien'
  UNION ALL SELECT 'Insecte géant','Druide'
  UNION ALL SELECT 'Invocation d''élémentaires mineurs','Druide'
  UNION ALL SELECT 'Invocation d''élémentaires mineurs','Magicien'
  UNION ALL SELECT 'Invocation d''êtres des bois','Druide'
  UNION ALL SELECT 'Mur de feu','Druide'
  UNION ALL SELECT 'Mur de feu','Ensorceleur'
  UNION ALL SELECT 'Mur de feu','Magicien'
  UNION ALL SELECT 'Peau de pierre','Druide'
  UNION ALL SELECT 'Peau de pierre','Ensorceleur'
  UNION ALL SELECT 'Peau de pierre','Magicien'
  UNION ALL SELECT 'Tempête de grêle','Druide'
  UNION ALL SELECT 'Tempête de grêle','Ensorceleur'
  UNION ALL SELECT 'Tempête de grêle','Magicien'
  UNION ALL SELECT 'Assassin imaginaire','Magicien'
  UNION ALL SELECT 'Bouclier de feu','Magicien'
  UNION ALL SELECT 'Chien de garde de Mordenkainen','Magicien'
  UNION ALL SELECT 'Coffre secret de Léomund','Magicien'
  UNION ALL SELECT 'Fabrication','Magicien'
  UNION ALL SELECT 'Œil magique','Magicien'
  UNION ALL SELECT 'Sanctuaire privé de Mordenkainen','Magicien'
  UNION ALL SELECT 'Sphère résiliente d''Otiluke','Magicien'
  UNION ALL SELECT 'Tentacules noirs d''Evard','Magicien'
  UNION ALL SELECT 'Animation des objets','Barde'
  UNION ALL SELECT 'Animation des objets','Ensorceleur'
  UNION ALL SELECT 'Animation des objets','Magicien'
  UNION ALL SELECT 'Apparence trompeuse','Barde'
  UNION ALL SELECT 'Apparence trompeuse','Ensorceleur'
  UNION ALL SELECT 'Apparence trompeuse','Magicien'
  UNION ALL SELECT 'Cercle de téléportation','Barde'
  UNION ALL SELECT 'Cercle de téléportation','Ensorceleur'
  UNION ALL SELECT 'Cercle de téléportation','Magicien'
  UNION ALL SELECT 'Domination de personne','Barde'
  UNION ALL SELECT 'Domination de personne','Ensorceleur'
  UNION ALL SELECT 'Domination de personne','Magicien'
  UNION ALL SELECT 'Éveil','Barde'
  UNION ALL SELECT 'Éveil','Druide'
  UNION ALL SELECT 'Immobilisation de monstre','Barde'
  UNION ALL SELECT 'Immobilisation de monstre','Ensorceleur'
  UNION ALL SELECT 'Immobilisation de monstre','Occultiste'
  UNION ALL SELECT 'Immobilisation de monstre','Magicien'
  UNION ALL SELECT 'Lien planaire','Barde'
  UNION ALL SELECT 'Lien planaire','Clerc'
  UNION ALL SELECT 'Lien planaire','Druide'
  UNION ALL SELECT 'Lien planaire','Magicien'
  UNION ALL SELECT 'Modification de mémoire','Barde'
  UNION ALL SELECT 'Modification de mémoire','Magicien'
  UNION ALL SELECT 'Mythes et légendes','Barde'
  UNION ALL SELECT 'Mythes et légendes','Clerc'
  UNION ALL SELECT 'Mythes et légendes','Magicien'
  UNION ALL SELECT 'Quête','Barde'
  UNION ALL SELECT 'Quête','Clerc'
  UNION ALL SELECT 'Quête','Druide'
  UNION ALL SELECT 'Quête','Magicien'
  UNION ALL SELECT 'Rappel à la vie','Barde'
  UNION ALL SELECT 'Rappel à la vie','Clerc'
  UNION ALL SELECT 'Restauration supérieure','Barde'
  UNION ALL SELECT 'Restauration supérieure','Clerc'
  UNION ALL SELECT 'Restauration supérieure','Druide'
  UNION ALL SELECT 'Rêve','Barde'
  UNION ALL SELECT 'Rêve','Occultiste'
  UNION ALL SELECT 'Rêve','Magicien'
  UNION ALL SELECT 'Scrutation','Barde'
  UNION ALL SELECT 'Scrutation','Clerc'
  UNION ALL SELECT 'Scrutation','Druide'
  UNION ALL SELECT 'Scrutation','Occultiste'
  UNION ALL SELECT 'Scrutation','Magicien'
  UNION ALL SELECT 'Soins de groupe','Barde'
  UNION ALL SELECT 'Soins de groupe','Clerc'
  UNION ALL SELECT 'Soins de groupe','Druide'
  UNION ALL SELECT 'Colonne de flamme','Clerc'
  UNION ALL SELECT 'Communion','Clerc'
  UNION ALL SELECT 'Contagion','Clerc'
  UNION ALL SELECT 'Contagion','Druide'
  UNION ALL SELECT 'Dissipation du mal et du bien','Clerc'
  UNION ALL SELECT 'Fléau d''insectes','Clerc'
  UNION ALL SELECT 'Fléau d''insectes','Druide'
  UNION ALL SELECT 'Fléau d''insectes','Ensorceleur'
  UNION ALL SELECT 'Sanctification','Clerc'
  UNION ALL SELECT 'Communion avec la nature','Druide'
  UNION ALL SELECT 'Invocation d''élémentaire','Druide'
  UNION ALL SELECT 'Mur de pierre','Druide'
  UNION ALL SELECT 'Mur de pierre','Ensorceleur'
  UNION ALL SELECT 'Mur de pierre','Magicien'
  UNION ALL SELECT 'Passage par les arbres','Druide'
  UNION ALL SELECT 'Réincarnation','Druide'
  UNION ALL SELECT 'Cône de froid','Ensorceleur'
  UNION ALL SELECT 'Cône de froid','Magicien'
  UNION ALL SELECT 'Création','Ensorceleur'
  UNION ALL SELECT 'Création','Magicien'
  UNION ALL SELECT 'Nuage mortel','Ensorceleur'
  UNION ALL SELECT 'Nuage mortel','Magicien'
  UNION ALL SELECT 'Télékinésie','Ensorceleur'
  UNION ALL SELECT 'Télékinésie','Magicien'
  UNION ALL SELECT 'Contact avec un autre plan','Occultiste'
  UNION ALL SELECT 'Contact avec un autre plan','Magicien'
  UNION ALL SELECT 'Double illusoire','Magicien'
  UNION ALL SELECT 'Lien télépathique de Rary','Magicien'
  UNION ALL SELECT 'Main de Bigby','Magicien'
  UNION ALL SELECT 'Mur de force','Magicien'
  UNION ALL SELECT 'Passe-muraille','Magicien'
) v JOIN sorts s ON s.nom=v.sn JOIN classes c ON c.nom=v.cn;

INSERT INTO modeles_creatures (nom,role,type,fp,donnees) VALUES
  ('Gobelin','ennemi','Humanoïde (gobelinoïde)','1/4','{"role":"ennemi","size":"Petite (P)","type":"Humanoïde (gobelinoïde)","align":"Neutre mauvais","ac":15,"acTxt":"armure de cuir, bouclier","hp":"2d6","speed":"9 m","cr":"1/4","ab":{"FOR":8,"DEX":14,"CON":10,"INT":10,"SAG":8,"CHA":8},"saves":[],"skills":{"Discrétion":2},"vuln":"","res":"","immun":"","condImm":"","senses":"vision dans le noir 18 m","langs":"commun, gobelin","traits":[{"n":"Fuite agile","t":"Le gobelin peut se désengager ou se cacher par une action bonus à chacun de ses tours."}],"actions":[{"n":"Cimeterre","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d6","dtype":"tranchants","extra":""},{"n":"Arc court","kind":"ranged","ab":"DEX","range":"portée 24/96 m","dice":"1d6","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Gobelin"}'),
  ('Kobold','ennemi','Humanoïde (kobold)','1/8','{"role":"ennemi","size":"Petite (P)","type":"Humanoïde (kobold)","align":"Loyal mauvais","ac":12,"acTxt":"","hp":"2d6-2","speed":"9 m","cr":"1/8","ab":{"FOR":7,"DEX":15,"CON":9,"INT":8,"SAG":7,"CHA":8},"saves":[],"skills":{},"vuln":"","res":"","immun":"","condImm":"","senses":"vision dans le noir 18 m","langs":"commun, draconique","traits":[{"n":"Sensibilité au soleil","t":"En plein soleil, désavantage aux jets d''attaque et aux tests de Sagesse (Perception) basés sur la vue."},{"n":"Tactique de groupe","t":"Avantage à l''attaque contre une créature si un allié non neutralisé du kobold se trouve à 1,50 m d''elle."}],"actions":[{"n":"Dague","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d4","dtype":"perforants","extra":""},{"n":"Fronde","kind":"ranged","ab":"DEX","range":"portée 9/36 m","dice":"1d4","dtype":"contondants","extra":""}],"reactions":[],"notes":"","name":"Kobold"}'),
  ('Bandit','ennemi','Humanoïde','1/8','{"role":"ennemi","size":"Moyenne (M)","type":"Humanoïde","align":"Chaotique neutre","ac":12,"acTxt":"armure de cuir","hp":"2d8+2","speed":"9 m","cr":"1/8","ab":{"FOR":11,"DEX":12,"CON":12,"INT":10,"SAG":10,"CHA":10},"saves":[],"skills":{},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun","traits":[],"actions":[{"n":"Cimeterre","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d6","dtype":"tranchants","extra":""},{"n":"Arbalète légère","kind":"ranged","ab":"DEX","range":"portée 24/96 m","dice":"1d8","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Bandit"}'),
  ('Garde','neutre','Humanoïde','1/8','{"role":"neutre","size":"Moyenne (M)","type":"Humanoïde","align":"Loyal neutre","ac":16,"acTxt":"chemise de mailles, bouclier","hp":"2d8+2","speed":"9 m","cr":"1/8","ab":{"FOR":13,"DEX":12,"CON":12,"INT":10,"SAG":11,"CHA":10},"saves":[],"skills":{"Perception":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun","traits":[],"actions":[{"n":"Lance","kind":"melee","ab":"FOR","range":"allonge 1,50 m ou portée 6/18 m","dice":"1d6","dtype":"perforants","extra":"ou 1d8 + FOR à deux mains"}],"reactions":[],"notes":"","name":"Garde"}'),
  ('Cultiste','ennemi','Humanoïde','1/8','{"role":"ennemi","size":"Moyenne (M)","type":"Humanoïde","align":"Chaotique mauvais","ac":12,"acTxt":"armure de cuir","hp":"2d8","speed":"9 m","cr":"1/8","ab":{"FOR":11,"DEX":12,"CON":10,"INT":10,"SAG":11,"CHA":10},"saves":[],"skills":{"Tromperie":1,"Religion":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun","traits":[{"n":"Dévotion obscure","t":"Avantage aux jets de sauvegarde contre les effets de charme et de peur."}],"actions":[{"n":"Cimeterre","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d6","dtype":"tranchants","extra":""}],"reactions":[],"notes":"","name":"Cultiste"}'),
  ('Loup','ennemi','Bête','1/4','{"role":"ennemi","size":"Moyenne (M)","type":"Bête","align":"Sans alignement","ac":13,"acTxt":"armure naturelle","hp":"2d8+2","speed":"12 m","cr":"1/4","ab":{"FOR":12,"DEX":15,"CON":12,"INT":3,"SAG":12,"CHA":6},"saves":[],"skills":{"Perception":1,"Discrétion":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"","traits":[{"n":"Ouïe et odorat aiguisés","t":"Avantage aux tests de Sagesse (Perception) basés sur l''ouïe ou l''odorat."},{"n":"Tactique de groupe","t":"Avantage à l''attaque contre une créature si un allié non neutralisé du loup se trouve à 1,50 m d''elle."}],"actions":[{"n":"Morsure","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"2d4","dtype":"perforants","extra":"Si la cible est une créature, elle doit réussir une sauvegarde de Force DD 11 ou tomber à terre."}],"reactions":[],"notes":"","name":"Loup"}'),
  ('Squelette','ennemi','Mort-vivant','1/4','{"role":"ennemi","size":"Moyenne (M)","type":"Mort-vivant","align":"Loyal mauvais","ac":13,"acTxt":"restes d''armure","hp":"2d8+4","speed":"9 m","cr":"1/4","ab":{"FOR":10,"DEX":14,"CON":15,"INT":6,"SAG":8,"CHA":5},"saves":[],"skills":{},"vuln":"contondants","res":"","immun":"poison","condImm":"empoisonné, épuisé","senses":"vision dans le noir 18 m","langs":"comprend les langues qu''il connaissait de son vivant mais ne peut pas parler","traits":[],"actions":[{"n":"Épée courte","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d6","dtype":"perforants","extra":""},{"n":"Arc court","kind":"ranged","ab":"DEX","range":"portée 24/96 m","dice":"1d6","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Squelette"}'),
  ('Zombie','ennemi','Mort-vivant','1/4','{"role":"ennemi","size":"Moyenne (M)","type":"Mort-vivant","align":"Neutre mauvais","ac":8,"acTxt":"","hp":"3d8+9","speed":"6 m","cr":"1/4","ab":{"FOR":13,"DEX":6,"CON":16,"INT":3,"SAG":6,"CHA":5},"saves":["SAG"],"skills":{},"vuln":"","res":"","immun":"poison","condImm":"empoisonné","senses":"vision dans le noir 18 m","langs":"comprend les langues qu''il connaissait de son vivant mais ne peut pas parler","traits":[{"n":"Ténacité des morts-vivants","t":"Si des dégâts font tomber le zombie à 0 PV, il fait une sauvegarde de Constitution DD 5 + dégâts subis, sauf contre des dégâts radiants ou un coup critique. En cas de réussite, il tombe à 1 PV à la place."}],"actions":[{"n":"Coup","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d6","dtype":"contondants","extra":""}],"reactions":[],"notes":"","name":"Zombie"}'),
  ('Orc','ennemi','Humanoïde (orc)','1/2','{"role":"ennemi","size":"Moyenne (M)","type":"Humanoïde (orc)","align":"Chaotique mauvais","ac":13,"acTxt":"armure de peaux","hp":"2d8+6","speed":"9 m","cr":"1/2","ab":{"FOR":16,"DEX":12,"CON":16,"INT":7,"SAG":11,"CHA":10},"saves":[],"skills":{"Intimidation":1},"vuln":"","res":"","immun":"","condImm":"","senses":"vision dans le noir 18 m","langs":"commun, orc","traits":[{"n":"Agressif","t":"Par une action bonus, l''orc peut se déplacer jusqu''à sa vitesse vers une créature hostile qu''il voit."}],"actions":[{"n":"Hache à deux mains","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d12","dtype":"tranchants","extra":""},{"n":"Javeline","kind":"melee","ab":"FOR","range":"allonge 1,50 m ou portée 9/36 m","dice":"1d6","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Orc"}'),
  ('Hobgobelin','ennemi','Humanoïde (gobelinoïde)','1/2','{"role":"ennemi","size":"Moyenne (M)","type":"Humanoïde (gobelinoïde)","align":"Loyal mauvais","ac":18,"acTxt":"cotte de mailles, bouclier","hp":"2d8+2","speed":"9 m","cr":"1/2","ab":{"FOR":13,"DEX":12,"CON":12,"INT":10,"SAG":10,"CHA":9},"saves":[],"skills":{},"vuln":"","res":"","immun":"","condImm":"","senses":"vision dans le noir 18 m","langs":"commun, gobelin","traits":[{"n":"Avantage martial","t":"Une fois par tour, +7 (2d6) dégâts à une créature touchée par une attaque d''arme si un allié non neutralisé du hobgobelin se trouve à 1,50 m d''elle."}],"actions":[{"n":"Épée longue","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d8","dtype":"tranchants","extra":"ou 1d10 + FOR à deux mains"},{"n":"Arc long","kind":"ranged","ab":"DEX","range":"portée 45/180 m","dice":"1d8","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Hobgobelin"}'),
  ('Araignée géante','ennemi','Bête','1','{"role":"ennemi","size":"Grande (G)","type":"Bête","align":"Sans alignement","ac":14,"acTxt":"armure naturelle","hp":"4d10+4","speed":"9 m, escalade 9 m","cr":"1","ab":{"FOR":14,"DEX":16,"CON":12,"INT":2,"SAG":11,"CHA":4},"saves":[],"skills":{"Discrétion":2},"vuln":"","res":"","immun":"","condImm":"","senses":"vision aveugle 3 m, vision dans le noir 18 m","langs":"","traits":[{"n":"Pattes d''araignée","t":"Escalade les surfaces difficiles, y compris au plafond, sans test."},{"n":"Sens de la toile","t":"En contact avec une toile, connaît la position de toute créature qui la touche."},{"n":"Marche sur les toiles","t":"Ignore les restrictions de mouvement dues aux toiles."}],"actions":[{"n":"Morsure","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d8","dtype":"perforants","extra":"La cible fait une sauvegarde de Constitution DD 11 : 9 (2d8) dégâts de poison en cas d''échec, moitié en cas de réussite."},{"n":"Toile (recharge 5–6)","kind":"autre","ab":"FOR","range":"","dice":"","dtype":"","extra":"Attaque à distance +5, portée 9/18 m. Cible entravée par la toile (Force DD 12 pour s''en libérer, la toile a CA 10, 5 PV)."}],"reactions":[],"notes":"","name":"Araignée géante"}'),
  ('Ours brun','ennemi','Bête','1','{"role":"ennemi","size":"Grande (G)","type":"Bête","align":"Sans alignement","ac":11,"acTxt":"armure naturelle","hp":"4d10+12","speed":"12 m, escalade 9 m","cr":"1","ab":{"FOR":19,"DEX":10,"CON":16,"INT":2,"SAG":13,"CHA":7},"saves":[],"skills":{"Perception":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"","traits":[{"n":"Odorat aiguisé","t":"Avantage aux tests de Sagesse (Perception) basés sur l''odorat."}],"actions":[{"n":"Attaques multiples","kind":"autre","ab":"FOR","range":"","dice":"","dtype":"","extra":"L''ours fait deux attaques : une de morsure et une de griffes."},{"n":"Morsure","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d8","dtype":"perforants","extra":""},{"n":"Griffes","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"2d6","dtype":"tranchants","extra":""}],"reactions":[],"notes":"","name":"Ours brun"}'),
  ('Ogre','ennemi','Géant','2','{"role":"ennemi","size":"Grande (G)","type":"Géant","align":"Chaotique mauvais","ac":11,"acTxt":"armure de peaux","hp":"7d10+21","speed":"12 m","cr":"2","ab":{"FOR":19,"DEX":8,"CON":16,"INT":5,"SAG":7,"CHA":7},"saves":[],"skills":{},"vuln":"","res":"","immun":"","condImm":"","senses":"vision dans le noir 18 m","langs":"commun, géant","traits":[],"actions":[{"n":"Massue","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"2d8","dtype":"contondants","extra":""},{"n":"Javeline","kind":"melee","ab":"FOR","range":"allonge 1,50 m ou portée 9/36 m","dice":"2d6","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Ogre"}'),
  ('Capitaine bandit','ennemi','Humanoïde','2','{"role":"ennemi","size":"Moyenne (M)","type":"Humanoïde","align":"Chaotique neutre","ac":15,"acTxt":"armure de cuir clouté","hp":"10d8+20","speed":"9 m","cr":"2","ab":{"FOR":15,"DEX":16,"CON":14,"INT":14,"SAG":11,"CHA":14},"saves":["FOR","DEX","SAG"],"skills":{"Athlétisme":1,"Tromperie":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun, une autre langue","traits":[],"actions":[{"n":"Attaques multiples","kind":"autre","ab":"FOR","range":"","dice":"","dtype":"","extra":"Le capitaine fait trois attaques : deux au cimeterre et une à la dague. Ou deux attaques à distance avec ses dagues."},{"n":"Cimeterre","kind":"melee","ab":"DEX","range":"allonge 1,50 m","dice":"1d6","dtype":"tranchants","extra":""},{"n":"Dague","kind":"melee","ab":"DEX","range":"allonge 1,50 m ou portée 6/18 m","dice":"1d4","dtype":"perforants","extra":""}],"reactions":[{"n":"Parade","t":"+2 à la CA contre une attaque au corps-à-corps qui le toucherait, s''il voit l''attaquant et tient une arme de corps-à-corps."}],"notes":"","name":"Capitaine bandit"}'),
  ('Acolyte (soigneur)','allie','Humanoïde','1/4','{"role":"allie","size":"Moyenne (M)","type":"Humanoïde","align":"Neutre bon","ac":10,"acTxt":"","hp":"2d8","speed":"9 m","cr":"1/4","ab":{"FOR":10,"DEX":10,"CON":10,"INT":10,"SAG":14,"CHA":11},"saves":[],"skills":{"Médecine":1,"Religion":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun","traits":[{"n":"Incantation","t":"Lanceur de sorts de niveau 1 (Sagesse, DD 12, +4 au toucher). Tours de magie : lumière, flamme sacrée, thaumaturgie. Niveau 1 (3 emplacements) : bénédiction, soins, sanctuaire."}],"actions":[{"n":"Gourdin","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d4","dtype":"contondants","extra":""}],"reactions":[],"notes":"","name":"Acolyte"}'),
  ('Vétéran (garde du corps)','allie','Humanoïde','3','{"role":"allie","size":"Moyenne (M)","type":"Humanoïde","align":"Loyal neutre","ac":17,"acTxt":"clibanion","hp":"9d8+18","speed":"9 m","cr":"3","ab":{"FOR":16,"DEX":13,"CON":14,"INT":10,"SAG":11,"CHA":10},"saves":[],"skills":{"Athlétisme":1,"Perception":1},"vuln":"","res":"","immun":"","condImm":"","senses":"","langs":"commun","traits":[],"actions":[{"n":"Attaques multiples","kind":"autre","ab":"FOR","range":"","dice":"","dtype":"","extra":"Le vétéran fait deux attaques à l''épée longue. S''il a dégainé son épée courte, il peut aussi faire une attaque à l''épée courte."},{"n":"Épée longue","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d8","dtype":"tranchants","extra":"ou 1d10 + FOR à deux mains"},{"n":"Épée courte","kind":"melee","ab":"FOR","range":"allonge 1,50 m","dice":"1d6","dtype":"perforants","extra":""},{"n":"Arbalète lourde","kind":"ranged","ab":"DEX","range":"portée 30/120 m","dice":"1d10","dtype":"perforants","extra":""}],"reactions":[],"notes":"","name":"Vétéran"}');

INSERT INTO objets_magiques (nom,type,rarete,harmonisation,effet,mods) VALUES
  ('Potion de soins','Potion','commune',0,'Rend 2d4 + 2 PV.','{"heal":"2d4+2"}'),
  ('Potion de soins supérieurs','Potion','peu commune',0,'Rend 4d4 + 4 PV.','{"heal":"4d4+4"}'),
  ('Potion de soins puissants','Potion','rare',0,'Rend 8d4 + 8 PV.','{"heal":"8d4+8"}'),
  ('Potion de soins suprêmes','Potion','très rare',0,'Rend 10d4 + 20 PV.','{"heal":"10d4+20"}'),
  ('Potion d''escalade','Potion','commune',0,'Vitesse d''escalade égale à ta vitesse et avantage en Athlétisme pour grimper pendant 1 h.',NULL),
  ('Potion de respiration aquatique','Potion','peu commune',0,'Respirer sous l''eau pendant 1 h.',NULL),
  ('Potion de résistance','Potion','peu commune',0,'Résistance à un type de dégâts pendant 1 h.',NULL),
  ('Potion de force de géant des collines','Potion','peu commune',0,'FOR 21 pendant 1 h.',NULL),
  ('Potion d''héroïsme','Potion','rare',0,'10 PV temporaires et l''effet de Bénédiction pendant 1 h.',NULL),
  ('Potion d''invisibilité','Potion','très rare',0,'Invisible pendant 1 h, jusqu''à ce que tu attaques ou lances un sort.',NULL),
  ('Potion de vol','Potion','très rare',0,'Vitesse de vol égale à ta vitesse pendant 1 h.',NULL),
  ('Potion de rapidité','Potion','très rare',0,'Effet de Hâte pendant 1 min, sans concentration.',NULL),
  ('Antidote','Potion','commune',0,'Avantage aux sauvegardes contre le poison pendant 1 h.',NULL),
  ('Arme +1','Arme','peu commune',0,'+1 aux jets d''attaque et de dégâts avec cette arme.','{"weapon":1}'),
  ('Arme +2','Arme','rare',0,'+2 aux jets d''attaque et de dégâts avec cette arme.','{"weapon":2}'),
  ('Arme +3','Arme','très rare',0,'+3 aux jets d''attaque et de dégâts avec cette arme.','{"weapon":3}'),
  ('Langue de feu','Arme','rare',1,'Action bonus : la lame s''enflamme, +2d6 feu aux dégâts et lumière sur 12 m.',NULL),
  ('Arme vicieuse','Arme','rare',0,'Sur un 20 naturel, +7 dégâts du type de l''arme.',NULL),
  ('Javeline de foudre','Arme','peu commune',0,'1 fois par jour : se transforme en éclair, ligne de 36 m, 4d6 foudre (DEX 13).',NULL),
  ('Munitions +1 (×10)','Arme','peu commune',0,'+1 aux jets d''attaque et de dégâts, détruites après avoir touché.',NULL),
  ('Armure +1','Armure','rare',0,'+1 à la CA quand tu portes cette armure.','{"armor":1}'),
  ('Armure +2','Armure','très rare',0,'+2 à la CA quand tu portes cette armure.','{"armor":2}'),
  ('Bouclier +1','Armure','peu commune',0,'+1 à la CA en plus du bonus normal du bouclier.','{"shield":1}'),
  ('Bouclier +2','Armure','rare',0,'+2 à la CA en plus du bonus normal du bouclier.','{"shield":2}'),
  ('Armure de résistance','Armure','rare',1,'Résistance à un type de dégâts (feu, froid, foudre…).',NULL),
  ('Armure en mithral','Armure','peu commune',0,'Pas de désavantage en Discrétion, pas de Force minimale.',NULL),
  ('Anneau de protection','Anneau','rare',1,'+1 à la CA et aux jets de sauvegarde.','{"ac":1,"save":1}'),
  ('Anneau de résistance','Anneau','rare',1,'Résistance à un type de dégâts lié à la pierre de l''anneau.',NULL),
  ('Anneau de saut','Anneau','peu commune',1,'Saut à volonté (distance de saut triplée).',NULL),
  ('Anneau de nage','Anneau','peu commune',0,'Vitesse de nage de 12 m.',NULL),
  ('Anneau de chaleur constante','Anneau','peu commune',1,'Résistance au froid, à l''aise par grand froid.',NULL),
  ('Anneau d''action libre','Anneau','rare',1,'Le terrain difficile ne ralentit pas, immunisé à la paralysie et à l''entrave magiques.',NULL),
  ('Anneau d''esquive totale','Anneau','rare',1,'3 charges : réaction, réussir une sauvegarde de DEX ratée.',NULL),
  ('Cape de protection','Objet merveilleux','peu commune',1,'+1 à la CA et aux jets de sauvegarde.','{"ac":1,"save":1}'),
  ('Bracelets de défense','Objet merveilleux','rare',1,'+2 à la CA si tu ne portes ni armure ni bouclier.','{"acNoArmor":2}'),
  ('Gantelets de puissance d''ogre','Objet merveilleux','peu commune',1,'Ta Force passe à 19.','{"set":{"FOR":19}}'),
  ('Amulette de santé','Objet merveilleux','rare',1,'Ta Constitution passe à 19.','{"set":{"CON":19}}'),
  ('Bandeau d''intellect','Objet merveilleux','peu commune',1,'Ton Intelligence passe à 19.','{"set":{"INT":19}}'),
  ('Pierre porte-bonheur','Objet merveilleux','peu commune',1,'+1 aux tests de caractéristique et aux jets de sauvegarde.','{"save":1,"check":1}'),
  ('Bottes elfiques','Objet merveilleux','peu commune',0,'Tes pas sont silencieux : avantage en Discrétion pour te déplacer sans bruit.',NULL),
  ('Cape elfique','Objet merveilleux','peu commune',1,'Avantage en Discrétion, désavantage pour te repérer à la vue.',NULL),
  ('Bottes de rapidité','Objet merveilleux','rare',1,'Action bonus : vitesse doublée et attaques d''opportunité désavantagées, 10 min par jour.',NULL),
  ('Bottes de sept lieues','Objet merveilleux','peu commune',1,'Vitesse de marche 9 m, saut triplé.',NULL),
  ('Lunettes de nuit','Objet merveilleux','peu commune',0,'Vision dans le noir à 18 m.',NULL),
  ('Sac sans fond','Objet merveilleux','peu commune',0,'Contient jusqu''à 250 kg dans un espace extradimensionnel, pèse toujours 7,5 kg.',NULL),
  ('Broche de bouclier','Objet merveilleux','peu commune',1,'Résistance aux dégâts de force, immunité à Projectile magique.',NULL),
  ('Corde d''escalade','Objet merveilleux','peu commune',0,'18 m de corde qui bouge et se noue sur ordre.',NULL),
  ('Heaume de compréhension des langues','Objet merveilleux','peu commune',0,'Compréhension des langues à volonté.',NULL),
  ('Médaillon des pensées','Objet merveilleux','peu commune',1,'3 charges : Détection des pensées (DD 13).',NULL),
  ('Amulette d''antidétection','Objet merveilleux','peu commune',1,'Invisible à la magie de divination.',NULL),
  ('Perle de thaumaturgie','Objet merveilleux','peu commune',1,'1 fois par jour : récupère un emplacement de sort de niveau 3 ou moins.',NULL),
  ('Baguette de projectiles magiques','Baguette','peu commune',0,'7 charges : Projectile magique (1 charge par niveau d''emplacement), récupère 1d6+1 charges à l''aube.',NULL),
  ('Baguette du mage de guerre +1','Baguette','peu commune',1,'+1 aux jets d''attaque des sorts, ignore les abris partiels.','{"spellAtk":1}'),
  ('Bâton de la vipère','Bâton','peu commune',1,'Action bonus : la tête devient un serpent venimeux, +1d6 poison… (CON).',NULL),
  ('Parchemin de sort','Parchemin','variable',0,'Permet de lancer une fois le sort écrit dessus, s''il est sur la liste de ta classe.',NULL);

-- Exemples de requêtes utiles :
-- SELECT s.nom, s.niveau FROM sorts s JOIN sort_classe sc ON sc.sort_id=s.id JOIN classes c ON c.id=sc.classe_id WHERE c.nom='Druide' AND s.niveau=2;
-- SELECT nom, classe, niveau, modifie_le FROM personnages ORDER BY modifie_le DESC;