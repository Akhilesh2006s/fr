import { Link, useLocation } from "wouter";
import { BookOpen, Video, FileText, MessageCircle, User, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation() {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/", label: "Learning Paths", icon: BookOpen },
    { path: "/videos", label: "Video Lectures", icon: Video },
    { path: "/tests", label: "Practice Tests", icon: FileText },
    { path: "/ai-tutor", label: "AI Tutor", icon: MessageCircle },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:text-primary"}`}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Desktop Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">EduAI</span>
              </div>
            </div>
            
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <button className={`transition-colors ${isActive ? "text-primary" : "text-gray-700 hover:text-primary"}`}>
                        {item.label}
                      </button>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              
              {isMobile ? (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col space-y-2 mt-8">
                      <NavContent />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <Link href="/profile">
                  <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-medium text-white">AK</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <button className={`bottom-nav-button ${isActive ? "text-primary" : "text-gray-500"}`}>
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{item.label.split(" ")[0]}</span>
                  </button>
                </Link>
              );
            })}
            <Link href="/profile">
              <button className={`bottom-nav-button ${location === "/profile" ? "text-primary" : "text-gray-500"}`}>
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs">Profile</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
