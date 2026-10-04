self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('notificationclick',e=>{e.notification.close();const d=e.notification.data||{};
e.waitUntil((async()=>{const cs=await clients.matchAll({type:'window',includeUncontrolled:true});let c=cs[0];
if(c){if(e.action=='reply'&&e.reply)c.postMessage({type:'reply',id:d.id,ty:d.ty,text:e.reply});else{await c.focus();c.postMessage({type:'open',id:d.id,ty:d.ty})}}
else await clients.openWindow(d.url||'./')})())});
