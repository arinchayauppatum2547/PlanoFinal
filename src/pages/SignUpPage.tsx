import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import imgImage4 from '../imports/RegisterPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import logoPlano from '../imports/plano_dark.png';
import Button from '../app/components/Button';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[852.383px] left-1/2 top-1/2 w-[1208.925px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>

      {/* Logo */}
      <div className="absolute left-[50px] top-[40px] z-10">
        <img src={logoPlano} alt="PLANO" className="h-[50px] w-auto" />
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="backdrop-blur-[20px] bg-[rgba(255,255,255,0.85)] rounded-[24px] p-[40px] shadow-[0px_20px_60px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.6)] w-full max-w-[450px]">
          <h1 className="font-['Manrope:Bold',sans-serif] font-bold text-[32px] text-[#1e5a4d] mb-2 text-center">
            Create Account
          </h1>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#5a7a6f] mb-6 text-center">
            Sign up to get started with PLANO
          </p>

          {error && (
            <div className="bg-[#fee] border border-[#fcc] rounded-[12px] px-4 py-3 mb-4">
              <p className="font-['Inter:Medium',sans-serif] text-[13px] text-[#c00]">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
            </div>

            <div className="mb-4">
              <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
            </div>

            <div className="mb-4">
              <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
            </div>

            <div className="mb-6">
              <label className="block font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#006055] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full bg-white/70 border border-[rgba(0,96,85,0.2)] rounded-[12px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[14px] text-[#006055] focus:outline-none focus:ring-2 focus:ring-[#006055]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006055] text-white px-6 py-3.5 rounded-lg font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] hover:bg-[#005047] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-['Inter:Regular',sans-serif] text-[13px] text-[#5a7a6f]">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/')}
                className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[#006055] hover:text-[#005047] transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
