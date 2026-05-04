import React from 'react';

interface SidebarActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SidebarActionButton({
  icon,
  label,
  onClick
}: SidebarActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[10px] px-[12px] py-[8px] hover:bg-[rgba(255,255,255,0.1)] rounded-[8px] transition-colors cursor-pointer"
    >
      <div className="size-[18px]">
        {icon}
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[rgba(255,255,255,0.7)]">
        {label}
      </p>
    </button>
  );
}
