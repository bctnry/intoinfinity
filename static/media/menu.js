// NOTE(bctnry): yeah, i did not rewrite this part because it's too troublesome and i would
// really like to move on to other projects for now. this code was a part of the original code,
// i only cleaned it up a bit.

log = function (s) {
    document.getElementById('log')
        .appendChild(document.createElement('li'))
        .appendChild(document.createTextNode(s));
    document.getElementById('log').scrollTop+=1000
}

DIST=90 //distance of labels from the center of the radial menu, in pixels

function findToMenu(s){
    var a=s.split('\n').map(function(l){return l.split('/').slice(1)})
    var f=function(a,d,s){
        var l,r=[]
        for (;;){
            if (!a.length) return r.length ? r : null
            if(d>0 && a[0][d-1] != s) return r.length ? r : null
            l=a.shift()
            r.push([l[d], "", f(a,d+1,l[d])])
        }}
    return f(a,0,"")
}

function Anim(f,a,d){
    this.f=f;
    this.args=a;
    this.duration=d||1000
}

Anim.prototype.cancel = function(){
    this.finished=true
}

runningAnimations={anims:[]}

function anim(f,args,dur){
    var newAnim=new Anim(f,args,dur)
    runningAnimations.anims.push(newAnim)
    runAnims()
    return newAnim
}

function runAnims(){
    if(runningAnimations.intervalID!=undefined) {
        return
    }
    runningAnimations.intervalID=setInterval(stepAnims,50)
}

function stepAnims(){
    runningAnimations.anims.forEach(stepAnim)
    if(!runningAnimations.anims.length){
        clearInterval(runningAnimations.intervalID)
        delete runningAnimations.intervalID
    }

}

function stepAnim(anim,i,arr){
    var x
    if (anim.finished) { arr.splice(i,1); return }
    if (!anim.start) { anim.start = Number(new Date()); x=0 }
    else { x = ((Number(new Date())) - anim.start) / anim.duration }
    if (x>1) x=1
    anim.f.apply(null,[x].concat(anim.args))
    if (x==1) { arr.splice(i,1) }
}

function showMenu(m,e,parent,theta,dist){
    var div=document.createElement('div'),offset=[e.pageX,e.pageY],coords
    if(parent&&theta&&dist) {
        coords=chooseCoordsFromP(parent,theta,dist)
    } else {
        coords=chooseCoordinates(e)
    }
    offset=[coords[0]+coords[2]/2,coords[1]+coords[3]/2]
    div.setDimensions(coords)
    div.className='menu'
    div.parentMenu=parent
    var angles=chooseAngles(m,theta),
    labels=placeLabels(div,m,angles,[150,130])
    //log(angles.join(', '))
    document.body.appendChild(div)
    div.onmousemove=mmove(m,angles,offset,labels,div)
    div.onmousedown=mclick(m,angles,offset,labels,div)
}

function chooseCoordsFromP(p,t,d){
    var wx=300,wy=300,x=p.offsetLeft+(Math.sin(t)*d),y=p.offsetTop-(Math.cos(t)*d)
    return [x>0?x:0,y>0?y:0,wx,wy]
}

function chooseCoordinates(e){
    var wx=300,wy=300,x=e.pageX-wx/2,y=e.pageY-wy/2
    return [x,y,wx,wy]
}

HTMLElement.prototype.setDimensions = function(a) {
    this.style.position="absolute"
    this.style.left=a[0]+"px"
    this.style.top=a[1]+"px"
    this.style.width=a[2]+"px"
    this.style.height=a[3]+"px"
}

function chooseAngles(menu,towards){
    var n=menu.length*2;
    var theta=Math.PI*2/n;
    var r=[],i=0;
    var offset=(towards==undefined)?0:towards-Math.PI-theta
    for (;i<n;i++) r.push(normRad(i*theta+offset))
    return r
}

function normRad(t){
    var a=2*Math.PI //normalize to positive radians 0..2*PI
    while (t<0) t+=a
    while (t>a) t-=a
    return t
}

function placeLabels(e,m,a,o){
    var i=0,l=m.length,wrap,span,ret=[]
    for (;i<l;i++){
        span=document.createElement('span')
        wrap=document.createElement('wrap')
        span.appendChild(document.createTextNode(m[i][0]))
        wrap.appendChild(document.createTextNode(m[i][0]))
        span.className='cmd'
        wrap.className='cmd-wrap'
        ret.push(span)
        var theta=a[2*i+1]
        wrap.style.top=(o[0]-Math.cos(theta)*DIST)+'px'
        wrap.style.left=(o[1]+Math.sin(theta)*DIST)+'px'
        e.appendChild(wrap).appendChild(span)
    }
    return ret
}
function mmove(m,a,o,l,p){
    //menu::array, angles::array, offset::array(2), labels::array, parent::HTMLDivElement
    return function(e){
        var x=e.pageX-o[0],y=e.pageY-o[1],i,len,dist=Math.sqrt(x*x+y*y)
        for(i=0,len=l.length;i<len;i++){
            l[i].style.backgroundColor='#bbb'
        }
        i=pointedAt(a,x,y)
        if(i!=null){
            l[i].style.backgroundColor=rgbinter('bbb','555',dist/DIST)
            if(dist>=DIST*0.8){
                if(m[i][0]=="<<"){
                    p.parentNode.removeChild(p)
                    if(p.parentMenu){
                        activateMenu(p.parentMenu)
                    }else{
                        if(m[i][2]!=null){
                            deactivateMenu(p);
                            showMenu([["<<","",null]].concat(m[i][2]),e,p,a[i*2+1],DIST)
                        }
                    }
                }
            }
        }
    }
}
function clamp(x,a,b){
    var c;
    if(a>b){c=b;b=a;a=c}
    if(x>b)return b;
    if(x<a)return a;
    return x
}

//interpolate between two RGB values expressed as strings
function rgbinter(from,to,by){
    by=clamp(by,0,1)
    from=rgbStringToTriple(from)
    to=rgbStringToTriple(to)
    return rgbTripleToString({
        r:inter(from.r,to.r,by),
        g:inter(from.g,to.g,by),
        b:inter(from.b,to.b,by)
    })
}

function rgbStringToTriple(s){
    var m=/#?([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})/.exec(s.toLowerCase()),
    f=function(s){return parseInt((s+s).substring(0,2),16)}
    return{r:f(m[1]),g:f(m[2]),b:f(m[3])}
}

function rgbTripleToString(t){
    var f=function(n){
        return ('0'+(Math.round(n).toString(16))).substr(-2)
    }
    return '#'+f(t.r)+f(t.g)+f(t.b)
}
function inter(a,b,x){return a+(b-a)*x}
function mclick(m,a,o,l,p){
    return function(e){
        var x=e.pageX-o[0],y=e.pageY-o[1],i
        i=pointedAt(a,x,y)
        if((i==null)||(m[i][0]=="<<")){
            p.parentNode.removeChild(p)
            if(p.parentMenu) activateMenu(p.parentMenu)
        }else{
            //if(m[i][1]!=null){log(m[i][1]);removeMenuTree(p)}
            if(m[i][1]!=null){log('you picked '+m[i][0]);removeMenuTree(p);eval(m[i][1])}
            if(m[i][2]!=null){deactivateMenu(p);showMenu(m[i][2],e,p)}
        }
    }
}
function deactivateMenu(e){
    e.className='menu downlevel'
    e.mmove_saved=e.onmousemove
    e.mdown_saved=e.onmousedown
    e.onmousemove=e.onmousedown=undefined
}
function activateMenu(e){
    e.className='menu'
    e.onmousemove=e.mmove_saved
    e.onmousedown=e.mdown_saved
    e.mmove_saved=e.mdown_saved=undefined
}
function removeMenuTree(e){
    if (e.parentMenu) removeMenuTree(e.parentMenu)
    e.parentNode.removeChild(e)
}
function pointedAt(a,x,y){
    var sq=400
    if(x*x+y*y<sq) return null
    var theta=Math.atan2(x,-y)
    if (theta<0) theta+=2*Math.PI
    return inDirection(a,theta)
}
//return lowest x such that theta is between a[2x] and a[2(x+1)]
function inDirection(a,theta){
    for (var i=0,l=a.length;i<l;i+=2)if(between(a[i],a[i+2],theta))return i/2
    return l/2-1
}
function between(a,b,t){
    if(b>a)return b>t && t>a
    else return t>a || t<b
}
