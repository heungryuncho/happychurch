export const metadata = {
    title: "환영인사 | 행복한교회",
};

export default function Greetings() {
    return (
        <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="mb-8 sm:mb-12">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold glass text-[var(--primary)] mb-4">
                    Welcome
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                    <span className="gradient-text">환영인사</span>
                </h1>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-12 space-y-6">
                <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed border-l-4 border-[var(--primary)] pl-4 sm:pl-6">
                    할렐루야! 행복한교회를 찾아주신 여러분을 주님의 이름으로 축복하고 환영합니다.
                </p>

                <div className="space-y-5 text-gray-600 leading-relaxed text-sm sm:text-base">
                    <p>
                        행복한교회는 <strong className="text-gray-900">"하나님을 기쁘시게, 사람을 행복하게"</strong>라는 표어 아래 세워진 건강하고 따뜻한 신앙 공동체입니다.
                        각박하게 돌아가는 세상 속에서 많은 이들이 참된 위로와 안식을 갈망하지만, 진정한 평안을 찾기 어려운 시대에 살고 있습니다.
                    </p>

                    <p>
                        우리는 오직 예수 그리스도의 십자가 복음만이 참된 소망이 됨을 믿습니다.
                        행복한교회는 누구나 와서 예배의 기쁨을 누리고, 말씀 안에서 삶의 해답을 찾으며,
                        서로를 아끼고 섬기는 믿음의 교제를 나누기를 원합니다.
                    </p>

                    <p>
                        가정 같은 교회, 생명이 살아 숨 쉬는 교회인 이곳에서
                        여러분과 함께 하나님 나라를 세워가기를 소원합니다.<br />
                        행복한교회에서 참된 안식과 기쁨을 누리시기를 기도합니다.
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 text-right">
                    <p className="text-sm text-gray-400 mb-1">행복한교회 섬기는 이</p>
                    <strong className="text-xl sm:text-2xl font-bold gradient-text">담임목사 윤영철</strong>
                </div>
            </div>
        </div>
    );
}
