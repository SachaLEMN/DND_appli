/* ===================== MODE XAMPP : données lues dans la base MariaDB ===================== */
const SPELL_LV={};
(()=>{
  const _lv=spellLevelOf;
  window.spellLevelOf=function(s){return SPELL_LV[s]!==undefined?SPELL_LV[s]:_lv(s)};
  Store.onReady(async()=>{if(Store.mode!=="api")return;
    // 1) sorts : la base devient la référence (tu peux en ajouter ou en corriger dans phpMyAdmin)
    try{const rows=await Store.api("sorts");if(Array.isArray(rows)&&rows.length){
      const lists={0:CANT,1:LVL1,2:LVL2,3:LVL3,4:LVL4,5:LVL5};const clear=o=>Object.keys(o).forEach(k=>o[k]=[]);const inDb=new Set(rows.map(r=>+r.niveau));
      // on ne remplace que les niveaux présents dans la base (une ancienne base sans les niveaux 4-5 garde ceux du site)
      [0,1,2,3,4,5].forEach(n=>{if(inDb.has(n)){clear(lists[n]);if(n===1)clear(LVL1X)}});
      rows.forEach(r=>{const n=+r.niveau;SPELL_LV[r.nom]=n;if(!SP[r.nom]||r.description)SP[r.nom]=[r.ecole+(r.mots_cles?" · "+r.mots_cles:""),r.description];
        (r.classes_liste||[]).forEach(c=>{const tgt=(n===1&&(c==="Paladin"||c==="Rôdeur"))?LVL1X:lists[n];if(!tgt)return;(tgt[c]=tgt[c]||[]).push(r.nom)})});}}
    catch(e){console.warn("Sorts non chargés depuis la base",e)}
    // 2) modèles de créatures
    try{const rows=await Store.api("modeles");if(Array.isArray(rows)&&rows.length&&window.PNJ){const T=window.PNJ.TEMPLATES;Object.keys(T).forEach(k=>delete T[k]);rows.forEach(r=>{T[r.nom]=r.donnees})}}
    catch(e){console.warn("Modèles non chargés depuis la base",e)}
    // 2 bis) objets magiques
    try{const rows=await Store.api("objets");if(Array.isArray(rows)&&rows.length)OBJETS=rows.map(r=>({nom:r.nom,type:r.type,rarete:r.rarete,harmo:!!+r.harmonisation,effet:r.effet,mods:r.mods?JSON.parse(r.mods):{}}))}catch(e){}
    // 2 ter) contenu maison (sorts, objets, monstres créés dans l'onglet Admin)
    try{if(typeof Maison!=="undefined")await Maison.apply()}catch(e){}
    // 3) combat en cours : gardé dans la table « etat »
    try{const k=await Store.api("etat",null,"&cle=combat");if(typeof Combat!=="undefined")Combat.setState(k)}catch(e){}
    try{render();window.routeView&&routeView()}catch(e){}
    const badge=document.getElementById("dbBadge");if(badge){badge.hidden=false}
  });
})();
