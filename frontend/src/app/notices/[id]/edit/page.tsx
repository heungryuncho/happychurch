'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import BoardForm from '@/components/board/BoardForm';
import { useAuthStore } from '@/store/useAuthStore';

export default function NoticeEditPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/notices');
            return;
        }

        const fetchNotice = async () => {
            try {
                const response = await api.get(`/notices/${params.id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (error) {
                console.error('Failed to fetch notice:', error);
                alert('게시글 정보를 불러올 수 없습니다.');
                router.push('/notices');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchNotice();
        }
    }, [params.id, router, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/notices/${params.id}`, { title, content });
            router.push(`/notices/${params.id}`);
        } catch (error) {
            console.error('Failed to update notice:', error);
            alert('공지사항 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <BoardForm
            title="공지사항"
            isEdit={true}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
        >
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    제목
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    내용
                </label>
                <div className="mt-1">
                    <textarea
                        id="content"
                        rows={15}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                        required
                    />
                </div>
            </div>
        </BoardForm>
    );
}
