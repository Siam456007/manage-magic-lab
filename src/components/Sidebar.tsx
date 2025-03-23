
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ListTodo, 
  PieChart, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  onOpenAddTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenAddTask }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-card transition-all duration-300 relative z-30",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="rounded-md bg-primary p-1">
              <div className="h-3 w-3 rounded-sm bg-white" />
            </div>
            <span className="font-semibold">Taskify</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "h-8 w-8",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            active={isActivePath("/dashboard")}
            collapsed={collapsed}
          />
          <SidebarLink
            to="/backlog"
            icon={<ListTodo className="h-5 w-5" />}
            label="Backlog"
            active={isActivePath("/backlog")}
            collapsed={collapsed}
          />
          <SidebarLink
            to="/summary"
            icon={<PieChart className="h-5 w-5" />}
            label="Summary"
            active={isActivePath("/summary")}
            collapsed={collapsed}
          />
          <SidebarLink
            to="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            active={isActivePath("/settings")}
            collapsed={collapsed}
          />
        </nav>
      </div>

      <div className="p-4 border-t mt-auto">
        <Button 
          onClick={onOpenAddTask} 
          className={cn(
            "w-full justify-center",
            collapsed ? "px-2" : ""
          )}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          {!collapsed && <span>Add Task</span>}
        </Button>
      </div>

      {!collapsed && (
        <div className="p-4 border-t flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium">{user?.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  active,
  collapsed,
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

export default Sidebar;
