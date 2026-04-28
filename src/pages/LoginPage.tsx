import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import svgPaths from '../imports/RegisterPage-1/svg-5j2nlrt7gl';
import imgImage4 from '../imports/RegisterPage-1/1e9b89899dee90e5a681bd87e2642344fbd3ee93.png';
import imgImage6 from '../imports/RegisterPage-1/a4fee361045e52e28a46e60d1d237cd7f9cf6f46.png';
import { imgImage5 } from '../imports/RegisterPage-1/svg-69lld';
import logoPlano from '../imports/plano_dark.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const user = username || 'user007';
    await signIn(user, password || 'dummy');
    navigate('/home');
  };

  const handleAppleSignIn = async () => {
    const user = username || 'user007';
    await signIn(user, password || 'dummy');
    navigate('/home');
  };

  const handleOutlookSignIn = async () => {
    const user = username || 'user007';
    await signIn(user, password || 'dummy');
    navigate('/home');
  };

  const handleLoginSubmit = async () => {
    const user = username || 'user007';
    await signIn(user, password || 'dummy');
    navigate('/home');
  };

  return (
    <div className="bg-white relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[852.383px] left-1/2 top-1/2 w-[1208.925px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>

      {/* Decorative Glass Card */}
      <div className="absolute flex h-[627.679px] items-center justify-center left-[111.94px] top-[111.11px] w-[970.125px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "22" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="h-[970.125px] relative w-[627.679px]">
            <div className="absolute inset-[0_-3.96%_-2.56%_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 652.554 995">
                <g filter="url(#filter0_di_1_963)" id="Rectangle 1">
                  <path d={svgPaths.p8f07ec0} fill="white" fillOpacity="0.1" shapeRendering="crispEdges" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="995" id="filter0_di_1_963" width="652.554" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dx="12.4375" dy="12.4375" />
                    <feGaussianBlur stdDeviation="6.21875" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_963" />
                    <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="4.14583" />
                    <feGaussianBlur stdDeviation="6.21875" />
                    <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
                    <feBlend in2="shape" mode="normal" result="effect2_innerShadow_1_963" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <p className="absolute font-['Instrument_Sans:Bold',sans-serif] font-bold h-[204.804px] leading-[normal] left-[157.54px] text-[62.188px] text-shadow-[0px_3.317px_8.292px_rgba(0,0,0,0.25)] text-white top-[140.96px] uppercase w-[389.708px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Create Your Own Profile
      </p>

      {/* Username and Password Input Fields */}
      <div className="absolute left-[157.54px] top-[380px] w-[344.933px] flex flex-col gap-[16px]">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="bg-white/90 h-[44.775px] w-full rounded-[82.917px] px-[24.87px] font-['Instrument_Sans:Regular',sans-serif] text-[16.583px] text-[#4c3123] border-none focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ fontVariationSettings: "'wdth' 100" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit()}
          placeholder="Password"
          className="bg-white/90 h-[44.775px] w-full rounded-[82.917px] px-[24.87px] font-['Instrument_Sans:Regular',sans-serif] text-[16.583px] text-[#4c3123] border-none focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{ fontVariationSettings: "'wdth' 100" }}
        />

        {/* Log In Button */}
        <button
          onClick={handleLoginSubmit}
          className="bg-[#aedf4b] h-[44.775px] w-full rounded-[82.917px] px-[24.87px] font-['Instrument_Sans:SemiBold',sans-serif] font-semibold text-[16.583px] text-black hover:bg-[#9dca3f] transition-colors cursor-pointer"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Log In
        </button>
      </div>

      {/* Sign In Buttons */}
      <div className="absolute content-stretch flex flex-col gap-[20.729px] items-start leading-[0] left-[157.54px] top-[595px] w-[344.933px]">
        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 w-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="bg-white col-1 h-[44.775px] ml-0 mt-0 rounded-[82.917px] row-1 w-[344.933px]" />
          <p className="capitalize col-1 font-['Instrument_Sans:Regular',sans-serif] font-normal h-[18.242px] leading-[normal] ml-[24.87px] mt-[13.27px] relative row-1 text-[#4c3123] text-[16.583px] text-center w-[294.354px] pointer-events-none" style={{ fontVariationSettings: "'wdth' 100" }}>
            Sign in / Log in with Google
          </p>
        </button>

        {/* Apple Button */}
        <button
          onClick={handleAppleSignIn}
          className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 w-full cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="border-[1.658px] border-solid border-white col-1 h-[44.775px] ml-0 mt-0 rounded-[82.917px] row-1 w-[344.933px]" />
          <p className="capitalize col-1 font-['Instrument_Sans:Regular',sans-serif] font-normal h-[18.242px] leading-[normal] ml-[24.88px] mt-[13.27px] relative row-1 text-[16.583px] text-center text-white w-[294.354px] pointer-events-none" style={{ fontVariationSettings: "'wdth' 100" }}>
            Sign in / Log in with Apple
          </p>
        </button>
      </div>

      {/* Right Side Image with Mask */}
      <div className="absolute contents left-[547.25px] top-[160.03px]">
        <div className="absolute h-[621.875px] left-[240.46px] top-[68.82px] w-[1106.108px] overflow-hidden rounded-[50px]" style={{
          maskImage: `url('${imgImage5}')`,
          WebkitMaskImage: `url('${imgImage5}')`,
          maskSize: '491.696px 530.667px',
          maskPosition: '306.792px 91.208px',
          maskRepeat: 'no-repeat'
        }}>
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
        </div>
      </div>
    </div>
  );
}
