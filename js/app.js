import {MobiusView} from './view.js';
import {PoincareRenderer} from './renderer.js';
import {ColorPicker} from './color-picker.js';
import {MobiusPicker} from './mobius-picker.js';
import {SeedManager} from './seeds.js';
import {DownloadManager} from './downloads.js';

const canvas=document.getElementById('c');
const state={showGrid:true,painting:false,panning:false,currentStroke:null,strokes:[],colorX:+document.getElementById('colorX').value/1000,colorY:+document.getElementById('colorY').value/1000,color:'#ff5c8a',alpha:+document.getElementById('alpha').value,hBrush:+document.getElementById('brush').value,sliceCount:+document.getElementById('slices').value,last:null};
const ui={brush:document.getElementById('brush'),alpha:document.getElementById('alpha'),slices:document.getElementById('slices'),br:document.getElementById('br'),sliceReadout:document.getElementById('sliceReadout'),grid:document.getElementById('grid'),seedMode:document.getElementById('seedMode'),seedInput:document.getElementById('seedInput'),seedState:document.getElementById('seedState'),prevSeed:document.getElementById('prevSeed'),nextSeed:document.getElementById('nextSeed'),randomSeed:document.getElementById('randomSeed'),copySeed:document.getElementById('copySeed'),loadSeed:document.getElementById('loadSeed')};

const view=new MobiusView();
const renderer=new PoincareRenderer(canvas,state,view);
let seedManager;
const redraw=()=>{renderer.redraw();seedManager?.scheduleUpdate();};
const colorPicker=new ColorPicker(state,redraw);
const mobiusPicker=new MobiusPicker(view,redraw);
seedManager=new SeedManager(state,view,ui,renderer,colorPicker,mobiusPicker);
new DownloadManager(canvas,seedManager,redraw);

function mousePoint(e){return {x:e.offsetX*renderer.W/canvas.clientWidth,y:e.offsetY*renderer.H/canvas.clientHeight};}

canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('mousedown',e=>{state.last=mousePoint(e);if(e.button===1){e.preventDefault();state.panning=true;return;}if(e.button===0){const z=renderer.screenToDisk(state.last.x,state.last.y);if(!z)return;seedManager.markFreehand();state.painting=true;state.currentStroke={color:state.color,alpha:state.alpha,radius:state.hBrush,points:[]};renderer.maybeAddPoint(z);redraw();}});
window.addEventListener('mouseup',()=>{if(state.painting){state.painting=false;if(state.currentStroke?.points.length)state.strokes.push(state.currentStroke);state.currentStroke=null;redraw();}state.panning=false;});
canvas.addEventListener('mousemove',e=>{const p=mousePoint(e);if(state.panning&&state.last){const u0=renderer.screenToViewDisk(state.last.x,state.last.y),u1=renderer.screenToViewDisk(p.x,p.y);if(u0&&u1){view.appendDrag(u0,u1);redraw();}state.last=p;return;}if(state.painting){const z=renderer.screenToDisk(p.x,p.y);if(z&&renderer.maybeAddPoint(z))redraw();}});
canvas.addEventListener('wheel',e=>{e.preventDefault();state.sliceCount=Math.max(2,Math.min(24,state.sliceCount+(e.deltaY<0?1:-1)));ui.slices.value=state.sliceCount;ui.sliceReadout.textContent=state.sliceCount;redraw();},{passive:false});

document.getElementById('clear').onclick=()=>{seedManager.markFreehand();state.strokes=[];state.currentStroke=null;redraw();};
document.getElementById('undo').onclick=()=>{seedManager.markFreehand();state.strokes.pop();redraw();};
ui.grid.onclick=e=>{state.showGrid=!state.showGrid;e.target.textContent=state.showGrid?'Hide grid':'Show grid';redraw();};
document.getElementById('reset').onclick=()=>{view.reset();mobiusPicker.draw();redraw();};
ui.alpha.oninput=e=>{state.alpha=+e.target.value;seedManager.markFreehand();redraw();};
ui.brush.oninput=e=>{state.hBrush=+e.target.value;ui.br.textContent=state.hBrush.toFixed(2);seedManager.markFreehand();redraw();};
ui.slices.oninput=e=>{state.sliceCount=+e.target.value;ui.sliceReadout.textContent=state.sliceCount;seedManager.markFreehand();redraw();};

renderer.redraw();
