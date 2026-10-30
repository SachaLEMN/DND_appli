<?php
// ===== Réglages de connexion à MariaDB (valeurs par défaut de XAMPP) =====
const DB_HOST = '127.0.0.1';
const DB_PORT = 3306;
const DB_NAME = 'dnd';
const DB_USER = 'root';
const DB_PASS = '';          // XAMPP : mot de passe root vide par défaut

// Qui a le droit d'utiliser l'API :
//  'local' = seulement ce PC (recommandé)
//  'lan'   = ce PC + les appareils de ton réseau (télé, téléphone sur ta box)
const ACCES = 'lan';

// Mot de passe du site (optionnel). Vide = pas de mot de passe (OK sur ton réseau local).
// Mets-en un si l'appli tourne sur un serveur accessible par d'autres personnes, ex. :
//   const MOT_DE_PASSE = 'MonSuperMotDePasse';
// Les joueurs le tapent une fois sur leur téléphone (on reste connecté 30 jours).
const MOT_DE_PASSE = '';
