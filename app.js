(function(){
'use strict';
var SHELL=`<header class="top">
  <div class="wrap">
    <a class="brand" href="#accueil" id="brand" aria-label="Accueil">A</a>
    <nav class="nav" id="nav" aria-label="Sections">
      <a href="#accueil">Accueil</a><a href="#apropos">À propos</a><a href="#experiences">Expériences</a><a href="#competences">Compétences</a><a href="#projets">Projets</a><a href="#certifications">Certifications</a><a href="#formation">Formation</a><a href="#contact">Contact</a>
    </nav>
    <div class="tools">
      <button class="ibtn" data-theme-toggle type="button" aria-label="Changer de thème">Thème</button>
      <button class="ibtn" id="editBtn" data-edit type="button" aria-pressed="false">Éditer</button>
    </div>
  </div>
  <div class="prog" id="prog"></div>
</header>

<main class="wrap">
  <section id="accueil">
    <div class="hero">
      <div id="heroText"></div>
      <aside class="readout" id="readout"></aside>
    </div>
  </section>
  <div id="holder" hidden>
      <figure class="scope" id="scene">
        <div class="scope-box"><canvas id="bev" role="img" aria-label="Vue de dessus animée : un véhicule, des objets détectés, et un véhicule connecté qui partage ce qu'il voit pour révéler une voiture cachée derrière un camion"></canvas></div>
        <div class="seg" role="group" aria-label="Mode de perception">
          <button type="button" data-v2x="0" aria-pressed="false">Perception seule</button>
          <button type="button" data-v2x="1" aria-pressed="true">Avec V2X</button>
        </div>
        <figcaption id="sceneNote">Illustration simulée. Clique sur la scène pour comparer.</figcaption>
      </figure>
  </div>
  <section id="apropos"></section>
  <section id="experiences"></section>
  <section id="competences"></section>
  <section id="projets"></section>
  <section id="certifications"></section>
  <section id="formation"></section>
  <section id="contact"></section>
</main>
<footer><div class="wrap"><span id="foot"></span><a href="#accueil">Retour en haut ↑</a></div></footer>

<div class="scrim" id="modal" hidden></div>
<input type="file" id="photoIn" accept="image/*" hidden>
<input type="file" id="mediaIn" accept="image/gif,image/png,image/jpeg,image/webp,video/mp4,video/webm" multiple hidden>
<input type="file" id="slideIn" accept="image/*,video/*" multiple hidden>
<input type="file" id="codeIn" accept=".py,.m,.ipynb,.txt,.c,.cpp,.h,.js,.sh,.r,.json,.md,text/*" hidden>
<input type="file" id="docIn" accept="application/pdf,.pdf" hidden>

<div class="tb" id="tb" hidden>
  <div class="wrap">
    <span class="cnt" id="cnt"></span>
    <button type="button" data-publish id="pubBtn" class="pub">Publier</button>
    <button type="button" data-dlstate>Télécharger state.json</button>
    <button type="button" data-export>Copier les données</button>
    <button type="button" data-import-toggle>Importer</button>
    <button type="button" data-reset id="resetBtn">Réinitialiser</button>
    <div class="imp" id="imp" hidden>
      <textarea id="impTxt" placeholder="Colle ici les données copiées précédemment (JSON)"></textarea>
      <div><button type="button" data-apply>Appliquer</button></div>
    </div>
  </div>
</div>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`;
document.getElementById('app').innerHTML=SHELL;
var KEY='portfolio-anthony-v1';
var TODO='À compléter';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Modèles et données de départ ---------- */
var TPL={
  exp:function(){return {company:TODO,role:TODO,period:TODO,place:TODO,summary:TODO,missions:[TODO],tech:[TODO],achievements:[TODO],challenges:[TODO],environment:TODO,impact:TODO,docs:[],medias:[],codes:[]}},
  proj:function(){return {title:TODO,desc:TODO,tags:[TODO],link:'',image:'',method:TODO,results:TODO,docs:[]}},
  doc:function(){return {label:TODO,url:'',kind:''}},
  doclink:function(){return {label:TODO,url:'https://',kind:'link'}},
  code:function(){return {title:'Nouveau script',lang:'Python',code:''}},
  med:function(){return {caption:'',src:'',kind:'',ms:'2500',frames:[]}},
  edu:function(){return {school:TODO,degree:TODO,period:TODO,detail:TODO}},
  cert:function(){return {title:TODO,issuer:TODO,year:TODO}},
  dom:function(){return {name:TODO,desc:TODO,tech:[TODO]}},
  lang:function(){return {name:TODO,level:TODO}},
  str:function(){return TODO}
};
var DEFAULT={
  name:'Anthony',
  status:TODO+" : disponibilité (par exemple « Ouvert aux offres de thèse à partir de 2027 »)",
  roles:['Perception coopérative','Vision par ordinateur','Deep learning','Traitement du signal'],
  tagline:"Étudiant en Master 2 Signal, Image, Vision et Applications. Je travaille sur la vision par ordinateur, le traitement du signal et l’apprentissage profond, de l’imagerie médicale aux systèmes autonomes.",
  location:'Rennes, Bretagne, France',
  about:"Étudiant en Master 2 Signal, Image, Vision à l'Université de Rennes, je réalise un stage de cinq mois chez ALTEN Labs sur le projet C-ITS (systèmes de transport intelligents coopératifs). Ma formation relie le deep learning, le traitement du signal, la vision par ordinateur et la physique.\n\n"+TODO+" : ce qui te motive, ce que tu cherches (stage, thèse, poste).",
  badges:['Perception','Signal','Vision'],
  highlights:['Master 2 Signal, Image, Vision','Stagiaire chez ALTEN Labs','Rennes, Bretagne'],
  languages:[{name:'Français',level:'Langue principale'},{name:'Anglais',level:TODO}],
  interests:[TODO],
  photo:'',
  domains:[
    {name:'Perception coopérative',desc:"Partager l'information entre véhicules et infrastructure pour voir au-delà du champ d'un seul capteur.",tech:['V2X','Fusion multi-capteurs','LiDAR','Caméra','BEV','Graphes']},
    {name:'Deep learning',desc:"Réseaux convolutifs, ResNet, autoencodeurs et détecteurs, du jeu de données à l'évaluation.",tech:['CNN','ResNet','Autoencodeurs','YOLO','PointPillars','OpenPCDet','PyTorch Geometric']},
    {name:'Vision par ordinateur',desc:"Détection, classification, segmentation, flot optique et calibration de caméras.",tech:['Détection','Segmentation','Flot optique','Calibration caméra']},
    {name:'Traitement du signal',desc:"Analyse temps-fréquence, filtrage optimal et théorie de l'estimation.",tech:['FFT','STFT','Wiener','Kalman','Borne de Cramér-Rao']},
    {name:'Machine learning',desc:"Méthodes classiques de classification et de modélisation statistique.",tech:['Random Forest','SVM','GMM']},
    {name:'Physique',desc:"Bases solides en mécanique, physique nucléaire et électronique.",tech:['Mécanique','Physique nucléaire','Électronique']},
    {name:'Outils',desc:"Environnement de travail au quotidien.",tech:['Git','Azure DevOps','SSH','LaTeX',TODO]}
  ],
  experiences:[
    {company:'ALTEN Labs',role:'Stagiaire, perception coopérative (projet C-ITS)',period:'13 juil. 2026 – 15 déc. 2026',place:'Sèvres',
     summary:"Perception coopérative pour véhicules autonomes dans le cadre du projet C-ITS.",
     missions:["Entraînement d'un modèle PointPillars avec OpenPCDet sur un jeu de données personnalisé (environ 3 200 échantillons, 20 époques)","Évaluation des modèles : composantes de la loss, configuration des ancres, recall, mAP","Étude du pipeline de perception coopérative : simulation V2X, graphes avec PyTorch Geometric, fusion caméra et LiDAR, représentation BEV","Synthèses LaTeX en français d'articles de référence (rapport BST, état de l'art IEEE)"],
     tech:['PointPillars','OpenPCDet','PyTorch Geometric','Git','Azure DevOps','SSH','LaTeX'],
     achievements:[TODO+" : résultat chiffré, livrable, soutenance du 31 octobre 2026"],
     challenges:["Entraînement sur une machine distante, en SSH et sans interface graphique","Migration du dépôt vers Azure DevOps et résolution de conflits Git"],
     environment:TODO+" : équipe, méthode de travail, outils partagés.",
     impact:TODO+" : mAP obtenue, ce que le modèle permet, suite du projet."},
    {company:'LTSI, Université de Rennes / INSERM',role:'Stagiaire',period:TODO,place:'Rennes',
     summary:"Stage de recherche autour de la détection sur vidéo et de la calibration de caméras.",
     missions:["Détection d'objets par YOLO sur des séquences vidéo","Calibration de caméra"],
     tech:['YOLO','Calibration caméra'],
     achievements:[TODO],challenges:[TODO],environment:TODO,impact:TODO}
  ],
  projects:[
    {title:"Détection de l'épilepsie par flot optique",desc:"Détection de crises à partir du mouvement estimé dans la vidéo. "+TODO+" : données, méthode, résultats.",tags:['Flot optique','Vision'],link:'',image:'',method:TODO,results:TODO},
    {title:'Tumeurs cérébrales : classification et segmentation',desc:"Classification puis segmentation de tumeurs sur images médicales. "+TODO+" : modèle, métriques.",tags:['Deep learning','Imagerie médicale'],link:'',image:'',method:TODO,results:TODO},
    {title:"Restauration d'images",desc:"Restauration d'images dégradées. "+TODO+" : type de dégradation, méthode, résultats.",tags:['Traitement du signal','Image'],link:'',image:'',method:TODO,results:TODO}
  ],
  certifications:[{title:TODO,issuer:TODO,year:TODO}],
  education:[
    {school:'Université de Rennes',degree:'Master 2 Signal, Image, Vision',period:TODO,detail:TODO+" : cours marquants, spécialité."},
    {school:TODO,degree:TODO+" (parcours précédent)",period:TODO,detail:TODO}
  ],
  links:{phone:TODO+" : numéro de téléphone",calendly:TODO+" : lien de prise de rendez-vous",linkedin:TODO+" : lien LinkedIn",email:TODO+" : adresse e-mail",github:TODO+" : lien GitHub",cv:TODO+" : lien vers ton CV (PDF)"}
};

/* ---------- Utilitaires ---------- */
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var clone=function(o){return JSON.parse(JSON.stringify(o))};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var isBlob=function(u){return /^\/_blob\/[0-9a-f]{32}$/i.test(clean(u))};
var okUrl=function(u){u=clean(u);return isBlob(u)||/^https?:\/\//i.test(u)||/^[\w\-.\/%]+\.(pdf|docx?|pptx?|zip|mp4|webm|gif|png|jpe?g|webp)$/i.test(u)};
/* en lecture, les passages « À compléter » sont masqués */
function clean(v){return String(v==null?'':v).replace(/[ \t]*À compléter[^\n]*/g,'').replace(/\n{3,}/g,'\n\n').trim()}
var D,edit=false,openM=null,filter='Tous',activeDom=0,imgTarget='photo',resetArm=0;

/* ---------- Données : lecture, migration, sauvegarde ---------- */
function fill(def,cur){
  if(cur==null)return clone(def);
  if(Array.isArray(def))return Array.isArray(cur)?cur:clone(def);
  if(def&&typeof def==='object'){
    if(!cur||typeof cur!=='object')return clone(def);
    var o=Object.assign({},cur);
    Object.keys(def).forEach(function(k){o[k]=fill(def[k],cur[k])});
    return o;
  }
  return cur;
}
function migrate(raw){
  var rev=raw&&typeof raw==='object'?(raw._rev||0):0;
  var o=fill(DEFAULT,raw);
  var map={experiences:'exp',projects:'proj',education:'edu',certifications:'cert',domains:'dom',languages:'lang'};
  Object.keys(map).forEach(function(k){
    o[k]=(Array.isArray(o[k])?o[k]:[]).map(function(it){
      if(it&&typeof it==='object'&&!('docs' in it)){
        if(k==='experiences'&&/ltsi/i.test(it.company||''))it.docs=[{label:'Rapport de stage',url:''}];
        if(k==='projects'&&/épilep|epilep|tumeur|imagerie/i.test(it.title||''))it.docs=[{label:'Rapport du projet',url:''}];
      }
      if(k==='experiences'&&it&&typeof it==='object'){
        if(!Array.isArray(it.medias)){var m0=it.media;it.medias=(m0&&((m0.frames||[]).length||clean(m0.src)))?[m0]:[]}
        it.medias=it.medias.map(function(m){return fill(TPL.med(),m)});
        delete it.media;
      }
      return fill(TPL[map[k]](),it);
    });
  });
  ['roles','badges','highlights','interests'].forEach(function(k){if(!Array.isArray(o[k]))o[k]=clone(DEFAULT[k])});
  if(rev<2)applyCV(o);
  if(clean(o.tagline)==='Étudiant en Master 2 Signal, Image, Vision. Je travaille sur la perception coopérative pour les véhicules autonomes.')o.tagline=DEFAULT.tagline;
  o._rev=2;
  return o;
}
/* ---------- Contenu issu du CV : appliqué une fois, sans écraser tes propres textes ---------- */
function hasTodo(v){return /À compléter/.test(String(v==null?'':v))}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#]+/g,' ').trim()}
function setIf(obj,k,val){if(!obj)return;if(!clean(obj[k])||hasTodo(obj[k]))obj[k]=val}
function union(arr,items){if(!Array.isArray(arr))return;var have={};arr.forEach(function(t){have[norm(t)]=1});items.forEach(function(t){if(!have[norm(t)]){arr.push(t);have[norm(t)]=1}})}
function findBy(arr,key,re){for(var i=0;i<arr.length;i++)if(re.test(String(arr[i][key]||'')))return arr[i];return null}
function applyCV(o){
  if(clean(o.name)==='Anthony')o.name='Anthony KOUAM';
  setIf(o,'status',"Candidat à un poste d'ingénieur R&D en vision par ordinateur et traitement du signal");
  if(hasTodo(o.about))o.about=String(o.about).replace(/[ \t]*À compléter[^\n]*/,"Spécialisé en traitement du signal, vision par ordinateur et apprentissage profond. Expérience en détection d'objets 3D, segmentation d'images et développement de pipelines de perception. Intérêt pour les sciences appliquées et les méthodes numériques.");
  var L=o.links;
  setIf(L,'email','anthony.kmf@gmail.com');setIf(L,'phone','+33 7 45 34 88 91');
  setIf(L,'linkedin','https://www.linkedin.com/in/anthony-kouam/');setIf(L,'cv','cv-anthony-kouam.pdf');
  var fr=findBy(o.languages,'name',/fran/i);if(fr)setIf(fr,'level','Courant');else o.languages.unshift({name:'Français',level:'Courant'});
  var en=findBy(o.languages,'name',/angl/i);if(en)setIf(en,'level','Professionnel');else o.languages.push({name:'Anglais',level:'Professionnel'});
  // formations
  o.education=o.education.filter(function(x){return clean(x.school)||clean(x.degree)||clean(x.period)||clean(x.detail)});
  var m2=findBy(o.education,'degree',/master 2/i)||findBy(o.education,'school',/universit/i);
  if(m2){if(!clean(m2.degree)||/^master 2 signal, image, vision\s*$/i.test(clean(m2.degree)))m2.degree='Master 2 Signal, Image, Vision et Applications';setIf(m2,'period','2025–2026');setIf(m2,'school','Université de Rennes')}
  else o.education.push({school:'Université de Rennes',degree:'Master 2 Signal, Image, Vision et Applications',period:'2025–2026',detail:TODO+' : cours marquants, spécialité.'});
  var m1=findBy(o.education,'degree',/master 1/i);
  if(m1)setIf(m1,'period','2024–2025');else o.education.push({school:TODO+' : établissement',degree:'Master 1 Signal, Image, Vision et Applications',period:'2024–2025',detail:TODO});
  var lic=findBy(o.education,'degree',/licence/i);
  if(lic)setIf(lic,'period','2023–2024');else o.education.push({school:TODO+' : établissement',degree:'Licence en physique',period:'2023–2024',detail:TODO});
  // expériences
  var al=findBy(o.experiences,'company',/alten/i);
  if(al){
    if(!clean(al.role)||/^stagiaire(, perception coopérative \(projet C-ITS\))?$/i.test(clean(al.role)))al.role='Stagiaire Ingénieur Innovation, Computer Vision et Véhicule Autonome Coopératif';
    setIf(al,'place','Sèvres, France');
    union(al.missions,["Analyse de l'état de l'art sur les stratégies de perception collaborative pour les systèmes de transport intelligents coopératifs","Conception d'un pipeline de perception collaborative : fusion de données (caméra, LiDAR, Radar) et redistribution de l'information par Graph Neural Networks et LSTM","Expérimentations sur données simulées, évaluation selon la latence, la qualité de décision et la bande passante"]);
    union(al.tech,['Radar','GNN','LSTM']);
    if(al.docs&&!al.docs.length)al.docs.push({label:'Rapport de stage',url:''});
  }
  var lt=findBy(o.experiences,'company',/ltsi/i);
  if(lt){
    if(!clean(lt.role)||/^stagiaire$/i.test(clean(lt.role)))lt.role='Stagiaire Traitement du Signal et Deep Learning';
    setIf(lt,'period','Avril 2025 – Juin 2025');
    union(lt.missions,["Tracking du mouvement d'un joueur de tennis à partir d'une annotation manuelle sous CVAT et du modèle YOLO","Détermination des paramètres intrinsèques de la caméra et calcul de l'erreur de reprojection"]);
    union(lt.tech,['CVAT','Tracking','Erreur de reprojection']);
  }
  // projets
  var tu=findBy(o.projects,'title',/tumeur/i);
  if(tu){
    setIf(tu,'desc',"Modèles CNN et U-Net pour la classification multi-classes et la segmentation de tumeurs cérébrales sur images IRM.");
    setIf(tu,'method',"CNN pour la classification multi-classes, U-Net pour la segmentation.");
    setIf(tu,'results',"87 % d'accuracy.");
    union(tu.tags,['CNN','U-Net','IRM']);
  }
  var ep=findBy(o.projects,'title',/épilep|epilep/i);
  if(ep){
    setIf(ep,'desc',"Pipeline complet pour détecter des crises d'épilepsie et des anomalies par analyse vidéo : flot optique, séries temporelles, puis classification ML ou deep learning.");
    setIf(ep,'method',"Flot optique pour extraire des caractéristiques dynamiques, analyse de séries temporelles, puis classification ML ou deep learning.");
    setIf(ep,'results',"Évaluation par accuracy, precision et recall.");
    union(ep.tags,['Flot optique','Séries temporelles']);
  }
  // compétences
  function dom(re,name,desc,tech){var d=findBy(o.domains,'name',re);if(d)union(d.tech,tech);else o.domains.push({name:name,desc:desc,tech:tech.slice()})}
  dom(/coop/i,'Perception coopérative',"Partager l'information entre véhicules et infrastructure pour voir au-delà du champ d'un seul capteur.",['Radar','Graph Neural Networks','LSTM']);
  dom(/deep/i,'Deep learning',"Réseaux convolutifs, ResNet, autoencodeurs et détecteurs, du jeu de données à l'évaluation.",['CNN','ResNet','Autoencodeurs','Data augmentation','Fine-tuning']);
  dom(/machine/i,'Machine learning',"Apprentissage supervisé et non supervisé sur des jeux de données annotés.",['Apprentissage supervisé','Apprentissage non supervisé','Analyse de datasets annotés']);
  dom(/vision/i,'Vision par ordinateur',"Détection, segmentation, tracking, reconstruction 3D et calibration de caméras.",['Segmentation',"Détection d'objets",'Tracking','Prédiction','Reconstruction 3D','Calibration caméra','Systèmes multi-capteurs']);
  dom(/signal/i,'Traitement du signal',"Analyse temps-fréquence, filtrage et échantillonnage.",['Filtrage','FFT','STFT','Convolution','Débruitage','Échantillonnage']);
  dom(/analyse de donn/i,'Analyse de données',"Filtrage, séries temporelles et estimation statistique.",['Filtrage','Séries temporelles','Statistiques','Probabilités','Détection','Estimation']);
  dom(/math/i,'Mathématiques',"Problèmes inverses et optimisation pour l'estimation et la restauration.",['Problèmes inverses','Optimisation','Estimation','Régularisation','Méthodes numériques']);
  dom(/physique/i,'Physique',"Bases solides en mécanique, électronique et optoélectronique.",['Mécanique','Électronique','Simulation multiphysique','Optoélectronique']);
  dom(/programmation/i,'Programmation',"Langages et bibliothèques pour prototyper, entraîner et évaluer des modèles.",['Python','PyTorch','NumPy','OpenCV','MATLAB','C++ (bases)']);
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){toast("Enregistrement local impossible (espace plein ?). Copie tes données pour ne rien perdre.")}}
function get(p){return p.split('.').reduce(function(o,k){return o==null?o:o[k]},D)}
function set(p,v){var ks=p.split('.'),l=ks.pop();ks.reduce(function(o,k){return o[k]},D)[l]=v}
function removeAt(p){var ks=p.split('.'),i=+ks.pop();get(ks.join('.')).splice(i,1)}
function move(spec){var a=spec.split('|'),ks=a[0].split('.'),i=+ks.pop(),arr=get(ks.join('.')),j=i+(+a[1]);if(j<0||j>=arr.length)return;var t=arr[i];arr[i]=arr[j];arr[j]=t}

var toastT;
function toast(m){var t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},2800)}

/* ---------- Briques de rendu ---------- */
function E(p,cls,tag){
  var v=get(p);if(v==null)v='';
  var shown=edit?v:clean(v);
  return '<'+(tag||'span')+' class="ed '+(cls||'')+(edit&&/À compléter/i.test(v)?' todo':'')+'" data-k="'+p+'"'+(edit?' contenteditable="true" spellcheck="false"':'')+'>'+esc(shown)+'</'+(tag||'span')+'>';
}
/* élément optionnel : absent en lecture s'il est vide */
function T(tag,cls,p,ecls){
  if(!edit&&clean(get(p))==='')return '';
  return '<'+tag+' class="'+cls+'">'+E(p,ecls)+'</'+tag+'>';
}
function strList(p,kind){
  var arr=get(p)||[],shown=0;
  var items=arr.map(function(_,i){
    var q=p+'.'+i;
    if(!edit&&clean(arr[i])==='')return '';
    shown++;
    return '<li class="'+(kind==='chips'?'chip':'')+'">'+E(q)+(edit?'<button class="x" type="button" data-del="'+q+'" aria-label="Supprimer">×</button>':'')+'</li>';
  }).join('');
  if(!edit&&!shown)return '';
  var add=edit?'<li><button class="add" type="button" data-add="str" data-path="'+p+'">+ Ajouter</button></li>':'';
  return kind==='chips'?'<ul class="chips">'+items+add+'</ul>':'<ul class="bul">'+items+add+'</ul>';
}
var RKEY={experiences:'company',projects:'title',education:'degree',domains:'name'};
var BASE=null;function base(){return BASE||(BASE=migrate(null))}
function missing(path){
  var k=RKEY[path];if(!k)return [];
  var have={};(D[path]||[]).forEach(function(x){have[clean(x[k]).toLowerCase()]=1});
  return base()[path].filter(function(x){var c=clean(x[k]).toLowerCase();return c&&!have[c]});
}
function addBtn(tpl,path,label){
  if(!edit)return '';
  var n=missing(path).length;
  return '<p style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap"><button class="add" type="button" data-add="'+tpl+'" data-path="'+path+'">+ '+label+'</button>'+(n?'<button class="add" type="button" data-restore="'+path+'">Remettre les éléments d’origine supprimés ('+n+')</button>':'')+'</p>';
}
function delBtn(p){return edit?'<div class="delbox"><button class="add" type="button" data-move="'+p+'|-1" aria-label="Monter">↑</button><button class="add" type="button" data-move="'+p+'|1" aria-label="Descendre">↓</button><button class="add" type="button" data-del="'+p+'">Supprimer</button></div>':''}
function head(eyebrow,title,sub){return '<div class="shead"><p class="eyebrow">/ '+eyebrow+'</p><h2>'+title+'</h2>'+(sub?'<p class="sub">'+sub+'</p>':'')+'</div>'}
function put(id,html){var s=$('#'+id);s.innerHTML=html;s.hidden=!html}
var GUIDE='<div class="guide"><b>Mode édition.</b> Clique sur n’importe quel texte pour le modifier. Les champs jaunes sont à compléter et restent invisibles pour les visiteurs tant qu’ils ne sont pas remplis. Les boutons ↑ ↓ réordonnent, « + Ajouter » crée une entrée, et la photo comme les projets acceptent une image. Tes PDF et tes GIF se téléversent directement depuis ton ordinateur. Tout est gardé dans ce navigateur ; clique sur « Publier » dans la barre noire en bas pour que les visiteurs voient tes changements.</div>';

/* couverture générative d'un projet, aux couleurs du thème */
function cover(seed){
  var h=0;for(var i=0;i<seed.length;i++)h=(h*31+seed.charCodeAt(i))>>>0;
  var c1='var(--blue)',c2='var(--rust)';
  function r(){h=(h*1664525+1013904223)>>>0;return h/4294967296}
  var f1=.25+r()*.4,f2=.25+r()*.4,p1=r()*6,p2=r()*6,cx=60+r()*200,cy=30+r()*80;
  var s='<svg class="cover" viewBox="0 0 320 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
  for(var y=0;y<7;y++)for(var x=0;x<16;x++){
    var px=10+x*20,py=10+y*20,v=.5+.5*Math.sin(x*f1+p1)*Math.cos(y*f2+p2),d=Math.hypot(px-cx,py-cy);
    s+='<circle cx="'+px+'" cy="'+py+'" r="'+(1+v*3.2).toFixed(1)+'" style="fill:'+(d<50?c1:'var(--line)')+'"/>';
  }
  var a=(r()*30-15).toFixed(0);
  s+='<rect x="'+(cx-28).toFixed(0)+'" y="'+(cy-13).toFixed(0)+'" width="56" height="26" rx="2" transform="rotate('+a+' '+cx.toFixed(0)+' '+cy.toFixed(0)+')" style="fill:none;stroke:'+c1+';stroke-width:1.6"/>';
  s+='<rect x="'+(cx+14).toFixed(0)+'" y="'+(cy-30).toFixed(0)+'" width="40" height="20" rx="2" stroke-dasharray="4 3" style="fill:none;stroke:'+c2+';stroke-width:1.4"/>';
  return s+'</svg>';
}
function projCover(x){return x.image?'<img class="cover" src="'+esc(x.image)+'" alt="">':cover(clean(x.title)||'projet')}

/* ---------- Sections ---------- */
function visibleRoles(){return (D.roles||[]).map(clean).filter(Boolean)}
function heroHTML(){
  var roles=visibleRoles();
  var nExp=D.experiences.filter(function(x){return edit||clean(x.company)}).length;
  var nPr=D.projects.filter(function(x){return edit||clean(x.title)}).length;
  var nDo=D.domains.filter(function(x){return edit||clean(x.name)}).length;
  var s='';
  if(edit||clean(D.status))s+='<p class="pill"><i></i>'+E('status')+'</p>';
  s+='<p class="eyebrow">Bonjour, je suis</p><h1>'+E('name')+'</h1>';
  s+='<p class="spec">Spécialisé en <span class="typed-wrap"><span id="typed">'+esc(roles[0]||'')+'</span><span class="caret" aria-hidden="true"></span></span></p>';
  s+='<p class="lead">'+E('tagline','multi')+'</p>';
  var cvOk=okUrl(D.links.cv);
  s+='<div class="cta">'+((cvOk||edit)?'<a class="btn" href="'+(cvOk?esc(clean(D.links.cv)):'#contact')+'" '+(cvOk?'target="_blank" rel="noopener"':'data-nocv')+'>Télécharger CV</a>':'')+'<a class="btn ghost" href="#contact">Me contacter</a><a class="btn ghost" href="#experiences">Voir mes expériences</a></div>';
  if(edit)s+='<div style="margin-top:28px"><p class="eyebrow" style="margin-bottom:8px">Mots qui défilent après « Spécialisé en »</p>'+strList('roles','chips')+'</div>';
  return s;
}
function readoutHTML(){
  var nExp=D.experiences.filter(function(x){return edit||clean(x.company)}).length;
  var nPr=D.projects.filter(function(x){return edit||clean(x.title)}).length;
  var nDo=D.domains.filter(function(x){return edit||clean(x.name)}).length;
  function row(l,n,h){return '<div class="ro-row"><span>'+l+'</span><b class="num" data-n="'+n+'" style="color:var(--'+h+'-t)">'+n+'</b></div>'}
  return row('Expériences',nExp,'blue')+row('Projets',nPr,'blue')+row('Domaines',nDo,'blue')+'<div class="ro-row"><span>Lieu</span><span class="v">'+E('location')+'</span></div>';
}
function aboutHTML(){
  var photo=D.photo?'<img src="'+esc(D.photo)+'" alt="Portrait">':'<span class="ini" aria-hidden="true">'+esc((D.name||'A').charAt(0).toUpperCase())+'</span>';
  var s=(edit?GUIDE:'')+'<div class="about-grid"><figure class="portrait" '+(edit?'data-photo role="button" tabindex="0" aria-label="Changer la photo"':'')+'>'+photo+(edit?'<span class="hint">Changer la photo</span>':'')+'</figure><div>';
  s+='<p class="eyebrow">/ À propos</p><h2 style="margin-top:10px">À propos de moi</h2><p class="about-body">'+E('about','multi')+'</p>';
  s+='<div class="chips pad">'+(D.badges||[]).map(function(b,i){if(!edit&&!clean(b))return '';return '<span class="chip big">'+E('badges.'+i)+(edit?'<button class="x" type="button" data-del="badges.'+i+'" aria-label="Supprimer">×</button>':'')+'</span>'}).join('')+(edit?'<button class="add" type="button" data-add="str" data-path="badges">+ Ajouter</button>':'')+'</div>';
  s+='<ul class="facts">'+(D.highlights||[]).map(function(h,i){if(!edit&&!clean(h))return '';return '<li><span>'+E('highlights.'+i)+'</span>'+(edit?'<button class="x" type="button" data-del="highlights.'+i+'" aria-label="Supprimer">×</button>':'')+'</li>'}).join('')+(edit?'<li><button class="add" type="button" data-add="str" data-path="highlights">+ Ajouter</button></li>':'')+'</ul>';
  var langs=D.languages.map(function(l,i){
    if(!edit&&(!clean(l.name)||!clean(l.level)))return '';
    return '<li><span>'+E('languages.'+i+'.name')+'</span><span class="lv">'+E('languages.'+i+'.level')+(edit?' <button class="x" type="button" data-del="languages.'+i+'" aria-label="Supprimer">×</button>':'')+'</span></li>';
  }).join('');
  if(langs||edit)s+='<h3 class="sub-h">Langues</h3><ul class="facts" style="margin-top:0">'+langs+(edit?'<li><button class="add" type="button" data-add="lang" data-path="languages">+ Ajouter une langue</button></li>':'')+'</ul>';
  var ints=strList('interests','chips');
  if(ints||edit)s+='<h3 class="sub-h">Centres d’intérêt</h3>'+ints;
  return s+'</div></div>';
}
/* documents (rapports, PDF) : fichier importé depuis l'ordinateur, ou lien */
function docsHTML(p,ro){
  var arr=get(p)||[];
  var items=arr.map(function(d,i){
    var q=p+'.'+i;
    if(!edit||ro){
      if(!okUrl(d.url)||!clean(d.label))return '';
      var u=clean(d.url),pdf=d.kind==='pdf'||/\.pdf([?#]|$)/i.test(u);
      return '<li><a class="doc" href="'+esc(u)+'" target="_blank" rel="noopener"><span class="tag">'+(pdf?'PDF':'LIEN')+'</span>'+esc(clean(d.label))+' ↗</a></li>';
    }
    var has=okUrl(d.url),up=isBlob(d.url),lk=d.kind==='link'||(has&&!up);
    return '<li class="docedit"><span>'+E(q+'.label')+'</span>'+
      (up?'<span class="eyebrow">PDF importé</span>':(lk?'<span style="font-family:var(--f-mono);font-size:12.5px">'+E(q+'.url')+'</span>':'<span class="eyebrow">Aucun fichier</span>'))+
      (lk?'':'<button class="add" type="button" data-docup="'+q+'">'+(up?'Remplacer le PDF':'Importer un PDF')+'</button>')+
      '<button class="x" type="button" data-del="'+q+'" aria-label="Supprimer">×</button></li>';
  }).join('');
  if(!edit||ro)return items?'<ul class="docs">'+items+'</ul>':'';
  return '<div class="docs-edit"><p class="eyebrow">Documents : rapport, PDF</p><ul class="docs">'+items+'</ul><button class="add" type="button" data-docnew="'+p+'">+ Importer un PDF depuis mon ordinateur</button> <button class="add" type="button" data-add="doclink" data-path="'+p+'">+ Ajouter un lien</button></div>';
}
function mediaFig(i,j){
  var m=D.experiences[i].medias[j],fr=m.frames||[],src=clean(m.src),hosted=!!(src&&okUrl(src));
  if(!fr.length&&!hosted)return '';
  var p='experiences.'+i+'.medias.'+j,key=i+'-'+j,cap=clean(m.caption),alt=esc(cap||'Illustration');
  var h='<figure class="media" data-mk="'+key+'"><div class="stage">';
  if(hosted)h+=(m.kind==='video'||/\.(mp4|webm)([?#]|$)/i.test(src))?'<video src="'+esc(src)+'" autoplay muted loop playsinline controls></video>':'<img src="'+esc(src)+'" alt="'+alt+'">';
  else h+='<img class="mimg" src="'+esc(fr[0])+'" alt="'+alt+'">';
  h+='</div>';
  if(!hosted&&fr.length>1)h+='<div class="ctl"><button type="button" data-mtoggle="'+key+'">Pause</button><button type="button" data-mprev="'+key+'" aria-label="Image précédente">←</button><button type="button" data-mnext="'+key+'" aria-label="Image suivante">→</button><span class="dots">'+fr.map(function(){return '<i></i>'}).join('')+'</span></div>';
  if(edit||cap)h+='<figcaption>'+E(p+'.caption')+'</figcaption>';
  h+='</figure>';
  if(edit)h+='<div class="mtools"><button class="add" type="button" data-move="'+p+'|-1" aria-label="Avancer">↑</button><button class="add" type="button" data-move="'+p+'|1" aria-label="Reculer">↓</button><button class="add" type="button" data-del="'+p+'">Retirer</button>'+(!hosted&&fr.length>1?'<span class="eyebrow">ms par image</span>'+E(p+'.ms'):'')+'</div>';
  return '<div class="mitem">'+h+'</div>';
}
function mediaRow(i){
  var ms=D.experiences[i].medias||[],figs=ms.map(function(_,j){return mediaFig(i,j)}).join('');
  if(!figs&&!edit)return '';
  var n=ms.filter(function(m){return (m.frames||[]).length||clean(m.src)}).length;
  var slot=(!figs&&edit)?'<div class="slot">Emplacement pour un ou plusieurs GIF, vidéos ou diaporamas, affichés sous cette expérience. Invisible pour les visiteurs tant qu\'il est vide.</div>':'';
  var tools=edit?'<div class="mtools"><button class="add" type="button" data-mediaup="'+i+'">+ Importer un GIF ou une vidéo</button><button class="add" type="button" data-slideup="'+i+'">+ Créer un diaporama (images ou vidéo)</button></div>':'';
  return '<div class="row media-row"><div class="when">Média</div><div>'+slot+(figs?'<div class="mgrid'+(n>1?' two':'')+'">'+figs+'</div>':'')+tools+'</div></div>';
}
function codeRow(i){
  var cs=D.experiences[i].codes||[],p0='experiences.'+i+'.codes';
  var items=cs.map(function(c,j){
    var p=p0+'.'+j;
    if(!edit){
      if(!String(c.code||'').trim())return '';
      return '<details class="code"><summary><span>'+esc(clean(c.title)||'Script')+'</span><span class="lg">'+esc(clean(c.lang))+'</span></summary><div class="ctools"><button class="add" type="button" data-copy="'+p+'.code">Copier le code</button></div><pre><code>'+esc(String(c.code).replace(/\s+$/,''))+'</code></pre></details>';
    }
    return '<div class="code edit"><div class="chead">'+E(p+'.title','ctitle')+'<span class="lg">'+E(p+'.lang')+'</span><span class="mtools" style="margin:0"><button class="add" type="button" data-move="'+p+'|-1" aria-label="Monter">↑</button><button class="add" type="button" data-move="'+p+'|1" aria-label="Descendre">↓</button><button class="add" type="button" data-del="'+p+'">Retirer</button></span></div><pre>'+E(p+'.code','multi codebox','code')+'</pre></div>';
  }).join('');
  var ltsi=/ltsi/i.test(D.experiences[i].company||'');
  if(!items.replace(/\s/g,'')&&!(edit&&(ltsi||cs.length)))return '';
  var tools=edit?'<div class="mtools"><button class="add" type="button" data-codeup="'+i+'">+ Importer un script depuis mon ordinateur</button><button class="add" type="button" data-add="code" data-path="'+p0+'">+ Écrire un extrait</button></div>':'';
  var slot=(!items&&edit)?'<div class="slot">Emplacement pour quelques scripts légers (Python, MATLAB…), affichés sous cette expérience. Invisible pour les visiteurs tant qu\'il est vide.</div>':'';
  return '<div class="row media-row"><div class="when">Quelques codes</div><div>'+slot+items+tools+'</div></div>';
}
function expHTML(){
  var idx=[];D.experiences.forEach(function(x,i){if(edit||clean(x.company))idx.push(i)});
  if(!idx.length)return '';
  var ai=-1;idx.forEach(function(i){if(ai<0&&/alten/i.test(D.experiences[i].company))ai=i});
  if(ai<0)ai=idx[idx.length-1];
  var slotRow='<div class="row scene-row"><div class="when">Illustration</div><div id="sceneSlot"></div></div>';
  var s=head('Parcours professionnel','Expériences','Stages et missions. Ouvre une expérience pour voir les missions, les défis et les résultats.');
  s+='<div class="rows">'+idx.map(function(i){
    var p='experiences.'+i;
    return '<article class="row"><div class="when">'+E(p+'.period')+'</div><div><h3>'+E(p+'.company')+'</h3>'+T('p','role',p+'.role')+T('p','place',p+'.place')+T('p','sum multi',p+'.summary')+'<div style="margin-top:14px">'+strList(p+'.tech','chips')+'</div>'+docsHTML(p+'.docs')+'<button class="link" type="button" data-openm="exp:'+i+'">Voir le détail →</button></div>'+delBtn(p)+'</article>'+(i===ai?slotRow:'')+mediaRow(i)+codeRow(i);
  }).join('')+'</div>'+addBtn('exp','experiences','Ajouter une expérience');
  return s;
}
function usedIn(i){
  var d=D.domains[i],tok={};
  (d.tech||[]).concat([d.name]).forEach(function(t){var c=clean(t).toLowerCase();if(c)tok[c]=1});
  var hit=function(list){return (list||[]).some(function(t){return tok[clean(t).toLowerCase()]})};
  var out=[];
  D.experiences.forEach(function(x,j){if(clean(x.company)&&hit(x.tech))out.push({k:'exp:'+j,l:clean(x.company)})});
  D.projects.forEach(function(x,j){if(clean(x.title)&&hit(x.tags))out.push({k:'proj:'+j,l:clean(x.title)})});
  return out;
}
function domHTML(){
  var idx=[];D.domains.forEach(function(x,i){if(edit||clean(x.name))idx.push(i)});
  if(!idx.length)return '';
  if(idx.indexOf(activeDom)<0)activeDom=idx[0];
  var i=activeDom,p='domains.'+i;
  var s=head('Expertise technique','Compétences','Choisis un domaine pour voir les outils associés et les travaux où je les ai utilisés.');
  s+='<div class="dx"><div class="dx-tabs" role="tablist">'+idx.map(function(j){
    return '<button type="button" role="tab" class="dx-tab" data-dom="'+j+'" aria-selected="'+(j===i)+'"><span class="tl"><i class="sq" style="background:var(--accent)"></i><span data-dn="'+j+'">'+esc(edit?D.domains[j].name:clean(D.domains[j].name))+'</span></span></button>';
  }).join('')+(edit?'<p style="padding:12px 0"><button class="add" type="button" data-add="dom" data-path="domains">+ Ajouter un domaine</button></p>':'')+'</div>';
  var used=usedIn(i);
  s+='<div class="dx-panel" role="tabpanel"><h3>'+E(p+'.name')+'</h3>'+T('p','d multi',p+'.desc')+strList(p+'.tech','chips');
  if(used.length)s+='<div class="used"><p class="eyebrow">Où je l’ai utilisé</p><ul>'+used.map(function(u){return '<li><button type="button" data-openm="'+u.k+'">'+esc(u.l)+' →</button></li>'}).join('')+'</ul></div>';
  else if(edit)s+='<p class="used none">Les liens apparaissent quand un mot-clé de ce domaine figure dans les technologies d’une expérience ou dans les mots-clés d’un projet.</p>';
  s+=(edit?'<div style="position:relative;height:30px">'+delBtn(p).replace('top:10px','')+'</div>':'')+'</div></div>';
  return s;
}
function projHTML(){
  var idx=[];D.projects.forEach(function(x,i){if(edit||clean(x.title))idx.push(i)});
  if(!idx.length)return '';
  var tags=['Tous'];
  idx.forEach(function(i){(D.projects[i].tags||[]).forEach(function(t){var c=clean(t);if(c&&tags.indexOf(c)<0)tags.push(c)})});
  if(tags.indexOf(filter)<0)filter='Tous';
  var s=head('Réalisations','Projets','Travaux académiques et de recherche. Ouvre un projet pour la méthode et les résultats.');
  s+='<div class="filters" role="group" aria-label="Filtrer par thème">'+tags.map(function(t){return '<button type="button" data-filter="'+esc(t)+'" aria-pressed="'+(t===filter)+'">'+esc(t)+'</button>'}).join('')+'</div>';
  s+='<div class="projects">'+idx.map(function(i){
    var x=D.projects[i];
    if(filter!=='Tous'&&(x.tags||[]).map(clean).indexOf(filter)<0)return '';
    var p='projects.'+i;
    var tools=edit?'<div class="imgtools"><button class="add" type="button" data-projimg="'+i+'">'+(x.image?"Changer l'image":"Ajouter une image")+'</button>'+(x.image?'<button class="add" type="button" data-rmimg="'+i+'">Retirer l’image</button>':'')+'</div>':'';
    var link=edit?'<p style="font:400 12px var(--f-mono);color:var(--muted)">Lien : '+E(p+'.link')+'</p>':(okUrl(x.link)?'<a class="go" href="'+esc(x.link)+'" target="_blank" rel="noopener">Voir le projet ↗</a>':'');
    return '<article class="proj">'+projCover(x)+'<div class="pbody"><h3>'+E(p+'.title')+'</h3>'+T('p','d multi',p+'.desc')+strList(p+'.tags','chips')+docsHTML(p+'.docs')+tools+link+'<button class="link" type="button" data-openm="proj:'+i+'" style="margin-top:0;justify-self:start">Voir le détail →</button></div>'+delBtn(p)+'</article>';
  }).join('')+'</div>'+addBtn('proj','projects','Ajouter un projet');
  return s;
}
function certHTML(){
  var idx=[];D.certifications.forEach(function(x,i){if(edit||clean(x.title))idx.push(i)});
  if(!idx.length&&!edit)return '';
  var s=head('Attestations','Certifications');
  s+='<div class="rows">'+idx.map(function(i){
    var p='certifications.'+i;
    return '<article class="row"><div class="when">'+E(p+'.year')+'</div><div><h3>'+E(p+'.title')+'</h3>'+T('p','place',p+'.issuer')+'</div>'+delBtn(p)+'</article>';
  }).join('')+'</div>'+addBtn('cert','certifications','Ajouter une certification');
  return s;
}
function eduHTML(){
  var idx=[];D.education.forEach(function(x,i){if(edit||clean(x.school)||clean(x.degree))idx.push(i)});
  if(!idx.length)return '';
  var s=head('Parcours académique','Formation');
  s+='<div class="rows">'+idx.map(function(i){
    var p='education.'+i,sc=edit||clean(D.education[i].school);
    return '<article class="row"><div class="when">'+E(p+'.period')+'</div><div><h3>'+(sc?E(p+'.school'):E(p+'.degree'))+'</h3>'+(sc?T('p','role',p+'.degree'):'')+T('p','sum multi',p+'.detail')+'</div>'+delBtn(p)+'</article>';
  }).join('')+'</div>'+addBtn('edu','education','Ajouter une formation');
  return s;
}
function contactHTML(){
  var all=[['calendly','Prendre rendez-vous','Réserver un créneau pour un échange'],['linkedin','LinkedIn','Se connecter sur le réseau professionnel'],['email','E-mail','Envoyer un message détaillé'],['phone','Téléphone','Appeler ou envoyer un message'],['github','GitHub','Code et projets']];
  if(edit)all.push(['cv','CV','Lien du bouton « Télécharger CV »']);
  var rows=all.filter(function(r){return edit||clean(D.links[r[0]])});
  var s=head('Me joindre','Discutons','Un projet, une collaboration, un stage, une thèse ou simplement un échange sur la vision, le signal ou l’intelligence artificielle : écris-moi.');
  s+='<div class="contact">'+rows.map(function(r){
    var v=clean(D.links[r[0]]);
    return '<div class="crow"><div><h3>'+r[1]+'</h3><p>'+r[2]+'</p></div><div class="cval">'+E('links.'+r[0])+'</div><div class="cact">'+(okUrl(v)?'<a class="btn ghost small" href="'+esc(v)+'" target="_blank" rel="noopener">Ouvrir ↗</a>':'')+(v?'<button class="btn ghost small" type="button" data-copy="links.'+r[0]+'">Copier</button>':'')+'</div></div>';
  }).join('')+'</div>';
  return s;
}
function blk(t,b){return b?'<div><h4>'+t+'</h4>'+b+'</div>':''}
function strBlock(t,p){return (edit||clean(get(p))!=='')?blk(t,'<p class="multi">'+E(p)+'</p>'):''}
function modalHTML(){
  if(!openM)return '';
  var kind=openM.k,i=openM.i;
  if(kind==='exp'){
    var x=D.experiences[i];if(!x)return '';var p='experiences.'+i;
    return '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt"><header><div><p class="eyebrow">'+E(p+'.period')+' · '+E(p+'.place')+'</p><h2 id="mt" style="margin-top:8px">'+E(p+'.company')+'</h2><p style="color:var(--accent);font-weight:500;margin-top:4px">'+E(p+'.role')+'</p></div><button class="ibtn" type="button" data-close aria-label="Fermer">Fermer</button></header>'+
      blk('Missions principales',strList(p+'.missions'))+blk('Technologies utilisées',strList(p+'.tech','chips'))+blk('Réalisations clés',strList(p+'.achievements'))+blk('Défis relevés',strList(p+'.challenges'))+strBlock('Environnement de travail',p+'.environment')+strBlock('Impact et résultats',p+'.impact')+blk('Documents',docsHTML(p+'.docs',true))+'</div>';
  }
  var y=D.projects[i];if(!y)return '';var q='projects.'+i;
  return '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt"><header><div><p class="eyebrow">Projet</p><h2 id="mt" style="margin-top:8px">'+E(q+'.title')+'</h2></div><button class="ibtn" type="button" data-close aria-label="Fermer">Fermer</button></header>'+projCover(y)+
    strBlock('Contexte',q+'.desc')+strBlock('Méthode',q+'.method')+strBlock('Résultats',q+'.results')+blk('Mots-clés',strList(q+'.tags','chips'))+blk('Documents',docsHTML(q+'.docs',true))+(okUrl(y.link)?'<p><a class="btn small" href="'+esc(y.link)+'" target="_blank" rel="noopener">Voir le projet ↗</a></p>':'')+'</div>';
}

function render(){
  put('heroText',heroHTML()); $('#accueil').hidden=false;
  $('#readout').innerHTML=readoutHTML();
  put('apropos',aboutHTML());
  var fig=$('#scene');$('#holder').appendChild(fig);
  put('experiences',expHTML());
  var slot=$('#sceneSlot');if(slot)slot.appendChild(fig);
  put('competences',domHTML());
  put('projets',projHTML());
  put('certifications',certHTML());
  put('formation',eduHTML());
  put('contact',contactHTML());
  $('#foot').textContent='© 2026 '+(D.name||'')+'. Tous droits réservés.';
  $('#brand').textContent=(clean(D.name)||'A').charAt(0).toUpperCase();
  $$('#nav a').forEach(function(a){var s=$(a.getAttribute('href'));a.hidden=!!(s&&s.hidden)});
  renderModal();
  document.body.classList.toggle('editing',edit);
  $('#editBtn').style.display=canEdit?'':'none';
  $('#editBtn').setAttribute('aria-pressed',edit);
  $('#editBtn').textContent=edit?'Terminer':'Éditer';
  $('#tb').hidden=!edit;
  $('#pubBtn').hidden=!CAP.artifact;
  updateTodo();
  startShows();
}
function renderModal(){
  var m=$('#modal'),html=modalHTML();
  if(!html){m.hidden=true;m.innerHTML='';openM=null;document.documentElement.classList.remove('modal-open');return}
  m.innerHTML=html;m.hidden=false;document.documentElement.classList.add('modal-open');
}
function updateTodo(){
  var c=JSON.stringify(Object.assign({},D,{photo:''})).split(TODO).length-1;
  $('#cnt').textContent=c?c+' champ'+(c>1?'s':'')+' à compléter':'Tout est rempli';
}

/* ---------- Interactions ---------- */
function copyText(t){
  function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}a.remove();toast(ok?'Copié':'Copie impossible : sélectionne le texte à la main')}
  try{navigator.clipboard.writeText(t).then(function(){toast('Copié')},fb)}catch(e){fb()}
}
document.addEventListener('input',function(e){
  var el=e.target.closest&&e.target.closest('[data-k]');if(!el||!edit)return;
  var k=el.dataset.k;
  set(k,el.innerText.replace(/\n+$/,''));
  el.classList.toggle('todo',/À compléter/i.test(el.textContent));
  var m=/^domains\.(\d+)\.name$/.exec(k);
  if(m){var tab=$('[data-dn="'+m[1]+'"]');if(tab)tab.textContent=el.textContent}
  save();updateTodo();
});
document.addEventListener('keydown',function(e){
  var el=e.target.closest&&e.target.closest('[data-k]');
  if(el&&edit&&e.key==='Enter'&&!el.classList.contains('multi')){e.preventDefault();el.blur()}
  if(e.key==='Escape'&&openM){openM=null;renderModal()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-photo]')){e.preventDefault();imgTarget='photo';$('#photoIn').click()}
});
document.addEventListener('paste',function(e){
  var el=e.target.closest&&e.target.closest('[data-k]');if(!el||!edit)return;
  e.preventDefault();var t=(e.clipboardData||window.clipboardData).getData('text');document.execCommand('insertText',false,t);
});
document.addEventListener('click',function(e){
  var t=e.target.closest('button,a,[data-photo],#modal,.scope-box');if(!t)return;
  var d=t.dataset;
  if(t.id==='modal'){if(e.target===t){openM=null;renderModal()}return}
  if(t.classList.contains('scope-box')){bevCtl&&bevCtl.toggle(true);return}
  if(d.photo!=null){imgTarget='photo';$('#photoIn').click();return}
  if(d.v2x!=null){bevCtl&&bevCtl.set(d.v2x==='1',true);return}
  if(d.openm!=null){var a=d.openm.split(':');openM={k:a[0],i:+a[1]};renderModal();var cb=$('[data-close]');if(cb)cb.focus();return}
  if(d.close!=null){openM=null;renderModal();return}
  if(d.edit!=null){if(!canEdit)return;edit=!edit;render();return}
  if(d.themeToggle!=null){var dark=effDark();document.documentElement.dataset.theme=dark?'light':'dark';try{localStorage.setItem(KEY+'-theme',dark?'light':'dark')}catch(_){}return}
  if(d.filter!=null){filter=d.filter;put('projets',projHTML());return}
  if(d.dom!=null){activeDom=+d.dom;put('competences',domHTML());return}
  if(d.add!=null){get(d.path).push(TPL[d.add]());save();render();return}
  if(d.del!=null){removeAt(d.del);save();render();return}
  if(d.move!=null){move(d.move);save();render();return}
  if(d.restore!=null){var ms=missing(d.restore);ms.forEach(function(x){D[d.restore].push(clone(x))});save();render();toast(ms.length+' élément'+(ms.length>1?'s':'')+' remis en fin de liste');return}
  if(d.mediaup!=null){mediaTarget=+d.mediaup;$('#mediaIn').click();return}
  if(d.codeup!=null){codeTarget=+d.codeup;$('#codeIn').click();return}
  if(d.slideup!=null){mediaTarget=+d.slideup;$('#slideIn').click();return}
  if(d.docup!=null){docTarget=d.docup;$('#docIn').click();return}
  if(d.docnew!=null){var da=get(d.docnew);da.push(TPL.doc());docTarget=d.docnew+'.'+(da.length-1);$('#docIn').click();return}
  if(d.publish!=null){publish(t);return}
  if(d.dlstate!=null){var bl=new Blob([JSON.stringify(D)],{type:'application/json'}),au=document.createElement('a');au.href=URL.createObjectURL(bl);au.download='state.json';document.body.appendChild(au);au.click();au.remove();toast('state.json téléchargé : dépose-le dans ton dépôt GitHub, à côté de index.html.');return}
  if(d.mtoggle!=null){var st=shows[d.mtoggle];if(st){st.paused=!st.paused;syncToggle(d.mtoggle)}return}
  if(d.mprev!=null||d.mnext!=null){var mi=d.mprev!=null?d.mprev:d.mnext,s2=shows[mi]||(shows[mi]={k:0,paused:reduce});showAt(mi,s2.k+(d.mprev!=null?-1:1));return}
  if(d.projimg!=null){imgTarget='projects.'+d.projimg+'.image';$('#photoIn').click();return}
  if(d.rmimg!=null){D.projects[+d.rmimg].image='';save();render();return}
  if(d.copy!=null){copyText(clean(get(d.copy)));return}
  if(d.export!=null){var ex=clone(D);ex.photo='';ex.projects.forEach(function(p){p.image=''});ex.experiences.forEach(function(x){x.medias.forEach(function(m){m.frames=[]})});copyText(JSON.stringify(ex,null,1));toast('Données copiées (sans la photo, les images ni les médias)');return}
  if(d.importToggle!=null){$('#imp').hidden=!$('#imp').hidden;return}
  if(d.apply!=null){
    try{var o=JSON.parse($('#impTxt').value);if(!o||typeof o!=='object'||!o.experiences)throw 0;var old=D;D=migrate(o);if(!D.photo)D.photo=old.photo;D.projects.forEach(function(p,i){if(!p.image&&old.projects[i])p.image=old.projects[i].image||''});D.experiences.forEach(function(x,i){x.medias.forEach(function(m,j){var om=old.experiences[i]&&old.experiences[i].medias[j];if(om&&!(m.frames||[]).length)m.frames=om.frames||[]})});save();$('#imp').hidden=true;$('#impTxt').value='';render();toast('Données importées')}
    catch(_){toast("Ces données ne sont pas valides : colle le texte copié avec « Copier les données ».")}
    return}
  if(d.reset!=null){
    if(Date.now()<resetArm){D=migrate(null);save();resetArm=0;t.textContent='Réinitialiser';render();toast('Modèle de départ restauré')}
    else{resetArm=Date.now()+4000;t.textContent='Confirmer (efface tout)';setTimeout(function(){if(Date.now()>=resetArm)t.textContent='Réinitialiser'},4100)}
    return}
  if(d.nocv!=null){e.preventDefault();toast("Ajoute le lien de ton CV : mode Éditer, section Contact.");return}
});
$('#photoIn').addEventListener('change',function(){
  var f=this.files&&this.files[0];if(!f)return;
  var target=imgTarget,max=target==='photo'?480:720,r=new FileReader();
  r.onload=function(){
    var im=new Image();
    im.onload=function(){
      var w=Math.min(max,im.width),h=Math.round(im.height*w/im.width),c=document.createElement('canvas');
      c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);
      set(target,c.toDataURL('image/jpeg',.82));save();render();
    };
    im.onerror=function(){toast("Image illisible.")};
    im.src=r.result;
  };
  r.readAsDataURL(f);this.value='';
});

/* ---------- Scripts : lus comme du texte, stockés avec la page ---------- */
var codeTarget=0;
$('#codeIn').addEventListener('change',function(){
  var fs=Array.prototype.slice.call(this.files||[]).slice(0,5),i=codeTarget;this.value='';
  if(!fs.length||!D.experiences[i])return;
  var L={py:'Python',m:'MATLAB',c:'C',cpp:'C++',h:'C',js:'JavaScript',sh:'Shell',r:'R',ipynb:'Notebook',json:'JSON',md:'Markdown',txt:'Texte'};
  var left=fs.length,bad=0;
  fs.forEach(function(f){
    if(f.size>80000){bad++;if(--left===0)fin();return}
    var r=new FileReader();
    r.onload=function(){var x=(f.name.split('.').pop()||'').toLowerCase();D.experiences[i].codes.push({title:f.name,lang:L[x]||'Texte',code:String(r.result)});if(--left===0)fin()};
    r.onerror=function(){bad++;if(--left===0)fin()};
    r.readAsText(f);
  });
  function fin(){save();render();toast(bad?'Fichier trop lourd ou illisible (80 Ko maximum par script).':'Script ajouté. Clique sur Publier pour le rendre visible.')}
});

/* ---------- Import de fichiers (PDF, GIF, vidéo) vers l'hébergement de la page ---------- */
var CAP={},PUB=null,canEdit=false,docTarget='';
var MT={pdf:'application/pdf',gif:'image/gif',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',mp4:'video/mp4',webm:'video/webm'};
function mtype(f){var x=(f.name.split('.').pop()||'').toLowerCase();return MT[x]||f.type||''}
function upload(f){
  return new Promise(function(ok,ko){
    if(!CAP.assets){ko({code:'local'});return}
    if(f.size>20*1048576){ko({code:'big'});return}
    var ty=mtype(f);if(!ty){ko({code:'type'});return}
    CAP.assets.upload(f,{type:ty}).then(ok,ko);
  });
}
function upErr(e){
  var c=e&&e.code;
  toast(c==='local'?"Dépose le PDF ou le GIF dans le dépôt GitHub, à côté de index.html, puis utilise « + Ajouter un lien » et saisis son nom (par exemple rapport.pdf).":
        c==='big'?"Fichier trop lourd : 20 Mo maximum.":
        c==='type'?"Format non reconnu (PDF, GIF, PNG, JPG, WebP, MP4 ou WebM).":
        "Import refusé"+(c?' ('+c+')':'')+".");
}
$('#docIn').addEventListener('change',function(){
  var f=this.files&&this.files[0],t=docTarget;this.value='';if(!f||!t)return;
  var d=get(t);if(!d)return;
  if(!/\.pdf$/i.test(f.name)&&f.type!=='application/pdf'){toast('Choisis un fichier PDF.');render();return}
  toast('Import du PDF…');
  upload(f).then(function(r){
    d.url='/_blob/'+r.id;d.kind='pdf';
    if(!clean(d.label)||hasTodo(d.label))d.label=f.name.replace(/\.pdf$/i,'').replace(/[_]+/g,' ');
    save();render();toast('PDF importé. Clique sur Publier pour le rendre visible.');
  },function(e){upErr(e);render()});
});
$('#mediaIn').addEventListener('change',function(){
  var files=Array.prototype.slice.call(this.files||[]).slice(0,6),i=mediaTarget;this.value='';
  if(!files.length||!D.experiences[i])return;
  toast('Import en cours…');
  var chain=Promise.resolve(),n=0,err=null;
  files.forEach(function(f){
    chain=chain.then(function(){return upload(f)}).then(function(r){
      var m=TPL.med();m.src='/_blob/'+r.id;m.kind=/^video\//.test(mtype(f))?'video':'image';
      D.experiences[i].medias.push(m);n++;
    },function(e){err=e});
  });
  chain.then(function(){
    if(n){save();render();toast(n+' média'+(n>1?'s':'')+' ajouté'+(n>1?'s':'')+'. Clique sur Publier pour le rendre visible.')}
    if(err)upErr(err);
  });
});

/* ---------- Diaporama : vidéo ou images transformées en images successives ---------- */
var shows={},timers=[],mediaTarget=0;
function mget(key){var a=key.split('-'),x=D.experiences[+a[0]];return x&&x.medias[+a[1]]}
function showAt(key,k){
  var fig=$('.media[data-mk="'+key+'"]'),m=mget(key);if(!fig||!m)return;
  var fr=m.frames||[];if(!fr.length)return;
  var st=shows[key]||(shows[key]={k:0,paused:reduce});
  st.k=((k%fr.length)+fr.length)%fr.length;
  var img=$('.mimg',fig);if(img)img.src=fr[st.k];
  $$('.dots i',fig).forEach(function(d,n){d.classList.toggle('on',n===st.k)});
}
function syncToggle(key){var b=$('[data-mtoggle="'+key+'"]');if(b&&shows[key])b.textContent=shows[key].paused?'Lecture':'Pause'}
function startShows(){
  timers.forEach(clearInterval);timers=[];
  $$('.media[data-mk]').forEach(function(fig){
    var key=fig.dataset.mk,m=mget(key);if(!m)return;
    var fr=m.frames||[];
    if(clean(m.src)||fr.length<2)return;
    var st=shows[key]||(shows[key]={k:0,paused:reduce});
    showAt(key,st.k);syncToggle(key);
    var ms=Math.max(300,parseInt(m.ms,10)||2500);
    timers.push(setInterval(function(){if(!st.paused&&!document.hidden)showAt(key,st.k+1)},ms));
  });
}
function readRaw(file,cb){var r=new FileReader();r.onload=function(){cb(r.result)};r.onerror=function(){cb(null)};r.readAsDataURL(file)}
function shrink(file,max,cb){
  readRaw(file,function(src){
    if(!src){cb(null);return}
    var im=new Image();
    im.onload=function(){var w=Math.min(max,im.width),h=Math.round(im.height*w/im.width),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);cb(c.toDataURL('image/jpeg',.78))};
    im.onerror=function(){cb(null)};im.src=src;
  });
}
function extractFrames(file,n,cb){
  var v=document.createElement('video'),url=URL.createObjectURL(file),done=false,frames=[],i=0;
  v.muted=true;v.playsInline=true;v.preload='auto';
  function end(fr,dur){if(done)return;done=true;URL.revokeObjectURL(url);cb(fr,dur)}
  v.onerror=function(){end(null)};
  var guard=setTimeout(function(){end(null)},25000);
  v.onloadedmetadata=function(){
    var dur=isFinite(v.duration)?v.duration:0;
    if(!dur||!v.videoWidth){end(null);return}
    var w=Math.min(800,v.videoWidth),h=Math.round(v.videoHeight*w/v.videoWidth),c=document.createElement('canvas');
    c.width=w;c.height=h;var x=c.getContext('2d');
    function seek(){v.currentTime=Math.min(Math.max(dur-.05,0),(i+.5)*dur/n)}
    v.onseeked=function(){
      try{x.drawImage(v,0,0,w,h);frames.push(c.toDataURL('image/jpeg',.78))}catch(e){clearTimeout(guard);end(null);return}
      i++;if(i<n)seek();else{clearTimeout(guard);end(frames,dur)}
    };
    seek();
  };
  v.src=url;
}
$('#slideIn').addEventListener('change',function(){
  var files=Array.prototype.slice.call(this.files||[]).slice(0,12),i=mediaTarget;this.value='';
  if(!files.length||!D.experiences[i])return;
  var m=TPL.med(),meds=D.experiences[i].medias;
  var vid=files.filter(function(f){return /^video\//.test(f.type)})[0];
  toast('Traitement du média…');
  if(vid){
    extractFrames(vid,10,function(fr,dur){
      if(!fr){toast("Cette vidéo n'a pas pu être lue dans ce navigateur. Importe-la plutôt comme GIF ou vidéo.");return}
      m.frames=fr;m.ms=String(Math.max(300,Math.round(dur*1000/fr.length)));meds.push(m);save();render();toast('Vidéo convertie en diaporama de '+fr.length+' images');
    });
    return;
  }
  var out=new Array(files.length),left=files.length;
  files.forEach(function(f,k){
    shrink(f,800,function(u){
      out[k]=u;
      if(--left===0){
        var fr=out.filter(Boolean);
        if(!fr.length){toast("Image illisible.");return}
        m.frames=fr;m.ms='2500';meds.push(m);save();render();toast(fr.length+' image'+(fr.length>1?'s':'')+' ajoutée'+(fr.length>1?'s':''));
      }
    });
  });
});

/* ---------- Publication : les changements deviennent visibles pour les visiteurs ---------- */
function publish(btn){
  var a=CAP.artifact;
  if(!a){toast("La publication marche sur la page publiée, ouverte avec ton compte.");return}
  btn.disabled=true;toast('Publication…');
  a.publish({'state.json':{content:JSON.stringify(D),contentType:'application/json'}}).then(function(){
    btn.disabled=false;toast('Publié. Les visiteurs verront ces changements au prochain chargement.');
  },function(e){
    btn.disabled=false;var c=e&&e.code;
    toast(c==='conflict'?'Une version plus récente existe : la page va se recharger.':c==='not_writer'?"Seul le propriétaire peut publier.":'Publication impossible'+(c?' ('+c+')':'')+'.');
  });
}

/* ---------- Thème ---------- */
function effDark(){var t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
try{var th=localStorage.getItem(KEY+'-theme');if(th==='dark'||th==='light')document.documentElement.dataset.theme=th}catch(_){}

/* ---------- Texte qui défile ---------- */
var cur=null,ti=0,mode='erase';
function tick(){
  var el=$('#typed'),roles=visibleRoles();
  if(!el||!roles.length){setTimeout(tick,700);return}
  cur=el.textContent;
  if(mode==='hold'){mode='erase';setTimeout(tick,1600);return}
  if(mode==='erase'){
    if(cur.length>0){cur=cur.slice(0,-1);el.textContent=cur;setTimeout(tick,32);return}
    ti++;mode='type';setTimeout(tick,200);return}
  var target=roles[ti%roles.length];
  if(cur.length<target.length){cur=target.slice(0,cur.length+1);el.textContent=cur;setTimeout(tick,65);return}
  mode='hold';setTimeout(tick,200);
}

/* ---------- Compteurs, progression, repérage de section, lueur ---------- */
function countUp(){
  if(reduce)return;
  $$('.num').forEach(function(el){
    var n=+el.dataset.n,t0=performance.now();
    (function f(now){var k=Math.min(1,(now-t0)/700);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0);
  });
}
var raf=0;
function onScroll(){
  if(raf)return;
  raf=requestAnimationFrame(function(){
    raf=0;var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    $('#prog').style.transform='scaleX('+(max>0?Math.min(1,h.scrollTop/max):0)+')';
  });
}
addEventListener('scroll',onScroll,{passive:true});
function spy(){
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(en){
    en.forEach(function(x){
      if(!x.isIntersecting)return;
      $$('#nav a').forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+x.target.id?'true':'false')});
    });
  },{rootMargin:'-35% 0px -60% 0px'});
  $$('main section').forEach(function(s){io.observe(s)});
}
(function(){
  var h=$('#accueil');
  h.addEventListener('pointermove',function(e){var r=h.getBoundingClientRect();h.style.setProperty('--mx',(e.clientX-r.left)+'px');h.style.setProperty('--my',(e.clientY-r.top)+'px')});
})();

/* ---------- Scène BEV : perception seule contre perception coopérative ---------- */
var bevCtl=null;
function bev(){
  var cv=$('#bev'),ctx=cv.getContext('2d'),TAU=Math.PI*2;
  var W=0,H=0,dpr=1,pts=[],running=false;
  var coop=reduce,blend=reduce?1:0,userSet=false,lastToggle=0;
  var V={x:.5,y:-.5};
  var truck={x:.36,y:.03,rot:.04,l:.3,w:.1};
  var hid={x:.74,y:.04,rot:.03,l:.17,w:.072};
  var cars=[{x:-.5,y:-.32,rot:1.1,l:.17,w:.072,lab:'voiture 0.93'},{x:-.28,y:.56,rot:-.4,l:.17,w:.072,lab:'voiture 0.88'}];
  function corners(o){var c=Math.cos(o.rot),s=Math.sin(o.rot);return [[-o.l/2,-o.w/2],[o.l/2,-o.w/2],[o.l/2,o.w/2],[-o.l/2,o.w/2]].map(function(p){return [o.x+p[0]*c-p[1]*s,o.y+p[0]*s+p[1]*c]})}
  function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
  var amin=0,amax=0;
  function seed(){
    var s=11;function rnd(){s=(s*16807)%2147483647;return s/2147483647}
    var tc=corners(truck);var an=tc.map(function(c){return Math.atan2(c[1],c[0])});amin=Math.min.apply(null,an);amax=Math.max.apply(null,an);
    var all=[truck,hid].concat(cars);
    pts=[];
    for(var k=1;k<=14;k++){var r=k/14*.98,n=Math.round(30+k*9);
      for(var i=0;i<n;i++){var a=i/n*TAU+rnd()*.05,x=Math.cos(a)*r,y=Math.sin(a)*r,near=false;
        all.forEach(function(o){if(Math.hypot(x-o.x,y-o.y)<(o===truck?.19:.13))near=true});
        if(near)continue;
        var an2=Math.atan2(y,x),shadow=an2>amin&&an2<amax&&r>.22;
        pts.push({x:x,y:y,c:shadow?3:0})}}
    function edges(o,c,fx,fy){var cs=corners(o);for(var e=0;e<4;e++){var a=cs[e],b=cs[(e+1)%4];for(var j=0;j<12;j++){var f=j/12,px=a[0]+(b[0]-a[0])*f,py=a[1]+(b[1]-a[1])*f;if((px-o.x)*(fx-o.x)+(py-o.y)*(fy-o.y)>0)pts.push({x:px,y:py,c:c})}}}
    edges(truck,1,0,0);cars.forEach(function(o){edges(o,1,0,0)});edges(hid,2,V.x,V.y);
  }
  function size(){
    var r=cv.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);
    W=Math.max(1,Math.round(r.width));H=Math.max(1,Math.round(r.height));
    cv.width=W*dpr;cv.height=H*dpr;
  }
  function note(){
    $('#sceneNote').textContent=coop?"Avec V2X : le véhicule connecté partage ce qu'il voit et révèle la voiture cachée. 4 objets détectés.":"Perception seule : le camion masque une voiture. 3 objets détectés.";
    $$('[data-v2x]').forEach(function(b){b.setAttribute('aria-pressed',String((b.dataset.v2x==='1')===coop))});
  }
  function draw(now){
    if(!W)return;
    var ink=css('--ink'),acc=css('--accent'),cp=css('--coop'),line=css('--line'),srf=css('--surface'),mono=css('--f-mono');
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    var cx=W/2,cy=H/2,R=Math.min(W,H)/2-16;
    var a=2.2+(reduce?0:now/1000*.8);
    ctx.strokeStyle=line;ctx.lineWidth=1;ctx.globalAlpha=.5;ctx.beginPath();
    var g=R*2/16;
    for(var i=-8;i<=8;i++){ctx.moveTo(cx+i*g,cy-R);ctx.lineTo(cx+i*g,cy+R);ctx.moveTo(cx-R,cy+i*g);ctx.lineTo(cx+R,cy+i*g)}
    ctx.stroke();ctx.globalAlpha=1;
    [10/26,20/26,1].forEach(function(k){ctx.beginPath();ctx.arc(cx,cy,R*k,0,TAU);ctx.stroke()});
    ctx.fillStyle=ink;ctx.globalAlpha=.6;ctx.font='10px '+mono;ctx.textAlign='left';
    ctx.fillText('10 m',cx+4,cy+R*10/26-4);ctx.fillText('20 m',cx+4,cy+R*20/26-4);
    // zone d'ombre du camion
    ctx.globalAlpha=.1*(1-blend)+.04;ctx.fillStyle=ink;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,amin,amax);ctx.closePath();ctx.fill();
    // balayage
    ctx.globalAlpha=.12;ctx.fillStyle=acc;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,a-.9,a);ctx.closePath();ctx.fill();
    ctx.globalAlpha=.8;ctx.strokeStyle=acc;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);ctx.stroke();
    // points
    for(var p=0;p<pts.length;p++){
      var q=pts[p];if(q.c>=2&&blend<.02)continue;
      var ang=Math.atan2(q.y,q.x),d=(((a-ang)%TAU)+TAU)%TAU,base=.16+.84*Math.exp(-d*1.4);
      var al=q.c>=2?base*blend:base;
      ctx.globalAlpha=al;ctx.fillStyle=q.c>=2?cp:(q.c===1?acc:ink);
      ctx.fillRect(cx+q.x*R-1,cy+q.y*R-1,2,2);
    }
    // liaison V2X
    if(blend>.02){
      ctx.globalAlpha=.7*blend;ctx.strokeStyle=cp;ctx.lineWidth=1.2;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(cx+V.x*R,cy+V.y*R);ctx.lineTo(cx,cy);ctx.stroke();ctx.setLineDash([]);
      var f=reduce?.5:((now/1100)%1);
      ctx.globalAlpha=blend;ctx.fillStyle=cp;ctx.beginPath();ctx.arc(cx+V.x*R*(1-f),cy+V.y*R*(1-f),3.2,0,TAU);ctx.fill();
    }
    // véhicule connecté
    ctx.globalAlpha=.35+.65*blend;ctx.fillStyle=cp;
    var vx=cx+V.x*R,vy=cy+V.y*R;ctx.fillRect(vx-.085*R,vy-.036*R,.17*R,.072*R);
    ctx.fillStyle=ink;ctx.textAlign='center';ctx.font='10px '+mono;ctx.fillText('véhicule connecté',Math.min(W-60,Math.max(60,vx)),vy-.036*R-8);
    // camion
    function box(o,col,al,dash){
      ctx.globalAlpha=al;ctx.lineWidth=1.6;ctx.strokeStyle=col;ctx.setLineDash(dash||[]);
      ctx.beginPath();corners(o).forEach(function(c,i){var X=cx+c[0]*R,Y=cy+c[1]*R;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.closePath();ctx.stroke();ctx.setLineDash([]);
    }
    function label(txt,o,al,col){ctx.globalAlpha=al;ctx.fillStyle=col||ink;ctx.textAlign='center';ctx.font='10px '+mono;ctx.fillText(txt,Math.min(W-46,Math.max(46,cx+o.x*R)),cy+o.y*R-Math.max(o.w,.07)*R/2-8-(o===truck?6:0))}
    box(truck,acc,.95);label('camion 0.95',truck,.92);
    cars.forEach(function(o){var an=Math.atan2(o.y,o.x),dd=(((a-an)%TAU)+TAU)%TAU,al=.5+.5*Math.exp(-dd*.8);box(o,acc,al);label(o.lab,o,.9)});
    // voiture cachée
    if(blend>.02){box(hid,cp,blend,[4,3]);label('via V2X 0.84',hid,blend,cp)}
    else{ctx.globalAlpha=.55;ctx.fillStyle=ink;ctx.textAlign='center';ctx.font='700 16px '+mono;ctx.fillText('?',cx+hid.x*R,cy+hid.y*R+6)}
    // ego
    ctx.globalAlpha=1;ctx.fillStyle=acc;ctx.fillRect(cx-.085*R,cy-.036*R,.17*R,.072*R);
    ctx.strokeStyle=srf;ctx.lineWidth=1.5;ctx.strokeRect(cx-.085*R,cy-.036*R,.17*R,.072*R);
    ctx.fillStyle=ink;ctx.textAlign='center';ctx.font='10px '+mono;ctx.fillText('ego',cx,cy+.036*R+13);
    // compteur
    ctx.textAlign='left';ctx.font='500 12px '+mono;ctx.globalAlpha=.9;ctx.fillText('objets détectés : '+(3+(blend>.5?1:0)),12,22);
    ctx.globalAlpha=1;
  }
  function loop(now){
    var target=coop?1:0;
    if(Math.abs(target-blend)>.01)blend+=(target-blend)*.09;else blend=target;
    if(!userSet&&!reduce&&now-lastToggle>4600){lastToggle=now;coop=!coop;note()}
    draw(now);if(running)requestAnimationFrame(loop);
  }
  function start(){if(!running&&!reduce&&!document.hidden){running=true;lastToggle=performance.now()-2000;requestAnimationFrame(loop)}}
  bevCtl={
    set:function(v,byUser){coop=v;if(byUser)userSet=true;if(reduce){blend=v?1:0;draw(0)}note()},
    toggle:function(byUser){bevCtl.set(!coop,byUser)}
  };
  seed();size();draw(0);note();
  new ResizeObserver(function(){size();draw(performance.now())}).observe(cv.parentElement);
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){if(en[0].isIntersecting)start();else running=false}).observe(cv);else start();
  document.addEventListener('visibilitychange',function(){if(document.hidden)running=false;else start()});
  new MutationObserver(function(){draw(performance.now())}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){draw(performance.now())});
}

/* ---------- Démarrage ---------- */
function launch(){
  var local=null;try{local=JSON.parse(localStorage.getItem(KEY))}catch(e){}
  D=canEdit&&local&&typeof local==='object'?migrate(local):migrate(PUB);
  if(canEdit&&local&&!(local._rev>=2))save();
  render();
  countUp();
  if(!reduce)setTimeout(tick,1800);
  bev();
  spy();
  onScroll();
}
(function boot(){
  var c=window.claude&&typeof window.claude.use==='function'?window.claude:null;
  function use(n){return c?Promise.resolve().then(function(){return c.use(n)}).then(function(x){return x||null},function(){return null}):Promise.resolve(null)}
  Promise.all([use('artifact'),use('assets'),use('user'),
    fetch('state.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).catch(function(){return null})
  ]).then(function(r){
    CAP.artifact=r[0];CAP.assets=r[1];CAP.user=r[2];PUB=r[3];
    return CAP.user&&CAP.user.canEdit?Promise.resolve(CAP.user.canEdit()).catch(function(){return false}):false;
  }).then(function(ce){
    canEdit=c?!!ce:/[?&]edit\b/.test(location.search);
    launch();
  });
})();
})();
