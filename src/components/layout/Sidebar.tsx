
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  Lightbulb,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  text: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: Home, text: 'Dashboard', path: '/dashboard' },
  { icon: FileText, text: 'Resume Analysis', path: '/resume-analysis' },
  { icon: Users, text: 'Candidates', path: '/candidates' },
  { icon: BarChart2, text: 'Reports', path: '/reports' },
  { icon: Lightbulb, text: 'Recommendations', path: '/recommendations' },
  { icon: Settings, text: 'Settings', path: '/settings' }
];

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(isOpen);
  }, [isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative h-screen w-64 z-30 shadow-md flex flex-col transition-transform duration-300 ease-out",
          "bg-white dark:bg-gray-900 dark:border-r dark:border-gray-800",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          animateIn ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">lovable.dev</h2>
          {isMobile && (
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100 transition-all duration-200 dark:hover:bg-gray-800"
            >
              <X size={20} className="dark:text-gray-300" />
            </button>
          )}
          {!isMobile && (
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-gray-100 transition-all duration-200 dark:hover:bg-gray-800"
            >
              <ChevronLeft size={20} className="dark:text-gray-300" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20" 
                    : "text-gray-700 dark:text-gray-300"
                )}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-all",
                    isActive && "animate-pulse opacity-80"
                  )}
                />
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">© 2025 lovable.dev</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
