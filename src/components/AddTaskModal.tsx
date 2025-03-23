
import { useState } from "react";
import { Task, TaskStatus, TaskTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().optional(),
  status: z.enum(["backlog", "in-progress", "pending", "complete", "working"] as const),
  dueDate: z.date().optional(),
  tags: z.array(z.enum(["designing", "meeting", "research", "development", "planning"] as const)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  status?: TaskStatus;
  taskToEdit?: Task;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  status = "backlog",
  taskToEdit,
}) => {
  const [selectedTags, setSelectedTags] = useState<TaskTag[]>(taskToEdit?.tags || []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: taskToEdit?.title || "",
      description: taskToEdit?.description || "",
      status: taskToEdit?.status || status,
      dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined,
      tags: taskToEdit?.tags || [],
    },
  });

  const onSubmit = (values: FormValues) => {
    const newTask: Task = {
      id: taskToEdit?.id || `task-${Date.now()}`,
      title: values.title,
      description: values.description,
      status: values.status,
      dueDate: values.dueDate,
      createdAt: taskToEdit?.createdAt || new Date(),
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };
    
    onAddTask(newTask);
    toast.success(taskToEdit ? "Task updated" : "Task created");
    onClose();
    form.reset();
    setSelectedTags([]);
  };

  const toggleTag = (tag: TaskTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {taskToEdit 
              ? "Update the details of your task below."
              : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description (optional)" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {["designing", "meeting", "research", "development", "planning"].map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                      selectedTags.includes(tag as TaskTag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => toggleTag(tag as TaskTag)}
                  >
                    {tag}
                    {selectedTags.includes(tag as TaskTag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {taskToEdit ? "Update Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
