import { MapPin, Phone, Clock, Bus, Train } from "lucide-react";

export const metadata = {
    title: "오시는 길 | 행복한교회",
};

export default function Location() {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-12">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold glass text-[var(--primary)] mb-4">
                    Location
                </div>
                <h1 className="text-4xl font-black text-gray-900">
                    <span className="gradient-text">오시는 길</span>
                </h1>
            </div>

            {/* Map placeholder */}
            <div className="glass-card w-full h-80 rounded-3xl mb-12 flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-4">
                    <MapPin className="w-12 h-12 mx-auto text-[var(--primary-light)] animate-float" />
                    <p className="text-gray-400 text-sm font-medium">네이버 지도 API 연동 예정</p>
                    <a
                        href="https://map.naver.com/v5/search/%EC%9D%B8%EC%B2%9C%20%EB%82%A8%EB%8F%99%EA%B5%AC%20%EC%86%8C%EB%9E%98%EC%97%AD%EB%82%A8%EB%A1%9C%2010"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        <MapPin className="w-4 h-4 mr-1.5" />
                        네이버 지도에서 보기
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Address & Contact */}
                <div className="space-y-6">
                    {[
                        {
                            Icon: MapPin,
                            title: '주소',
                            content: (
                                <>인천광역시 남동구 소래역남로 10<br />5층 501-1호, 501-2호</>
                            ),
                        },
                        {
                            Icon: Phone,
                            title: '연락처',
                            content: '032-213-9191 (교회 사무실)',
                        },
                        {
                            Icon: Clock,
                            title: '예배 시간',
                            content: (
                                <ul className="space-y-1.5 text-sm">
                                    <li><strong>주일 낮 예배:</strong> 오전 11:00</li>
                                    <li><strong>주일 오후 예배:</strong> 오후 2:00</li>
                                    <li><strong>수요 기도회:</strong> 저녁 7:30</li>
                                    <li><strong>새벽 기도회:</strong> 월~금 오전 5:30</li>
                                </ul>
                            ),
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start group">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                                style={{ background: 'var(--gradient-primary)' }}>
                                <item.Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                                <div className="text-gray-500 text-sm leading-relaxed">{item.content}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Transportation */}
                <div className="glass-card rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">교통편 안내</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                                <Train className="w-4 h-4 mr-2 text-[var(--primary)]" />
                                지하철
                            </h4>
                            <ul className="space-y-1.5 ml-6 text-sm text-gray-500">
                                <li>• <strong>3호선 경찰병원역</strong> 1번 출구 도보 10분</li>
                                <li>• <strong>8호선 가락시장역</strong> 4번 출구 도보 15분</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                                <Bus className="w-4 h-4 mr-2 text-[var(--secondary)]" />
                                버스
                            </h4>
                            <ul className="space-y-1.5 ml-6 text-sm text-gray-500">
                                <li>• <strong>간선:</strong> 301, 302, 303</li>
                                <li>• <strong>지선:</strong> 3217, 3317</li>
                                <li>• <strong>마을:</strong> 송파01</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
