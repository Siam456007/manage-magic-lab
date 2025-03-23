
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { isAfter, isBefore } from "date-fns";
import { Task } from "@/lib/types";
import { getColumns } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AddTaskModal from "@/components/AddTaskModal";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaskBoard from "@/components/dashboard/TaskBoard";

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

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTagFilter("all");
    setDateRange({ from: undefined, to: undefined });
    setColumns(getColumns());
  };

  const handleOpenAddTask = () => {
    setSelectedStatus("todo");
    setTaskToEdit(undefined);
    setIsAddTaskModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onOpenAddTask={handleOpenAddTask} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6 flex flex-col h-full overflow-hidden">
          <DashboardHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            clearFilters={clearFilters}
            onOpenAddTask={handleOpenAddTask}
          />
          
          <Separator className="mb-6" />
          
          <TaskBoard 
            columns={columns}
            setColumns={setColumns}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
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
