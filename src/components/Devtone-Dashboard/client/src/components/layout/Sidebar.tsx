import { LucideIcon } from "lucide-react";

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: number;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="w-64 glass-card border-r border-gray-700 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.href) {
                    window.location.href = item.href;
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-primary text-white font-medium"
                    : "text-gray-300 hover:bg-[hsl(249,57%,14%)] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full ml-auto">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
