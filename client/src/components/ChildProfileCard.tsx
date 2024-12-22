import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import type { Child, Achievement } from "@db/schema";
import { format } from "date-fns";

interface ChildProfileCardProps {
  child: Child & {
    achievements: Achievement[];
  };
}

export default function ChildProfileCard({ child }: ChildProfileCardProps) {
  const [_, setLocation] = useLocation();

  const recentAchievements = child.achievements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const categories = [...new Set(child.achievements.map(a => a.category))];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{child.name}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(child.dateOfBirth), "MMMM d, yyyy")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation(`/timeline/${child.id}`)}
          >
            View Timeline
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="text-sm p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <span>{achievement.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(achievement.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
