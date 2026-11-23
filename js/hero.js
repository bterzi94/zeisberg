(function(){
  /* Scherenbühne: fährt einmal aus, bleibt oben. Lineal 0–10 m, Markierung folgt der Oberkante. */
  var L=window.ScissorLift, root=document.getElementById('zb-lift'), mk=document.getElementById('marker');
  if(!L) return;
  var plat=root.querySelector('#zbPlat'), ruler=document.getElementById('ruler'), stage=document.getElementById('stage'), cur=0;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ease(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
  function fit(){
    L.setProgress(1);
    var s=stage.getBoundingClientRect(), t=plat.getBoundingClientRect(), g=root.getBoundingClientRect();
    ruler.style.top=(t.top+t.height*0.093-s.top)+'px';              /* 10 m = Oberkante voll ausgefahren */
    ruler.style.bottom=(s.bottom-(g.bottom-g.height*0.01))+'px';    /* 0 m = Boden */
  }
  function apply(p){
    cur=p; L.setProgress(p);
    var r=plat.getBoundingClientRect(), rr=ruler.getBoundingClientRect();
    mk.style.bottom=(rr.bottom-(r.top+r.height*0.093))+'px';
  }
  fit();
  window.addEventListener('resize',function(){ fit(); apply(cur); });
  if(reduce){ apply(1); return; }
  apply(0);
  var DELAY=500, UP=2800, t0=null;
  function frame(ts){
    if(t0===null) t0=ts;
    var t=ts-t0-DELAY, p=t<=0?0:Math.min(1,t/UP);
    apply(ease(p));
    if(p<1) requestAnimationFrame(frame); else apply(1);
  }
  function start(){ requestAnimationFrame(frame); }
  /* Animation startet, sobald die Bühne sichtbar ist (am Handy liegt sie unter dem Text) */
  if('IntersectionObserver' in window){
    var thr=Math.min(.97,(innerHeight/Math.max(stage.getBoundingClientRect().height,1))*.92);
    var io=new IntersectionObserver(function(e){ if(e[0].isIntersecting){ io.disconnect(); start(); } },{threshold:thr});
    io.observe(stage);
  } else start();
})();
