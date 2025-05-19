
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { logoutUser } from '@/services';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logoutUser();
    
    if (success) {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente."
      });
      
      // Redirigir al login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Intente nuevamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      {isMobile && (
        <button 
          onClick={toggleSidebar}
          className="mr-4 p-1 rounded hover:bg-gray-100 transition-all duration-200 dark:hover:bg-gray-800"
        >
          <Menu size={24} className="dark:text-gray-300" />
        </button>
      )}
      
      <div className="flex-1 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Escuela Pontificia</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-1.5 rounded-full hover:bg-gray-100 relative transition-all duration-200 dark:hover:bg-gray-800">
            <Bell size={20} className="dark:text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-100 transition-all duration-200 dark:hover:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:bg-primary/20">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium hidden md:inline dark:text-gray-300">Usuario</span>
                <ChevronDown size={16} className={`transition-transform duration-300 dark:text-gray-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-scale-in">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover-scale">
                <User size={16} className="mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateToSettings} className="cursor-pointer hover-scale">
                <Settings size={16} className="mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover-scale">
                <LogOut size={16} className="mr-2" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
