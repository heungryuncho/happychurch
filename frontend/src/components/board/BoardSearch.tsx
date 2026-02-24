import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

interface BoardSearchProps {
    onSearch: (params: { keyword: string; startDate: string; endDate: string }) => void;
}

export default function BoardSearch({ onSearch }: BoardSearchProps) {
    const currentYear = new Date().getFullYear();
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState(`${currentYear}-12-31`);

    const handleSearch = () => {
        onSearch({ keyword, startDate, endDate });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="glass-card rounded-2xl p-4 mb-6">
            {/* Row 1: Keyword + Search Button */}
            <div className="flex gap-3 mb-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="제목으로 검색"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all bg-white/70"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl inline-flex items-center whitespace-nowrap flex-shrink-0"
                >
                    <Search className="w-4 h-4 mr-1.5" />
                    검색
                </button>
            </div>

            {/* Row 2: Date Range */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all bg-white/70"
                    />
                </div>
                <span className="text-gray-400 text-sm font-medium flex-shrink-0">~</span>
                <div className="relative flex-1 min-w-0">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all bg-white/70"
                    />
                </div>
            </div>
        </div>
    );
}
