'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import ThumbnailCard from '@/components/board/ThumbnailCard';
import Pagination from '@/components/board/Pagination';
import BoardSearch from '@/components/board/BoardSearch';

interface Gallery {
    id: number;
    title: string;
    image_url: string | null;
    views: number;
    created_at: string;
}

export default function GalleryListPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const currentYear = new Date().getFullYear();
    const [searchParams, setSearchParams] = useState({ keyword: '', startDate: `${currentYear}-01-01`, endDate: `${currentYear}-12-31` });
    const itemsPerPage = 12;

    const fetchGalleries = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage };
            if (searchParams.keyword) params.keyword = searchParams.keyword;
            if (searchParams.startDate) params.start_date = searchParams.startDate;
            if (searchParams.endDate) params.end_date = searchParams.endDate;

            const response = await api.get('/galleries', { params });
            setGalleries(response.data.items);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Failed to fetch galleries:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchParams]);

    useEffect(() => {
        fetchGalleries();
    }, [fetchGalleries]);

    const handleSearch = (params: { keyword: string; startDate: string; endDate: string }) => {
        setSearchParams(params);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">
                        <span className="gradient-text">앨범</span>
                    </h1>
                </div>

                {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => router.push('/galleries/write')}
                        className="btn-primary inline-flex items-center !py-2.5 !px-5 !text-sm !rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        사진 등록
                    </button>
                )}
            </div>

            <BoardSearch onSearch={handleSearch} />

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : (
                <>
                    {galleries.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-3xl">
                            <p className="text-4xl mb-3">📷</p>
                            <p className="text-gray-400 font-medium">등록된 사진이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {galleries.map((item) => (
                                <ThumbnailCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    imageUrl={item.image_url}
                                    date={item.created_at}
                                    onClick={() => router.push(`/galleries/${item.id}`)}
                                />
                            ))}
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / itemsPerPage)}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
