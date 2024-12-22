import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import CategoryBadge from "./CategoryBadge";
import type { Achievement } from "@db/schema";
import { Badge } from "@/components/ui/badge";

interface AchievementCardProps {
  achievement: Achievement;
  compact?: boolean;
}

export default function AchievementCard({ achievement, compact }: AchievementCardProps) {
  return (
    <Card className={compact ? "h-full" : "max-w-2xl mx-auto"}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(achievement.date), "MMMM d, yyyy")}
            </p>
          </div>
          <CategoryBadge category={achievement.category} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{achievement.description}</p>
        {achievement.mediaUrls && achievement.mediaUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {achievement.mediaUrls.map((url, index) => (
              <a 
                key={index} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Media {index + 1}
              </a>
            ))}
          </div>
        )}
      </CardContent>
      {achievement.tags && achievement.tags.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {achievement.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
