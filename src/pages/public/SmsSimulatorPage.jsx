import React, { useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';
import api, { apiErrorMessage } from '../../services/api.js';

export default function SmsSimulatorPage() {
  const [phone, setPhone] = useState('9876543210');
  const [message, setMessage] = useState('REPORT Sector 15, Chandigarh');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const send = async (event) => {
    event.preventDefault();
    setResult(null);
    setError('');
    setSending(true);
    try {
      const idempotencyKey = crypto.randomUUID().replaceAll('-', '');
      const response = await api.post('/sms/incoming', { phone_number: phone, message, idempotency_key: idempotencyKey }, { headers: { 'X-SMS-Source': 'simulator', 'Idempotency-Key': idempotencyKey } });
      setResult(response.data);
    } catch (requestError) {
      setError(apiErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-[#273b33] bg-[#1D2B25] p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3"><div className="rounded-2xl bg-[#16A36A]/15 p-3 text-[#8BE0B0]"><MessageSquareText size={24} /></div><div><h1 className="text-2xl font-black font-heading">SMS reporting simulator</h1><p className="text-sm text-[#A5B3AA]">This posts an incoming SMS to the real backend. It does not send a telecom SMS.</p></div></div>
        <form onSubmit={send} className="mt-7 space-y-4">
          <label className="block text-xs font-bold text-[#A5B3AA]">Sender mobile number<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="numeric" required className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
          <label className="block text-xs font-bold text-[#A5B3AA]">SMS message<textarea value={message} onChange={(event) => setMessage(event.target.value)} required rows={4} className="mt-1.5 w-full rounded-xl border border-[#273b33] bg-[#142820] px-3 py-2.5 text-sm text-white" /></label>
          <p className="text-xs text-[#A5B3AA]">Supported format: <strong className="text-[#F5F7F5]">REPORT [LOCATION]</strong></p>
          <button disabled={sending} className="flex items-center gap-2 rounded-xl bg-[#16A36A] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f7a4e] disabled:opacity-60"><Send size={16} />{sending ? 'Processing…' : 'Send simulated SMS'}</button>
        </form>
        {error && <div role="alert" className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
        {result && <div className="mt-5 rounded-xl border border-[#16A36A]/40 bg-[#16A36A]/10 p-4 text-sm text-[#d6f8e5]"><strong>{result.message}</strong><div className="mt-2 grid gap-1 text-xs"><span>Report ID: {result.reportId}</span><span>Location: {result.location}</span><span>Status: {result.status}</span><span>Source: simulated incoming SMS</span></div></div>}
      </div>
    </div>
  );
}
