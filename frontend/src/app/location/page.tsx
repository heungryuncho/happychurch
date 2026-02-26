import { MapPin, Phone, Clock, Bus, Train } from "lucide-react";
import NaverMap from "@/components/NaverMap";

export const metadata = {
    title: "오시는 길 | 행복한교회",
};

export default function Location() {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900">
                    <span className="gradient-text">오시는 길</span>
                </h1>
            </div>

            {/* Naver Map integration */}
            <div className="glass-card w-full h-[400px] sm:h-[500px] rounded-3xl mb-12 flex flex-col items-center justify-center overflow-hidden relative shadow-lg">
                <NaverMap />
            </div>

            <div className="flex justify-center">
                {/* Address & Contact */}
                <div className="space-y-6 max-w-lg w-full">
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
            </div>
        </div>
    );
}
