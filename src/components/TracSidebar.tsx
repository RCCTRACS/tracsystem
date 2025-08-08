import { Home, ClipboardList, GraduationCap } from "lucide-react";

const TracSidebar = () => {
  const menuItems = [
    { src: "/Dashboard.png", label: "Teacher Dashboard" },
    { src: "/attendance.png", label: "Attendance Management" },
    { src: "/students.png", label: "Student Management" },
  ];

  return (
    <div className="w-16 bg-trac-sidebar min-h-screen flex flex-col items-center py-4">
      
      {/* Logo */}
      <div className="mb-6">
        <img src="/logo.png" alt="TRACS Logo" className="w-10 h-10 object-cover" />
      </div>

      {/* Top Menu Icons */}
      <nav className="flex flex-col space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-10 h-10 bg-white text-trac-sidebar hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            title={item.label}
          >
            <img src={item.src} alt={item.label} className="w-5 h-5 object-contain" />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TracSidebar;
