import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signInWithEmail, signUpWithEmail } from '../lib/supabase';

export default function AuthPage() {
  const { t } = useTranslation();
  const { mode } = useParams();
  const navigate = useNavigate();
  const isSignUp = mode === 'signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = useMemo(
    () => ({
      title: isSignUp ? t('auth.signup') : t('auth.signin'),
      action: isSignUp ? t('auth.signup') : t('auth.signin'),
    }),
    [isSignUp, t]
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const res = await signUpWithEmail(email, password);
        if (res?.error) setError(String(res.error));
        else navigate('/dashboard');
      } else {
        const res = await signInWithEmail(email, password);
        if (res?.error) setError(String(res.error));
        else navigate('/dashboard');
      }
    } catch (err: any) {
      setError(String(err ?? 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-[36px] border border-white/10 bg-surface/90 p-8 shadow-xl backdrop-blur-xl">
      <div className="grid gap-10 lg:grid-cols-[0.6fr_0.4fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{t('brand')}</p>
          <h2 className="text-4xl font-semibold text-white">{meta.title}</h2>
          <p className="text-white/70">{isSignUp ? t('auth.createAccountCopy') : t('auth.signinCopy')}</p>
          <div className="space-y-4 rounded-[28px] border border-white/10 bg-[#0f1320]/90 p-6">
            <button className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-white/80 transition hover:bg-white/10">{t('auth.continueGoogle')}</button>
            <button className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-white/80 transition hover:bg-white/10">{t('auth.continueApple')}</button>
            <button className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm text-white/80 transition hover:bg-white/10">{t('auth.continueMicrosoft')}</button>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#0b0f18]/90 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">{meta.action}</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm text-white/70">
              {t('auth.email')}
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-[#11151f]/90 px-4 py-3 text-white outline-none" type="email" placeholder="hello@jwe.com" />
            </label>
            <label className="block text-sm text-white/70">
              {t('auth.password')}
              <input value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-3xl border border-white/10 bg-[#11151f]/90 px-4 py-3 text-white outline-none" type="password" placeholder="••••••••" />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-3xl bg-accent px-5 py-4 text-sm font-semibold text-white transition hover:bg-violet-400">
              {loading ? 'Please wait…' : meta.action}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between text-sm text-white/50">
            <button type="button" className="text-white/60 hover:text-white">{t('auth.forgot')}</button>
            <button type="button" onClick={() => navigate(isSignUp ? '/auth/signin' : '/auth/signup')} className="text-accent hover:text-white">
              {isSignUp ? t('auth.signin') : t('auth.signup')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
