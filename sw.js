self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
const U=(id,ty)=>self.registration.scope+'?'+(ty=='g'?'grup=':'chat=')+id;
self.addEventListener('push',e=>{let j={};try{j=e.data.json()}catch{}const d=j.data||j,id=d.id,ty=d.ty;
e.waitUntil((async()=>{const cs=await clients.matchAll({type:'window',includeUncontrolled:true});
if(cs.some(c=>c.visibilityState=='visible'&&c.focused&&c.url.includes((ty=='g'?'grup=':'chat=')+id)))return;
return self.registration.showNotification(d.title||'Relay',{body:d.body||'Pesan baru',tag:d.tag||id,renotify:true,vibrate:[200,100,200],data:{id,ty,url:U(id,ty)},actions:[{action:'reply',type:'text',title:'Balas',placeholder:'Ketik balasan...'}]})})())});
self.addEventListener('notificationclick',e=>{e.notification.close();const d=e.notification.data||{};
e.waitUntil((async()=>{const cs=await clients.matchAll({type:'window',includeUncontrolled:true});let c=cs[0];
if(c){if(e.action=='reply'&&e.reply)c.postMessage({type:'reply',id:d.id,ty:d.ty,text:e.reply});else{await c.focus();c.postMessage({type:'open',id:d.id,ty:d.ty})}}
else await clients.openWindow(d.url||self.registration.scope)})())});
