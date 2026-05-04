import React from 'react';

interface NavigationButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export default function NavigationButton({
  icon,
  label,
  active = false,
  onClick
}: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex gap-[20px] h-[49.75px] items-center px-[24px] rounded-[16.583px] w-[240px] cursor-pointer transition-all ${
        active
          ? 'bg-[rgba(0,0,0,0.25)] shadow-[4.146px_4.146px_4.146px_0px_rgba(0,0,0,0.15)] hover:opacity-90'
          : 'bg-[rgba(255,255,255,0)] hover:bg-[rgba(0,0,0,0.15)]'
      }`}
    >
      <div className="relative shrink-0 size-[30px]">
        {icon}
      </div>
      <p className="capitalize font-['Instrument_Sans:Medium',sans-serif] font-medium text-[18px] text-[#d9d9d9]" style={{ fontVariationSettings: "'wdth' 100" }}>
        {label}
      </p>
    </button>
  );
}
