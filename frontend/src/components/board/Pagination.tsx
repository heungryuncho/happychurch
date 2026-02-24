import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages: rawTotalPages, onPageChange }: PaginationProps) {
    const totalPages = Math.max(1, rawTotalPages);

    return (
        <div className="flex justify-center items-center space-x-1.5 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl glass text-gray-500 hover:text-[var(--primary)] hover:border-[var(--primary)]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all duration-300 ${currentPage === page
                        ? "text-white shadow-lg"
                        : "glass text-gray-600 hover:text-[var(--primary)] hover:border-[var(--primary)]/20"
                        }`}
                    style={currentPage === page ? { background: 'var(--gradient-primary)' } : {}}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl glass text-gray-500 hover:text-[var(--primary)] hover:border-[var(--primary)]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
