
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { ParticleBackground } from '../components/ParticleBackground';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual password reset logic here
    console.log('Requesting password reset for:', email);
    // You might want to show a confirmation message here
    navigate('/login'); // Redirect to login after request
  };

  return (
    <div className="relative h-[100dvh]">
      <ParticleBackground />
      <div className="absolute inset-0 flex justify-center">
        <div className="w-full h-[500px] max-w-md pt-16 p-8 space-y-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-zinc-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900">Forgot Your Password?</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Enter your email and we'll send you a reset link.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleResetRequest}>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-zinc-400 top-3.5 left-4" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 text-sm text-zinc-900 bg-white/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-sm font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>
          <p className="text-sm text-center text-zinc-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-zinc-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
