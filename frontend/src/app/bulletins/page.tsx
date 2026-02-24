'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import BoardTable, { Column } from '@/components/board/BoardTable';
import Pagination from '@/components/board/Pagination';
import BoardSearch from '@/components/board/BoardSearch';

interface Bulletin {
    id: number;
    title: string;
    views: number;
    created_at: string;
}

export default function BulletinListPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [bulletins, setBulletins] = useState<Bulletin[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const currentYear = new Date().getFullYear();
    const [searchParams, setSearchParams] = useState({ keyword: '', startDate: `${currentYear}-01-01`, endDate: `${currentYear}-12-31` });
    const itemsPerPage = 10;

    const fetchBulletins = useCallback(async () => {
        try {
            setLoading(true);
            const params: any = { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage };
            if (searchParams.keyword) params.keyword = searchParams.keyword;
            if (searchParams.startDate) params.start_date = searchParams.startDate;
            if (searchParams.endDate) params.end_date = searchParams.endDate;

            const response = await api.get('/bulletins', { params });
            setBulletins(response.data.items);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Failed to fetch bulletins:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchParams]);

    useEffect(() => {
        fetchBulletins();
    }, [fetchBulletins]);

    const handleSearch = (params: { keyword: string; startDate: string; endDate: string }) => {
        setSearchParams(params);
        setCurrentPage(1);
    };

    const columns: Column<Bulletin>[] = [
        { key: 'id', label: '번호', width: 'w-20' },
        { key: 'title', label: '제목' },
        { key: 'created_at', label: '등록일', width: 'w-32' },
    ];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">
                        <span className="gradient-text">교회 주보</span>
                    </h1>
                </div>

                {user?.role === 'ADMIN' && (
                    <button
                        onClick={() => router.push('/bulletins/write')}
                        className="btn-primary inline-flex items-center !py-2.5 !px-5 !text-sm !rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        주보 등록
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
                    <BoardTable
                        data={bulletins}
                        columns={columns}
                        basePath="/bulletins"
                        onRowClick={(item) => router.push(`/bulletins/${item.id}`)}
                    />
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
