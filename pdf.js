/* ===================== REMPLISSAGE DE LA FICHE PDF (aidedd) ===================== */
const PDFX=(()=>{
  let lib=null,lastBytes=null;
  function loadLib(){if(lib)return Promise.resolve(lib);return new Promise((ok,ko)=>{const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";s.onload=()=>{lib=window.PDFLib;ok(lib)};s.onerror=()=>ko(new Error("pdf-lib"));document.head.appendChild(s)})}
  // Helvetica (WinAnsi) ne connaît pas certains symboles : on les remplace
  const clean=t=>String(t??"").replace(/[●✔★☆]/g,"*").replace(/→/g,"->").replace(/[🎲🎮⚔️🤝⚖️]/gu,"").replace(/[^\n\x20-\x7E\xA0-\xFFœŒ€‘’“”–—…•]/g,"");
  // ordre des lignes de compétences sur la fiche (noms de champs du PDF, de haut en bas)
  const SKF=["Acrobaties","Arcanes","Athlétisme","Discrétion","Dressage","Escamotage","Histoire","Intimidation","Intuition","Investigation","Médecine","Nature","Perception","Persuasion","Religion","Représentation","Survie","Tromperie"];
  const SKCB=[23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
  const SVF=["ST Strength","ST Dexterity","ST Constitution","ST Intelligence","ST Wisdom","ST Charisma"],SVCB=[11,18,19,20,21,22];
  const ABF=[["STR","STRmod"],["DEX","DEXmod"],["CON","CONmod"],["INT","INTmod"],["WIS","WISmod"],["CHA","CHAmod"]];
  const SPF={0:range(1014,1021),1:range(1022,1033),2:[1046,...range(1034,1045)],3:[1048,1047,...range(1049,1059)],4:[1061,1060,...range(1062,1072)],5:[1074,1073,...range(1075,1081)]};
  function range(a,b){const r=[];for(let i=a;i<=b;i++)r.push(i);return r}
  function values(){
    const c=C(),r=R(),b=BGS[S.bg],ac=armorClass(),si=spellInfo(),sb=SUB();const p=S.play||null;
    const v={},cb=[];
    v.CharacterName=S.name;v["CharacterName 2"]=S.name;v.ClassLevel=`${S.cls}${S.sub?" ("+S.sub+")":""}${S.sub2&&sub2()?" ("+S.sub2+")":""} ${LV()}`;
    v.Background=S.bg;v.PlayerName=S.player;v.Race=S.race;v.Alignment=S.align;v.XP="0";
    AB.forEach((a,i)=>{v[ABF[i][0]]=String(score(a));v[ABF[i][1]]=sgn(M(a));const prof=c.saves.includes(a);v[SVF[i]]=sgn(saveBonus(a));if(prof)cb.push("Check Box "+SVCB[i])});
    v.ProfBonus="+"+PB;v.Inspiration=p&&p.insp?"*":"";
    SKILLS.forEach(([s],i)=>{v[SKF[i]]=sgn(skillTotal(s));if(allSkills().has(s))cb.push("Check Box "+SKCB[i])});
    v.Passive=String(10+skillTotal("Perception"));
    const ap=[...new Set(armorProf())];
    v.ProficienciesLang=["Langues : "+languages().join(", "),"Armures : "+(ap.length?ap.join(", "):"aucune"),...[b.tools,c.tools,r.tools].filter(Boolean).map(t=>"Outils : "+t)].join("\n");
    v.AC=String(ac.v);v.Initiative=sgn(M("DEX"));v.Speed=r.spd;v.HPMax=String(hp());v.HPCurrent=String(p?p.hp:hp());v.HPTemp=p&&p.temp?String(p.temp):"";
    v.HDTotal=LV()+"d"+c.hd;v.HD=(p?LV()-p.hd:LV())+"d"+c.hd;
    const atk=attacks();const wn=[["Wpn Name","Wpn1 AtkBonus","Wpn1 Damage"],["Wpn Name 2","Wpn2 AtkBonus","Wpn2 Damage"],["Wpn Name 3","Wpn3 AtkBonus","Wpn3 Damage"]];
    atk.slice(0,3).forEach((a,i)=>{v[wn[i][0]]=a.n;v[wn[i][1]]=a.atk.replace(" (non maîtrisée)","");v[wn[i][2]]=a.dmg.split(" / ")[0]});
    const more=atk.slice(3).map(a=>`${a.n} : ${a.atk}, ${a.dmg}`);if(si)more.push(`Sorts : DD ${si.dc}, attaque ${si.atk}`);v.AttacksSpellcasting=more.join("\n");
    const m=p?p.money:{pc:0,pa:0,pe:0,po:b.po,pp:0};v.CP=String(m.pc);v.SP=String(m.pa);v.EP=String(m.pe);v.GP=String(m.po);v.PP=String(m.pp);
    const inv=p&&p.inv?p.inv.filter(x=>x.n).map(x=>(x.q>1?x.q+" × ":"")+x.n):chosenItems().map(it=>it.p?PACKS[it.p][0]:it.pick?it.w:itemLabel(it).replace(/&amp;/g,"&")).concat(b.eq);
    v.Equipment=[...new Set(inv.concat((S.items||[]).map(it=>(it.q>1?it.q+" × ":"")+it.nom+(it.arme?" ("+it.arme+")":""))))].join(", ");
    v.PersonalityTraits=S.traits;v.Ideals=S.ideaux;v.Bonds=S.liens;v.Flaws=S.defauts;
    const feats=featList().map(f=>`• ${f[1]}`);const half=Math.min(feats.length,14);
    v["Features and Traits"]=feats.slice(0,half).join("\n");v["Feat+Traits"]=feats.slice(half).join("\n");
    v.Age=S.age;v.Height=S.height;v.Weight=S.weight;v.Eyes=S.eyes;v.Skin=S.skin;v.Hair=S.hair;v.Apparence=S.apparence;v.Backstory=S.histoire;
    v.Allies="";v.Treasure="";
    if(si){v["Spellcasting Class 2"]=S.cls;v["SpellcastingAbility 2"]=si.ab;v["SpellSaveDC 2"]=String(si.dc);v["SpellAtkBonus 2"]=si.atk;
      si.slotsArr.forEach((n,i)=>{if(i<9)v["SlotsTotal "+(19+i)]=n?String(n):""})}
    const cants=[...S.cants];if(sb&&sb.cantrip)cants.push(sb.cantrip);if(S.domCant)cants.push(S.domCant);if(r.spells)cants.push(...r.spells);if(r.cantrip)cants.push(S.raceCantrip);
    let lv=[];if(si){lv=si.known?S.spells:si.book?S.book.map(s=>s+(S.prepared.includes(s)?" *":"")):domSpells().map(s=>s+" (domaine)").concat(S.prepared)}
    const byL={0:cants,1:[],2:[],3:[],4:[],5:[]};lv.forEach(x=>{const l=spellLevelOf(x.replace(/ \(.*$| \*$/,""));byL[l].push(x)});
    [0,1,2,3,4,5].forEach(l=>(byL[l]||[]).forEach((s,i)=>{if(SPF[l][i])v["Spells "+SPF[l][i]]=s}));
    return {v,cb}}
  // certaines cases de la page 1 ne sont pas déclarées dans le formulaire du PDF : on les rattache
  function fixForm(L,doc){const {PDFName,PDFRef}=L;const af=doc.catalog.getOrCreateAcroForm();
    const have=new Set(af.getAllFields().map(([f,r])=>r.toString()));
    doc.getPages().forEach(pg=>{const an=pg.node.Annots();if(!an)return;for(let i=0;i<an.size();i++){const ref=an.get(i);if(!(ref instanceof PDFRef))continue;
      const d=doc.context.lookup(ref);if(!d||!d.get||d.get(PDFName.of("Subtype"))!==PDFName.of("Widget"))continue;
      let top=ref,dd=d;while(dd.get(PDFName.of("Parent"))){top=dd.get(PDFName.of("Parent"));dd=doc.context.lookup(top)}
      if(dd.get(PDFName.of("T"))&&!have.has(top.toString())){af.addField(top);have.add(top.toString())}}})}
  async function fill(bytes){const L=await loadLib();const doc=await L.PDFDocument.load(bytes,{ignoreEncryption:true});
    try{fixForm(L,doc)}catch(e){}
    const form=doc.getForm();const map={};form.getFields().forEach(f=>{map[f.getName().trim().replace(/\s+/g," ")]=f});
    const font=await doc.embedFont(L.StandardFonts.Helvetica);const {v,cb}=values();let n=0;
    const SMALL=["ProficienciesLang","AttacksSpellcasting","Equipment","Features and Traits","Feat+Traits","Backstory","Apparence","PersonalityTraits","Ideals","Bonds","Flaws"];
    const fails=[];
    Object.entries(v).forEach(([k,val])=>{const f=map[k];if(!f||val===undefined||val===null||!f.setText)return;
      try{if(SMALL.includes(k)){f.enableMultiline();const sz=k.startsWith("Feat")?7:["PersonalityTraits","Ideals","Bonds","Flaws"].includes(k)?8:8.5;try{f.setFontSize(sz)}catch(e){f.acroField.setDefaultAppearance(`/Helv ${sz} Tf 0 g`)}}}catch(e){}
      try{f.setText(clean(val));n++}catch(e){fails.push(k+": "+e.message)}});
    if(fails.length)console.warn("PDF : champs non remplis",fails);
    cb.forEach(k=>{try{map[k].check();n++}catch(e){}});
    try{form.updateFieldAppearances(font)}catch(e){}
    return {bytes:await doc.save(),n}}
  async function deliver(bytes){const name=`Fiche - ${(S.name||"perso").replace(/[\\/:*?"<>|]/g,"")}.pdf`;
    let dl=null;try{if(window.claude&&window.claude.use)dl=await window.claude.use("downloads")}catch(e){}
    if(dl){try{await dl.save({filename:name,data:new Blob([bytes],{type:"application/pdf"})});return "saved"}catch(e){if(e&&e.code==="declined")return "declined";if(!(e&&/unavailable|not_granted|capability/.test(e.code||"")))throw e}}
    const url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000);return "saved"}
  async function run(bytes){const box=document.getElementById("pdfMsg");try{if(box)box.textContent="Remplissage en cours…";
    const {bytes:out,n}=await fill(bytes);const st=await deliver(out);if(box)box.textContent=st==="declined"?"Téléchargement annulé.":`✔ Fiche remplie (${n} cases). Vérifie ton dossier de téléchargements.`}
    catch(e){if(box)box.textContent="Impossible de remplir ce PDF. Utilise la fiche vierge d'aidedd (FeuillePerso.pdf). "+(e&&e.message==="pdf-lib"?"(La bibliothèque PDF n'a pas pu se charger.)":"")}}
  function panel(){return `<div class="card" id="pdfPanel"><h2>📄 Remplir ma fiche PDF</h2><div class="small">Choisis ta fiche vierge <b>FeuillePerso.pdf</b> (celle d'aidedd.org). La page la remplit avec ton perso et te la renvoie, prête à imprimer. Rien n'est envoyé nulle part.</div>
    <input type="file" id="pdfFile" accept="application/pdf,.pdf" style="margin-top:8px">${lastBytes?` <button class="btn" id="pdfAgain">Re-remplir avec la même fiche</button>`:""}<div class="small" id="pdfMsg" style="margin-top:6px"></div></div>`}
  document.addEventListener("click",e=>{if(e.target.id==="pdfBtn"){const ex=document.getElementById("pdfPanel");if(ex){ex.remove();return}
      document.getElementById("page").insertAdjacentHTML("afterbegin",panel());window.scrollTo(0,0)}
    if(e.target.id==="pdfAgain"&&lastBytes)run(lastBytes.slice(0))});
  document.addEventListener("change",async e=>{if(e.target.id!=="pdfFile"||!e.target.files[0])return;e.stopImmediatePropagation();
    const buf=await e.target.files[0].arrayBuffer();lastBytes=buf.slice(0);run(buf)},true);
  return {values,fill};
})();
