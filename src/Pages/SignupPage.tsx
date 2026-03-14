
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase'; // Import db from firebase
import { setDoc, doc } from 'firebase/firestore'; // Import setDoc and doc
import { ParticleBackground } from '../components/ParticleBackground';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      // Create a document in Firestore for the new user
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });
      navigate('/'); // Redirect to home after signup
    } catch (error) {
      setError('Failed to create an account');
      console.error(error);
    }
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className='relative h-[100dvh]'
      >
        <ParticleBackground/>
        <div className="flex justify-center">
          <div className="w-full h-[500px] max-w-md p-8 space-y-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-zinc-200">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-zinc-900">Create an Account</h1>
              <p className="mt-2 text-sm text-zinc-600">
                Get started with your free PDFile account.
              </p>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <form className="space-y-6" onSubmit={handleSignup}>
              <div className="relative">
                <User className="absolute w-5 h-5 text-zinc-400 top-3.5 left-4" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 text-sm text-zinc-900 bg-white/50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                />
              </div>
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
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>
            <p className="text-sm text-center text-zinc-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-zinc-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
  );
}
