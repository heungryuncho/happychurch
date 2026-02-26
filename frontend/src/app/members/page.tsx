export const metadata = {
    title: "섬기는 사람들 | 행복한교회",
};

export default function Members() {
    const leadership = [
        { role: "담임목사", name: "윤영철", description: "감리교 신학대학교 졸업\n행복한교회 개척 및 담임", icon: "👨‍🏫", color: "from-violet-500 to-purple-500" },
        { role: "부목사", name: "이소망", description: "청년부 및 교육부서 총괄\n찬양팀 인도", icon: "👱‍♂️", color: "from-blue-500 to-cyan-500" },
        { role: "전도사", name: "박사랑", description: "주일학교 및 유초등부 담당\n심방 전담", icon: "👩‍🏫", color: "from-pink-500 to-rose-500" },
    ];

    const elders = [
        { name: "최믿음 장로", role: "재정부 및 관리부 담당" },
        { name: "정은혜 장로", role: "선교부 및 봉사부 담당" },
        { name: "강기쁨 장로", role: "성가대 대장" },
    ];

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-gray-900">
                    <span className="gradient-text">섬기는 사람들</span>
                </h1>
            </div>

            {/* Leadership */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="w-1.5 h-8 rounded-full mr-3" style={{ background: 'var(--gradient-primary)' }} />
                    교역자 소개
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {leadership.map((person, index) => (
                        <div key={index} className="glass-card rounded-2xl p-8 text-center group">
                            <div className={`w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-5xl mb-5 bg-gradient-to-br ${person.color} bg-opacity-10 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {person.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                            <p className={`text-sm font-medium bg-gradient-to-r ${person.color} bg-clip-text text-transparent mt-1`}>
                                {person.role}
                            </p>
                            <p className="text-sm text-gray-500 mt-3 whitespace-pre-line leading-relaxed">{person.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Elders */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <span className="w-1.5 h-8 rounded-full mr-3" style={{ background: 'var(--gradient-primary)' }} />
                    장로 및 시무
                </h2>
                <div className="glass-card rounded-2xl p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {elders.map((elder, index) => (
                            <div key={index} className="flex items-center space-x-3 group cursor-default">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-150"
                                    style={{ background: 'var(--gradient-primary)' }} />
                                <div>
                                    <div className="font-bold text-gray-900">{elder.name}</div>
                                    <div className="text-sm text-gray-500">{elder.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
