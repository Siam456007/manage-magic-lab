
import { useState } from "react";
import { format } from "date-fns";
import { PlusCircle, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { Task } from "@/lib/types";
import { getBacklogTasks } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BacklogPage = () => {
  const [tasks, setTasks] = useState<Task[]>(getBacklogTasks());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsAddTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    toast.success("Task deleted successfully");
  };

  const handleAddOrUpdateTask = (newTask: Task) => {
    if (taskToEdit) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === newTask.id ? newTask : task
      );
      setTasks(updatedTasks);
    } else {
      // Add new task
      setTasks([...tasks, newTask]);
    }
  };

  // Filter and sort tasks
  let filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort tasks
  switch (sortOrder) {
    case "newest":
      filteredTasks = [...filteredTasks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      filteredTasks = [...filteredTasks].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "a-z":
      filteredTasks = [...filteredTasks].sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      break;
    case "z-a":
      filteredTasks = [...filteredTasks].sort((a, b) => 
        b.title.localeCompare(a.title)
      );
      break;
    default:
      break;
  }

  return (
    <div className="flex h-screen">
      <Sidebar onOpenAddTask={() => {
        setTaskToEdit(undefined);
        setIsAddTaskModalOpen(true);
      }} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Backlog</h1>
              <p className="text-muted-foreground mt-1">
                Manage unprioritized and unscheduled tasks
              </p>
            </div>
            <Button 
              onClick={() => {
                setTaskToEdit(undefined);
                setIsAddTaskModalOpen(true);
              }}
              className="flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <Separator className="mb-6" />
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="a-z">A to Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="z-a">Z to A</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pb-4 pr-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? `No tasks match "${searchQuery}"`
                  : "Your backlog is empty. Add some tasks to get started."}
              </p>
              <Button
                onClick={() => {
                  setTaskToEdit(undefined);
                  setIsAddTaskModalOpen(true);
                }}
              >
                Add Your First Task
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddOrUpdateTask}
        status="backlog"
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default BacklogPage;
