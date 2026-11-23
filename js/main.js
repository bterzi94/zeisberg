/* Zeisberg Arbeitsbühnenvermietung: Navigation, Einblenden, Slider, Galerie, Formular, Karte */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s);};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

/* Navigation */
var nav=$('.nav'),burger=$('#burger');
if(nav&&burger){
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  $$('.menu a',nav).forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');});});
}
var dds=$$('.dd');
function closeDD(){dds.forEach(function(x){x.classList.remove('open');var b=$('.dd-btn',x);if(b)b.setAttribute('aria-expanded','false');});}
dds.forEach(function(d){
  var b=$('.dd-btn',d);
  b.addEventListener('click',function(e){
    e.stopPropagation();var was=d.classList.contains('open');closeDD();
    if(!was){d.classList.add('open');b.setAttribute('aria-expanded','true');}
  });
});
document.addEventListener('click',function(e){if(!e.target.closest('.dd'))closeDD();});

/* Einblenden beim Scrollen */
var items=$$('.rv,.tcard,.tmore');
if(!('IntersectionObserver' in window)){items.forEach(function(e){e.classList.add('in');});}
else{
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  items.forEach(function(e){
    if(!e.style.getPropertyValue('--d')){var sib=e.parentNode.children,i=Array.prototype.indexOf.call(sib,e);e.style.setProperty('--d',Math.min(i,5)*.08+'s');}
    io.observe(e);
  });
}

/* Bewertungen-Slider */
(function(){
  var t=document.getElementById('revs'),p=document.getElementById('rprev'),n=document.getElementById('rnext'),pos=document.getElementById('rpos');
  if(!t)return;
  var cards=t.querySelectorAll('.rev');
  function step(){var c=cards[0],g=parseFloat(getComputedStyle(t).columnGap)||16;return c.getBoundingClientRect().width+g;}
  function upd(){
    var max=t.scrollWidth-t.clientWidth-2;
    p.disabled=t.scrollLeft<=2;n.disabled=t.scrollLeft>=max;
    var first=Math.round(t.scrollLeft/step())+1,vis=Math.max(1,Math.round(t.clientWidth/step()));
    var last=Math.min(first+vis-1,cards.length);pos.textContent=(last>first?first+'–'+last:first)+' von '+cards.length;
  }
  p.addEventListener('click',function(){t.scrollBy({left:-step(),behavior:'smooth'});});
  n.addEventListener('click',function(){t.scrollBy({left:step(),behavior:'smooth'});});
  t.addEventListener('scroll',function(){window.requestAnimationFrame(upd);},{passive:true});
  t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();n.click();}if(e.key==='ArrowLeft'){e.preventDefault();p.click();}});
  window.addEventListener('resize',upd);upd();
})();

/* Geräte: Vorschaubilder */
$$('.dthumbs button').forEach(function(b){
  b.addEventListener('click',function(){
    var card=b.closest('.dcard'),img=$('.dmedia img',card);
    img.src=b.getAttribute('data-src');
    $$('.dthumbs button',card).forEach(function(x){x.setAttribute('aria-current','false');});
    b.setAttribute('aria-current','true');
  });
});

/* Galerie mit Großansicht */
(function(){
  var links=$$('a[data-lb]');if(!links.length)return;
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Großansicht');
  lb.innerHTML='<button class="lb-x" aria-label="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><button class="lb-p" aria-label="Zurück"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg></button><img alt=""><button class="lb-n" aria-label="Weiter"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>';
  document.body.appendChild(lb);
  var img=$('img',lb),group=[],idx=0,last=null;
  function show(i){idx=(i+group.length)%group.length;img.src=group[idx].getAttribute('href');var t=$('img',group[idx]);img.alt=t?t.alt:'';}
  function open(a){group=$$('a[data-lb]',a.closest('.gal')||document);last=a;show(group.indexOf(a));lb.classList.add('open');document.body.classList.add('lb-open');$('.lb-x',lb).focus();}
  function close(){lb.classList.remove('open');document.body.classList.remove('lb-open');if(last)last.focus();}
  links.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open(a);});});
  $('.lb-x',lb).addEventListener('click',close);$('.lb-p',lb).addEventListener('click',function(){show(idx-1);});$('.lb-n',lb).addEventListener('click',function(){show(idx+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1);});
})();

/* Karte erst nach Klick laden (Datenschutz) */
(function(){
  var m=document.getElementById('map'),b=document.getElementById('map-load');if(!m||!b)return;
  b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Karte: Betriebshof Zeisberg, Tomphecke 20, Mönchengladbach';f.loading='lazy';m.innerHTML='';m.appendChild(f);});
})();

/* Kontaktformular: öffnet das Mailprogramm mit vorbefüllter Anfrage */
(function(){
  var f=document.getElementById('anfrage'),out=document.getElementById('f-msgout');if(!f)return;
  var g=new URLSearchParams(location.search).get('g');
  if(g){
    var sel=document.getElementById('f-typ'),msg=document.getElementById('f-msg'),want='';
    if(/Ruthmann|Multitel/.test(g))want='LKW-Arbeitsbühne';else if(/CMC/.test(g))want='Raupenarbeitsbühne';else if(/Fronteq|XCMG|Genie/.test(g))want='Scherenarbeitsbühne';else if(/Haulotte/.test(g))want='Teleskopmastbühne';else want='Mietgerät für Bau & Garten';
    for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===want)sel.selectedIndex=i;}
    if(msg&&!msg.value)msg.value='Ich interessiere mich für: '+g+'\n';
  }
  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    var v=function(id){return document.getElementById(id).value.trim();};
    if(!v('f-name')||!v('f-mail')){out.textContent='Bitte gib Name und E-Mail an.';return;}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('f-mail'))){out.textContent='Bitte gib eine gültige E-Mail-Adresse an.';return;}
    if(!document.getElementById('f-ds').checked){out.textContent='Bitte stimme der Datenschutzerklärung zu.';return;}
    out.textContent='';
    var body='Name: '+v('f-name')+'\nE-Mail: '+v('f-mail')+'\nTelefon: '+v('f-tel')+'\nGerät: '+v('f-typ')+'\nZeitraum: '+v('f-von')+' bis '+v('f-bis')+'\n\n'+v('f-msg');
    location.href='mailto:info@zeisberg-arbeitsbuehnen.de?subject='+encodeURIComponent('Anfrage Arbeitsbühne')+'&body='+encodeURIComponent(body);
  });
})();
})();
