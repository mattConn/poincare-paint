import {cMul,cConj,cSub,mobius,clampDisk} from './math.js';

export class MobiusView {
  constructor(){this.transforms=[];this.pickerA={x:0,y:0};}
  reset(){this.transforms=[];this.pickerA={x:0,y:0};}
  apply(z){let w={x:z.x,y:z.y};for(const a of this.transforms)w=mobius(w,a);return mobius(w,this.pickerA);}
  inverse(z){let w=mobius(z,{x:-this.pickerA.x,y:-this.pickerA.y});for(let i=this.transforms.length-1;i>=0;i--){const a=this.transforms[i];w=mobius(w,{x:-a.x,y:-a.y});}return w;}
  scaleAt(z){let w={x:z.x,y:z.y};let scale=1;for(const a of this.transforms){const den=cSub({x:1,y:0},cMul(cConj(a),w));scale*=(1-a.x*a.x-a.y*a.y)/(den.x*den.x+den.y*den.y);w=mobius(w,a);}const a=this.pickerA;const den=cSub({x:1,y:0},cMul(cConj(a),w));scale*=(1-a.x*a.x-a.y*a.y)/(den.x*den.x+den.y*den.y);return Math.abs(scale);}
  appendDrag(u0,u1){const a0=clampDisk(u0,.995);const a1=clampDisk({x:-u1.x,y:-u1.y},.995);this.transforms.push(a0,a1);if(this.transforms.length>600)this.transforms=this.transforms.slice(-600);}
  setPicker(a){this.pickerA=clampDisk(a,.94);}
}
