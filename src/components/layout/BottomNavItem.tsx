import type { LucideProps } from 'lucide-react';
import type { TabName } from '@/types';

interface BottomNavItemProps {
  tabName: TabName;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  label: string;
  Icon: React.ElementType<LucideProps>;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  tabName,
  activeTab,
  setActiveTab,
  label,
  Icon,
}) => {
  const isActive = activeTab === tabName;
  return (
    <button
      className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 w-1/5
        ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
      onClick={() => setActiveTab(tabName)}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

export default BottomNavItem;
