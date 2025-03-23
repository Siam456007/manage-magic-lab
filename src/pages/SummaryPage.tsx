
import { PieChart, BarChart, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getTaskStatistics } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, ListChecks } from "lucide-react";

const COLORS = ["#06d6a0", "#4361ee", "#f7b801", "#3a86ff", "#4cc9f0"];

const SummaryPage = () => {
  const stats = getTaskStatistics();

  return (
    <div className="flex h-screen">
      <Sidebar onOpenAddTask={() => {}} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        
        <div className="p-4 sm:p-6 overflow-auto custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Summary</h1>
            <p className="text-muted-foreground mt-1">
              Task statistics and productivity insights
            </p>
          </div>
          
          <Separator className="mb-6" />
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              description="Across all statuses"
              icon={<ListChecks className="h-4 w-4" />}
              trend="+5% from last week"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              description="Tasks finished"
              icon={<CheckCircle className="h-4 w-4" />}
              trend="+12% from last week"
              trendPositive
            />
            <StatCard
              title="Completion Rate"
              value={`${Math.round(stats.completionRate)}%`}
              description="Of all tasks"
              icon={<Activity className="h-4 w-4" />}
              trend="+3% from last week"
              trendPositive
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              description="Currently active"
              icon={<Clock className="h-4 w-4" />}
              trend="Same as last week"
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Distribution Chart */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>
                  Breakdown of tasks by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Progress Chart */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>
                  Tasks completed by day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="Tasks Completed" fill="#4361ee" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Average Completion Time"
              value="2.4 days"
              description="Average time to complete tasks"
            />
            <MetricCard
              title="Most Productive Day"
              value="Thursday"
              description="Based on tasks completed"
            />
            <MetricCard
              title="Upcoming Deadlines"
              value="3"
              description="Tasks due in the next 3 days"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendPositive,
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-primary/10 p-1 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`text-xs mt-2 ${trendPositive ? "text-green-500" : "text-muted-foreground"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SummaryPage;
