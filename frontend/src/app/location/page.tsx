import { MapPin, Phone, Clock, Bus, Train, Car } from "lucide-react";
import NaverMap from "@/components/NaverMap";

export const metadata = {
    title: "오시는 길 | 행복한교회",
};

export default function Location() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
                    <span className="gradient-text">오시는 길</span>
                </h1>
                <p className="text-gray-500 text-lg">행복한교회로 오시는 길을 상세히 안내해 드립니다</p>
            </div>

            {/* Naver Map integration */}
            <div className="glass-card w-full h-[450px] sm:h-[550px] rounded-3xl mb-16 flex flex-col items-center justify-center overflow-hidden relative shadow-xl border border-white/40">
                <NaverMap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
                {/* Info Section */}
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-3 mb-2 px-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white border border-[#e0ac5f]/30">
                            <MapPin className="w-5 h-5 text-[#d4a853]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">교회 정보</h2>
                    </div>

                    <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-8 flex-grow shadow-lg border border-white/50 bg-white/40 backdrop-blur-md">
                        {/* Address */}
                        <div className="flex items-start group">
                            <div className="w-12 h-12 rounded-2xl bg-[#f8f3eb] flex items-center justify-center text-[#d4a853] mr-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">주소</h3>
                                <div className="text-gray-600 leading-relaxed text-[15px]">
                                    인천광역시 남동구 소래역남로 10<br />
                                    5층 501-1호, 501-2호 행복한교회
                                </div>
                            </div>
                        </div>
                        {/* Contact */}
                        <div className="flex items-start group">
                            <div className="w-12 h-12 rounded-2xl bg-[#f8f3eb] flex items-center justify-center text-[#d4a853] mr-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">연락처</h3>
                                <div className="text-gray-600 leading-relaxed text-[15px]">032-213-9191 (사무실)</div>
                            </div>
                        </div>
                        {/* Worship Time */}
                        <div className="flex items-start group">
                            <div className="w-12 h-12 rounded-2xl bg-[#f8f3eb] flex items-center justify-center text-[#d4a853] mr-5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">예배 안내</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-2 w-full text-[15px]">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="font-semibold text-gray-700">주일 낮 예배</span>
                                        <span className="text-gray-600">오전 11:00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="font-semibold text-gray-700">주일 오후 예배</span>
                                        <span className="text-gray-600">오후 2:00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="font-semibold text-gray-700">수요 기도회</span>
                                        <span className="text-gray-600">저녁 7:30</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="font-semibold text-gray-700">새벽 기도회</span>
                                        <span className="text-gray-600">평일 5:30</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transportation Section */}
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-3 mb-2 px-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white border border-[#e0ac5f]/30">
                            <Bus className="w-5 h-5 text-[#d4a853]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">교통편 안내</h2>
                    </div>

                    <div className="space-y-4 flex-grow">
                        {/* Subway */}
                        <div className="glass-card p-6 sm:p-7 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-lg border border-white/50 bg-gradient-to-br from-white to-[#fff9ec]">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#ffce32] flex items-center justify-center text-white mb-4 sm:mb-0 sm:mr-5 flex-shrink-0 shadow-md">
                                    <Train className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-900 flex items-center">
                                        지하철 이용
                                    </h3>
                                    <p className="text-gray-600 text-[15px] mt-2 leading-relaxed">
                                        <strong className="text-yellow-600">수인분당선 소래포구역</strong> 2번 출구에서 도보 약 5분
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">(소래역사관 맞은편 건물)</p>
                                </div>
                            </div>
                        </div>

                        {/* Bus */}
                        <div className="glass-card p-6 sm:p-7 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-lg border border-white/50 bg-gradient-to-br from-white to-[#f0faf4]">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center text-white mb-4 sm:mb-0 sm:mr-5 flex-shrink-0 shadow-md">
                                    <Bus className="w-7 h-7" />
                                </div>
                                <div className="w-full">
                                    <h3 className="text-[17px] font-bold text-gray-900 mb-2">버스 이용</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-600 text-[14px]">
                                            <strong>소래포구역</strong> 또는 <strong>소래역사관</strong> 앞 하차
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-[13px] mt-1">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">간선 20, 21, 27</span>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md font-medium">지선 51-1, 51-2</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car */}
                        <div className="glass-card p-6 sm:p-7 rounded-3xl hover:-translate-y-1 transition-transform duration-300 shadow-lg border border-white/50 bg-gradient-to-br from-white to-[#f4f7ff]">
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#4b7aef] flex items-center justify-center text-white mb-4 sm:mb-0 sm:mr-5 flex-shrink-0 shadow-md">
                                    <Car className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-[17px] font-bold text-gray-900">자가용 이용</h3>
                                    <p className="text-gray-600 text-[15px] mt-2 leading-relaxed">
                                        네비게이션에 <strong>'소래역남로 10'</strong> 검색<br />
                                        (건물 지하 주차장 이용 가능)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
