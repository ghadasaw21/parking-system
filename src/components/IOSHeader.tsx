import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

interface IOSHeaderProps {
  title?: string;
  largeTitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightButton?: React.ReactNode;
}

export function IOSHeader({ title, largeTitle, onBack, showBack = false, rightButton }: IOSHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-11">
        <div className="w-20">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-blue-500 hover:bg-transparent p-0 h-auto -ml-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-[17px]">Back</span>
            </Button>
          )}
        </div>
        {title && <span className="text-[17px]">{title}</span>}
        <div className="w-20 flex justify-end">{rightButton}</div>
      </div>
      
      {/* Large Title */}
      {largeTitle && (
        <div className="px-4 pt-2 pb-4">
          <h1 className="text-[34px] tracking-tight">{largeTitle}</h1>
        </div>
      )}
    </div>
  );
}
