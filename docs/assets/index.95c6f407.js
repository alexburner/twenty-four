var jt=Object.defineProperty,Ht=Object.defineProperties;var Gt=Object.getOwnPropertyDescriptors;var ct=Object.getOwnPropertySymbols;var Ot=Object.prototype.hasOwnProperty,At=Object.prototype.propertyIsEnumerable;var at=(t,o,r)=>o in t?jt(t,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[o]=r,lt=(t,o)=>{for(var r in o||(o={}))Ot.call(o,r)&&at(t,r,o[r]);if(ct)for(var r of ct(o))At.call(o,r)&&at(t,r,o[r]);return t},ut=(t,o)=>Ht(t,Gt(o));import{p as u,l as S,h as s,i as a,a as dt,c,b as Mt}from"./vendor.5eb8c784.js";const Ut=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const f of e)if(f.type==="childList")for(const g of f.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&l(g)}).observe(document,{childList:!0,subtree:!0});function r(e){const f={};return e.integrity&&(f.integrity=e.integrity),e.referrerpolicy&&(f.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?f.credentials="include":e.crossorigin==="anonymous"?f.credentials="omit":f.credentials="same-origin",f}function l(e){if(e.ep)return;e.ep=!0;const f=r(e);fetch(e.href,f)}};Ut();const b="#F8F8F8",L={hue:0,saturation:0,brightness:1},gt=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty one","twenty two","twenty three","twenty four"],E=(t,o)=>{const r=2*Math.PI/o;return t/2/Math.sin(r/2)},X=(t,o,r)=>{if(r===0)return[];if(r===1)return[t];const l=new u.Point(t);return l.length=o,l.angle=-90,new Array(r).fill(null).map(()=>{const f=t.add(l);return l.angle+=360/r,f})},O=(t,o,r)=>{const l=t.map(e=>new u.Path.Circle({fillColor:o,center:e,radius:r}));return new u.Group(l)},B=({container:t,center:o,proximity:r,radius:l,size:e,n:f,graphColor:g,shellColor:i,points:m,shelln:d=20,shellGap:y=36,shellThickness:h=1,graphThickness:p=2,twoTouch:C=!1})=>{if(f<1)return;if(f<2){qt({center:o,shelln:d,shellColor:i,shellThickness:h,shellGap:y,graphColor:g,graphThickness:p,container:t});return}const k={},x={};if(m.forEach(function($,z){const v=$.toString();m.forEach(function(P,N){var ft;if(z===N)return;const R=P.toString();if(k[v+R]||k[R+v])return;k[v+R]=!0;const et=$.subtract(P).length.toFixed(2),Dt=new u.Path.Line({from:$,to:P,strokeCap:"round",strokeJoin:"round",strokeColor:g,strokeWidth:p}),st=(ft=x[et])!=null?ft:[];st.push(Dt),x[et]=st})}),f===2){It({center:o,size:e,radius:l,shelln:d,shellColor:i,shellThickness:h,shellGap:y,container:t,twoTouch:C});return}Jt({center:o,shelln:d,shellColor:i,shellThickness:h,shellGap:y,container:t,linesByLength:x,radius:l,proximity:r})},qt=({center:t,shelln:o,shellColor:r,shellThickness:l,shellGap:e,graphColor:f,graphThickness:g,container:i})=>{new u.Path.Circle({center:t,radius:g,fillColor:f});const m=[];for(let d=0;d<o;d++)m.push(new u.Path.Circle({center:t,radius:(d+1)*e,strokeWidth:l,strokeColor:r}));m.unshift(i),new u.Group(m).clipped=!0},It=({center:t,size:o,radius:r,shelln:l,shellColor:e,shellThickness:f,shellGap:g,container:i,twoTouch:m})=>{const d=[],y=m?0:g;d.push(new u.Path.Line({from:[t.x,t.y-o/2],to:[t.x,t.y-r-y],strokeColor:e,strokeWidth:f})),d.push(new u.Path.Line({from:[t.x,t.y+r+y],to:[t.x,t.y+o/2],strokeColor:e,strokeWidth:f}));for(let p=0;p<l;p++)d.push(new u.Path.Line({from:[t.x-(p+1)*g,t.y-o/2],to:[t.x-(p+1)*g,t.y+o/2],strokeColor:e,strokeWidth:f})),d.push(new u.Path.Line({from:[t.x+(p+1)*g,t.y-o/2],to:[t.x+(p+1)*g,t.y+o/2],strokeColor:e,strokeWidth:f}));d.unshift(i);const h=new u.Group(d);h.clipped=!0,h.sendToBack()},Jt=({center:t,shelln:o,shellColor:r,shellThickness:l,shellGap:e,container:f,linesByLength:g,radius:i,proximity:m})=>{const d=Object.keys(g).sort((k,x)=>Number(k)-Number(x))[0];if(!d)return;const y=g[d],h=new u.Group(y),p=Yt(i,m),C=[];for(let k=0;k<o;k++){const x=h.clone(),z=(p+(k+1)*e)/p;x.scale(z,t),x.strokeWidth=l,x.strokeColor=r,C.push(x)}C.unshift(f),new u.Group(C).clipped=!0},Yt=(t,o)=>Math.sqrt(Math.pow(t,2)-Math.pow(o/2,2)),pt=36,I=300*3.5+pt*2,J=300*3.5+pt*2,Kt="#333",T=100,_t=(t,o,r)=>{t.style.width=`${I}px`,t.style.height=`${J}px`,u.setup(t);let e={hue:360*((o-1)/(r+0))%360-8,saturation:1/3,brightness:1},f=e;o===0&&(f=L,e=L);const g=I/2,i=g,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[0,0],size:[I,J]}),y=d.clone();y.fillColor=e;const h=42,p=E(T,o),C=E(T,r),k=(p+C)/2,x=X(m,p,o);B({container:d,center:m,proximity:T,radius:p,size:J*1.5,n:o,graphColor:f,shellColor:f,points:x,shelln:0});const $=E(T,2),v=E(T,3)-$,P=$-v,N=(P+C)/2,R=O(x,Kt,h),G=o===1?(N+h)/(P+h):(k+h)/(p+h);R.scale(G,m),y.sendToBack()},ht=36,Y=300*3.5+ht*2,K=300*3.5+ht*2,Qt="#333",yt=140,Vt=(t,o,r)=>{t.style.width=`${Y}px`,t.style.height=`${K}px`,u.setup(t);const l=360*((o-1)/(r+0))%360-8;let e={hue:l,saturation:.5,brightness:.9},f={hue:l,saturation:.1,brightness:1};o===0&&(e=L,f=L);const g=Y/2,i=g,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[0,0],size:[Y,K]}),y=d.clone();y.fillColor=f;const h=E(yt,o),p=X(m,h,o);B({container:d,center:m,proximity:yt,radius:h,size:K*1.5,n:o,graphColor:Qt,shellColor:e,points:p,shelln:30,shellGap:24,graphThickness:5,twoTouch:!0}),y.sendToBack()},n=25,_=1200,Zt=4200,F=_/n,A=F,t0=A,n0=0,o0=t=>{t.style.width=`${_}px`,t.style.height=`${Zt}px`,u.setup(t),s0.forEach((o,r)=>{e0(r*t0,o)})},w=S().domain([0,n]).range([0,1]),r0=(t,o,r)=>{const e=new u.Path.Rectangle({point:[t.x-F/2,t.y-A/2],size:[F,A]}).clone();e.scale(15/16,t),e.remove();const f=new u.Path.Circle({radius:F/2,fillColor:r(o),opacity:4/6});f.position=t},e0=(t,o)=>{for(let r=0;r<n;r++){let l=F*r+F/2;l+=F*n0,l%=_;const e=t+A/2;r0(new u.Point(l,e),r,o)}},s0=[()=>b,t=>s((360*((t-1)/n)+1)%360,.8,.5).toString(),t=>a(w((t-1)%n)),t=>dt(w((t+5)%n)),()=>b,()=>b,t=>(t>=10&&(t+=1),s((360*((t-1)/(n+1))+1)%360,.8,.5).toString()),()=>b,()=>b,t=>(t===10&&(t+=.7),t===11&&(t+=.5),t===12&&(t+=.3),t===13&&(t+=.1),s((360*((t-1)/(n+1))+1)%360,.8,.5).toString()),t=>(t===9&&(t+=.9),t===10&&(t+=.7),t===11&&(t+=.5),t===12&&(t+=.3),t===13&&(t+=.1),s((360*((t-1)/(n+1))+1)%360,.8,.5).toString()),t=>s((360*((t-1)/(n+1))+1)%360,.8,.5).toString(),t=>(t>=10&&(t+=1),s((360*((t-1)/(n+1))+1)%360,.8,.5).toString()),t=>s((360*((t-1)/n)+1)%360,.8,.5).toString(),()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t-=.1),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>15?a(o((t-1)%n)):s(360*((t-1)/n)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t-=.1),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>15?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-.5)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>15?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>18?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>17?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>16?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>15?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>14?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>13?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>12?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>10?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=0),t===1&&(t-=.3),t===2&&(t-=.2),t===3&&(t+=.2),t>3&&(t+=.2),t===3&&(t-=.8),t===5&&(t-=.2),t===6&&(t-=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>(t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t>10&&(t+=.5),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():s((360*((t-1)/(n+1))+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t>10&&(t+=.5),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t>10&&(t+=.5),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>12?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+2]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},()=>b,t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.1),t===1&&(t-=.3),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t===23&&(t+=.9),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.1),t===1&&(t-=.3),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.2),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>{const o=S().domain([0,n+1]).range([0,1]);return t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(o((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()},t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1.8),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.2),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.1),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.4),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t===0&&(t+=.4),t===1&&(t-=0),t>3&&(t+=.4),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.3),t===1&&(t-=0),t>3&&(t+=.4),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.6),t===1&&(t-=0),t>3&&(t+=.4),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.6),t===1&&(t-=0),t>3&&(t+=.4),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.6),t===1&&(t-=0),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===0&&(t+=.4),t===1&&(t-=0),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===1&&(t-=.3),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t===1&&(t-=.3),t>5&&(t-=.1),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===1&&(t-=.4),t>5&&(t-=.2),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===1&&(t-=.5),t>5&&(t-=.5),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t===1&&(t-=.5),t>5&&(t-=.5),t>7&&(t+=.01),t>8&&(t+=1),t>9&&(t+=0),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t===1&&(t-=.5),t>5&&(t-=.5),t>7&&(t+=.01),t>8&&(t+=.3),t>9&&(t+=.3),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t>5&&(t-=.5),t>7&&(t+=.01),t>8&&(t+=.3),t>9&&(t+=.3),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),()=>b,t=>(t>5&&(t-=.5),t>7&&(t+=.01),t>8&&(t+=.3),t>9&&(t+=.3),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>(t>7&&(t+=.01),t>8&&(t+=.3),t>9&&(t+=.3),t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>11?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString()),t=>t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>8?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString(),t=>t<4?c((360*((t-1)/n)+0)%360,2,.5).toString():t>10?a(w((t-1)%n)):s((360*((t-1)/n)+1)%360,.8,.5).toString(),()=>b,t=>s((360*((t-1)/n)+1)%360,.8,.5).toString(),t=>c((360*((t-1)/n)+0)%360,2,.5).toString(),t=>a(w((t-1)%n)),t=>dt(w((t+5)%n)),t=>Mt((360*((t-1)/n)+30)%360,100,60).toString()],mt=120,it=300*11,St=300*8.5*4,Q=3,V=8,f0=Q*V,D=it/Q,j=St/V,c0=Math.max(D,j),a0="#333",l0="black",u0=20,d0=t=>{t.style.width=`${it}px`,t.style.height=`${St}px`,u.setup(t);let o=1;for(let r=0;r<V;r++)for(let l=0;l<Q;l++){const e={hue:(360*((o-1)/(f0+1))-5)%360,saturation:.9,brightness:.9},f=ut(lt({},e),{brightness:.6}),g=D*l+D/2,i=j*r+j/2,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[g-D/2,i-j/2],size:[D,j],fillColor:e});d.scale(31/32,m);const y=d.clone();y.fillColor=e,y.opacity=1/6;const h=E(mt,o),p=X(m,h,o);B({container:d,center:m,proximity:mt,radius:h,size:c0,n:o,graphColor:a0,shellColor:f,points:p}),O(p,l0,u0),o++}},wt=36,Z=300*3.5+wt*2,bt=300*3.5+wt*2,xt="#333",g0=(t,o,r)=>{var h;t.style.width=`${Z}px`,t.style.height=`${bt}px`,u.setup(t);const e={hue:360*((o-0)/(r+1))%360-8,saturation:.4,brightness:1},f=Z/2,g=f,i=new u.Point(f,g),d=new u.Path.Rectangle({point:[0,0],size:[Z,bt]}).clone();d.fillColor=e;const y=new u.Group;{const p=240;y.addChild(new u.PointText({point:[i.x,i.y+p/3-80],content:o,justification:"center",fillColor:xt,fontFamily:"Futura",fontSize:p}))}{const p=(h=gt[o])==null?void 0:h.split("").join(""),C=100;y.addChild(new u.PointText({point:[i.x,i.y+C/3+120],content:p,justification:"center",fillColor:xt,fontFamily:"Futura-Light",fontSize:C,opacity:.9}))}y.position=i,d.sendToBack()},Ct=36,tt=300*3.5+Ct*2,nt=300*3.5+Ct*2,p0="#333",kt=140,h0=(t,o,r)=>{t.style.width=`${tt}px`,t.style.height=`${nt}px`,u.setup(t);const l=360*((o-0)/(r+1))%360-8,e={hue:l,saturation:1,brightness:.9},f={hue:l,saturation:.1,brightness:1},g=tt/2,i=g,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[0,0],size:[tt,nt]}),y=d.clone();y.fillColor=f;const h=E(kt,o),p=X(m,h,o);B({container:d,center:m,proximity:kt,radius:h,size:nt*1.5,n:o,graphColor:p0,shellColor:e,points:p,shelln:30,shellGap:24,graphThickness:3,twoTouch:!0}),y.sendToBack()},$t=36,ot=300*3.5+$t*2,Et=300*3.5+$t*2,y0="#333",m0=(t,o,r)=>{t.style.width=`${ot}px`,t.style.height=`${Et}px`,u.setup(t);const e={hue:360*((o-0)/(r+1))%360-8,saturation:.6,brightness:1},f=ot/2,g=f,i=new u.Point(f,g),d=new u.Path.Rectangle({point:[0,0],size:[ot,Et]}).clone();d.fillColor=e;const y=400;new u.PointText({point:[i.x,i.y+y/3],content:o,justification:"center",fillColor:y0,fontFamily:"Futura",fontSize:y}),d.sendToBack()},vt=36,rt=300*3.5+vt*2,Pt=300*3.5+vt*2,i0="#333",S0=200,w0=(t,o,r)=>{t.style.width=`${rt}px`,t.style.height=`${Pt}px`,u.setup(t);const e={hue:360*((o-0)/(r+1))%360-8,saturation:.6,brightness:1},f=rt/2,g=f,i=new u.Point(f,g),d=new u.Path.Rectangle({point:[0,0],size:[rt,Pt]}).clone();d.fillColor=e;const y=86,h=E(S0,o),p=X(i,h,o);O(p,i0,y),d.sendToBack()},Lt=36,W=300*2.75+Lt*2,M=300*4.75+Lt*2,Rt="#333",H=90,Xt=(t,o,r)=>{t.style.width=`${W}px`,t.style.height=`${M}px`,u.setup(t);let e={hue:360*((o-1)/(r+1))%360-8,saturation:1/3,brightness:1},f=e;o===0&&(f=L,e=L);const g=W/2,i=g,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[0,0],size:[W,M]}),y=d.clone();y.fillColor=e;const h=38,p=E(H,o),C=E(H,r),k=(p+C)/2,x=X(m,p,o);B({container:d,center:m,proximity:H,radius:p,size:M*1.5,n:o,graphColor:f,shellColor:f,points:x,shelln:0});const $=E(H,2),v=E(H,3)-$,P=$-v,N=(P+C)/2,R=O(x,Rt,h),G=o===1?(N+h)/(P+h):(k+h)/(p+h);R.scale(G,m),new u.PointText({point:[W/2,W+(M-W)/2],content:o,justification:"center",fillColor:Rt,fontFamily:"Futura",fontSize:200}),y.sendToBack()},Ft=36,U=300*2.75+Ft*2,q=300*4.75+Ft*2,zt="#333",Bt=90,Wt=(t,o,r)=>{var $;t.style.width=`${U}px`,t.style.height=`${q}px`,u.setup(t);const l=360*((o-1)/(r+1))%360-8;let e={hue:l,saturation:1,brightness:.9},f={hue:l,saturation:.1,brightness:1};o===0&&(e=L,f=L);const g=U/2,i=g,m=new u.Point(g,i),d=new u.Path.Rectangle({point:[0,0],size:[U,q]}),y=d.clone();y.fillColor=f;const h=E(Bt,o),p=X(m,h,o);B({container:d,center:m,proximity:Bt,radius:h,size:q*1.5,n:o,graphColor:zt,shellColor:e,points:p,shelln:31,shellGap:36,graphThickness:2});const C=($=gt[o])==null?void 0:$.split("").join("\u200A"),k=48,x=[U/2,q-k*3];new Array(5).fill(null).forEach((z,v)=>{new u.PointText({point:x,content:C,justification:"center",fillColor:f,fontFamily:"Futura-Light",fontSize:k,strokeColor:f,strokeWidth:(v+1)*4,strokeJoin:"round",strokeCap:"round"})}),new u.PointText({point:x,content:C,justification:"center",fillColor:zt,fontFamily:"Futura-Light",fontSize:k,opacity:.9}),y.sendToBack()};document.body.style.backgroundColor=b;var Tt;document.title=(Tt=document.location.hash.substring(1))!=null?Tt:"learning cards";switch(document.location.hash){case"#color-test":{const t=document.createElement("canvas");document.body.appendChild(t),o0(t);break}case"#fields":{const t=document.createElement("canvas");document.body.appendChild(t),d0(t);break}case"#tarot-graph":{const t=document.createElement("canvas");document.body.appendChild(t);const o=document.location.hash.substring(1)||void 0,r=o?Number(o):NaN,l=Number.isFinite(r)?r:12;Wt(t,l,20);break}case"#tarot-dots":{const t=document.createElement("canvas");document.body.appendChild(t);const o=document.location.hash.substring(1)||void 0,r=o?Number(o):NaN,l=Number.isFinite(r)?r:12;Xt(t,l,20);break}case"#tarot-graph-spread":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="50px",document.body.appendChild(r),Wt(r,t,o)}break}case"#tarot-dots-spread":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="50px",document.body.appendChild(r),Xt(r,t,o)}break}case"#circle-graph-spread":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),Vt(r,t,o)}break}case"#circle-dots-spread":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),_t(r,t,o)}break}case"#split-young-front":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=10;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),w0(r,t,o)}break}case"#split-young-back":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=10;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),m0(r,t,o)}break}case"#split-old-front":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),h0(r,t,o)}break}case"#split-old-back":{document.body.style.backgroundColor="#EEE",document.body.style.padding="50px";for(let t=0,o=20;t<=o;t++){const r=document.createElement("canvas");r.style.margin="50px",r.style.display="inline-block",r.style.borderRadius="1000px",document.body.appendChild(r),g0(r,t,o)}break}}let Nt=!1;document.addEventListener("keydown",async t=>{if(t.key==="D"&&!Nt){Nt=!0;const o=Array.from(document.getElementsByTagName("canvas"));for(const r of o)await b0(r)}});const b0=t=>new Promise(o=>t.toBlob(r=>{if(r===null)return;const l=window.document.createElement("a"),e=window.URL.createObjectURL(r);l.href=e,l.download=document.title,document.body.appendChild(l),l.click(),document.body.removeChild(l),window.URL.revokeObjectURL(e),o()}));