
import { HomeIcon, ChatBubbleOvalLeftEllipsisIcon, Squares2X2Icon, StarIcon, UserIcon } from '@heroicons/react/24/outline';
import BottomNavItem from './BottomNavItem';
import type { TabName } from '@/types';

interface BottomNavigationProps {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { tabName: 'home' as TabName, label: 'Home', Icon: HomeIcon },
    { tabName: 'feeds' as TabName, label: 'Feeds', Icon: ChatBubbleOvalLeftEllipsisIcon },
    { tabName: 'menu' as TabName, label: 'Services', Icon: Squares2X2Icon },
    { tabName: 'recommended' as TabName, label: 'Recommended', Icon: StarIcon },
    { tabName: 'account' as TabName, label: 'Account', Icon: UserIcon }, // This will now point to the new AccountScreen for content management
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
    