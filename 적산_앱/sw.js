// 오프라인 캐시 (앱 파일은 먼저 캐시, 글꼴은 받아 오면서 저장)
const CACHE="sigong-v142";
const CORE=["./","index.html","manifest.webmanifest","lib/three.min.js","lib/OrbitControls.js","lib/xlsx.full.min.js","lib/pdf.min.js","lib/pdf.worker.min.js","lib/html2canvas.min.js","lib/jspdf.umd.min.js","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  // 화면(HTML)은 항상 최신 버전을 먼저 받아 오고, 오프라인일 때만 캐시 사용
  if(r.mode==="navigate"||/\/(index\.html)?$/.test(new URL(r.url).pathname)){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));return res;}).catch(()=>caches.match("index.html")));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}return res;}).catch(()=>hit||caches.match("index.html"));
    return hit||net;}));
});
