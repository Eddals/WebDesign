import { Button } from "@/components/ui/button";

interface NavigationProps {
  user: any;
  isAdmin?: boolean;
  extra?: React.ReactNode;
}

export default function Navigation({ user, isAdmin = false, extra }: NavigationProps) {
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="glass-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">Devtone</h1>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{isAdmin ? "Admin Dashboard" : "Client Portal"}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {extra}
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full real-time-indicator"></div>
            <span className="text-sm text-gray-300">Online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{getInitials(user)}</span>
            </div>
            <span className="text-white">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
