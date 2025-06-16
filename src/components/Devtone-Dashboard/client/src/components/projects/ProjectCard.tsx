interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description?: string;
    status: string;
    progress: number;
    startDate?: string;
    dueDate?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "in_progress":
        return "bg-amber-500 text-amber-900";
      case "review":
        return "bg-primary text-white";
      case "planning":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 75) return "bg-primary";
    if (progress >= 50) return "bg-amber-500";
    return "bg-gray-500";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-[hsl(249,57%,14%)] rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white">{project.name}</h4>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(project.status)}`}>
          {project.status.replace("_", " ")}
        </span>
      </div>
      
      {project.description && (
        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm mb-3">
        <span className="text-gray-400">
          Started: <span className="text-gray-300">{formatDate(project.startDate)}</span>
        </span>
        <span className="text-gray-400">
          Due: <span className="text-gray-300">{formatDate(project.dueDate)}</span>
        </span>
      </div>
      
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
