'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Edit, Trash2, ArrowLeft, Eye, Calendar } from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    content: string;
    views: number;
    created_at: string;
}

export default function NoticeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await api.get(`/notices/${params.id}`);
                setNotice(response.data);
            } catch (error) {
                console.error('Failed to fetch notice:', error);
                alert('게시글을 불러올 수 없습니다.');
                router.push('/notices');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchNotice();
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/notices/${params.id}`);
            router.push('/notices');
        } catch (error) {
            console.error('Failed to delete notice:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div></div>;
    }
    if (!notice) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
            <button
                onClick={() => router.push('/notices')}
                className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-[var(--primary)] mb-6 transition-colors duration-300"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
            </button>

            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h1>
                    <div className="flex items-center text-sm text-gray-400 space-x-5">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" />{format(new Date(notice.created_at), 'yyyy-MM-dd HH:mm')}</span>
                        <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1.5" />{notice.views}</span>
                    </div>
                </div>

                <div className="px-8 py-10 min-h-[300px]">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                </div>

                {user?.role === 'ADMIN' && (
                    <div className="px-8 py-4 border-t border-gray-100/80 bg-gray-50/50 flex justify-end space-x-3">
                        <button onClick={() => router.push(`/notices/${notice.id}/edit`)}
                            className="btn-outline !py-2 !px-4 !text-xs !rounded-lg inline-flex items-center">
                            <Edit className="w-3.5 h-3.5 mr-1.5" /> 수정
                        </button>
                        <button onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-all duration-300">
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> 삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
