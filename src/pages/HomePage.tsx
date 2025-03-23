
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, PieChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
                  Organize Your Work <span className="text-primary">Effortlessly!</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Streamline your tasks, boost productivity, and never miss a deadline with our 
                  intuitive task management platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <Link to="/signup">
                  <Button size="lg" className="group">
                    Sign Up for Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why Choose Taskify?
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
                Our platform is designed to simplify task management and boost productivity with 
                powerful features and an intuitive interface.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<CheckCircle2 className="h-12 w-12 text-primary" />}
                title="Task Management"
                description="Create, organize, and prioritize tasks with drag-and-drop simplicity."
              />
              <FeatureCard
                icon={<Clock className="h-12 w-12 text-primary" />}
                title="Due Dates & Reminders"
                description="Never miss a deadline with customizable due dates and timely notifications."
              />
              <FeatureCard
                icon={<PieChart className="h-12 w-12 text-primary" />}
                title="Analytics & Insights"
                description="Track progress and gain insights with visual charts and progress reports."
              />
              <FeatureCard
                icon={<Zap className="h-12 w-12 text-primary" />}
                title="Real-time Updates"
                description="Stay in sync with real-time updates and seamless collaboration features."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
                Discover how Taskify has helped users transform their productivity and work management.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Taskify has transformed how I manage my daily tasks. I'm more productive than ever!"
                author="Sarah Johnson"
                role="Marketing Manager"
              />
              <TestimonialCard
                quote="The intuitive interface and powerful features make this the best task manager I've used."
                author="Michael Chen"
                role="Software Developer"
              />
              <TestimonialCard
                quote="I love the analytics dashboard. It helps me understand my productivity patterns."
                author="Emma Davis"
                role="Project Manager"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Get Started?
                </h2>
                <p className="max-w-[600px] text-primary-foreground/80">
                  Join thousands of users who have transformed their productivity with Taskify.
                  Sign up today and start organizing your work effortlessly!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary" className="group">
                    Sign Up for Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <div className="h-3 w-3 rounded-sm bg-white" />
              </div>
              <span className="font-semibold">Taskify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Taskify. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border transition-all hover:shadow-md hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  return (
    <div className="p-6 bg-card rounded-lg shadow-sm border">
      <p className="mb-4 italic">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default HomePage;
