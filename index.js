const{onValueCreated}=require('firebase-functions/v2/database'),admin=require('firebase-admin');admin.initializeApp();
exports.notify=onValueCreated({ref:'/chats/{cid}/{mid}',region:'asia-southeast1',instance:'relay-chat-d6f38-default-rtdb'},async e=>{
const m=e.data.val(),cid=e.params.cid,db=admin.database(),v=async p=>(await db.ref(p).get()).val();
if(!m||!m.from||m.y)return;let jobs=[];
if(cid.startsWith('g_')){const id=cid.slice(2),g=await v('groups/'+id);if(!g)return;
for(const u of(Array.isArray(g.members)?g.members:Object.values(g.members||{})).filter(u=>u!=m.from))jobs.push({u,id,ty:'g',title:g.name+' · '+m.from})}
else{const cs=await v('contacts/'+m.from)||{};
for(const u of Object.keys(cs).filter(u=>[m.from,u].sort().join('_')==cid)){const c=await v('contacts/'+u+'/'+m.from);jobs.push({u,id:m.from,ty:'u',title:(c&&c.name)||m.from})}}
for(const j of jobs){if(await v('mutes/'+j.u+'/'+j.id)||await v('blocks/'+j.u+'/'+m.from))continue;
const t=Object.values(await v('fcm/'+j.u)||{}).map(x=>x.t);if(!t.length)continue;
await admin.messaging().sendEach(t.map(token=>({token,data:{title:j.title,body:'Pesan baru',id:j.id,ty:j.ty,tag:cid},webpush:{headers:{Urgency:'high',TTL:'86400'}}})))}});
