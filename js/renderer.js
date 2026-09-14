import {rotatePoint,reflectAcrossXAxis,hDist,localEuclidRadius} from './math.js';

export class PoincareRenderer {
  constructor(canvas,state,view){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;this.view=view;this.W=canvas.width;this.H=canvas.height;this.cx=this.W/2;this.cy=this.H/2;this.R=Math.min(this.W,this.H)*.45;}
  screenToViewDisk(x,y){const u={x:(x-this.cx)/this.R,y:-(y-this.cy)/this.R};return Math.hypot(u.x,u.y)>=1?null:u;}
  screenToDisk(x,y){const u=this.screenToViewDisk(x,y);return u?this.view.inverse(u):null;}
  diskToScreen(z){const u=this.view.apply(z);return {x:this.cx+u.x*this.R,y:this.cy-u.y*this.R};}
  canonicalize(z){const step=Math.PI*2/this.state.sliceCount;let a=Math.atan2(z.y,z.x);if(a<0)a+=Math.PI*2;let local=a%step;if(local>step/2)local=step-local;const r=Math.hypot(z.x,z.y);return {x:r*Math.cos(local),y:r*Math.sin(local)};}
  allSliceCopies(z){const out=[],step=Math.PI*2/this.state.sliceCount;for(let i=0;i<this.state.sliceCount;i++){const base=i*step;out.push(rotatePoint(z,base));out.push(rotatePoint(reflectAcrossXAxis(z),base));}return out;}
  maybeAddPoint(z){const folded=this.canonicalize(z),stroke=this.state.currentStroke;if(!stroke)return false;if(!stroke.points.length){stroke.points.push(folded);return true;}const prev=stroke.points[stroke.points.length-1];if(hDist(prev,folded)>=stroke.radius*.32){stroke.points.push(folded);return true;}return false;}
  drawBoundary(){const c=this.ctx;c.save();c.beginPath();c.arc(this.cx,this.cy,this.R,0,Math.PI*2);c.fillStyle='#f6f0df';c.fill();c.lineWidth=3;c.strokeStyle='#202737';c.stroke();c.restore();}
  drawGrid(){if(!this.state.showGrid)return;const c=this.ctx;c.save();c.beginPath();c.arc(this.cx,this.cy,this.R,0,Math.PI*2);c.clip();c.lineWidth=1;c.strokeStyle='rgba(40,55,78,.18)';for(let i=0;i<12;i++){const a=i*Math.PI/12,z1={x:.999*Math.cos(a),y:.999*Math.sin(a)},z2={x:-z1.x,y:-z1.y},p1=this.diskToScreen(z1),p2=this.diskToScreen(z2);c.beginPath();c.moveTo(p1.x,p1.y);c.lineTo(p2.x,p2.y);c.stroke();}for(let k=1;k<=8;k++){const rr=Math.tanh((k*.55)/2);c.beginPath();for(let i=0;i<=256;i++){const t=i/256*Math.PI*2,p=this.diskToScreen({x:rr*Math.cos(t),y:rr*Math.sin(t)});if(i===0)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);}c.stroke();}c.restore();}
  drawStroke(s){if(!s?.points?.length)return;const c=this.ctx;c.save();c.globalAlpha=s.alpha;c.fillStyle=s.color;for(const z0 of s.points){for(const z of this.allSliceCopies(z0)){const p=this.diskToScreen(z),re=localEuclidRadius(z,s.radius),rr=Math.max(.7,re*this.view.scaleAt(z)*this.R);c.beginPath();c.arc(p.x,p.y,rr,0,Math.PI*2);c.fill();}}c.restore();}
  redraw(){const c=this.ctx;c.clearRect(0,0,this.W,this.H);c.fillStyle='#0c0f14';c.fillRect(0,0,this.W,this.H);this.drawBoundary();this.drawGrid();for(const s of this.state.strokes)this.drawStroke(s);if(this.state.currentStroke)this.drawStroke(this.state.currentStroke);}
}
