
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <div className="rounded-md bg-primary p-1.5">
              <div className="h-5 w-5 rounded-sm bg-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Taskify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/backlog" className="text-sm font-medium transition-colors hover:text-primary">
                  Backlog
                </Link>
                <Link to="/summary" className="text-sm font-medium transition-colors hover:text-primary">
                  Summary
                </Link>
                <Link to="/settings" className="text-sm font-medium transition-colors hover:text-primary">
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link to="/features" className="text-sm font-medium transition-colors hover:text-primary">
                  Features
                </Link>
                <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
                  Pricing
                </Link>
              </>
            )}
          </nav>

          {/* User Menu or Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    3
                  </span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex w-full cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="flex cursor-pointer items-center text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/backlog" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Backlog
                </Link>
                <Link 
                  to="/summary" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Summary
                </Link>
                <Link 
                  to="/settings" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-base font-medium text-destructive"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full" variant="outline">
                      Log in
                    </Button>
                  </Link>
                  <Link 
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
