import { useParams } from "wouter";
import { useChildAchievements, useChildren } from "@/hooks/use-achievements";
import Header from "@/components/Header";
import AchievementCard from "@/components/AchievementCard";
import AddAchievementDialog from "@/components/AddAchievementDialog";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Timeline() {
  const { childId } = useParams<{ childId: string }>();
  const { data: children } = useChildren();
  const { data: achievements, isLoading } = useChildAchievements(parseInt(childId));

  const child = children?.find(c => c.id === parseInt(childId));

  if (!child) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Child not found</h2>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const achievementsByYear = achievements?.reduce((acc: Record<string, typeof achievements>, achievement) => {
    const year = format(new Date(achievement.date), "yyyy");
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(achievement);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">{child.name}'s Timeline</h2>
            <p className="text-muted-foreground">
              Born {format(new Date(child.dateOfBirth), "MMMM d, yyyy")}
            </p>
          </div>
          <AddAchievementDialog childId={child.id} />
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-border" />
          <div className="space-y-12">
            {achievementsByYear && Object.entries(achievementsByYear)
              .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
              .map(([year, yearAchievements]) => (
                <div key={year} className="relative">
                  <div className="sticky top-0 z-10 mb-4 bg-background/95 backdrop-blur">
                    <h3 className="text-xl font-semibold ml-4 py-2">{year}</h3>
                  </div>
                  <div className="space-y-8">
                    {yearAchievements
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((achievement) => (
                        <div key={achievement.id} className="relative">
                          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                          <div className="pl-8">
                            <AchievementCard achievement={achievement} />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
