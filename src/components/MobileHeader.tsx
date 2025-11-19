import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  onMenu?: () => void;
  showBack?: boolean;
}

export function MobileHeader({ title, onBack, onMenu, showBack = false }: MobileHeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-blue-700 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-xl">{title}</h1>
      </div>
      {onMenu && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenu}
          className="text-white hover:bg-blue-700 p-2"
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}
    </header>
  );
}
