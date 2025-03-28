
import { User, Task, Column } from "./types";

// Mock user data
export const mockUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "user@example.com",
  avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
  preferences: {
    darkMode: true,
    notifications: true,
  },
};

// Mock task data
export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Creating a new Portfolio on Dribbble",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "in-progress",
    createdAt: new Date("2023-08-08"),
    dueDate: new Date("2023-08-08"),
    tags: ["designing"],
    image: "/lovable-uploads/c08b374a-fca5-4392-8efe-672ee2429a26.png",
  },
  {
    id: "task-2",
    title: "Singapore Team Meet",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    status: "in-progress",
    createdAt: new Date("2023-08-09"),
    dueDate: new Date("2023-08-09"),
    tags: ["meeting"],
  },
  {
    id: "task-3",
    title: "Plan a trip to another country",
    description: "",
    status: "todo",
    createdAt: new Date("2023-09-10"),
    dueDate: new Date("2023-09-10"),
  },
  {
    id: "task-4",
    title: "Dinner with Kelly Young",
    description: "",
    status: "done",
    createdAt: new Date("2023-08-08"),
    dueDate: new Date("2023-08-08"),
  },
  {
    id: "task-5",
    title: "Launch New SEO Wordpress Theme",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq ua.",
    status: "done",
    createdAt: new Date("2023-08-09"),
    dueDate: new Date("2023-08-09"),
  },
  {
    id: "task-6",
    title: "Create wireframes for homepage redesign",
    description: "Create low-fidelity wireframes for the new homepage design based on user feedback.",
    status: "todo",
    createdAt: new Date("2023-09-15"),
  },
  {
    id: "task-7",
    title: "Research competitor analytics tools",
    description: "Analyze main competitors' analytics implementations and create a comparison report.",
    status: "todo",
    createdAt: new Date("2023-09-12"),
    tags: ["research"],
  },
  {
    id: "task-8",
    title: "Implement user authentication system",
    description: "Develop and integrate a secure authentication system with JWT tokens.",
    status: "todo",
    createdAt: new Date("2023-09-05"),
    tags: ["development"],
  },
  {
    id: "task-9",
    title: "Create project documentation",
    description: "Document all API endpoints and data structures for the developer team.",
    status: "todo",
    createdAt: new Date("2023-09-20"),
  },
  {
    id: "task-10",
    title: "Plan Q4 marketing strategy",
    description: "Develop a comprehensive marketing plan for the upcoming quarter.",
    status: "todo",
    createdAt: new Date("2023-09-18"),
    tags: ["planning"],
  },
];

// Generate columns with tasks
export const getColumns = (): Column[] => {
  return [
    {
      id: "todo",
      title: "To-Do",
      tasks: mockTasks.filter(task => task.status === "todo"),
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: mockTasks.filter(task => task.status === "in-progress"),
    },
    {
      id: "done",
      title: "Done",
      tasks: mockTasks.filter(task => task.status === "done"),
    },
  ];
};

// Get backlog tasks
export const getBacklogTasks = (): Task[] => {
  return mockTasks.filter(task => task.status === "todo" && !task.dueDate);
};

// Get tasks by status
export const getTasksByStatus = (status: string): Task[] => {
  return mockTasks.filter(task => task.status === status);
};

// Task statistics for the summary page
export const getTaskStatistics = () => {
  const total = mockTasks.length;
  const completed = mockTasks.filter(task => task.status === "done").length;
  const inProgress = mockTasks.filter(task => task.status === "in-progress").length;
  const todo = mockTasks.filter(task => task.status === "todo").length;
  
  return {
    total,
    completed,
    completionRate: (completed / total) * 100,
    inProgress,
    todo,
    // Data for charts
    statusDistribution: [
      { name: "Done", value: completed },
      { name: "In Progress", value: inProgress },
      { name: "To-Do", value: todo },
    ],
    weeklyProgress: [
      { name: "Mon", tasks: 3 },
      { name: "Tue", tasks: 5 },
      { name: "Wed", tasks: 2 },
      { name: "Thu", tasks: 7 },
      { name: "Fri", tasks: 4 },
      { name: "Sat", tasks: 1 },
      { name: "Sun", tasks: 0 },
    ],
  };
};
