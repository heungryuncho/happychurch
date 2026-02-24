import { ChevronRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-8 px-4">
      {/* Hero Section - Warm gradient */}
      <div className="w-full -mx-4 -mt-8">
        <div className="relative overflow-hidden py-16 sm:py-24 px-4" style={{ background: 'linear-gradient(180deg, #fef3d0 0%, #fdeeb7 30%, #f8e8a8 60%, #fffcf7 100%)' }}>
          {/* 장식 원형 */}
          <div className="absolute top-10 right-[10%] w-40 h-40 rounded-full bg-amber-200/20 blur-2xl" />
          <div className="absolute bottom-0 left-[5%] w-56 h-56 rounded-full bg-yellow-100/30 blur-3xl" />

          <div className="relative animate-fade-in-up space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-white/60 backdrop-blur-sm border border-amber-200/50 text-amber-700 mb-4">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              하나님의 사랑을 실천하는 공동체
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight">
              <span className="gradient-text-hero">행복한교회</span>에<br />
              <span className="text-gray-800">오신 것을 환영합니다</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-amber-800/60 max-w-2xl mx-auto leading-relaxed font-light">
              말씀과 기도로 기쁨이 넘치는 공동체, 행복한교회와 함께<br className="hidden sm:block" />
              당신의 삶에 새로운 평안과 사랑이 가득하기를 소망합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2026 표어 - 보라색 글래스모피즘 카드 */}
      <div className="w-full max-w-3xl animate-fade-in-up delay-100 -mt-16 sm:-mt-20 relative z-10">
        <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 30%, #7c3aed 60%, #5b21b6 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-4 left-4 w-3 h-3 bg-amber-400/40 rounded-full" />
          <div className="absolute bottom-8 right-12 w-2.5 h-2.5 bg-cyan-400/30 rounded-full" />

          <div className="relative px-6 sm:px-10 py-8 sm:py-12">
            <div className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-[0.2em] mb-4">
              2026년 표어
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              예수님은 나의 소망
            </h2>
            <div className="space-y-2 sm:space-y-3 mb-6">
              <p className="text-base sm:text-lg md:text-xl text-purple-100 font-medium">소망 중에 즐거워 하며</p>
              <p className="text-base sm:text-lg md:text-xl text-purple-100 font-medium">환난 중에 참으며</p>
              <p className="text-base sm:text-lg md:text-xl text-purple-100 font-medium">기도에 항상 힘쓰라</p>
            </div>
            <p className="text-sm sm:text-base text-purple-200/80 font-medium">(로마서 12:12)</p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-center flex-wrap gap-4 animate-fade-in-up delay-200">
        <a href="/greetings" className="btn-primary inline-flex items-center group">
          교회 소개
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </a>
        <a href="/notices" className="btn-outline inline-flex items-center">
          새소식 보기
        </a>
      </div>

      {/* 핵심가치 */}
      <div className="w-full max-w-5xl animate-fade-in-up delay-300">
        <div className="mb-8">
          <p className="text-sm text-amber-600 font-semibold mb-2">
            주께서 구원 받는 사람을 날마다 더하게 하시니라 (행 2:47)
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-800">
            우리가 함께 세워가는 <span className="gradient-text">행복한 교회</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
          {[
            {
              title: '함께 섬기는 교회',
              icon: '🤝',
              bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
              border: 'border-l-green-500',
              items: ['한 사람, 한 섬김', '은사대로, 기쁘게', '구경말고, 동역으로', '함께 할 때, 교회다'],
            },
            {
              title: '다음세대를 함께 품는 교회',
              icon: '🌱',
              bg: 'bg-gradient-to-br from-sky-50 to-blue-50',
              border: 'border-l-sky-500',
              items: ['아이들은 교회의 희망', '부모와 함께 자라는 신앙', '가정이 신앙의 첫 자리', '오늘의 돌봄이 내일의 믿음'],
            },
            {
              title: '복음이 흘러가는 교회',
              icon: '💧',
              bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
              border: 'border-l-violet-500',
              items: ['삶으로 먼저 보여주기', '기도하며 사람을 품자', '처음 온 분을 가족으로', '교회 밖으로 사랑을 나누자'],
            },
            {
              title: '함께라서 괜찮은 교회',
              icon: '💛',
              bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
              border: 'border-l-amber-500',
              items: ['작은 모임이 큰 믿음된다', '말할 수 있고 들어주는 자리', '서로 돌보며 함께 자라가는 신앙', '변화 앞에서도 함께 가자'],
            },
          ].map((card, i) => (
            <div key={i} className={`p-5 sm:p-7 rounded-2xl ${card.bg} border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-l-4 ${card.border}`}>
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{card.icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">{card.title}</h3>
              </div>
              <ul className="space-y-2">
                {card.items.map((item, j) => (
                  <li key={j} className="flex items-start text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 mr-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100/60 shadow-sm">
          <p className="text-base sm:text-lg font-bold text-gray-800">
            30에 머물지 말고 60의 벽을 넘어 100배의 결실로 가자
          </p>
          <p className="text-sm text-amber-600/60 mt-1">(마태복음 13:8)</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 w-full text-left animate-fade-in-up delay-300">
        {[
          {
            icon: '🕊️',
            title: '말씀 중심',
            desc: '성경 중심의 바른 신학과 신앙으로 세상을 이기는 믿음을 키워갑니다.',
            bg: 'from-green-50/80 to-emerald-50/60',
          },
          {
            icon: '🙏',
            title: '기도 예배',
            desc: '뜨거운 기도와 생명력 넘치는 예배를 통해 하나님의 임재를 경험합니다.',
            bg: 'from-sky-50/80 to-blue-50/60',
          },
          {
            icon: '🤝',
            title: '사랑 나눔',
            desc: '이웃을 섬기고 사랑을 실천하며 그리스도의 향기를 세상에 더합니다.',
            bg: 'from-amber-50/80 to-yellow-50/60',
          },
        ].map((card, i) => (
          <div key={i} className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${card.bg} border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 text-xl sm:text-2xl bg-white/70 shadow-sm">
              {card.icon}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">{card.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
