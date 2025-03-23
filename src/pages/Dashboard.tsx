
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Task } from "@/lib/types";
import { getColumns } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TaskColumn from "@/components/TaskColumn";
import AddTaskModal from "@/components/AddTaskModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [columns, setColumns] = useState(getColumns());
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

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

  return (
    <div className="flex h-screen">
      <Sidebar onOpenAddTask={() => {
        setSelectedStatus("backlog");
        setTaskToEdit(undefined);
        setIsAddTaskModalOpen(true);
      }} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Task Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and organize your tasks
              </p>
            </div>
            <Button 
              onClick={() => {
                setSelectedStatus("backlog");
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
          
          <div className="flex gap-4 pb-4 overflow-x-auto custom-scrollbar">
            {columns.map(column => (
              <TaskColumn
                key={column.id}
                column={column}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
              />
            ))}
            
            {/* Add Column Button (disabled for now) */}
            <Button 
              variant="outline" 
              className="h-10 shrink-0 self-start mt-8 border-dashed"
              disabled
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Column
            </Button>
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
