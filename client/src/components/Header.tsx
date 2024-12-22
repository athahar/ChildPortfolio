import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const { user, logout } = useUser();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer" 
            onClick={() => setLocation("/")}
          >
            HypeDoc
          </h1>
          {location !== "/" && (
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
            >
              Dashboard
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user?.username}
          </span>
          <Button 
            variant="outline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
