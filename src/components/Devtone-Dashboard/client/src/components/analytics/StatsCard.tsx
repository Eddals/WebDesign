import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "green" | "amber" | "purple" | "red";
  subtitle?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, subtitle }: StatsCardProps) {
  const colorClasses = {
    primary: "bg-primary",
    green: "bg-green-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  const subtitleClasses = {
    primary: "text-primary",
    green: "text-green-400",
    amber: "text-amber-400",
    purple: "text-purple-400",
    red: "text-red-400",
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className={`text-xs ${subtitleClasses[color]}`}>{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
