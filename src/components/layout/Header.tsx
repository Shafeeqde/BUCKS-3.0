import { Menu, MessageSquare } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-card shadow-sm p-4 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center">
        <button aria-label="Open menu" className="p-1 mr-3 text-foreground hover:text-primary">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-2xl font-bold text-primary font-headline">bucks</span>
      </div>
      <div className="relative">
        <button aria-label="Messages" className="p-1 text-foreground hover:text-primary">
          <MessageSquare className="w-6 h-6" />
        </button>
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-destructive-foreground bg-destructive rounded-full">
          10
        </span>
      </div>
    </header>
  );
};

export default Header;
