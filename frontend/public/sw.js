const CACHE_NAME = 'happychurch-v2';

// 캐싱할 정적 자원
const STATIC_ASSETS = [
    '/',
    '/icon-192x192.svg',
    '/icon-512x512.svg',
];

// Service Worker 설치 시 정적 자원 캐시
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// 이전 캐시 정리
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시 사용 (Network First 전략)
self.addEventListener('fetch', (event) => {
    // API 요청이나 http/https가 아닌 요청(chrome-extension 등)은 캐싱하지 않음
    // 네이버 지도 등 외부 스크립트 도메인 요청도 Service Worker가 가로채면 Referer 증발로 인증 실패가 발생하므로 제외
    let url = event.request.url || "";
    if (url.includes('/api/') || url.includes('naver.com') || !url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 성공한 응답만 캐시에 저장
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // 네트워크 실패 시 캐시에서 제공
                return caches.match(event.request);
            })
    );
});
