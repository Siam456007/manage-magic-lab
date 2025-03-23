
import { useState } from "react";
import { Task, Column } from "@/lib/types";
import TaskColumn from "@/components/TaskColumn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface TaskBoardProps {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  columns,
  setColumns,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);

  // Drag and drop handlers
  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  const handleDragOver = (columnId: string, targetIndex?: number) => {
    if (!draggingTask) return;

    const sourceColumnId = draggingTask.status;
    const updatedColumns = [...columns];
    
    // Find source and target columns
    const sourceColumn = updatedColumns.find(col => col.id === sourceColumnId);
    const targetColumn = updatedColumns.find(col => col.id === columnId);
    
    if (!sourceColumn || !targetColumn) return;
    
    // Create updated task with new status
    const updatedTask = {...draggingTask, status: columnId as Task["status"]};
    
    // Remove task from source column
    sourceColumn.tasks = sourceColumn.tasks.filter(t => t.id !== draggingTask.id);
    
    // Insert task at specific position in target column
    if (targetIndex !== undefined) {
      targetColumn.tasks = [
        ...targetColumn.tasks.slice(0, targetIndex),
        updatedTask,
        ...targetColumn.tasks.slice(targetIndex)
      ];
    } else {
      // If no specific index, add to end of column
      targetColumn.tasks = [...targetColumn.tasks, updatedTask];
    }
    
    setDraggingTask(updatedTask);
    setColumns(updatedColumns);
  };

  const handleDrop = () => {
    if (draggingTask) {
      toast.success(`Task moved to ${draggingTask.status.replace('-', ' ')}`);
    }
    setDraggingTask(null);
  };

  return (
    <ScrollArea className="flex-1">
      <div 
        className="flex gap-4 pb-4 min-w-max"
        onDrop={handleDrop}
      >
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            column={column}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default TaskBoard;
