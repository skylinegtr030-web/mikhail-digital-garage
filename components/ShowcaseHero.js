'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './ShowcaseHero.module.css';

export default function ShowcaseHero() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha:true });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 1, height = 1, rect = null, raf = 0, pointerRaf = 0, previous = 0, frames = 0;
    let visible = true, accent = '140,103,255';
    const pointer = { x:0, y:0, clientX:0, clientY:0, active:false };
    let particles = [];

    const particle = (x = Math.random() * width, y = Math.random() * height, burst = false) => ({
      x,y,vx:burst ? (Math.random()-.5)*3.8 : (Math.random()-.5)*.16,vy:burst ? (Math.random()-.5)*3.8 : (Math.random()-.5)*.16,
      r:.6+Math.random()*1.25,accent:Math.random()>.68,life:burst ? 38+Math.random()*28 : 1e9
    });
    const measure = () => {
      rect = stage.getBoundingClientRect(); width = Math.max(1,rect.width); height = Math.max(1,rect.height);
      canvas.width = Math.round(width); canvas.height = Math.round(height); canvas.style.width=`${width}px`; canvas.style.height=`${height}px`;
      ctx.setTransform(1,0,0,1,0,0);
      const count = innerWidth < 760 ? 18 : Math.min(36,Math.floor(width/30));
      particles = Array.from({length:count},()=>particle());
      frames = 2; start();
    };
    const draw = time => {
      raf = 0;
      if (!visible || document.hidden || frames <= 0) return;
      if (time-previous < 33) { raf=requestAnimationFrame(draw); return; }
      previous=time; frames--;
      ctx.clearRect(0,0,width,height);
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        if (pointer.active) {
          const dx=p.x-pointer.x,dy=p.y-pointer.y,d2=dx*dx+dy*dy;
          if (d2<19600) { const d=Math.sqrt(d2)||1,f=(140-d)/140;p.vx+=dx/d*f*.026;p.vy+=dy/d*f*.026; }
        }
        p.vx*=.988;p.vy*=.988;p.x+=p.vx;p.y+=p.vy;p.life--;
        if(p.x<0)p.x=width;else if(p.x>width)p.x=0;if(p.y<0)p.y=height;else if(p.y>height)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.accent?`rgba(${accent},.72)`:'rgba(232,229,220,.42)';ctx.fill();
        if(p.life<=0)particles.splice(i,1);
      }
      if(frames>0)raf=requestAnimationFrame(draw);
    };
    const start = () => { if(!raf&&!reduced&&visible&&!document.hidden)raf=requestAnimationFrame(draw); };
    const applyPointer = () => {
      pointerRaf=0;if(!rect)return;
      pointer.x=pointer.clientX-rect.left;pointer.y=pointer.clientY-rect.top;pointer.active=true;
      stage.style.setProperty('--px',`${pointer.x}px`);stage.style.setProperty('--py',`${pointer.y}px`);
      frames=Math.max(frames,4);start();
    };
    const move = event => { pointer.clientX=event.clientX;pointer.clientY=event.clientY;if(!pointerRaf)pointerRaf=requestAnimationFrame(applyPointer); };
    const burst = event => {
      if(!rect||reduced)return;const x=event.clientX-rect.left,y=event.clientY-rect.top;
      for(let i=0;i<10;i++)particles.push(particle(x,y,true));if(particles.length>48)particles.splice(0,particles.length-48);
      frames=30;start();stage.classList.remove(styles.flash);void stage.offsetWidth;stage.classList.add(styles.flash);
    };
    const color = event => { accent=event.detail.rgb;frames=2;start(); };
    const resizeObserver=new ResizeObserver(measure);
    const intersectionObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else{frames=2;start();}},{rootMargin:'60px',threshold:.01});
    resizeObserver.observe(stage);intersectionObserver.observe(stage);measure();
    stage.addEventListener('pointermove',move,{passive:true});stage.addEventListener('pointerdown',burst,{passive:true});
    stage.addEventListener('pointerleave',()=>{pointer.active=false},{passive:true});window.addEventListener('site:color',color);
    return()=>{if(raf)cancelAnimationFrame(raf);if(pointerRaf)cancelAnimationFrame(pointerRaf);resizeObserver.disconnect();intersectionObserver.disconnect();stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerdown',burst);window.removeEventListener('site:color',color);};
  },[]);

  return (
    <section ref={stageRef} className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" /><div className={styles.cursorGlow} aria-hidden="true" /><div className={styles.scan} aria-hidden="true" />
      <header className={styles.meta}><span>MIKHAIL.DIGITAL / CREATIVE WEB LAB</span><span className={styles.rec}>● LIVE DEMO</span><span>FRAME 0001 / 2026</span></header>
      <div className={styles.core} aria-hidden="true"><i /><i /><i /><span className={styles.orbitA}>DESIGN</span><span className={styles.orbitB}>CODE</span><span className={styles.orbitC}>MOTION</span><span className={styles.orbitD}>IDEAS</span></div>
      <div className={styles.title}><span className={styles.kicker}>ЭТО НЕ ПОРТФОЛИО</span><h1><span>ДЕМО</span><span>НАШИХ</span><span>ВОЗМОЖНОСТЕЙ</span></h1></div>
      <div className={styles.bottom}><p>Интерактивная витрина дизайна, анимации и разработки. Каждый следующий блок запускает новую возможность.</p><div className={styles.actions}><button className={styles.launch} onClick={()=>scrollTo({top:innerHeight*.92,behavior:'smooth'})}><span>ЗАПУСТИТЬ ДЕМО</span><b>↓</b></button><Link href="/contact" className={styles.contact}>ОБСУДИТЬ ПРОЕКТ ↗</Link></div></div>
      <div className={styles.sideNote}>MOVE / CLICK / SCROLL</div><div className={styles.frameCount}><span>00</span><i /><span>10</span></div>
    </section>
  );
}
