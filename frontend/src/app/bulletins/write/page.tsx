'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiForm } from '@/lib/api';
import BoardForm from '@/components/board/BoardForm';
import { useAuthStore } from '@/store/useAuthStore';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function BulletinWritePage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (user?.role !== 'ADMIN') {
        if (typeof window !== 'undefined') {
            router.push('/bulletins');
        }
        return null;
    }

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);

        // Generate previews for image files
        newFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews(prev => [...prev, '']);
            }
        });
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            files.forEach(file => {
                formData.append('files', file);
            });

            await apiForm.post('/bulletins/', formData);
            router.push('/bulletins');
        } catch (error) {
            console.error('Failed to create bulletin:', error);
            alert('주보 등록에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BoardForm
            title="주보 등록"
            isEdit={false}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        주보 제목
                    </label>
                    <div className="mt-1">
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                            placeholder="예: 2026년 2월 넷째주 주보"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        주보 파일 첨부 (이미지, PDF 등 — 여러 장 가능)
                    </label>

                    {/* Preview Grid */}
                    {files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {files.map((file, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    {previews[i] ? (
                                        <img src={previews[i]} alt={file.name} className="w-full aspect-[3/4] object-cover" />
                                    ) : (
                                        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon className="w-8 h-8 mb-1" />
                                            <span className="text-xs truncate max-w-[90%] px-2">{file.name}</span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <label className="inline-flex items-center px-4 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-[var(--primary)] cursor-pointer transition-all duration-300">
                        <Upload className="h-4 w-4 mr-2" />
                        파일 선택
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={handleFilesChange}
                        />
                    </label>
                    <p className="text-xs text-gray-400 mt-1.5">이미지 파일은 미리보기가 제공됩니다.</p>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        내용 (선택)
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="content"
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                            placeholder="필요한 경우 텍스트 내용을 입력하세요"
                        />
                    </div>
                </div>
            </div>
        </BoardForm>
    );
}
