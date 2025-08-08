import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  courseCode: string;
  courseTitle: string;
  description: string;
  onClick?: () => void;
}

const CourseCard = ({ courseCode, courseTitle, description, onClick }: CourseCardProps) => {
  return (
    <Card 
      className="bg-card border border-border hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 flex flex-col justify-center"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center flex-1 flex items-center justify-center">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            {courseCode}
          </h3>
          <p className="text-lg text-muted-foreground font-medium">
            {courseTitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;