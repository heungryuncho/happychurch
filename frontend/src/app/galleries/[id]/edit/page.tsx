'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, apiForm, getBaseUrl } from '@/lib/api';
import BoardForm from '@/components/board/BoardForm';
import { useAuthStore } from '@/store/useAuthStore';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function GalleryEditPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/galleries');
            return;
        }

        const fetchGallery = async () => {
            try {
                const response = await api.get(`/galleries/${params.id}`);
                setTitle(response.data.title);
                setContent(response.data.content || '');
                setExistingUrls(response.data.image_urls || []);
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
                alert('앨범 정보를 불러올 수 없습니다.');
                router.push('/galleries');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchGallery();
        }
    }, [params.id, router, user]);

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);

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

            await apiForm.put(`/galleries/${params.id}`, formData);
            router.push(`/galleries/${params.id}`);
        } catch (error) {
            console.error('Failed to update gallery:', error);
            alert('앨범 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <BoardForm
            title="앨범 수정"
            isEdit={true}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
        >
            <div className="space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        사진 첨부
                    </label>

                    {existingUrls.length > 0 && files.length === 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <p className="text-sm text-blue-700 font-medium mb-2">
                                기존 사진 {existingUrls.length}장이 있습니다. 새 사진을 선택하면 교체됩니다.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {existingUrls.map((url, i) => {
                                    const fullUrl = url.startsWith('http') ? url : `${getBaseUrl()}${url}`;
                                    return (
                                        <img key={i} src={fullUrl} alt={`기존 사진 ${i + 1}`}
                                            className="w-16 h-16 object-cover rounded-lg border border-blue-200" />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {files.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {files.map((file, i) => (
                                <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    {previews[i] ? (
                                        <img src={previews[i]} alt={file.name} className="w-full aspect-square object-cover" />
                                    ) : (
                                        <div className="w-full aspect-square flex flex-col items-center justify-center text-gray-400">
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
                        {files.length > 0 ? '사진 추가' : '새 사진 선택'}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFilesChange}
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        내용 및 설명 (선택)
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="content"
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 px-4 border"
                        />
                    </div>
                </div>
            </div>
        </BoardForm>
    );
}
