'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CreativeBridge.module.css';

const modes=[
  {id:'01',key:'visual',title:'VISUAL',ru:'ВИЗУАЛ',color:'#ff382e',rgb:'255,56,46',text:'Композиция, типографика и цвет превращают содержание в узнаваемый образ.'},
  {id:'02',key:'motion',title:'MOTION',ru:'ДВИЖЕНИЕ',color:'#8c67ff',rgb:'140,103,255',text:'Анимация связывает состояния интерфейса и управляет вниманием человека.'},
  {id:'03',key:'code',title:'CODE',ru:'КОД',color:'#34f58a',rgb:'52,245,138',text:'Разработка превращает идею в быстрый, адаптивный и работающий продукт.'}
];

export default function CreativeBridge(){
  const [active,setActive]=useState(1);
  const scene=useRef(null),rect=useRef(null),point=useRef({x:0,y:0}),raf=useRef(0),last=useRef(0),hoverTimer=useRef(0);

  useEffect(()=>{
    const mode=modes[active],root=document.documentElement;
    root.style.setProperty('--site-accent',mode.color);
    root.style.setProperty('--site-accent-rgb',mode.rgb);
    document.body.dataset.colorMode=mode.key;
    sessionStorage.setItem('site-color-mode',mode.key);
    window.dispatchEvent(new CustomEvent('site:color',{detail:mode}));
  },[active]);

  useEffect(()=>{
    const saved=sessionStorage.getItem('site-color-mode');
    const index=modes.findIndex(mode=>mode.key===saved);
    if(index>=0)setActive(index);
    const measure=()=>{if(scene.current)rect.current=scene.current.getBoundingClientRect()};
    const observer=new ResizeObserver(measure);
    if(scene.current)observer.observe(scene.current);
    measure();
    return()=>{
      observer.disconnect();
      if(raf.current)cancelAnimationFrame(raf.current);
      if(hoverTimer.current)clearTimeout(hoverTimer.current);
    };
  },[]);

  const apply=()=>{
    raf.current=0;
    const box=rect.current;
    if(!box||!scene.current)return;
    const x=point.current.x-box.left,y=point.current.y-box.top;
    scene.current.style.setProperty('--x',`${x}px`);
    scene.current.style.setProperty('--y',`${y}px`);
  };
  const move=event=>{
    const now=performance.now();
    if(now-last.current<42)return;
    last.current=now;
    point.current.x=event.clientX;
    point.current.y=event.clientY;
    if(!raf.current)raf.current=requestAnimationFrame(apply);
  };
  const hover=index=>{
    if(index===active)return;
    if(hoverTimer.current)clearTimeout(hoverTimer.current);
    hoverTimer.current=setTimeout(()=>setActive(index),70);
  };
  const select=index=>{
    if(hoverTimer.current)clearTimeout(hoverTimer.current);
    if(index!==active)setActive(index);
  };

  return <section ref={scene} className={`${styles.bridge} ${styles[modes[active].key]}`} onPointerMove={move} aria-label="Три слоя креативной веб-разработки">
    <div className={styles.coordinates} aria-hidden="true"><span>X 055.752</span><span>CREATIVE SYSTEM / 01</span><span>Y 037.618</span></div>
    <div className={styles.light} aria-hidden="true"/>
    <div className={styles.backWord} aria-hidden="true">{modes[active].title}</div>
    <div className={styles.panels}>{modes.map((mode,index)=><button type="button" key={mode.key} className={`${styles.panel} ${active===index?styles.active:''}`} onPointerEnter={()=>hover(index)} onClick={()=>select(index)} aria-pressed={active===index}><span className={styles.number}>{mode.id}</span><span className={styles.word}>{mode.title}</span><span className={styles.ru}>{mode.ru}</span><i aria-hidden="true"/></button>)}</div>
    <div className={styles.description} key={modes[active].key}><span>{modes[active].id} / 03</span><p>{modes[active].text}</p></div>
    <div className={styles.instruction}>HOVER TO TRANSFORM</div>
    <div className={styles.exit}>СОБИРАЕМ ВМЕСТЕ <span>↓</span></div>
  </section>;
}
