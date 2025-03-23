
import { MoreHorizontal, Plus } from "lucide-react";
import { Column, Task } from "@/lib/types";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { ScrollArea } from "./ui/scroll-area";

interface TaskColumnProps {
  column: Column;
  onAddTask: (status: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragOver: (columnId: string, index?: number) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDragStart,
  onDragOver,
}) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "in-progress":
        return "bg-status-in-progress";
      case "todo":
        return "bg-amber-500";
      case "done":
        return "bg-status-complete";
      default:
        return "bg-muted";
    }
  };

  return (
    <div 
      className="flex h-full w-[300px] shrink-0 flex-col rounded-lg bg-card"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(column.id);
      }}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", getStatusColor(column.id))} />
          <h3 className="font-medium">{column.title}</h3>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
            {column.tasks.length}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddTask(column.id)}>
                Add Task
              </DropdownMenuItem>
              <DropdownMenuItem>Clear Column</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-3">
          {column.tasks.length > 0 ? (
            column.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                draggable
                onDragStart={() => onDragStart(task)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOver(column.id, index);
                }}
              >
                <TaskCard
                  task={task}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-3 text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskColumn;
