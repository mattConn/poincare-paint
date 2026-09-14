export function cMul(a,b){return {x:a.x*b.x-a.y*b.y,y:a.x*b.y+a.y*b.x};}
export function cConj(a){return {x:a.x,y:-a.y};}
export function cSub(a,b){return {x:a.x-b.x,y:a.y-b.y};}
export function cDiv(a,b){const d=b.x*b.x+b.y*b.y;return {x:(a.x*b.x+a.y*b.y)/d,y:(a.y*b.x-a.x*b.y)/d};}
export function mobius(z,a){return cDiv(cSub(z,a),cSub({x:1,y:0},cMul(cConj(a),z)));}
export function clampDisk(z,eps=.999){const r=Math.hypot(z.x,z.y);return r<=eps?z:{x:z.x/r*eps,y:z.y/r*eps};}
export function rotatePoint(z,a){const c=Math.cos(a),s=Math.sin(a);return {x:z.x*c-z.y*s,y:z.x*s+z.y*c};}
export function reflectAcrossXAxis(z){return {x:z.x,y:-z.y};}
export function hDist(a,b){const dx=a.x-b.x,dy=a.y-b.y;const na=1-a.x*a.x-a.y*a.y;const nb=1-b.x*b.x-b.y*b.y;const arg=1+2*(dx*dx+dy*dy)/(na*nb);return Math.acosh(Math.max(1,arg));}
export function localEuclidRadius(z,rho){return rho*(1-z.x*z.x-z.y*z.y)/2;}
