'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { api, getBaseUrl } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Edit, Trash2, ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryDetail {
    id: number;
    title: string;
    content: string;
    image_urls: string[];
    views: number;
    created_at: string;
}

export default function GalleryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();

    const [gallery, setGallery] = useState<GalleryDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get(`/galleries/${params.id}`);
                setGallery(response.data);
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
                alert('앨범을 불러올 수 없습니다.');
                router.push('/galleries');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchGallery();
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/galleries/${params.id}`);
            router.push('/galleries');
        } catch (error) {
            console.error('Failed to delete gallery:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div></div>;
    }
    if (!gallery) return null;

    const imageUrls = gallery.image_urls.map(url =>
        url.startsWith('http') ? url : `${getBaseUrl()}${url}`
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
            <button onClick={() => router.push('/galleries')}
                className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-[var(--primary)] mb-6 transition-colors duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" /> 목록으로
            </button>

            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{gallery.title}</h1>
                    <div className="flex items-center text-sm text-gray-400 space-x-5">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5" />{format(new Date(gallery.created_at), 'yyyy-MM-dd')}</span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Image Viewer */}
                    {imageUrls.length > 0 && (
                        <div className="space-y-4 mb-8">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                <img
                                    src={imageUrls[currentImage]}
                                    alt={`사진 ${currentImage + 1}`}
                                    className="w-full object-contain max-h-[800px] mx-auto"
                                />
                                {imageUrls.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImage(prev => Math.max(0, prev - 1))}
                                            disabled={currentImage === 0}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImage(prev => Math.min(imageUrls.length - 1, prev + 1))}
                                            disabled={currentImage === imageUrls.length - 1}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 hover:bg-white disabled:opacity-30 transition-all"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                            {currentImage + 1} / {imageUrls.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail strip */}
                            {imageUrls.length > 1 && (
                                <div className="flex gap-2 justify-center">
                                    {imageUrls.map((url, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentImage(i)}
                                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImage === i ? 'border-[var(--primary)] shadow-md scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={url} alt={`썸네일 ${i + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {gallery.content && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{gallery.content}</p>
                    )}
                </div>

                {user?.role === 'ADMIN' && (
                    <div className="px-8 py-4 border-t border-gray-100/80 bg-gray-50/50 flex justify-end space-x-3">
                        <button onClick={() => router.push(`/galleries/${gallery.id}/edit`)}
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
