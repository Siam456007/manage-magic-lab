
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Tag, Trash2, Edit2 } from "lucide-react";
import { Task, TaskTag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onEdit }) => {
  const [showDetail, setShowDetail] = useState(false);
  
  const getTagColor = (tag: TaskTag) => {
    switch(tag) {
      case "designing":
        return "bg-tag-design text-white";
      case "meeting":
        return "bg-tag-meeting text-white";
      case "research":
        return "bg-tag-research text-white";
      case "development":
        return "bg-tag-development text-white";
      case "planning":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <div 
        className="task-card animate-scale-in overflow-hidden"
        onClick={() => setShowDetail(true)}
      >
        {task.image && (
          <div className="h-36 w-full overflow-hidden">
            <img 
              src={task.image} 
              alt={task.title} 
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-4">
          <h3 className="font-medium line-clamp-2 mb-2">{task.title}</h3>
          
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {task.tags && task.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "status-tag inline-flex items-center",
                  getTagColor(tag)
                )}
              >
                {tag}
              </span>
            ))}
            {(!task.tags || task.tags.length === 0) && (
              <span className="status-tag bg-muted text-muted-foreground">
                No Tags
              </span>
            )}
          </div>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground mt-auto">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{format(new Date(task.dueDate), "dd MMM, yyyy")}</span>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
            <DialogDescription>
              Created on {format(new Date(task.createdAt), "MMMM dd, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {task.image && (
            <div className="h-48 w-full overflow-hidden rounded-md">
              <img 
                src={task.image} 
                alt={task.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-4">
            {task.description && (
              <p className="text-sm">{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {task.tags && task.tags.map((tag) => (
                <div
                  key={tag}
                  className={cn(
                    "status-tag inline-flex items-center",
                    getTagColor(tag)
                  )}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
            
            {task.dueDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Due: {format(new Date(task.dueDate), "MMMM dd, yyyy")}</span>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            {onEdit && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => {
                  onEdit(task);
                  setShowDetail(false);
                }}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                className="flex items-center gap-1"
                onClick={() => {
                  onDelete(task.id);
                  setShowDetail(false);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
