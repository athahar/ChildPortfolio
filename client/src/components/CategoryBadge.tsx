import { Badge } from "@/components/ui/badge";
import { Award, Code, Book, Brush, Trophy } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Arts": "bg-pink-100 text-pink-800 hover:bg-pink-200",
  "STEM": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "Sports": "bg-green-100 text-green-800 hover:bg-green-200",
  "Volunteering": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "Academic": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Arts": <Brush className="w-3 h-3" />,
  "STEM": <Code className="w-3 h-3" />,
  "Sports": <Trophy className="w-3 h-3" />,
  "Volunteering": <Award className="w-3 h-3" />,
  "Academic": <Book className="w-3 h-3" />,
};

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge 
      className={`flex items-center gap-1 ${CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800'}`}
      variant="secondary"
    >
      {CATEGORY_ICONS[category]}
      {category}
    </Badge>
  );
}
