
import { useState, useEffect } from "react";
import { PlusCircle, Search, Filter, Calendar, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { Task } from "@/lib/types";
import { getColumns } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TaskColumn from "@/components/TaskColumn";
import AddTaskModal from "@/components/AddTaskModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useTheme } from "@/components/ThemeProvider";

const Dashboard = () => {
  const [columns, setColumns] = useState(getColumns());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const { theme, setTheme } = useTheme();

  // Apply filters to columns
  useEffect(() => {
    const originalColumns = getColumns();
    
    const filteredColumns = originalColumns.map(column => {
      // Filter tasks
      let filteredTasks = column.tasks;
      
      // Search term filter
      if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
      }
      
      // Tag filter
      if (tagFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
          task.tags?.includes(tagFilter as any)
        );
      }
      
      // Date range filter
      if (dateRange.from || dateRange.to) {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          
          const dueDate = new Date(task.dueDate);
          
          if (dateRange.from && dateRange.to) {
            return isAfter(dueDate, dateRange.from) && isBefore(dueDate, dateRange.to);
          } else if (dateRange.from) {
            return isAfter(dueDate, dateRange.from);
          } else if (dateRange.to) {
            return isBefore(dueDate, dateRange.to);
          }
          
          return true;
        });
      }
      
      return {
        ...column,
        tasks: filteredTasks,
      };
    });
    
    setColumns(filteredColumns);
  }, [searchTerm, statusFilter, tagFilter, dateRange]);

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setTaskToEdit(undefined);
    setIsAddTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));
    
    setColumns(updatedColumns);
    toast.success("Task deleted successfully");
  };

  const handleAddOrUpdateTask = (newTask: Task) => {
    if (taskToEdit) {
      // Update existing task
      const updatedColumns = columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === newTask.id ? newTask : task
        )
      }));
      
      setColumns(updatedColumns);
    } else {
      // Add new task
      const updatedColumns = columns.map(column => {
        if (column.id === newTask.status) {
          return {
            ...column,
            tasks: [...column.tasks, newTask]
          };
        }
        return column;
      });
      
      setColumns(updatedColumns);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  const handleDragOver = (columnId: string) => {
    if (draggingTask && draggingTask.status !== columnId) {
      const updatedTask = {...draggingTask, status: columnId as Task["status"]};
      
      // Remove from original column
      const originalColumn = columns.find(col => col.id === draggingTask.status);
      if (originalColumn) {
        originalColumn.tasks = originalColumn.tasks.filter(t => t.id !== draggingTask.id);
      }
      
      // Add to new column
      const targetColumn = columns.find(col => col.id === columnId);
      if (targetColumn) {
        targetColumn.tasks = [...targetColumn.tasks, updatedTask];
      }
      
      setDraggingTask(updatedTask);
      
      // Force rerender
      setColumns([...columns]);
      
      toast.success(`Task moved to ${columnId.replace('-', ' ')}`);
    }
  };

  const handleDrop = () => {
    setDraggingTask(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTagFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setColumns(getColumns());
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen" onDrop={handleDrop}>
      <Sidebar onOpenAddTask={() => {
        setSelectedStatus("todo");
        setTaskToEdit(undefined);
        setIsAddTaskModalOpen(true);
      }} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Task Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your tasks
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tasks..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filters dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="todo">To-Do</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={tagFilter} onValueChange={setTagFilter}>
                    <DropdownMenuRadioItem value="all">All Tags</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="designing">Designing</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="meeting">Meeting</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="research">Research</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="development">Development</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="planning">Planning</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={clearFilters}>Clear Filters</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Date range filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {/* Theme toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <Button 
                onClick={() => {
                  setSelectedStatus("todo");
                  setTaskToEdit(undefined);
                  setIsAddTaskModalOpen(true);
                }}
                className="flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="flex gap-4 pb-4 overflow-x-auto custom-scrollbar">
            {columns.map(column => (
              <TaskColumn
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
              />
            ))}
          </div>
        </div>
      </div>
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddOrUpdateTask}
        status={selectedStatus as any}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default Dashboard;
