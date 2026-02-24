'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';

export default function ChangePasswordPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!user || user.role !== 'ADMIN') {
        if (typeof window !== 'undefined') router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        if (newPassword.length < 4) {
            alert('새 비밀번호는 4자 이상이어야 합니다.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            alert('비밀번호가 변경되었습니다.');
            router.push('/');
        } catch (error: any) {
            const msg = error.response?.data?.detail || '비밀번호 변경에 실패했습니다.';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
            <div className="glass-card rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100/80 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">비밀번호 변경</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            현재 비밀번호
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                                placeholder="현재 비밀번호를 입력하세요"
                                required
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            새 비밀번호
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all"
                                placeholder="새 비밀번호 (4자 이상)"
                                required
                            />
                            <button type="button" onClick={() => setShowNew(!showNew)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            새 비밀번호 확인
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all ${confirmPassword && confirmPassword !== newPassword ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                    }`}
                                placeholder="새 비밀번호를 다시 입력하세요"
                                required
                            />
                        </div>
                        {confirmPassword && confirmPassword !== newPassword && (
                            <p className="text-xs text-red-500 mt-1.5">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 btn-primary !py-3 !rounded-xl !text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
