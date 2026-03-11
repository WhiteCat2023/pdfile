
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { ParticleBackground } from '../components/ParticleBackground';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual login logic here
    console.log('Logging in with:', { email, password });
    navigate('/'); // Redirect to home after login
  };

  return (

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative h-[100dvh]"
      >
        <ParticleBackground/>
        <div className="flex justify-center">
          <div className="w-full h-[500px]  max-w-md pt-16 p-8 space-y-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-zinc-200">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-zinc-900">Welcome Back!</h1>
              <p className="mt-2 text-sm text-zinc-600">
                Sign in to continue to your PDFile account.
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
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
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-zinc-400 top-3.5 left-4" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 text-sm text-zinc-900 bg-white/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="w-4 h-4 text-zinc-900 bg-zinc-100 border-zinc-300 rounded focus:ring-zinc-500" />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-zinc-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-zinc-900 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
            <p className="text-sm text-center text-zinc-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-zinc-900 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

  );
}
