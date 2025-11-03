(function(){
  const W=480,H=640,BG="#0c0b23";
  const cfg={type:Phaser.AUTO,width:W,height:H,backgroundColor:BG,scene:{create,update}};
  new Phaser.Game(cfg);
  let floors=[],score=0,scoreTxt,lastHit=0,doneTxt,canHit=true;

  function create(){
    const s=this;
    drawBg(s);drawLogo(s);drawCranes(s);
    scoreTxt=s.add.text(16,16,"Score: 0",{fontFamily:"monospace",fontSize:"16px",fill:"#fff"});
    s.add.text(W/2,H-28,"↓ DEMOLER  •  R REINICIAR",{fontFamily:"monospace",fontSize:"14px",fill:"#ff9f1c"}).setOrigin(0.5);
    createBuilding(s);drawKango(s);
    s.input.keyboard.on("keydown-DOWN",()=>hit(s));
    s.input.keyboard.on("keydown-R",()=>s.scene.restart());
  }

  function update(){}

  function drawBg(s){
    const g=s.add.graphics();
    const top=0x271a56,bot=0x1fd7ff;
    g.fillStyle(top,1);g.fillRect(0,0,W,H);
    for(let i=0;i<80;i++){
      const t=i/79,c=Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(top),
        Phaser.Display.Color.ValueToColor(bot),79,i);
      g.fillStyle(Phaser.Display.Color.GetColor(c.r,c.g,c.b),0.04);
      g.fillRect(0,i*(H/80),W,(H/80)+1);
    }
    const base=H-100,pal=[0xff2ea6,0x23d5ff,0xffe14d,0xcb4bff,0x16ffc8];
    for(let i=0;i<7;i++){
      const x=30+i*65+Phaser.Math.Between(-8,8),h=Phaser.Math.Between(120,260),c=pal[i%pal.length];
      g.fillStyle(c,1);g.fillRect(x,base-h,46,h);
      g.fillStyle(0x0c0b23,0.25);
      for(let y=base-h+8;y<base;y+=12)g.fillRect(x+4,y,38,3);
    }
  }

  function drawLogo(s){
    const g=s.add.graphics(),cx=W/2,y=46,c=0xe53935;
    g.fillStyle(c,1);
    g.fillRect(cx-52,y-22,14,44);
    g.fillRect(cx-34,y-22,22,12);
    g.fillRect(cx-34,y-8,22,12);
    g.fillRect(cx-12,y-22,14,44);
  }

  function drawCranes(s){
    const L=s.add.graphics();L.lineStyle(3,0xff9f1c,1);crane(L,70,120,120);
    const R=s.add.graphics();R.lineStyle(3,0x2ec4b6,1);crane(R,W-70,130,-120);
    s.tweens.add({targets:[L,R],angle:{from:-0.4,to:0.4},yoyo:true,duration:2400,repeat:-1,ease:"Sine.inOut"});
    function crane(g,x,y,a){g.strokeRect(x-6,y,12,160);g.strokeRect(x-40,y-10,80,10);
      g.lineBetween(x,y,x+a,y);g.lineBetween(x+a,y,x+a,y+30);g.strokeRect(x+a-10,y+30,20,6);}
  }

  function drawKango(s){
    const g=s.add.graphics();g.fillStyle(0xe53935,1);
    g.fillRect(W/2-20,76,40,18);g.fillRect(W/2-10,94,20,20);
  }

  function createBuilding(s){
    const baseY=H-120,h=36,n=Phaser.Math.Between(6,12),w=220,x=(W-w)/2;
    for(let i=0;i<n;i++){
      const y=baseY-i*h,c=Phaser.Display.Color.HSVToRGB((0.11+i*0.06)%1,0.85,0.95).color;
      const f=s.add.rectangle(x+w/2,y-h/2,w,h,c).setStrokeStyle(2,0x0c0b23,0.5);
      floors.push(f);drawWindows(s,x,y-h,w,h);
    }
  }

  function drawWindows(s,x,y,w,h){
    const g=s.add.graphics(),cols=Phaser.Math.Between(3,6),rows=Phaser.Math.Between(1,2);
    for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){
      const mx=10,my=6,wx=x+mx+c*((w-2*mx)/cols)+Phaser.Math.Between(-2,2),
            wy=y+my+r*((h-2*my)/rows)+Phaser.Math.Between(-1,1);
      g.fillStyle(0xdef3ff,Phaser.Math.FloatBetween(0.4,0.85));g.fillRect(wx,wy,16,10);
    }
  }

  function hit(s){
    if(!canHit)return;
    if(!floors.length){if(!doneTxt)doneTxt=s.add.text(W/2,H/2,"¡DEMOLICIÓN COMPLETA!",{fontFamily:"monospace",fontSize:"20px",fill:"#16ffc8"}).setOrigin(0.5);return;}
    canHit=false;
    const f=floors.pop(),now=s.time.now,dt=Math.max((now-lastHit)/1000,0.01);lastHit=now;
    const gain=Math.max(10,Math.floor(120-dt*25));score+=gain;scoreTxt.setText("Score: "+score);
    s.cameras.main.shake(80,0.004);debris(s,f.x,f.y,f.width,f.height);
    s.tweens.add({targets:f,y:f.y+70,alpha:0,duration:300,ease:"Cubic.easeIn",
      onComplete:()=>{f.destroy();canHit=true;if(!floors.length)end(s);} });
  }

  function debris(s,cx,cy,w,h){
    const p=s.add.graphics();
    for(let i=0;i<24;i++){p.fillStyle(0xffffff,Phaser.Math.FloatBetween(0.25,0.6));
      p.fillRect(cx+Phaser.Math.Between(-w/2,w/2),cy+Phaser.Math.Between(-h/2,h/2),Phaser.Math.Between(1,3),Phaser.Math.Between(1,2));}
    s.tweens.add({targets:p,y:"+=30",alpha:0,duration:420,onComplete:()=>p.destroy()});
  }

  function end(s){doneTxt=s.add.text(W/2,H/2,"¡DEMOLICIÓN COMPLETA!",{fontFamily:"monospace",fontSize:"20px",fill:"#16ffc8"}).setOrigin(0.5);}
})();