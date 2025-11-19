import { ChevronRight, LucideIcon } from 'lucide-react';

interface IOSCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  color: string;
  onClick: () => void;
  badge?: string;
}

export function IOSCard({ icon: Icon, title, subtitle, color, onClick, badge }: IOSCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-[14px] p-4 flex items-center gap-4 active:bg-gray-50 transition-colors shadow-sm border border-gray-100"
    >
      <div className={`w-14 h-14 rounded-[14px] ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <div className="flex-1 text-left">
        <p className="text-[17px]">{title}</p>
        {subtitle && <p className="text-[13px] text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {badge && (
        <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}
