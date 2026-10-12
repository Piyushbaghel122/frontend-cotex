import { useState } from 'react';
import api from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';
import { Mail, Lock, User as UserIcon, Loader2, Sparkles, ArrowRight } from 'lucide-react';

function Home() {
    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            if (isRegister) {
                if (!name.trim()) {
                    setErrorMsg('Please enter your full name');
                    setLoading(false);
                    return;
                }
                const { data } = await api.post('/api/auth/register', {
                    name: name.trim(),
                    email: email.trim(),
                    password
                });
                dispatch(setUserdata(data));
            } else {
                const { data } = await api.post('/api/auth/login', {
                    email: email.trim(),
                    password
                });
                dispatch(setUserdata(data));
            }
        } catch (err) {
            console.error('Auth error:', err);
            const message = err.response?.data?.message || err.message || 'Authentication failed';
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen flex bg-[#0d0f14] text-white overflow-hidden'>
            <SideBar />
            <ChatArea />
            <Artifact />

            {!userData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4'>
                    <div className='w-full max-w-[400px] bg-[#13151c] border border-white/[0.09] rounded-2xl p-7 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200'>
                        {/* Header */}
                        <div className='flex flex-col items-center text-center gap-1.5'>
                            <div className='w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1 shadow-lg shadow-indigo-500/10'>
                                <Sparkles size={22} />
                            </div>
                            <h2 className='text-xl font-bold text-slate-100 tracking-tight'>
                                {isRegister ? 'Create an Account' : 'Welcome to CortexAI'}
                            </h2>
                            <p className='text-xs text-slate-400 max-w-[280px]'>
                                {isRegister
                                    ? 'Get started with intelligent AI chat and code agents'
                                    : 'Sign in to access your chat history and credits'}
                            </p>
                        </div>

                        {/* Mode Switcher Tabs */}
                        <div className='grid grid-cols-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]'>
                            <button
                                type='button'
                                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    !isRegister
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                type='button'
                                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    isRegister
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                Register
                            </button>
                        </div>

                        {/* Error Alert */}
                        {errorMsg && (
                            <div className='p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium'>
                                {errorMsg}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3.5'>
                            {isRegister && (
                                <div className='flex flex-col gap-1'>
                                    <label className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider'>
                                        Full Name
                                    </label>
                                    <div className='relative flex items-center'>
                                        <UserIcon size={15} className='absolute left-3 text-slate-400 pointer-events-none' />
                                        <input
                                            type='text'
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder='e.g. Piyush Kumar'
                                            className='w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
                                        />
                                    </div>
                                </div>
                            )}

                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider'>
                                    Email Address
                                </label>
                                <div className='relative flex items-center'>
                                    <Mail size={15} className='absolute left-3 text-slate-400 pointer-events-none' />
                                    <input
                                        type='email'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='name@example.com'
                                        className='w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider'>
                                    Password
                                </label>
                                <div className='relative flex items-center'>
                                    <Lock size={15} className='absolute left-3 text-slate-400 pointer-events-none' />
                                    <input
                                        type='password'
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='••••••••'
                                        className='w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors'
                                    />
                                </div>
                            </div>

                            <button
                                type='submit'
                                disabled={loading}
                                className='mt-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={15} className='animate-spin' />
                                        <span>Please wait...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer toggle note */}
                        <div className='text-center'>
                            <button
                                type='button'
                                onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
                                className='text-xs text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer bg-transparent border-none'
                            >
                                {isRegister
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Register now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
