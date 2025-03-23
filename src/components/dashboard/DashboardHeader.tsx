
import { PlusCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterBar from "./FilterBar";
import { useTheme } from "@/components/ThemeProvider";

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  clearFilters: () => void;
  onOpenAddTask: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  dateRange,
  setDateRange,
  clearFilters,
  onOpenAddTask,
}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage and organize your tasks
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <FilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          clearFilters={clearFilters}
        />
        
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <Button 
          onClick={onOpenAddTask}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
