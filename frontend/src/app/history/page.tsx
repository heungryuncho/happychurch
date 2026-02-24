export const metadata = {
    title: "교회연혁 | 행복한교회",
};

export default function History() {
    const historyData = [
        { year: "2024", events: ["행복한교회 5주년 감사예배 달성", "해외 선교지 (필리핀) 단기 선교 파송"], color: "from-violet-500 to-purple-500" },
        { year: "2023", events: ["지역사회 사랑나눔 바자회 개최", "새가족 성경공부 10기 수료식"], color: "from-blue-500 to-cyan-500" },
        { year: "2021", events: ["행복한교회 성전 이전 및 입당 예배", "온라인 예배 시스템 구축 및 송출 시작"], color: "from-green-500 to-emerald-500" },
        { year: "2019", events: ["성전 건축 위원회 발족", "어린이주일학교 및 청년부 신설"], color: "from-amber-500 to-orange-500" },
        { year: "2018", events: ["기독교대한감리회 소속 승인", "행복한교회 창립 예배 (상가 개척)"], color: "from-pink-500 to-rose-500" }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-12">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold glass text-[var(--primary)] mb-4">
                    History
                </div>
                <h1 className="text-4xl font-black text-gray-900">
                    <span className="gradient-text">교회연혁</span>
                </h1>
            </div>

            <div className="relative ml-4 md:ml-8">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] rounded-full" />

                {historyData.map((item, index) => (
                    <div key={index} className="relative mb-12 ml-8 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        {/* Dot */}
                        <div className={`absolute -left-[2.35rem] top-1 w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-lg ring-4 ring-white`} />

                        <div className="glass-card rounded-2xl p-6">
                            <h3 className={`text-3xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>{item.year}</h3>
                            <ul className="space-y-2">
                                {item.events.map((event, eIndex) => (
                                    <li key={eIndex} className="flex items-start text-gray-600">
                                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color} mt-2 mr-3 flex-shrink-0`} />
                                        {event}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
