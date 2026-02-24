import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative mt-auto border-t border-gray-100/50 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'var(--gradient-primary)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 sm:gap-8">
                    {/* Logo & Description */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-2"
                                style={{ background: 'var(--gradient-primary)' }}>
                                H
                            </div>
                            <span className="text-lg font-bold gradient-text">행복한교회</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            하나님의 사랑을 실천하는 건강한 공동체,<br />
                            행복한교회에서 참된 기쁨을 만나세요.
                        </p>
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-right space-y-2">
                        <p className="text-sm text-gray-500">
                            📍 인천광역시 남동구 소래역남로 10, 5층 501-1호
                        </p>
                        <p className="text-sm text-gray-500">
                            📞 032-213-9191
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-100/80 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
                    <p>&copy; {new Date().getFullYear()} 행복한교회. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-[var(--accent)] fill-[var(--accent)]" /> by 행복한교회
                    </p>
                </div>
            </div>
        </footer>
    );
}
