const defaults = {
  brand: 'JUST FOR NO REGRET',
  heroEyebrow: 'FROM ~MANAS',
  heroTitle: 'A thought from me',
  heroSubtitle: 'I made this website just for you, to be honest, not entirely on my own\nbut with the help of AI.',
  heroCTA: 'OPEN LETTER',
  footerLeft: 'MADE FOR ONE VERY SPECIAL PERSON',
  letterEyebrow: 'I KNOW THESE FONTS ARE NOT GOOD',
  letterTitle: 'Sorry To Bother.',
  letterBody: "There are some things that are hard to say out loud.\n\nSo I decided to write them here...\nBut still I didn't write everything.\n\nI know this is a bad thing to say, but I still like you and haven't liked anyone else in my life. I just wanted you to know. I always admired and respected you. It is true that I cannot say all of this in front of you or express this feeling; I thought if I talked to you about it, you would become frustrated, so I thought this would be better. I am simply an introvert. Sorry if this offends or frustrates you, but I love you.",
  signature: '~MANAS',
  question: 'Will you be mine?',
  yesTitle: 'You said yes.',
  yesText: 'And somehow the whole night feels a little brighter.',
  noTitle: "That's okay.",
  noText: 'Thank you for being honest. Some feelings deserve kindness either way.',
  momentTitle: 'Take your time.',
  momentText: "No rush. Come back when you're ready.",
  font: 'Cormorant Garamond',
  accent: '#d86a86',
  text: '#f7f0e9',
  paper: '#f3eee4',
  ink: '#382c2f',
  surface: '#16151a',
  button: '#eee6dc',
  radius: 16,
  glow: .30,
  overlay: .38,
  bright: .86,
  yt: ''
};

let state = { ...defaults };
if (!window.SHARED) {
  try { state = { ...state, ...JSON.parse(localStorage.getItem('replicaLetter') || '{}') }; } catch {}
}

const $ = (id) => document.getElementById(id);
let toastTimer;
function toast(message) {
  const el = $('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}
function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? '';
}
function saveLocal() {
  if (window.SHARED) return;
  try {
    const safe = { ...state };
    // Large local data URLs can break mobile localStorage. Uploaded media is re-sent on Share.
    for (const key of ['bgUrl','letterPhotoUrl','yesPhotoUrl','noPhotoUrl','momentPhotoUrl']) {
      if (typeof safe[key] === 'string' && safe[key].startsWith('data:')) delete safe[key];
    }
    localStorage.setItem('replicaLetter', JSON.stringify(safe));
  } catch (e) {
    console.warn('Local save skipped:', e);
  }
}

function ambient() {
  const p = $('particles');
  if (!p || p.children.length) return;
  for (let i = 0; i < 26; i++) {
    const d = document.createElement('i');
    d.className = 'particle';
    d.style.left = `${Math.random() * 100}%`;
    d.style.animationDelay = `${Math.random() * 9}s`;
    d.style.animationDuration = `${8 + Math.random() * 7}s`;
    p.appendChild(d);
  }
}
ambient();

function apply() {
  setText('brand', state.brand);
  setText('heroEyebrow', state.heroEyebrow);
  setText('heroTitle', state.heroTitle);
  setText('heroSubtitle', state.heroSubtitle);
  setText('open', state.heroCTA);
  setText('footerLeft', state.footerLeft);
  setText('letterEyebrow', state.letterEyebrow);
  setText('letterTitle', state.letterTitle);
  setText('letterBody', state.letterBody);
  setText('signature', state.signature);
  setText('question', state.question);

  const letterPhoto = $('letterPhotoImg');
  if (letterPhoto && state.letterPhotoUrl) {
    letterPhoto.src = state.letterPhotoUrl;
    letterPhoto.classList.add('show');
  } else if (letterPhoto) {
    letterPhoto.classList.remove('show');
    letterPhoto.removeAttribute('src');
  }

  const root = document.documentElement;
  root.style.setProperty('--font', `'${state.font || defaults.font}', serif`);
  root.style.setProperty('--pink', state.accent || defaults.accent);
  root.style.setProperty('--text', state.text || defaults.text);
  root.style.setProperty('--paper', state.paper || defaults.paper);
  root.style.setProperty('--ink', state.ink || defaults.ink);
  root.style.setProperty('--surface', state.surface || defaults.surface);
  root.style.setProperty('--button', state.button || defaults.button);
  root.style.setProperty('--radius', `${Number(state.radius ?? defaults.radius)}px`);
  root.style.setProperty('--glow', Number(state.glow ?? defaults.glow));
  root.style.setProperty('--overlay', Number(state.overlay ?? defaults.overlay));
  root.style.setProperty('--bright', Number(state.bright ?? defaults.bright));

  if (!window.SHARED) {
    const map = {
      fEyebrow:'heroEyebrow', fTitle:'heroTitle', fSubtitle:'heroSubtitle', fCTA:'heroCTA', fFooter:'footerLeft',
      lEyebrow:'letterEyebrow', lTitle:'letterTitle', lBody:'letterBody', lSig:'signature', lQuestion:'question',
      yTitle:'yesTitle', yText:'yesText', nTitle:'noTitle', nText:'noText', mTitle:'momentTitle', mText:'momentText'
    };
    for (const [id, key] of Object.entries(map)) if ($(id)) $(id).value = state[key] || '';
    for (const id of ['font','accent','text','paper','ink','surface','button','radius','glow','overlay','bright']) if ($(id)) $(id).value = state[id] ?? defaults[id];
    if ($('yt')) $('yt').value = state.yt || '';
  }

  if (state.yt) {
    applyYoutube(state.yt);
  } else if (state.bgUrl) {
    applyBg(state.bgUrl, state.bgType || 'image');
  } else {
    applyYoutube('');
    applyBg('', 'image');
  }
}

function openLetter() {
  $('letterOverlay')?.classList.add('show');
  enableBackgroundSound();
}
function closeLetter() { $('letterOverlay')?.classList.remove('show'); }

let fireworksRAF = 0;
let fireworksCleanup = null;
function stopFireworks() {
  cancelAnimationFrame(fireworksRAF);
  fireworksRAF = 0;
  if (fireworksCleanup) { fireworksCleanup(); fireworksCleanup = null; }
}
function yesFx() {
  const host = $('sceneFX');
  if (!host) return;
  stopFireworks();
  host.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.className = 'fireworksCanvas';
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let w=0,h=0,dpr=Math.min(window.devicePixelRatio||1,1.5);
  const rockets=[], particles=[], sparks=[], blooms=[];
  const colors=['#ffd7a0','#ffb5b5','#f6d78c','#e8b7e9','#a9d7ee','#fff4cf','#f5a8c0','#c9b4ff'];
  const maxParticles=innerWidth<600?900:1500;
  let nextLaunch=0, last=0;
  const resize=()=>{const r=host.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};
  resize();
  const onResize=()=>resize(); window.addEventListener('resize',onResize,{passive:true}); fireworksCleanup=()=>window.removeEventListener('resize',onResize);

  const burst=(x,y,color,scale=1,style='chrysanthemum')=>{
    const count=Math.min(style==='willow'?72:96,Math.max(48,Math.floor(86*scale)));
    blooms.push({x,y,r:2,life:1,color,style});
    for(let i=0;i<count && particles.length<maxParticles;i++){
      const a=Math.random()*Math.PI*2;
      let speed;
      if(style==='peony') speed=(1.1+Math.random()*4.0)*scale;
      else if(style==='willow') speed=(.7+Math.random()*2.5)*scale;
      else speed=(1.4+Math.random()*3.6)*scale;
      particles.push({x,y,px:x,py:y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1,max:.72+Math.random()*.62,color,gravity:style==='willow'?.032:.052,drag:.988+Math.random()*.006,twinkle:Math.random()>.62});
    }
    // tiny secondary crackle sparks: the little "firecracker festival" texture
    for(let i=0;i<Math.floor(12*scale);i++) sparks.push({x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*8,vx:(Math.random()-.5)*2.8,vy:(Math.random()-.5)*2.8,life:.7+Math.random()*.6,color});
  };
  const launch=()=>{const x=w*(.10+Math.random()*.80);const target=h*(.14+Math.random()*.39);const color=colors[(Math.random()*colors.length)|0];rockets.push({x,y:h+18,tx:x+(Math.random()-.5)*w*.12,ty:target,vy:-7.4-Math.random()*2.4,color,trail:[]});};
  launch(); setTimeout(launch,320);

  const frame=(time)=>{
    if(!document.body.contains(host)||!$('scene')?.classList.contains('show')){stopFireworks();return;}
    const dt=Math.min(32,time-(last||time)); last=time;
    ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='rgba(4,6,12,.16)';ctx.fillRect(0,0,w,h);
    if(time>nextLaunch){launch();if(Math.random()>.62)setTimeout(launch,180);nextLaunch=time+650+Math.random()*700;}

    for(let i=rockets.length-1;i>=0;i--){const r=rockets[i];r.x+=(r.tx-r.x)*.012;r.y+=r.vy;r.vy+=.075;r.trail.push({x:r.x,y:r.y});if(r.trail.length>9)r.trail.shift();
      ctx.lineWidth=1.2;ctx.strokeStyle=r.color;ctx.globalAlpha=.72;ctx.beginPath();r.trail.forEach((q,j)=>j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();
      ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(r.x,r.y,1.7,0,Math.PI*2);ctx.fillStyle=r.color;ctx.fill();
      if(r.y<=r.ty||r.vy>-1){const style=Math.random()>.62?'peony':(Math.random()>.7?'willow':'chrysanthemum');burst(r.x,r.y,r.color,.85+Math.random()*.35,style);rockets.splice(i,1);}
    }
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.px=p.x;p.py=p.y;p.x+=p.vx*(dt/16);p.y+=p.vy*(dt/16);p.vx*=p.drag;p.vy=p.vy*p.drag+p.gravity*(dt/16);p.life-=.010*(dt/16);if(p.life<=0){particles.splice(i,1);continue;}ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.strokeStyle=p.color;ctx.globalAlpha=Math.max(0,p.life*(p.twinkle&&Math.random()>.82?1.6:.92));ctx.lineWidth=.65+p.life*1.15;ctx.stroke();}
    for(let i=sparks.length-1;i>=0;i--){const q=sparks[i];q.x+=q.vx;q.y+=q.vy;q.vy+=.06;q.life-=.028;if(q.life<=0){sparks.splice(i,1);continue;}ctx.globalAlpha=q.life;ctx.fillStyle=q.color;ctx.fillRect(q.x,q.y,1.5,1.5);}
    for(let i=blooms.length-1;i>=0;i--){const b=blooms[i];b.r+=b.style==='willow'?1.05:1.8;b.life-=.035;if(b.life<=0){blooms.splice(i,1);continue;}ctx.globalAlpha=b.life*.20;ctx.strokeStyle=b.color;ctx.lineWidth=1;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;fireworksRAF=requestAnimationFrame(frame);
  };
  ctx.fillStyle='rgba(4,6,12,.48)';ctx.fillRect(0,0,w,h);fireworksRAF=requestAnimationFrame(frame);
}

function rainFx() {
  const host=$('sceneFX'); if(!host)return; host.innerHTML=''; stopFireworks();
  for(let i=0;i<75;i++){const d=document.createElement('i');d.className='drop';d.style.left=`${Math.random()*100}%`;d.style.animationDelay=`${Math.random()}s`;d.style.animationDuration=`${.7+Math.random()*.7}s`;host.appendChild(d);}
}
function calmFx() {
  const host=$('sceneFX'); if(!host)return; host.innerHTML=''; stopFireworks();
  for(let i=0;i<24;i++){const d=document.createElement('i');d.className='calmGlow';d.style.left=`${Math.random()*100}%`;d.style.top=`${Math.random()*100}%`;d.style.animationDelay=`${Math.random()*5}s`;host.appendChild(d);}
}

function showScene(type) {
  $('scene')?.classList.add('show');
  const data={
    yes:['YES',state.yesTitle,state.yesText,'yesPhotoUrl'],
    no:['NO',state.noTitle,state.noText,'noPhotoUrl'],
    moment:['A LITTLE MOMENT',state.momentTitle,state.momentText,'momentPhotoUrl']
  }[type];
  if(!data)return;
  setText('sceneEyebrow',data[0]);setText('sceneTitle',data[1]);setText('sceneText',data[2]);
  const im=$('sceneImg');
  if(state[data[3]]){im.src=state[data[3]];im.classList.add('show');}else{im.removeAttribute('src');im.classList.remove('show');}
  if(type==='yes')yesFx();else if(type==='no')rainFx();else calmFx();
}
function closeScene(){ $('scene')?.classList.remove('show'); stopFireworks(); }

function youtubeId(url){
  try{
    const u=new URL(url);const host=u.hostname.replace(/^www\./,'');
    if(host==='youtu.be')return u.pathname.split('/').filter(Boolean)[0]||'';
    if(host==='youtube.com'||host.endsWith('.youtube.com')){
      if(u.pathname==='/watch')return u.searchParams.get('v')||'';
      for(const prefix of ['/shorts/','/embed/','/live/'])if(u.pathname.startsWith(prefix))return u.pathname.split('/')[2]||'';
    }
  }catch{}
  return '';
}

let ytPlayer=null,ytPlayerReady=false,ytSoundWanted=false,ytApiPromise=null,bgVideo=null,bgSoundWanted=false;
function currentOrigin(){return /^https?:$/.test(location.protocol)?location.origin:'';}
function loadYouTubeAPI(){
  if(window.YT?.Player)return Promise.resolve(window.YT);if(ytApiPromise)return ytApiPromise;
  ytApiPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-youtube-iframe-api]');
    if(existing){const timer=setInterval(()=>{if(window.YT?.Player){clearInterval(timer);resolve(window.YT);}},50);setTimeout(()=>{clearInterval(timer);reject(new Error('YouTube API timeout'));},10000);return;}
    const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.async=true;s.dataset.youtubeIframeApi='1';document.head.appendChild(s);
    const prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(typeof prev==='function')prev();resolve(window.YT);};
    setTimeout(()=>{if(!(window.YT?.Player))reject(new Error('YouTube API timeout'));},10000);
  });return ytApiPromise;
}
function applyYoutube(url){
  const wrap=$('youtubeBg'),bg=$('bg'),btn=$('soundToggle');if(!wrap)return;
  const id=youtubeId(url||'');
  if(ytPlayer){try{ytPlayer.destroy();}catch{}}ytPlayer=null;ytPlayerReady=false;ytSoundWanted=false;
  wrap.innerHTML='';wrap.style.display='none';
  if(btn){btn.classList.remove('show','on');btn.textContent='♪ SOUND';}
  if(bg){bg.style.backgroundImage='';bg.innerHTML='';}
  if(!id)return;
  const iframe=document.createElement('iframe');
  const params=new URLSearchParams({enablejsapi:'1',autoplay:'1',controls:'0',disablekb:'1',fs:'0',iv_load_policy:'3',loop:'1',playsinline:'1',rel:'0',mute:'1',playlist:id,modestbranding:'1'});
  const origin=currentOrigin();if(origin)params.set('origin',origin);
  iframe.id='youtubePlayer';iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.title='Background video';
  wrap.appendChild(iframe);wrap.style.display='block';if(btn)btn.classList.add('show');
  loadYouTubeAPI().then(YT=>new Promise(resolve=>{ytPlayer=new YT.Player(iframe,{events:{onReady:()=>{ytPlayerReady=true;try{ytPlayer.mute();ytPlayer.setVolume(100);ytPlayer.playVideo();}catch{}resolve();},onStateChange:e=>{if(e.data===YT.PlayerState.ENDED)try{ytPlayer.playVideo();}catch{}},onError:e=>{if([101,150].includes(e.data))toast('This YouTube video does not allow embedding.');else if(e.data===153)toast('YouTube blocked this embed. Try another video.');}}});})).catch(e=>{console.warn(e);toast('YouTube background could not load.');});
}
function enableYoutubeSound(){ytSoundWanted=true;if(!ytPlayerReady||!ytPlayer)return;try{ytPlayer.unMute();ytPlayer.setVolume(100);ytPlayer.playVideo();}catch{}}
function disableYoutubeSound(){ytSoundWanted=false;if(ytPlayerReady&&ytPlayer)try{ytPlayer.mute();}catch{}}
function applyBg(url,type){
  const bg=$('bg'),btn=$('soundToggle');if(!bg)return;
  bg.innerHTML='';bg.style.backgroundImage='';bgVideo=null;bgSoundWanted=false;
  if(btn){btn.classList.remove('show','on');btn.textContent='♪ SOUND';}
  if(type==='video'&&url){
    const v=document.createElement('video');v.autoplay=true;v.muted=true;v.loop=true;v.playsInline=true;v.preload='metadata';v.src=url;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
    bg.appendChild(v);bgVideo=v;v.play().catch(()=>{});if(btn)btn.classList.add('show');
  }else if(url){bg.style.backgroundImage=`url("${String(url).replaceAll('"','%22')}")`;}
}
function enableBackgroundSound(){
  bgSoundWanted=true;if(bgVideo)try{bgVideo.muted=false;bgVideo.volume=1;const p=bgVideo.play();p?.catch?.(()=>{});}catch{}
  if(ytPlayerReady)enableYoutubeSound();const b=$('soundToggle');if(b){b.classList.add('on');b.textContent='♪ SOUND ON';}
}
function disableBackgroundSound(){bgSoundWanted=false;if(bgVideo)try{bgVideo.muted=true;}catch{};if(ytPlayerReady)disableYoutubeSound();const b=$('soundToggle');if(b){b.classList.remove('on');b.textContent='♪ SOUND';}}

function filePreview(file,cb){const r=new FileReader();r.onload=()=>cb(r.result,file.type);r.readAsDataURL(file);}
function bindFiles(){
  if(window.SHARED)return;
  const bg=$('bgFile');
  if(bg)bg.onchange=e=>{const f=e.target.files?.[0];if(!f)return;const type=f.type.startsWith('video/')?'video':'image';
    if(type==='video'){const u=URL.createObjectURL(f);state.bgUrl=u;state.bgType='video';state.yt='';if($('yt'))$('yt').value='';applyYoutube('');applyBg(u,'video');saveLocal();toast('Video background ready. Share will upload it.');}
    else filePreview(f,(u)=>{state.bgUrl=u;state.bgType='image';state.yt='';if($('yt'))$('yt').value='';applyYoutube('');applyBg(u,'image');saveLocal();});
  };
  ['letterPhoto','yesPhoto','noPhoto','momentPhoto'].forEach(id=>{$(id)?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;filePreview(f,(u)=>{state[`${id}Url`]=u;if(id==='letterPhoto'&&$('letterPhotoImg')){$('letterPhotoImg').src=u;$('letterPhotoImg').classList.add('show');}saveLocal();toast('Photo ready for preview.');});});});
}

async function uploadFileToBlob(file,kind){
  const fd=new FormData();fd.append('file',file,file.name||'upload');fd.append('kind',kind);
  const r=await fetch('/api/upload',{method:'POST',body:fd});let data={};try{data=await r.json();}catch{}
  if(!r.ok)throw new Error(data.error||`Upload failed (${r.status})`);return data.url;
}
async function uploadForShare(fieldId,kind,savedUrl){
  const file=$(fieldId)?.files?.[0];if(file)return uploadFileToBlob(file,kind);
  if(savedUrl&&/^data:/i.test(savedUrl)){const blob=await (await fetch(savedUrl)).blob();const ext=(blob.type||'image/jpeg').split('/')[1]||'bin';return uploadFileToBlob(new File([blob],`restored.${ext}`,{type:blob.type||'application/octet-stream'}),kind);}
  return savedUrl||null;
}

async function createShare(){
  const button=$('shareBtn')||$('drawerShare');if(button)button.disabled=true;
  try{
    toast('Preparing your share link…');
    const copy={...state};delete copy.bgUrl;delete copy.bgType;
    for(const k of ['letterPhoto','yesPhoto','noPhoto','momentPhoto'])delete copy[`${k}Url`];
    const bgInput=$('bgFile')?.files?.[0];const bgKind=bgInput?.type?.startsWith('video/')?'background-video':'background-image';
    const results=await Promise.all([
      uploadForShare('letterPhoto','photo',state.letterPhotoUrl),
      uploadForShare('yesPhoto','photo',state.yesPhotoUrl),
      uploadForShare('noPhoto','photo',state.noPhotoUrl),
      uploadForShare('momentPhoto','photo',state.momentPhotoUrl),
      uploadForShare('bgFile',bgKind,state.bgUrl)
    ]);
    const [letterPhotoUrl,yesPhotoUrl,noPhotoUrl,momentPhotoUrl,bgUrl]=results;
    if(letterPhotoUrl)copy.letterPhotoUrl=letterPhotoUrl;if(yesPhotoUrl)copy.yesPhotoUrl=yesPhotoUrl;if(noPhotoUrl)copy.noPhotoUrl=noPhotoUrl;if(momentPhotoUrl)copy.momentPhotoUrl=momentPhotoUrl;
    if(bgUrl){copy.bgUrl=bgUrl;copy.bgType=bgInput?.type?.startsWith('video/')?'video':'image';}
    const r=await fetch('/api/share',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({config:copy})});let j={};try{j=await r.json();}catch{}
    if(!r.ok||!j.url)throw new Error(j.error||`Share API failed (${r.status})`);
    showShareModal(j.url);toast('Share link created.');return j.url;
  }catch(e){console.error('Share failed:',e);toast(e.message||'Share failed.');return null;}
  finally{if(button)button.disabled=false;}
}

function showShareModal(url){
  const modal=$('shareModal'),input=$('shareUrl');if(!modal||!input)return;
  input.value=url;modal.classList.add('show');document.body.classList.add('modal-open');
  setTimeout(()=>{input.focus();input.select();},50);
}
function closeShareModal(){$('shareModal')?.classList.remove('show');document.body.classList.remove('modal-open');}
async function copyShareUrl(){const input=$('shareUrl');if(!input)return;try{await navigator.clipboard.writeText(input.value);toast('Link copied.');}catch{input.focus();input.select();try{document.execCommand('copy');toast('Link copied.');}catch{toast('Select the link and copy it.');}}}
async function nativeShare(){const url=$('shareUrl')?.value;if(!url)return;if(navigator.share){try{await navigator.share({title:document.title,url});}catch{}}else copyShareUrl();}

async function loadShared(){
  document.body.classList.add('shared-loading');
  try{
    const slug=String(window.SHARE_SLUG||'').replace(/[^A-Za-z0-9]/g,'');
    if(!slug)throw new Error('Invalid share link.');
    const r=await fetch(`/api/share/${encodeURIComponent(slug)}`,{cache:'no-store'});let j={};try{j=await r.json();}catch{}
    if(!r.ok)throw new Error(j.error||`Could not load letter (${r.status})`);
    state={...defaults,...(j.config||{})};apply();
    document.body.classList.remove('shared-loading');
  }catch(e){
    console.error('Shared letter error:',e);
    document.body.classList.remove('shared-loading');
    const err=$('shareError');if(err){err.querySelector('strong').textContent='This letter could not be loaded';err.querySelector('span').textContent=e.message||'The share link is unavailable.';err.classList.add('show');}
  }
}

function initEditor(){
  const map={fEyebrow:'heroEyebrow',fTitle:'heroTitle',fSubtitle:'heroSubtitle',fCTA:'heroCTA',fFooter:'footerLeft',lEyebrow:'letterEyebrow',lTitle:'letterTitle',lBody:'letterBody',lSig:'signature',lQuestion:'question',yTitle:'yesTitle',yText:'yesText',nTitle:'noTitle',nText:'noText',mTitle:'momentTitle',mText:'momentText'};
  for(const [id,key] of Object.entries(map))$(id)?.addEventListener('input',e=>{state[key]=e.target.value;apply();saveLocal();});
  for(const id of ['font','accent','text','paper','ink','surface','button','radius','glow','overlay','bright'])$(id)?.addEventListener('input',e=>{state[id]=['radius','glow','overlay','bright'].includes(id)?Number(e.target.value):e.target.value;apply();saveLocal();});

  const closeDrawer=()=>{document.body.classList.remove('drawer-open');$('drawer')?.classList.remove('open');$('drawerShade')?.classList.remove('open');};
  $('customBtn')?.addEventListener('click',()=>{document.body.classList.add('drawer-open');$('drawer')?.classList.add('open');$('drawerShade')?.classList.add('open');});
  $('drawerClose')?.addEventListener('click',closeDrawer);$('drawerShade')?.addEventListener('click',closeDrawer);
  $('save')?.addEventListener('click',()=>{saveLocal();toast('Saved on this device.');});
  $('reset')?.addEventListener('click',()=>{state={...defaults};saveLocal();apply();toast('Reset complete.');});
  $('shareBtn')?.addEventListener('click',createShare);$('drawerShare')?.addEventListener('click',createShare);
  $('previewBtn')?.addEventListener('click',()=>document.body.classList.toggle('preview'));$('previewBack')?.addEventListener('click',()=>{document.body.classList.remove('preview');document.body.classList.add('drawer-open');$('drawer')?.classList.add('open');$('drawerShade')?.classList.add('open');});$('drawerPreview')?.addEventListener('click',()=>{document.body.classList.remove('drawer-open');$('drawer')?.classList.remove('open');$('drawerShade')?.classList.remove('open');document.body.classList.add('preview');});
  $('open')?.addEventListener('click',openLetter);$('letterClose')?.addEventListener('click',closeLetter);
  $('yes')?.addEventListener('click',()=>showScene('yes'));$('no')?.addEventListener('click',()=>showScene('no'));$('moment')?.addEventListener('click',()=>showScene('moment'));
  $('sceneClose')?.addEventListener('click',closeScene);$('back')?.addEventListener('click',closeScene);
  $('footerRight')?.addEventListener('click',()=>{state={...defaults};saveLocal();apply();});

  const presets={
    'Rosewood':{accent:'#d86a86',text:'#f7f0e9',paper:'#f3eee4',ink:'#382c2f',surface:'#16151a',button:'#eee6dc',overlay:.38,bright:.86,font:'Cormorant Garamond',radius:16,glow:.30},
    'Midnight Blue':{accent:'#8fb9d9',text:'#edf3f5',paper:'#eef0e8',ink:'#27333a',surface:'#111820',button:'#e8ece9',overlay:.40,bright:.82,font:'Cormorant Garamond',radius:15,glow:.22},
    'Warm Amber':{accent:'#d5a25d',text:'#fff2df',paper:'#f2e5cf',ink:'#4a3525',surface:'#1a1510',button:'#eee0c7',overlay:.35,bright:.88,font:'Georgia',radius:14,glow:.25},
    'Plum Velvet':{accent:'#b995ce',text:'#f5edf8',paper:'#eee5ed',ink:'#392d3c',surface:'#17131a',button:'#ece2ea',overlay:.39,bright:.84,font:'Cormorant Garamond',radius:17,glow:.27},
    'Forest Noir':{accent:'#98bda0',text:'#edf3ed',paper:'#ece8da',ink:'#29352d',surface:'#101714',button:'#e7eadf',overlay:.40,bright:.80,font:'Georgia',radius:15,glow:.18},
    'Ivory Minimal':{accent:'#c7ae8d',text:'#f4f1ea',paper:'#f5efe2',ink:'#34302a',surface:'#181715',button:'#eee8db',overlay:.44,bright:.78,font:'Times New Roman',radius:13,glow:.10}
  };
  const renderPresets=()=>{const g=$('presetGrid');if(!g)return;g.innerHTML='';Object.entries(presets).forEach(([name,t])=>{const b=document.createElement('button');b.className='presetCard'+(state.preset===name?' active':'');const sw=document.createElement('div');sw.className='presetSwatch';sw.style.background=`linear-gradient(135deg,${t.surface},${t.ink})`;[t.accent,t.paper,t.text].forEach(c=>{const i=document.createElement('i');i.className='sw';i.style.background=c;sw.appendChild(i);});const info=document.createElement('div');info.className='presetInfo';const strong=document.createElement('strong');strong.textContent=name;const span=document.createElement('span');span.textContent=name==='Rosewood'?'SIGNATURE / WARM':name==='Midnight Blue'?'COOL / CINEMATIC':name==='Warm Amber'?'WARM / NOSTALGIC':name==='Forest Noir'?'CALM / ORGANIC':name==='Plum Velvet'?'DREAMY / LUXE':'CLEAN / TIMELESS';info.append(strong,span);b.append(sw,info);b.onclick=()=>{state={...state,...t,preset:name};apply();saveLocal();renderPresets();toast(`${name} applied.`);setTimeout(closePresets,220);};g.appendChild(b);});};
  const openPresets=()=>{$('presetPanel')?.classList.add('open');$('presetShade')?.classList.add('open');renderPresets();};
  const closePresets=()=>{$('presetPanel')?.classList.remove('open');$('presetShade')?.classList.remove('open');};
  $('presetBtn')?.addEventListener('click',openPresets);$('presetClose')?.addEventListener('click',closePresets);$('presetShade')?.addEventListener('click',closePresets);
  $('ytApply')?.addEventListener('click',()=>{const raw=$('yt').value.trim();if(!youtubeId(raw)){toast('Paste a valid YouTube URL.');return;}state.yt=raw;state.bgUrl='';state.bgType='';applyYoutube(raw);saveLocal();toast('YouTube background applied.');});
  bindFiles();apply();
}


function initSharedPresets(){
  const presets={
    'Rosewood':{accent:'#d86a86',text:'#f7f0e9',paper:'#f3eee4',ink:'#382c2f',surface:'#16151a',button:'#eee6dc',overlay:.30,bright:.86,font:'Cormorant Garamond',radius:16,glow:.30},
    'Midnight Blue':{accent:'#8fb9d9',text:'#edf3f5',paper:'#eef0e8',ink:'#27333a',surface:'#111820',button:'#e8ece9',overlay:.30,bright:.82,font:'Cormorant Garamond',radius:15,glow:.22},
    'Warm Amber':{accent:'#d5a25d',text:'#fff2df',paper:'#f2e5cf',ink:'#4a3525',surface:'#1a1510',button:'#eee0c7',overlay:.28,bright:.88,font:'Georgia',radius:14,glow:.25},
    'Plum Velvet':{accent:'#b995ce',text:'#f5edf8',paper:'#eee5ed',ink:'#392d3c',surface:'#17131a',button:'#ece2ea',overlay:.30,bright:.84,font:'Cormorant Garamond',radius:17,glow:.27},
    'Forest Noir':{accent:'#98bda0',text:'#edf3ed',paper:'#ece8da',ink:'#29352d',surface:'#101714',button:'#e7eadf',overlay:.30,bright:.80,font:'Georgia',radius:15,glow:.18},
    'Ivory Minimal':{accent:'#c7ae8d',text:'#f4f1ea',paper:'#f5efe2',ink:'#34302a',surface:'#181715',button:'#eee8db',overlay:.32,bright:.78,font:'Times New Roman',radius:13,glow:.10},
    'Sakura Night':{accent:'#f09ab7',text:'#fff5f7',paper:'#f6eceb',ink:'#3b2a31',surface:'#17121a',button:'#f0dbe3',overlay:.27,bright:.87,font:'Cormorant Garamond',radius:15,glow:.34},
    'Ocean Glass':{accent:'#78c7cf',text:'#edf9fa',paper:'#eef5f0',ink:'#25383b',surface:'#0f181b',button:'#dcefed',overlay:.27,bright:.84,font:'Cormorant Garamond',radius:15,glow:.24},
    'Crimson Night':{accent:'#df6f72',text:'#fff0ee',paper:'#f2e7df',ink:'#3d2928',surface:'#1a1013',button:'#ead9d3',overlay:.30,bright:.84,font:'Georgia',radius:14,glow:.28},
    'Lavender Dusk':{accent:'#ad9de2',text:'#f5f0ff',paper:'#f1ebf5',ink:'#342d3b',surface:'#15121c',button:'#e8e0ee',overlay:.29,bright:.83,font:'Cormorant Garamond',radius:16,glow:.29},
    'Sage & Champagne':{accent:'#b8c78d',text:'#f5f4e9',paper:'#f1eddf',ink:'#34362a',surface:'#131713',button:'#e9e4d2',overlay:.29,bright:.82,font:'Georgia',radius:14,glow:.20},
    'Silver Moon':{accent:'#c4cbd8',text:'#f2f4f8',paper:'#eef0f3',ink:'#30343b',surface:'#111419',button:'#e4e7eb',overlay:.31,bright:.82,font:'Cormorant Garamond',radius:15,glow:.18}
  };
  const panel=$('presetPanel'),shade=$('presetShade'),grid=$('presetGrid');
  const close=()=>{panel?.classList.remove('open');shade?.classList.remove('open');};
  const render=()=>{
    if(!grid)return; grid.innerHTML='';
    Object.entries(presets).forEach(([name,t])=>{
      const b=document.createElement('button');b.className='presetCard'+(state.preset===name?' active':'');
      const sw=document.createElement('div');sw.className='presetSwatch';sw.style.background=`linear-gradient(135deg,${t.surface},${t.ink})`;
      [t.accent,t.paper,t.text].forEach(c=>{const i=document.createElement('i');i.className='sw';i.style.background=c;sw.appendChild(i);});
      const info=document.createElement('div');info.className='presetInfo';
      const strong=document.createElement('strong');strong.textContent=name;
      const span=document.createElement('span');span.textContent='VIEWER MOOD';info.append(strong,span);b.append(sw,info);
      b.addEventListener('click',()=>{state={...state,...t,preset:name};apply();saveLocal();render();toast(`${name} applied.`);setTimeout(close,220);});
      grid.appendChild(b);
    });
  };
  $('presetBtn')?.addEventListener('click',()=>{render();panel?.classList.add('open');shade?.classList.add('open');});
  $('presetClose')?.addEventListener('click',close);shade?.addEventListener('click',close);
}

if(window.SHARED){
  $('customBtn')?.remove();$('previewBtn')?.remove();$('shareModal')?.remove();
  initSharedPresets();
  $('soundToggle')?.addEventListener('click',()=>{if($('soundToggle').classList.contains('on'))disableBackgroundSound();else enableBackgroundSound();});
  $('open')?.addEventListener('click',openLetter);$('letterClose')?.addEventListener('click',closeLetter);$('yes')?.addEventListener('click',()=>showScene('yes'));$('no')?.addEventListener('click',()=>showScene('no'));$('moment')?.addEventListener('click',()=>showScene('moment'));$('sceneClose')?.addEventListener('click',closeScene);$('back')?.addEventListener('click',closeScene);
  loadShared();
}else{
  initEditor();
  $('soundToggle')?.addEventListener('click',()=>{if($('soundToggle').classList.contains('on'))disableBackgroundSound();else enableBackgroundSound();});
  $('shareModalClose')?.addEventListener('click',closeShareModal);$('shareModalShade')?.addEventListener('click',closeShareModal);$('copyShare')?.addEventListener('click',copyShareUrl);$('nativeShare')?.addEventListener('click',nativeShare);$('openShare')?.addEventListener('click',()=>{const u=$('shareUrl')?.value;if(u)location.href=u;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeShareModal();closeScene();}});
}

document.addEventListener('pointerdown',()=>{if((state.yt||bgVideo)&&!bgSoundWanted)enableBackgroundSound();},{passive:true});
document.addEventListener('keydown',()=>{if((state.yt||bgVideo)&&!bgSoundWanted)enableBackgroundSound();},{passive:true});
