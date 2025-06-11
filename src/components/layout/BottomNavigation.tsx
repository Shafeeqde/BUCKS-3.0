import { Home, MessageCircle, LayoutGrid, Star, User } from 'lucide-react';
import BottomNavItem from './BottomNavItem';
import type { TabName } from '@/types';

interface BottomNavigationProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { tabName: 'home' as TabName, label: 'Home', Icon: Home },
    { tabName: 'feeds' as TabName, label: 'Feeds', Icon: MessageCircle },
    { tabName: 'menu' as TabName, label: 'Menu', Icon: LayoutGrid },
    { tabName: 'recommended' as TabName, label: 'Recommended', Icon: Star },
    { tabName: 'account' as TabName, label: 'Account', Icon: User },
  ];

  return (
    <nav className="bg-card border-t border-border p-2 flex justify-around items-center sticky bottom-0 z-10">
      {navItems.map((item) => (
        <BottomNavItem
          key={item.tabName}
          tabName={item.tabName}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label={item.label}
          Icon={item.Icon}
        />
      ))}
    </nav>
  );
};

export default BottomNavigation;
