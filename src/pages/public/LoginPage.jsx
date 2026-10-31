import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiErrorMessage } from '../../services/api.js';

function destination(user) {
  return user.role === 'administrator' ? '/admin/overview' : user.role === 'driver' ? '/driver/overview' : '/citizen/dashboard';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', ward: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const signIn = async (credentials) => {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const user = mode === 'login' ? await login(credentials) : await register(credentials);
      navigate(destination(user), { replace: true });
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };
  const submit = (event) => {
    event.preventDefault();
    return signIn({ email: form.email, password: form.password, ...form });
  };
  const loginDemo = (email) => {
    setForm((current) => ({ ...current, email, password: 'DemoPass123!' }));
    return signIn({ email, password: 'DemoPass123!' });
  };
  return (
    <div className="min-h-[calc(100vh-13rem)] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#273b33] bg-[#1D2B25] p-7 shadow-2xl">
        <div className="mb-6">
          <div className="inline-flex rounded-xl bg-[#16A36A]/15 p-3 text-[#8BE0B0]"><LockKeyhole size={22} /></div>
          <h1 className="mt-4 text-2xl font-black font-heading">{mode === 'login' ? 'Sign in securely' : 'Create citizen account'}</h1>
          <p className="mt-1 text-sm text-[#A5B3AA]">Demo accounts use the local API. Reports and collection updates are shared with the administrator and assigned driver.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && <>
            <label className="block text-xs font-bold text-[#A5B3AA]">Full name<input required name="name" value={form.name} onChange={update} className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
            <label className="block text-xs font-bold text-[#A5B3AA]">Mobile number (optional)<input name="phoneNumber" value={form.phoneNumber} onChange={update} placeholder="9876543210" className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
            <label className="block text-xs font-bold text-[#A5B3AA]">Ward (optional)<input name="ward" value={form.ward} onChange={update} className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
          </>}
          <label className="block text-xs font-bold text-[#A5B3AA]">Email<input required type="email" name="email" value={form.email} onChange={update} className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
          <label className="block text-xs font-bold text-[#A5B3AA]">Password<input required type="password" name="password" value={form.password} onChange={update} minLength={mode === 'register' ? 10 : 1} className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
          {mode === 'register' && <p className="text-[11px] text-[#A5B3AA]">Use 10+ characters including upper-case, lower-case, and a number.</p>}
          {error && <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A36A] px-4 py-3 text-sm font-bold text-white hover:bg-[#0f7a4e] disabled:opacity-60">{mode === 'login' ? <LockKeyhole size={16} /> : <UserPlus size={16} />}{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register as citizen'}<ArrowRight size={16} /></button>
        </form>
        {mode === 'login' && <div className="mt-5 border-t border-[#273b33] pt-4">
          <p className="mb-2 text-xs text-[#A5B3AA]">Click a demo account to sign in (password: DemoPass123!):</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => loginDemo('citizen@fixmyarea.local')} className="rounded-lg border border-[#273b33] bg-[#142820] px-2.5 py-1.5 text-xs font-bold text-[#8BE0B0] disabled:opacity-50">{busy && form.email === 'citizen@fixmyarea.local' ? 'Signing in…' : 'Citizen'}</button>
            <button type="button" disabled={busy} onClick={() => loginDemo('admin@fixmyarea.local')} className="rounded-lg border border-[#273b33] bg-[#142820] px-2.5 py-1.5 text-xs font-bold text-[#8BE0B0] disabled:opacity-50">{busy && form.email === 'admin@fixmyarea.local' ? 'Signing in…' : 'Administrator'}</button>
            <button type="button" disabled={busy} onClick={() => loginDemo('driver@fixmyarea.local')} className="rounded-lg border border-[#273b33] bg-[#142820] px-2.5 py-1.5 text-xs font-bold text-[#8BE0B0] disabled:opacity-50">{busy && form.email === 'driver@fixmyarea.local' ? 'Signing in…' : 'Driver'}</button>
          </div>
        </div>}
        <button onClick={() => { setMode((current) => current === 'login' ? 'register' : 'login'); setError(''); }} className="mt-5 w-full text-center text-sm font-bold text-[#8BE0B0] hover:text-white">{mode === 'login' ? 'Need a citizen account? Register' : 'Already have an account? Sign in'}</button>
      </div>
    </div>
  );
}
