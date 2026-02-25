import { format } from 'date-fns';
import { useState } from 'react';
import { getBaseUrl } from '@/lib/api';

interface ThumbnailCardProps {
    id: number;
    displayId?: number;
    title: string;
    imageUrl?: string | null;
    date: string;
    onClick: () => void;
}

export default function ThumbnailCard({ id, displayId, title, imageUrl, date, onClick }: ThumbnailCardProps) {
    const displayImage = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${getBaseUrl()}${imageUrl}`) : null;
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            onClick={onClick}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full group"
        >
            <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                {displayImage ? (
                    <>
                        {/* Skeleton placeholder until loaded */}
                        {!loaded && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                        )}
                        <img
                            src={displayImage}
                            alt={title}
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                            className={`object-cover w-full h-full group-hover:scale-110 transition-all duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                        🖼️
                    </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-5 flex-grow flex flex-col justify-between">
                <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors duration-200">
                    {displayId !== undefined && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 mr-2 align-middle">
                            No.{displayId}
                        </span>
                    )}
                    <span className="align-middle">{title}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-auto">
                    {format(new Date(date), 'yyyy. MM. dd.')}
                </p>
            </div>
        </div>
    );
}
