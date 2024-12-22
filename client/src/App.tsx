import { Switch, Route } from "wouter";
import { Loader2 } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import { useUser } from "./hooks/use-user";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/timeline/:childId" component={Timeline} />
    </Switch>
  );
}

export default App;
