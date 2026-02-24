import React, { FormEvent } from 'react';

interface BoardFormProps {
    title: string;
    isEdit?: boolean;
    onSubmit: (e: FormEvent) => void;
    onCancel: () => void;
    children: React.ReactNode;
    isSubmitting?: boolean;
}

export default function BoardForm({
    title,
    isEdit = false,
    onSubmit,
    onCancel,
    children,
    isSubmitting = false
}: BoardFormProps) {

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in-up">
            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100/80 bg-gradient-to-r from-[var(--primary)]/5 to-transparent flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        <span className="gradient-text">{title}</span> {isEdit ? '수정' : '작성'}
                    </h2>
                </div>

                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    {children}

                    <div className="pt-6 border-t border-gray-100/80 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-outline !py-2.5 !px-6 !text-sm !rounded-xl"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary !py-2.5 !px-6 !text-sm !rounded-xl disabled:opacity-50 inline-flex items-center"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            ) : null}
                            {isSubmitting ? '처리 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
