const peers=[{name:"Alex",route:"Direct",distance:"8 m",initial:"A"},{name:"Maria",route:"Relay",distance:"22 m",initial:"M"},{name:"Sam",route:"2 hops",distance:"41 m",initial:"S"}];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let current=null,rec=null,chunks=[],timer=null,seconds=0;
const esc=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const toast=t=>{let x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>x.classList.remove("show"),2400)};
const id=()=>{let x=localStorage.getItem("joeLinkId");if(!x){x="JOE-"+Math.random().toString(36).slice(2,8).toUpperCase();localStorage.setItem("joeLinkId",x)}return x};
function renderPeers(){$("#peers").innerHTML=peers.map((p,i)=>`<button class="peer" data-i="${i}"><div class="avatar">${p.initial}</div><div class="peermain"><b>${p.name}</b><small>${p.route}</small></div><span class="distance">${p.distance}</span></button>`).join("");$$(".peer").forEach(b=>b.onclick=()=>openChat(peers[+b.dataset.i]))}
function key(p){return "joe:"+p.name}
function msgs(p){try{return JSON.parse(localStorage.getItem(key(p))||"[]")}catch{return[]}}
function drawMsgs(){let a=msgs(current);$("#messages").innerHTML=a.length?a.map(m=>`<div class="bubble ${m.me?"me":"them"}">${esc(m.text)}<div class="meta">${m.me?"You":"Nearby"} · ${m.status}</div></div>`).join(""):`<div class="empty" style="text-align:center;margin:auto">Local conversation with ${current.name}.<br>Messages stay on this device.</div>`;requestAnimationFrame(()=>$("#messages").scrollTop=$("#messages").scrollHeight)}
function openChat(p){current=p;$("#chatName").textContent=p.name;$("#chatRoute").textContent=`${p.route} · ${p.distance}`;$("#chatAvatar").textContent=p.initial;$("#chat").classList.add("open");drawMsgs()}
function closeChat(){$("#chat").classList.remove("open")}
function send(){let x=$("#input"),t=x.value.trim();if(!t||!current)return;let a=msgs(current);a.push({text:t,me:true,status:"queued"});localStorage.setItem(key(current),JSON.stringify(a));x.value="";drawMsgs();setTimeout(()=>{let b=msgs(current);if(b.length)b.at(-1).status="delivered (local demo)";localStorage.setItem(key(current),JSON.stringify(b));drawMsgs()},450)}
function modal(id){$("#"+id).classList.add("open")} function closeModals(){$$(".modal").forEach(x=>x.classList.remove("open"));clearInterval(timer)}
function bluetooth(){if("bluetooth" in navigator){$("#bt").textContent="Web Bluetooth available";$("#transport").textContent="Radio API detected"}else{$("#bt").textContent="No Web Bluetooth";$("#transport").textContent="Browser-only local mode";$("#limit").textContent="iPhone Safari does not expose a full always-on Bluetooth mesh API. Nearby peers and Mesh Demo are simulations; no fake packets are sent."}}
async function startRec(){try{let stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];rec=new MediaRecorder(stream);rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);rec.onstop=()=>{$("#preview").src=URL.createObjectURL(new Blob(chunks,{type:"audio/webm"}));$("#preview").hidden=false;stream.getTracks().forEach(t=>t.stop());$("#recordState").textContent="Recording saved locally for preview"};rec.start();$("#hold").classList.add("recording");$("#recordState").textContent="Recording… release to stop"}catch{$("#recordState").textContent="Microphone unavailable or permission denied";toast("Microphone permission is required")}}
function stopRec(){if(rec&&rec.state==="recording"){rec.stop();$("#hold").classList.remove("recording")}}
function call(p=current||peers[0]){$("#callName").textContent=p.name;$("#callAvatar").textContent=p.initial;modal("call");seconds=0;tick();timer=setInterval(()=>{seconds++;tick()},1000)}
function tick(){$("#timer").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function files(fs){$("#queue").innerHTML=fs.length?fs.map(f=>`<div class="file"><div class="filemain"><div class="filename">${esc(f.name)}</div><div class="filestatus">${size(f.size)} · queued · experimental transport</div></div>↗</div>`).join(""):"No files queued."}
function size(n){return n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":n<1073741824?(n/1048576).toFixed(1)+" MB":(n/1073741824).toFixed(1)+" GB"}
function route(){let a=[["You","Origin"],[peers[Math.floor(Math.random()*3)].name,"Relay candidate"],["Alex","Destination"]];$("#nodes").innerHTML=a.map((x,i)=>`<div class="node"><b>${i+1}. ${x[0]}</b><span>${x[1]}</span></div>`).join("")}
document.addEventListener("DOMContentLoaded",()=>{localStorage.setItem("joeLinkId",id());renderPeers();bluetooth();
$$("[data-close-chat]").forEach(x=>x.onclick=closeChat);$$("[data-close]").forEach(x=>x.onclick=closeModals);
$("#send").onclick=send;$("#input").onkeydown=e=>{if(e.key==="Enter")send()};$("#chatCall").onclick=()=>call();$("#chatMic").onclick=()=>modal("ptt");
$("#choose").onclick=()=>$("#file").click();$("#file").onchange=e=>files([...e.target.files]);
$("#hold").onpointerdown=e=>{e.preventDefault();startRec()};["pointerup","pointercancel","pointerleave"].forEach(e=>$("#hold").addEventListener(e,stopRec));
$("#end").onclick=closeModals;$("#mute").onclick=()=>toast("Mute control is local UI prototype");$("#speaker").onclick=()=>toast("Speaker control is local UI prototype");
$("#reroute").onclick=route;$$("[data-action]").forEach(b=>b.onclick=()=>{let a=b.dataset.action;if(a==="find")toast("Nearby discovery is demo-only in Safari");if(a==="mesh"){modal("mesh");route()}if(a==="ptt")modal("ptt");if(a==="call")call()});
$("#profile").onclick=()=>toast("Local identity: "+id());
let sy=0;$("#chat").ontouchstart=e=>sy=e.touches[0].clientY;$("#chat").ontouchend=e=>{if(e.changedTouches[0].clientY-sy>90)closeChat()};});