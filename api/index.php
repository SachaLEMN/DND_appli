<?php
// ===================== API du Créateur de personnage D&D =====================
// Toutes les réponses sont en JSON. Exemples :
//   GET  api/?a=ping
//   GET  api/?a=list&kind=perso            (ou kind=pnj)
//   POST api/?a=save    {kind,id,name,summary,data}
//   POST api/?a=delete  {kind,id}
//   GET  api/?a=sorts                      (sorts + classes)
//   GET  api/?a=sorts&classe=Druide&niveau=2
//   GET  api/?a=modeles                    (modèles de créatures)
//   GET  api/?a=groupe  /  POST api/?a=groupe_set {id,actif}
//   GET  api/?a=list&kind=groupe  /  POST api/?a=groupe_charger {ids:[...]}
//   GET/POST api/?a=etat&cle=combat
//   GET  api/?a=stats  /  GET api/?a=export[&fichiers=1]  /  POST api/?a=import {mode,tables,fichiers}
//   POST api/?a=upload {data:"data:image/jpeg;base64,…"}  /  POST api/?a=migrer_images
//   POST api/?a=login {mdp}  /  POST api/?a=logout        (si MOT_DE_PASSE est rempli dans config.php)
declare(strict_types=1);
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reponse($data, int $code = 200): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE); exit; }
function erreur(string $msg, int $code = 400): void { reponse(['erreur' => $msg], $code); }

// ----- contrôle d'accès (adresse IP) -----
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$local = in_array($ip, ['127.0.0.1', '::1'], true);
$lan = (bool)preg_match('/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.|fe80:|fd)/i', $ip);   // + Tailscale (100.64/10)
if (!$local && !(ACCES === 'lan' && $lan)) erreur('Accès refusé depuis ' . $ip, 403);

// ----- connexion -----
try {
  $pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4', DB_USER, DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
} catch (PDOException $e) {
  erreur("Connexion à la base impossible : vérifie que MySQL est démarré dans XAMPP et que dnd.sql a été importé.", 500);
}

// table des groupes sauvegardés (créée toute seule si tu n'as pas réimporté dnd.sql)
$pdo->exec("CREATE TABLE IF NOT EXISTS groupes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume VARCHAR(255) NOT NULL DEFAULT '',
  donnees LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB");

$pdo->exec("CREATE TABLE IF NOT EXISTS cartes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume VARCHAR(255) NOT NULL DEFAULT '',
  donnees LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB");

foreach (['jetons', 'rencontres'] as $tb) {           // bibliothèque de jetons, rencontres préparées
  $pdo->exec("CREATE TABLE IF NOT EXISTS $tb (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume VARCHAR(255) NOT NULL DEFAULT '',
  donnees LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB");
}
$pdo->exec("CREATE TABLE IF NOT EXISTS journaux (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL DEFAULT 'Sans nom',
  resume VARCHAR(255) NOT NULL DEFAULT '',
  donnees LONGTEXT NOT NULL CHECK (JSON_VALID(donnees)),
  cree_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modifie_le DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB");

$a = $_GET['a'] ?? '';
$corps = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $corps = json_decode(file_get_contents('php://input') ?: '{}', true);
  if (!is_array($corps)) erreur('JSON invalide');
}
// ----- mot de passe (optionnel, voir config.php) -----
$mdp = defined('MOT_DE_PASSE') ? (string)MOT_DE_PASSE : '';
$connecte = true;
if ($mdp !== '') {
  ini_set('session.gc_maxlifetime', '2592000');
  session_set_cookie_params(['lifetime' => 2592000, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
  session_name('DNDSESS'); session_start();
  if ($a === 'login') {
    if (hash_equals($mdp, (string)($corps['mdp'] ?? ''))) { session_regenerate_id(true); $_SESSION['ok'] = true; reponse(['ok' => true]); }
    sleep(1); erreur('Mot de passe incorrect', 401);
  }
  if ($a === 'logout') { $_SESSION = []; session_destroy(); reponse(['ok' => true]); }
  $connecte = !empty($_SESSION['ok']);
  session_write_close();                       // libère la session : le polling ne se bloque pas
  if (!$connecte && $a !== 'ping') erreur('Connexion requise', 401);
}
const TABLES_PERSO = ['personnages', 'creatures', 'groupes', 'cartes', 'journaux', 'jetons', 'rencontres', 'etat'];
function dossierUploads(): string { $d = __DIR__ . '/../uploads'; if (!is_dir($d)) { @mkdir($d, 0775, true); @file_put_contents($d . '/.htaccess', "php_flag engine off\nRemoveHandler .php .phtml\nOptions -Indexes\n"); } return $d; }
function enregistrerImage(string $dataUrl): string {
  if (!preg_match('#^data:image/(jpeg|png|webp);base64,#', $dataUrl, $m)) erreur('Image invalide');
  $bin = base64_decode(substr($dataUrl, strpos($dataUrl, ',') + 1), true);
  if ($bin === false || strlen($bin) > 15 * 1024 * 1024 || !@getimagesizefromstring($bin)) erreur('Image invalide ou trop lourde (15 Mo max)');
  $nom = sha1($bin) . '.' . ($m[1] === 'jpeg' ? 'jpg' : $m[1]);
  $f = dossierUploads() . '/' . $nom; if (!is_file($f)) file_put_contents($f, $bin);
  return 'uploads/' . $nom;
}
// table selon le type de sauvegarde
function table(string $kind): string {
  return match ($kind) { 'perso' => 'personnages', 'pnj' => 'creatures', 'groupe' => 'groupes', 'carte' => 'cartes', 'journal' => 'journaux', 'jeton' => 'jetons', 'rencontre' => 'rencontres', default => erreur('kind inconnu') };
}
// "db12" -> 12
function idNum($id): ?int { if (is_int($id)) return $id; return (is_string($id) && preg_match('/^db(\d+)$/', $id, $m)) ? (int)$m[1] : null; }

try {
  switch ($a) {
    case 'ping':
      reponse(['ok' => true, 'base' => DB_NAME, 'auth' => $connecte, 'mdp' => $mdp !== '', 'version' => $pdo->query('SELECT VERSION()')->fetchColumn()]);

    case 'list': {
      $t = table($_GET['kind'] ?? '');
      $rows = $pdo->query("SELECT id, nom, resume, donnees, UNIX_TIMESTAMP(modifie_le)*1000 AS maj FROM $t ORDER BY modifie_le DESC")->fetchAll();
      reponse(array_map(fn($r) => ['id' => 'db' . $r['id'], 'name' => $r['nom'], 'summary' => $r['resume'], 'updated' => (int)$r['maj'], 'data' => json_decode($r['donnees'], true)], $rows));
    }

    case 'save': {
      $kind = $corps['kind'] ?? ''; $t = table($kind);
      $data = $corps['data'] ?? null; if (!is_array($data)) erreur('data manquant');
      $json = json_encode($data, JSON_UNESCAPED_UNICODE);
      $nom = mb_substr(trim((string)($corps['name'] ?? '')) ?: 'Sans nom', 0, 100);
      $resume = mb_substr((string)($corps['summary'] ?? ''), 0, 255);
      $id = idNum($corps['id'] ?? null);
      if ($kind === 'perso') {
        $cols = ['nom' => $nom, 'joueur' => mb_substr((string)($data['player'] ?? ''), 0, 100), 'race' => $data['race'] ?? null, 'classe' => $data['cls'] ?? null,
                 'niveau' => max(1, min(20, (int)($data['level'] ?? 1))), 'historique' => $data['bg'] ?? null, 'resume' => $resume, 'donnees' => $json];
      } elseif ($kind !== 'pnj') {
        $cols = ['nom' => $nom, 'resume' => $resume, 'donnees' => $json];
      } else {
        $cols = ['nom' => $nom, 'role' => mb_substr((string)($data['role'] ?? 'ennemi'), 0, 10), 'type' => mb_substr((string)($data['type'] ?? ''), 0, 60),
                 'fp' => mb_substr((string)($data['cr'] ?? '0'), 0, 5), 'resume' => $resume, 'donnees' => $json];
      }
      $exists = false;
      if ($id) { $st = $pdo->prepare("SELECT 1 FROM $t WHERE id = ?"); $st->execute([$id]); $exists = (bool)$st->fetchColumn(); }
      if ($exists) {
        $set = implode(', ', array_map(fn($c) => "$c = :$c", array_keys($cols)));
        $st = $pdo->prepare("UPDATE $t SET $set WHERE id = :id"); $st->execute($cols + ['id' => $id]);
      } else {
        $st = $pdo->prepare("INSERT INTO $t (" . implode(', ', array_keys($cols)) . ") VALUES (:" . implode(', :', array_keys($cols)) . ")");
        $st->execute($cols); $id = (int)$pdo->lastInsertId();
      }
      reponse(['id' => 'db' . $id]);
    }

    case 'delete': {
      $t = table($corps['kind'] ?? ''); $id = idNum($corps['id'] ?? null); if (!$id) erreur('id invalide');
      $pdo->prepare("DELETE FROM $t WHERE id = ?")->execute([$id]); reponse(['ok' => true]);
    }

    case 'sorts': {
      $sql = "SELECT s.nom, s.niveau, s.ecole, s.mots_cles, s.description, GROUP_CONCAT(c.nom ORDER BY c.nom SEPARATOR '|') AS classes
              FROM sorts s LEFT JOIN sort_classe sc ON sc.sort_id = s.id LEFT JOIN classes c ON c.id = sc.classe_id";
      $w = []; $p = [];
      if (isset($_GET['niveau'])) { $w[] = 's.niveau = ?'; $p[] = (int)$_GET['niveau']; }
      if (isset($_GET['classe'])) { $w[] = 's.id IN (SELECT sc2.sort_id FROM sort_classe sc2 JOIN classes c2 ON c2.id = sc2.classe_id WHERE c2.nom = ?)'; $p[] = $_GET['classe']; }
      if ($w) $sql .= ' WHERE ' . implode(' AND ', $w);
      $st = $pdo->prepare($sql . ' GROUP BY s.id ORDER BY s.niveau, s.nom'); $st->execute($p);
      reponse(array_map(fn($r) => $r + ['classes_liste' => $r['classes'] ? explode('|', $r['classes']) : []], $st->fetchAll()));
    }

    case 'sons': {   // fichiers audio du dossier dnd/sons/ (un sous-dossier = une catégorie)
      $base = realpath(__DIR__ . '/../sons'); $out = [];
      if ($base) {
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($base, FilesystemIterator::SKIP_DOTS));
        foreach ($it as $f) {
          if (!preg_match('/\.(mp3|ogg|wav|m4a|webm)$/i', $f->getFilename())) continue;
          $rel = str_replace('\\', '/', substr($f->getPathname(), strlen($base) + 1));
          $dir = dirname($rel);
          $out[] = ['chemin' => $rel, 'nom' => preg_replace('/[_-]+/', ' ', pathinfo($rel, PATHINFO_FILENAME)), 'categorie' => $dir === '.' ? 'Divers' : ucfirst(str_replace('/', ' › ', $dir))];
        }
      }
      usort($out, fn($a, $b) => [$a['categorie'], $a['nom']] <=> [$b['categorie'], $b['nom']]);
      reponse($out);
    }

    case 'objets':
      reponse($pdo->query('SELECT nom, type, rarete, harmonisation, effet, mods FROM objets_magiques ORDER BY FIELD(type,"Potion","Arme","Armure","Anneau","Objet merveilleux","Baguette","Bâton","Parchemin"), nom')->fetchAll());

    case 'modeles':
      reponse(array_map(fn($r) => ['nom' => $r['nom'], 'donnees' => json_decode($r['donnees'], true)], $pdo->query('SELECT nom, donnees FROM modeles_creatures ORDER BY id')->fetchAll()));

    case 'groupe': {
      $rows = $pdo->query('SELECT id, nom, donnees, UNIX_TIMESTAMP(modifie_le)*1000 AS maj FROM personnages WHERE dans_groupe = 1 ORDER BY nom')->fetchAll();
      reponse(array_map(fn($r) => ['id' => 'db' . $r['id'], 'name' => $r['nom'], 'updated' => (int)$r['maj'], 'data' => json_decode($r['donnees'], true)], $rows));
    }

    case 'groupe_charger': {
      $ids = array_values(array_filter(array_map('idNum', (array)($corps['ids'] ?? []))));
      $pdo->beginTransaction();
      $pdo->exec('UPDATE personnages SET dans_groupe = 0');
      if ($ids) { $in = implode(',', array_fill(0, count($ids), '?')); $pdo->prepare("UPDATE personnages SET dans_groupe = 1 WHERE id IN ($in)")->execute($ids); }
      $pdo->commit();
      $st = $pdo->query('SELECT COUNT(*) FROM personnages WHERE dans_groupe = 1');
      reponse(['ok' => true, 'charges' => (int)$st->fetchColumn(), 'demandes' => count($ids)]);
    }

    case 'groupe_set': {
      $id = idNum($corps['id'] ?? null); if (!$id) erreur('id invalide');
      $pdo->prepare('UPDATE personnages SET dans_groupe = ? WHERE id = ?')->execute([!empty($corps['actif']) ? 1 : 0, $id]); reponse(['ok' => true]);
    }

    case 'etat': {
      $cle = (string)($_GET['cle'] ?? ''); if (!preg_match('/^[a-z0-9_-]{1,40}$/', $cle)) erreur('cle invalide');
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $pdo->prepare('INSERT INTO etat (cle, valeur) VALUES (?, ?) ON DUPLICATE KEY UPDATE valeur = VALUES(valeur)')->execute([$cle, json_encode($corps, JSON_UNESCAPED_UNICODE)]);
        reponse(['ok' => true]);
      }
      $st = $pdo->prepare('SELECT valeur FROM etat WHERE cle = ?'); $st->execute([$cle]); $v = $st->fetchColumn();
      reponse($v === false ? null : json_decode($v, true));
    }

    case 'etats': {       // plusieurs clés d'un coup, par préfixe (ex. deplace_ : les jetons bougés depuis les téléphones)
      $pre = (string)($_GET['prefixe'] ?? ''); if (!preg_match('/^[a-z0-9_-]{1,30}$/', $pre)) erreur('prefixe invalide');
      $st = $pdo->prepare("SELECT cle, valeur FROM etat WHERE cle LIKE ?"); $st->execute([str_replace('_', '\\_', $pre) . '%']);
      $out = []; foreach ($st->fetchAll() as $r) $out[$r['cle']] = json_decode($r['valeur'], true);
      reponse((object)$out);
    }

    case 'stats': {
      $out = [];
      foreach (array_merge(TABLES_PERSO, ['sorts', 'objets_magiques', 'modeles_creatures']) as $t) {
        try { $out[$t] = (int)$pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn(); } catch (PDOException $e) { $out[$t] = null; }
      }
      $taille = (int)$pdo->query("SELECT COALESCE(SUM(data_length + index_length), 0) FROM information_schema.tables WHERE table_schema = DATABASE()")->fetchColumn();
      $up = 0; $nb = 0; $d = __DIR__ . '/../uploads';
      if (is_dir($d)) foreach (glob($d . '/*.{jpg,png,webp}', GLOB_BRACE) ?: [] as $f) { $up += filesize($f); $nb++; }
      $img = 0; try { $img = (int)$pdo->query("SELECT COUNT(*) FROM cartes WHERE donnees LIKE '%\"img\":\"data:image%'")->fetchColumn(); } catch (PDOException $e) {}
      reponse(['tables' => $out, 'taille' => $taille, 'uploads' => ['fichiers' => $nb, 'octets' => $up], 'images_en_base' => $img, 'mdp' => $mdp !== '',
               'limites' => ['post_max_size' => ini_get('post_max_size'), 'upload_max_filesize' => ini_get('upload_max_filesize'),
                             'max_allowed_packet' => (int)$pdo->query('SELECT @@max_allowed_packet')->fetchColumn()], 'php' => PHP_VERSION]);
    }

    case 'rows': {        // liste légère pour la page d'admin (sans le JSON complet)
      $t = table($_GET['kind'] ?? '');
      $rows = $pdo->query("SELECT id, nom, resume, LENGTH(donnees) AS taille, UNIX_TIMESTAMP(modifie_le)*1000 AS maj FROM $t ORDER BY modifie_le DESC")->fetchAll();
      reponse(array_map(fn($r) => ['id' => 'db' . $r['id'], 'name' => $r['nom'], 'summary' => $r['resume'], 'size' => (int)$r['taille'], 'updated' => (int)$r['maj']], $rows));
    }

    case 'export': {
      @set_time_limit(120);
      $out = ['app' => 'dnd-createur', 'version' => 1, 'date' => date('c'), 'tables' => [], 'fichiers' => []];
      foreach (TABLES_PERSO as $t) { try { $out['tables'][$t] = $pdo->query("SELECT * FROM $t")->fetchAll(); } catch (PDOException $e) {} }
      if (!empty($_GET['fichiers'])) { $d = __DIR__ . '/../uploads';
        if (is_dir($d)) foreach (glob($d . '/*.{jpg,png,webp}', GLOB_BRACE) ?: [] as $f) $out['fichiers'][basename($f)] = base64_encode((string)file_get_contents($f)); }
      reponse($out);
    }

    case 'import': {
      @set_time_limit(300);
      $mode = ($corps['mode'] ?? 'ajouter') === 'remplacer' ? 'remplacer' : 'ajouter';
      $tables = $corps['tables'] ?? null; if (!is_array($tables)) erreur('Fichier de sauvegarde invalide');
      $bilan = [];
      $pdo->beginTransaction();
      try {
        foreach (TABLES_PERSO as $t) {
          if (!isset($tables[$t]) || !is_array($tables[$t])) continue;
          $cols = array_column($pdo->query("SHOW COLUMNS FROM $t")->fetchAll(), 'Field');
          if ($mode === 'remplacer') $pdo->exec("DELETE FROM $t");
          $n = 0;
          foreach ($tables[$t] as $row) {
            if (!is_array($row)) continue;
            $row = array_intersect_key($row, array_flip($cols));
            if ($mode === 'ajouter' && $t !== 'etat') unset($row['id']);
            if (!$row) continue;
            foreach ($row as $k => $v) if (is_array($v)) $row[$k] = json_encode($v, JSON_UNESCAPED_UNICODE);
            $k = array_keys($row);
            $sql = "INSERT INTO $t (" . implode(', ', $k) . ") VALUES (:" . implode(', :', $k) . ")";
            if ($t === 'etat') $sql .= " ON DUPLICATE KEY UPDATE valeur = VALUES(valeur)";
            $pdo->prepare($sql)->execute($row); $n++;
          }
          $bilan[$t] = $n;
        }
        $pdo->commit();
      } catch (PDOException $e) { $pdo->rollBack(); erreur("Import annulé, rien n'a été modifié : " . $e->getMessage(), 500); }
      $nf = 0;
      foreach (($corps['fichiers'] ?? []) as $nom => $b64) {
        if (!is_string($nom) || !preg_match('/^[a-f0-9]{16,64}\.(jpg|png|webp)$/', $nom)) continue;
        $bin = base64_decode((string)$b64, true); if ($bin === false || !@getimagesizefromstring($bin)) continue;
        file_put_contents(dossierUploads() . '/' . $nom, $bin); $nf++;
      }
      reponse(['ok' => true, 'mode' => $mode, 'lignes' => $bilan, 'fichiers' => $nf]);
    }

    case 'upload': {
      if ($_SERVER['REQUEST_METHOD'] !== 'POST') erreur('POST attendu');
      reponse(['url' => enregistrerImage((string)($corps['data'] ?? ''))]);
    }

    case 'migrer_images': {   // sort les images de cartes de la base vers dnd/uploads/
      @set_time_limit(300); $n = 0;
      $rows = $pdo->query("SELECT id, donnees FROM cartes")->fetchAll();
      foreach ($rows as $r) {
        $d = json_decode($r['donnees'], true); if (!is_array($d) || !is_string($d['img'] ?? null) || !str_starts_with($d['img'], 'data:image')) continue;
        $d['img'] = enregistrerImage($d['img']);
        $pdo->prepare('UPDATE cartes SET donnees = ? WHERE id = ?')->execute([json_encode($d, JSON_UNESCAPED_UNICODE), $r['id']]); $n++;
      }
      reponse(['ok' => true, 'cartes' => $n]);
    }

    default: erreur('Action inconnue : ' . $a, 404);
  }
} catch (PDOException $e) {
  erreur('Erreur base de données : ' . $e->getMessage(), 500);
}
