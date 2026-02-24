'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiForm } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { setAuth } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await apiForm.post('/auth/login', formData);
            const token = response.data.access_token;

            const userRes = await apiForm.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAuth(token, userRes.data);
            router.push('/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || '이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl mb-6"
                    style={{ background: 'var(--gradient-hero)' }}>
                    <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">관리자 로그인</h2>
                <p className="mt-3 text-sm text-gray-500">
                    교회 소식 등록과 게시물 관리를 위한 전용 페이지
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-card rounded-3xl p-8 sm:p-10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm transition-all duration-300 bg-white/70"
                                    placeholder="admin@happychurch.org"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">비밀번호</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-sm transition-all duration-300 bg-white/70"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center font-medium bg-red-50 rounded-xl py-3 border border-red-100 animate-fade-in">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3.5 !rounded-xl flex items-center justify-center text-sm disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    로그인
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
