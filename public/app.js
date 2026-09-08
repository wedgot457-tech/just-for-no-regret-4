const defaults={brand:'JUST FOR NO REGRET',heroEyebrow:'FROM ~MANAS',heroTitle:'A thought from me',heroSubtitle:'I made this website just for you, to be honest, not entirely on my own\nbut with the help of AI.',heroCTA:'OPEN LETTER',footerLeft:'MADE FOR ONE VERY SPECIAL PERSON',letterEyebrow:'I KNOW THESE FONTS ARE NOT GOOD',letterTitle:'Sorry To Bother.',letterBody:"There are some things that are hard to say out loud.\n\nSo I decided to write them here...\nBut still I didn't write everything.\n\nI know this is a bad thing to say, but I still like you and haven't liked anyone else in my life. I just wanted you to know. I always admired and respected you. It is true that I cannot say all of this in front of you or express this feeling; I thought if I talked to you about it, you would become frustrated, so I thought this would be better. I am simply an introvert. Sorry if this offends or frustrates you, but I love you.",signature:'~MANAS',question:'Will you be mine?',yesTitle:'You said yes.',yesText:'And somehow the whole night feels a little brighter.',noTitle:"That's okay.",noText:'Thank you for being honest. Some feelings deserve kindness either way.',momentTitle:'Take your time.',momentText:"No rush. Come back when you're ready.",font:'Cormorant Garamond',accent:'#ef4f82',text:'#f8f1ea',paper:'#f3efe4',ink:'#3d2730',surface:'#17141b',button:'#f3efe4',radius:20,glow:.35,overlay:.55,bright:.75};
let state={...defaults,yt:''};
if(!window.SHARED){try{state={...state,...JSON.parse(localStorage.getItem('replicaLetter')||'{}')}}catch{}}
const $=id=>document.getElementById(id); const toast=m=>{if(!$('toast'))return;$('toast').textContent=m;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)};
function ambient(){const p=$('particles');if(!p)return;for(let i=0;i<34;i++){const d=document.createElement('i');d.className='particle';d.style.left=Math.random()*100+'%';d.style.animationDelay=(Math.random()*9)+'s';d.style.animationDuration=(7+Math.random()*6)+'s';p.appendChild(d)}} ambient();
function set(id,v){if($(id))$(id).textContent=v??''} function esc(s){return String(s||'')}
function apply(){
 set('brand',state.brand);set('heroEyebrow',state.heroEyebrow);set('heroTitle',state.heroTitle);set('heroSubtitle',state.heroSubtitle);set('open',state.heroCTA);set('footerLeft',state.footerLeft);
 set('letterEyebrow',state.letterEyebrow);set('letterTitle',state.letterTitle);if($('letterPhotoImg')&&state.letterPhotoUrl){$('letterPhotoImg').src=state.letterPhotoUrl;$('letterPhotoImg').classList.add('show')}else if($('letterPhotoImg'))$('letterPhotoImg').classList.remove('show');set('letterBody',state.letterBody);set('signature',state.signature);set('question',state.question);set('yesTitle',state.yesTitle);set('yesText',state.yesText);set('noTitle',state.noTitle);set('noText',state.noText);set('momentTitle',state.momentTitle);set('momentText',state.momentText);if($('yt'))$('yt').value=state.yt||'';
 document.documentElement.style.setProperty('--font',`'${state.font}',serif`);document.documentElement.style.setProperty('--pink',state.accent);document.documentElement.style.setProperty('--text',state.text);document.documentElement.style.setProperty('--paper',state.paper);document.documentElement.style.setProperty('--ink',state.ink);document.documentElement.style.setProperty('--surface',state.surface||'#17141b');document.documentElement.style.setProperty('--button',state.button||state.paper);document.documentElement.style.setProperty('--radius',(state.radius||20)+'px');document.documentElement.style.setProperty('--glow',state.glow??.35);document.documentElement.style.setProperty('--overlay',state.overlay);document.documentElement.style.setProperty('--bright',state.bright);
 if(!window.SHARED){const map={fEyebrow:'heroEyebrow',fTitle:'heroTitle',fSubtitle:'heroSubtitle',fCTA:'heroCTA',fFooter:'footerLeft',lEyebrow:'letterEyebrow',lTitle:'letterTitle',lBody:'letterBody',lSig:'signature',lQuestion:'question',yTitle:'yesTitle',yText:'yesText',nTitle:'noTitle',nText:'noText',mTitle:'momentTitle',mText:'momentText'};for(const [id,k] of Object.entries(map))if($(id))$(id).value=state[k]||'';$('font').value=state.font;$('accent').value=state.accent;$('text').value=state.text;$('paper').value=state.paper;$('ink').value=state.ink;$('surface').value=state.surface||'#17141b';$('button').value=state.button||state.paper;$('radius').value=state.radius||20;$('glow').value=state.glow??.35;$('overlay').value=state.overlay;$('bright').value=state.bright}
 if(state.yt)applyYoutube(state.yt); else if(state.bgUrl)applyBg(state.bgUrl,state.bgType);
}
function saveLocal(){localStorage.setItem('replicaLetter',JSON.stringify(state))}
function openLetter(){ $('letterOverlay').classList.add('show'); enableBackgroundSound(); }
function closeLetter(){ $('letterOverlay').classList.remove('show') }
function scene(type){$('scene').classList.add('show');const data={yes:['YES','You said yes.',state.yesText,'yesPhotoUrl'],no:['NO',state.noTitle,state.noText,'noPhotoUrl'],moment:['A LITTLE MOMENT',state.momentTitle,state.momentText,'momentPhotoUrl']}[type];set('sceneEyebrow',data[0]);set('sceneTitle',data[1]);set('sceneText',data[2]);const im=$('sceneImg');if(state[data[3]]){im.src=state[data[3]];im.classList.add('show')}else{im.removeAttribute('src');im.classList.remove('show')}$('sceneFX').innerHTML=''; if(type==='yes')yesFx(); if(type==='no')rainFx(); if(type==='moment')calmFx()}
function closeScene(){$('scene').classList.remove('show')}
function yesFx(){for(let i=0;i<18;i++){const h=document.createElement('i');h.className='fxHeart';h.textContent='♥';h.style.left=Math.random()*100+'%';h.style.animationDelay=Math.random()*5+'s';h.style.animationDuration=4+Math.random()*4+'s';$('sceneFX').appendChild(h)}for(let k=0;k<4;k++){const cx=15+Math.random()*70,cy=15+Math.random()*50;for(let j=0;j<28;j++){const s=document.createElement('i');s.className='spark';const a=j*Math.PI*2/28,r=65+Math.random()*90;s.style.left=cx+'%';s.style.top=cy+'%';s.style.setProperty('--x',Math.cos(a)*r+'px');s.style.setProperty('--y',Math.sin(a)*r+'px');s.style.animationDelay=Math.random()*1.5+'s';$('sceneFX').appendChild(s)}}}
function rainFx(){for(let i=0;i<90;i++){const d=document.createElement('i');d.className='drop';d.style.left=Math.random()*100+'%';d.style.animationDelay=Math.random()+'s';d.style.animationDuration=.65+Math.random()*.7+'s';$('sceneFX').appendChild(d)}}
function calmFx(){for(let i=0;i<24;i++){const d=document.createElement('i');d.className='particle';d.style.left=Math.random()*100+'%';d.style.animationDelay=Math.random()*5+'s';$('sceneFX').appendChild(d)}}
function youtubeId(url){
 try{
  const u=new URL(url);
  const host=u.hostname.replace(/^www\./,'');
  if(host==='youtu.be') return u.pathname.split('/').filter(Boolean)[0]||'';
  if(host==='youtube.com'||host.endsWith('.youtube.com')){
   if(u.pathname==='/watch') return u.searchParams.get('v')||'';
   if(u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2]||'';
   if(u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2]||'';
   if(u.pathname.startsWith('/live/')) return u.pathname.split('/')[2]||'';
  }
 }catch{}
 return '';
}

let ytPlayer=null, ytPlayerReady=false, ytSoundWanted=false, ytApiPromise=null;
let bgVideo=null, bgSoundWanted=false;

function currentOrigin(){
 try{
  const o=window.location.origin;
  return /^https?:$/.test(window.location.protocol) ? o : '';
 }catch{return ''}
}

function loadYouTubeAPI(){
 if(window.YT && window.YT.Player) return Promise.resolve(window.YT);
 if(ytApiPromise) return ytApiPromise;
 ytApiPromise=new Promise((resolve,reject)=>{
  const existing=document.querySelector('script[data-youtube-iframe-api]');
  if(existing){
   const timer=setInterval(()=>{
    if(window.YT && window.YT.Player){clearInterval(timer);resolve(window.YT)}
   },50);
   setTimeout(()=>{clearInterval(timer); if(!(window.YT&&window.YT.Player))reject(new Error('YouTube API timeout'))},10000);
   return;
  }
  const script=document.createElement('script');
  script.src='https://www.youtube.com/iframe_api';
  script.async=true;
  script.dataset.youtubeIframeApi='1';
  document.head.appendChild(script);
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{
   if(typeof previous==='function')previous();
   resolve(window.YT);
  };
  setTimeout(()=>{if(!(window.YT&&window.YT.Player))reject(new Error('YouTube API timeout'))},10000);
 });
 return ytApiPromise;
}

function applyYoutube(url){
 const wrap=$('youtubeBg'), bg=$('bg'), btn=$('soundToggle');
 if(!wrap)return;
 const id=youtubeId(url||'');
 if(ytPlayer){try{ytPlayer.destroy()}catch{}}
 ytPlayer=null; ytPlayerReady=false; ytSoundWanted=false;
 if(bgVideo){try{bgVideo.pause()}catch{} bgVideo=null;}
 wrap.innerHTML=''; wrap.style.display='none';
 if(btn){btn.classList.remove('show','on');btn.textContent='♪ SOUND ON';}
 if(bg){bg.style.backgroundImage='';bg.innerHTML='';}
 if(!id)return;

 const iframe=document.createElement('iframe');
 const origin=currentOrigin();
 const params=new URLSearchParams({
  enablejsapi:'1', autoplay:'1', controls:'0', disablekb:'1', fs:'0',
  iv_load_policy:'3', loop:'1', playsinline:'1', rel:'0', mute:'1',
  playlist:id
 });
 if(origin)params.set('origin',origin);
 iframe.id='youtubePlayer';
 iframe.title='YouTube background video';
 iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
 iframe.allow='autoplay; encrypted-media; picture-in-picture';
 iframe.referrerPolicy='strict-origin-when-cross-origin';
 iframe.setAttribute('frameborder','0');
 iframe.setAttribute('allowfullscreen','');
 iframe.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;';
 wrap.appendChild(iframe);
 wrap.style.display='block';
 if(btn)btn.classList.add('show');

 loadYouTubeAPI().then(YT=>{
   ytPlayer=new YT.Player(iframe,{
    events:{
      onReady:()=>{
       ytPlayerReady=true;
       try{
        ytPlayer.mute();
        ytPlayer.setVolume(100);
        ytPlayer.playVideo();
       if(ytSoundWanted) enableYoutubeSound();
       }catch(e){console.warn('YouTube playback start failed',e)}
       if(ytSoundWanted)enableYoutubeSound();
      },
      onStateChange:e=>{
       if(window.YT && e.data===YT.PlayerState.ENDED){
        try{ytPlayer.playVideo()}catch{}
       }
      },
      onError:e=>{
       console.warn('YouTube background error',e.data);
       if(e.data===153) toast('YouTube blocked the embed because no referrer was supplied. Try the deployed site, not the embed URL itself.');
       else if(e.data===101||e.data===150) toast('This YouTube video does not allow embedding.');
      },
      onAutoplayBlocked:()=>{
       // Muted autoplay is normally allowed; if the browser still blocks it,
       // the first user interaction below retries playback.
      }
    }
   });
 }).catch(err=>{
   console.error(err);
   toast('YouTube could not load. Check the URL or browser connection.');
 });
}

function enableYoutubeSound(){
 ytSoundWanted=true;
 if(!ytPlayerReady||!ytPlayer)return;
 try{
  ytPlayer.unMute();
  ytPlayer.setVolume(100);
  ytPlayer.playVideo();
  const b=$('soundToggle');
  if(b){b.classList.add('on');b.textContent='♪ SOUND ON'}
 }catch(e){console.warn('YouTube sound blocked',e)}
}

function disableYoutubeSound(){
 ytSoundWanted=false;
 if(ytPlayerReady&&ytPlayer)try{ytPlayer.mute()}catch{}
 const b=$('soundToggle');
 if(b){b.classList.remove('on');b.textContent='♪ SOUND ON'}
}

function applyBg(url,type){
 const bg=$('bg'),btn=$('soundToggle'); if(!bg)return;
 bg.innerHTML=''; bg.style.backgroundImage=''; bgVideo=null; bgSoundWanted=false;
 if(btn){btn.classList.remove('show','on');btn.textContent='♪ SOUND ON';}
 if(type==='video' && url){
  const v=document.createElement('video');
  v.autoplay=true; v.muted=true; v.loop=true; v.playsInline=true; v.preload='auto'; v.src=url;
  v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
  v.style.cssText='width:100%;height:100%;object-fit:cover;display:block;';
  bg.appendChild(v); bgVideo=v;
  v.play().catch(()=>{});
  if(btn)btn.classList.add('show');
 }else if(url){
  bg.style.backgroundImage=`url("${url}")`;
 }
}
function enableBackgroundSound(){
 bgSoundWanted=true;
 if(bgVideo){
  try{bgVideo.muted=false; bgVideo.volume=1; const p=bgVideo.play(); if(p&&p.catch)p.catch(()=>{});}catch(e){console.warn('Background video sound blocked',e)}
 }
 if(ytPlayerReady) enableYoutubeSound();
 const b=$('soundToggle'); if(b){b.classList.add('on');b.textContent='♪ SOUND ON';}
}
function disableBackgroundSound(){
 bgSoundWanted=false;
 if(bgVideo)try{bgVideo.muted=true}catch{}
 if(ytPlayerReady) disableYoutubeSound();
 const b=$('soundToggle'); if(b){b.classList.remove('on');b.textContent='♪ SOUND ON';}
}


function filePreview(file,cb){const r=new FileReader();r.onload=()=>cb(r.result,file.type);r.readAsDataURL(file)}
function bindFiles(){
 if(window.SHARED)return;
 const bg=$('bgFile');if(bg)bg.onchange=e=>{const f=e.target.files[0];if(!f)return;filePreview(f,(u,t)=>{state.bgUrl=u;state.bgType=t.startsWith('video/')?'video':'image';state.yt='';if($('yt'))$('yt').value='';applyYoutube('');applyBg(u,state.bgType);saveLocal()})};
 ['letterPhoto','yesPhoto','noPhoto','momentPhoto'].forEach(id=>{const el=$(id);if(el)el.onchange=e=>{const f=e.target.files[0];if(!f)return;filePreview(f,(u,t)=>{state[id+'Url']=u;if(id==='letterPhoto'&&$('letterPhotoImg')){$('letterPhotoImg').src=u;$('letterPhotoImg').classList.add('show')}saveLocal();toast('Photo ready for preview. A Share save uploads it to the server.')})}})
}
async function uploadFileToBlob(file, kind){
 const fd=new FormData();
 fd.append('file', file);
 fd.append('kind', kind);
 const r=await fetch('/api/upload',{method:'POST',body:fd});
 const data=await r.json();
 if(!r.ok) throw Error(data.error||'Upload failed');
 return data.url;
}

async function uploadForShare(fieldId, kind, savedUrl){
 const input=$(fieldId);
 const file=input?.files?.[0];
 if(file) return uploadFileToBlob(file, kind);
 if(savedUrl && /^data:/i.test(savedUrl)){
   const blob=await (await fetch(savedUrl)).blob();
   const ext=(blob.type||'image/jpeg').split('/')[1]||'bin';
   const restored=new File([blob],`restored.${ext}`,{type:blob.type||'application/octet-stream'});
   return uploadFileToBlob(restored, kind);
 }
 return savedUrl||null;
}

async function createShare(){
 const button=$('shareBtn')||$('drawerShare');
 if(button) button.disabled=true;
 try{
   toast('Preparing your share link…');
   const copy={...state};
   delete copy.bgUrl;
   delete copy.bgType;
   for(const k of ['letterPhoto','yesPhoto','noPhoto','momentPhoto']) delete copy[k+'Url'];

   const bgInput=$('bgFile')?.files?.[0];
   const bgKind=bgInput?.type?.startsWith('video/')?'background-video':'background-image';
   const [letterPhotoUrl,yesPhotoUrl,noPhotoUrl,momentPhotoUrl,bgUrl]=await Promise.all([
     uploadForShare('letterPhoto','photo',state.letterPhotoUrl),
     uploadForShare('yesPhoto','photo',state.yesPhotoUrl),
     uploadForShare('noPhoto','photo',state.noPhotoUrl),
     uploadForShare('momentPhoto','photo',state.momentPhotoUrl),
     uploadForShare('bgFile',bgKind,state.bgUrl)
   ]);
   if(letterPhotoUrl) copy.letterPhotoUrl=letterPhotoUrl;
   if(yesPhotoUrl) copy.yesPhotoUrl=yesPhotoUrl;
   if(noPhotoUrl) copy.noPhotoUrl=noPhotoUrl;
   if(momentPhotoUrl) copy.momentPhotoUrl=momentPhotoUrl;
   if(bgUrl){ copy.bgUrl=bgUrl; copy.bgType=bgInput?.type?.startsWith('video/')?'video':'image'; }

   const r=await fetch('/api/share',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({config:copy})});
   let j={};
   try{j=await r.json()}catch{}
   if(!r.ok || !j.url) throw Error(j.error||`Share API failed (${r.status})`);

   // A share link was successfully created even if clipboard access is blocked.
   let copied=false;
   try{
     if(navigator.clipboard?.writeText){
       await navigator.clipboard.writeText(j.url);
       copied=true;
     }
   }catch{}

   if(!copied && navigator.share){
     try{
       await navigator.share({title:document.title||'Just For No Regret',url:j.url});
       copied=true;
     }catch{}
   }

   if(!copied){
     // Last-resort fallback: show the URL in a selectable prompt.
     try{ window.prompt('Your share link — copy it:',j.url); }catch{}
   }
   toast(copied?'Share link ready.':'Share link created — copy it from the dialog.');
   console.log('Share link:',j.url);
   return j.url;
 }catch(e){
   console.error('Share failed:',e);
   toast(e.message||'Share failed. Make sure Vercel Blob is connected.');
   return null;
 }finally{ if(button) button.disabled=false; }
}
async function loadShared(){
 try{
   const r=await fetch('/api/share/'+encodeURIComponent(window.SHARE_SLUG),{cache:'no-store'});
   if(!r.ok) throw Error();
   const j=await r.json();
   state={...defaults,...(j.config||{})};
   apply();
 }catch{
   toast('This share link is not available.');
 }
}
if(window.SHARED){$('customBtn')?.remove();$('presetBtn')?.remove();$('previewBtn')?.remove();loadShared()}
else{
 const map={fEyebrow:'heroEyebrow',fTitle:'heroTitle',fSubtitle:'heroSubtitle',fCTA:'heroCTA',fFooter:'footerLeft',lEyebrow:'letterEyebrow',lTitle:'letterTitle',lBody:'letterBody',lSig:'signature',lQuestion:'question',yTitle:'yesTitle',yText:'yesText',nTitle:'noTitle',nText:'noText',mTitle:'momentTitle',mText:'momentText'};
 for(const [id,k] of Object.entries(map))$(id).oninput=e=>{state[k]=e.target.value;apply();saveLocal()};
 [['font','font'],['accent','accent'],['text','text'],['paper','paper'],['ink','ink'],['surface','surface'],['button','button'],['radius','radius'],['glow','glow'],['overlay','overlay'],['bright','bright']].forEach(([id,k])=>$(id).oninput=e=>{state[k]=['overlay','bright'].includes(k)?+e.target.value:e.target.value;apply();saveLocal()});
 $('customBtn').onclick=()=>{document.body.classList.add('drawer-open');$('drawer').classList.add('open');$('drawerShade').classList.add('open')};$('drawerClose').onclick=closeDrawer;$('drawerShade').onclick=closeDrawer;
 function closeDrawer(){document.body.classList.remove('drawer-open');$('drawer').classList.remove('open');$('drawerShade').classList.remove('open')}
 $('save').onclick=()=>{saveLocal();toast('Saved on this device.')};$('reset').onclick=()=>{state={...defaults};saveLocal();apply();toast('Reset complete.')};
 $('shareBtn').onclick=createShare;$('drawerShare').onclick=createShare;
 $('previewBtn').onclick=()=>document.body.classList.toggle('preview');$('open').onclick=openLetter;$('letterClose').onclick=closeLetter;$('yes').onclick=()=>scene('yes');$('no').onclick=()=>scene('no');$('moment').onclick=()=>scene('moment');
 $('sceneClose').onclick=closeScene;$('back').onclick=closeScene;$('footerRight').onclick=()=>{state={...defaults};saveLocal();apply()};
 const presets={
 'Rose Night':{accent:'#ef4f82',text:'#f8f1ea',paper:'#f3efe4',ink:'#3d2730',surface:'#17141b',button:'#f3efe4',overlay:.55,bright:.75,font:'Cormorant Garamond',radius:20,glow:.35},
 'Midnight Blue':{accent:'#8fb7ff',text:'#edf3ff',paper:'#eef1ea',ink:'#202a38',surface:'#111823',button:'#edf3ff',overlay:.56,bright:.72,font:'Cormorant Garamond',radius:22,glow:.28},
 'Warm Amber':{accent:'#e4ad63',text:'#fff4df',paper:'#f2e6cf',ink:'#4a3421',surface:'#1a1510',button:'#f2e6cf',overlay:.5,bright:.78,font:'Georgia',radius:18,glow:.3},
 'Forest Noir':{accent:'#9dc7a5',text:'#edf4ed',paper:'#ece7d8',ink:'#28372c',surface:'#101714',button:'#ece7d8',overlay:.57,bright:.7,font:'Georgia',radius:20,glow:.22},
 'Plum Velvet':{accent:'#c89ae8',text:'#f7eff9',paper:'#f0e7ef',ink:'#392a3d',surface:'#17111b',button:'#f0e7ef',overlay:.56,bright:.73,font:'Cormorant Garamond',radius:24,glow:.32},
 'Ivory Minimal':{accent:'#d9c3a6',text:'#f5f2ec',paper:'#f6f0e3',ink:'#34302a',surface:'#181715',button:'#f6f0e3',overlay:.63,bright:.68,font:'Times New Roman',radius:16,glow:.12}
};
function renderPresets(){const g=$('presetGrid');if(!g)return;g.innerHTML='';Object.entries(presets).forEach(([name,t])=>{const b=document.createElement('button');b.className='presetCard'+(state.preset===name?' active':'');b.innerHTML=`<div class="presetSwatch" style="background:linear-gradient(135deg,${t.surface},${t.ink})"><i class="sw" style="background:${t.accent}"></i><i class="sw" style="background:${t.paper}"></i><i class="sw" style="background:${t.text}"></i></div><div class="presetInfo"><strong>${name}</strong><span>${name==='Rose Night'?'SIGNATURE / ROMANTIC':name==='Midnight Blue'?'COOL / CINEMATIC':name==='Warm Amber'?'WARM / NOSTALGIC':name==='Forest Noir'?'CALM / ORGANIC':name==='Plum Velvet'?'DREAMY / LUXE':'CLEAN / TIMELESS'}</span></div>`;b.onclick=()=>{state={...state,...t,preset:name};apply();saveLocal();renderPresets();toast(name+' applied.');setTimeout(closePresets,220)};g.appendChild(b)})}
function openPresets(){$('presetPanel').classList.add('open');$('presetShade').classList.add('open');renderPresets()}function closePresets(){$('presetPanel').classList.remove('open');$('presetShade').classList.remove('open')}
$('presetBtn').onclick=openPresets;$('presetClose').onclick=closePresets;$('presetShade').onclick=closePresets;;
 $('ytApply').onclick=()=>{const raw=$('yt').value.trim(),id=youtubeId(raw);if(!id){toast('Paste a valid YouTube URL.');return}state.yt=raw;state.bgUrl='';state.bgType='';applyYoutube(raw);saveLocal();toast('YouTube background applied.')};
 bindFiles();apply();
}

// Background audio controls work for both uploaded videos and YouTube backgrounds.
$('soundToggle').onclick=()=>{
 if($('soundToggle').classList.contains('on')) disableBackgroundSound();
 else enableBackgroundSound();
};
document.addEventListener('pointerdown',()=>{
 if((state.yt || bgVideo) && !bgSoundWanted) enableBackgroundSound();
},{passive:true});
document.addEventListener('keydown',()=>{
 if((state.yt || bgVideo) && !bgSoundWanted) enableBackgroundSound();
},{passive:true});
