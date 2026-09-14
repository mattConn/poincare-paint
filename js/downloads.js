export function downloadTimestamp(){const n=new Date();return `${n.getMonth()+1}-${n.getDate()}-${n.getFullYear()}_${n.getHours()}-${n.getMinutes()}-${n.getSeconds()}`;}
function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);}

export class DownloadManager {
  constructor(canvas,seedManager,redraw){this.canvas=canvas;this.seedManager=seedManager;this.redraw=redraw;this.bind();}
  bind(){document.getElementById('download').onclick=()=>this.image();document.getElementById('downloadSeed').onclick=()=>this.seed();document.getElementById('downloadBoth').onclick=()=>this.both();}
  image(){this.redraw();this.canvas.toBlob(blob=>{if(!blob){alert('Could not create the PNG.');return;}saveBlob(blob,`image_${downloadTimestamp()}.png`);},'image/png');}
  seed(){const contents=this.seedManager.currentCode();saveBlob(new Blob([contents],{type:'text/plain;charset=utf-8'}),`seed_${downloadTimestamp()}.txt`);}
  async both(){if(typeof JSZip==='undefined'){alert('ZIP support could not load. Check your internet connection and try again.');return;}this.redraw();const stamp=downloadTimestamp(),imageBlob=await new Promise(r=>this.canvas.toBlob(r,'image/png'));if(!imageBlob){alert('Could not create the image.');return;}const zip=new JSZip();zip.file(`image_${stamp}.png`,imageBlob);zip.file(`seed_${stamp}.txt`,this.seedManager.currentCode());saveBlob(await zip.generateAsync({type:'blob'}),`image-seed_${stamp}.zip`);}
}
