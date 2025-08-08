import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Home,
  UserCheck,
  ClipboardList 
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Users, label: "Students", active: false },
    { icon: UserCheck, label: "Attendance", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: ClipboardList, label: "Classes", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="w-16 bg-sidebar h-screen flex flex-col items-center py-4 space-y-4">
      {/* Logo */}
      <div className="bg-sidebar-accent p-2 rounded-lg mb-4">
        <span className="text-sidebar-foreground font-bold text-sm">TR</span>
      </div>

      {/* Menu Items */}
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            className={`p-3 rounded-lg transition-colors ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;