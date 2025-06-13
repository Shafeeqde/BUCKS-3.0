
import { Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
  onMessagesClick: () => void;
  unreadCount?: number;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onMessagesClick, unreadCount = 0 }) => {
  return (
    <header className="bg-card shadow-sm p-4 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" aria-label="Open menu" className="mr-2 text-foreground hover:text-primary" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </Button>
        <span className="text-2xl font-bold text-primary font-headline">bucks</span>
      </div>
      <div className="relative">
        <Button variant="ghost" size="icon" aria-label="Messages" className="text-foreground hover:text-primary" onClick={onMessagesClick}>
          <MessageSquare className="w-6 h-6" />
        </Button>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
