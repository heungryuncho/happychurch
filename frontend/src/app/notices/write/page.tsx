'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import BoardForm from '@/components/board/BoardForm';
import { useAuthStore } from '@/store/useAuthStore';

export default function NoticeWritePage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If not admin, shouldn't be here (simple client check)
    if (user?.role !== 'ADMIN') {
        if (typeof window !== 'undefined') {
            router.push('/notices');
        }
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/notices/', { title, content });
            router.push('/notices');
        } catch (error) {
            console.error('Failed to create notice:', error);
            alert('공지사항 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BoardForm
            title="공지사항"
            isEdit={false}
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
                        placeholder="공지사항 제목을 입력하세요"
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
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>
            </div>
        </BoardForm>
    );
}
