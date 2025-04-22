
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Course } from '@/services/DatabaseService';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { downloadCourse, isOnline } = useApp();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (course.isDownloaded) return;
    
    setIsDownloading(true);
    await downloadCourse(course.id);
    setIsDownloading(false);
  };

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <Link to={`/courses/${course.id}`} className="h-full flex flex-col">
        <div className="relative">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-36 object-cover"
          />
          {course.isDownloaded && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Available Offline
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          <p className="text-xs mt-2 text-muted-foreground">{course.lessonsCount} lessons</p>
        </CardContent>
        
        <CardFooter className="pt-2">
          {!course.isDownloaded && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleDownload}
              disabled={isDownloading || !isOnline}
            >
              {isDownloading ? <ArrowDown className="h-4 w-4 animate-bounce" /> : <Download className="h-4 w-4" />}
              {isDownloading ? 'Downloading...' : 'Download for Offline'}
            </Button>
          )}
          
          {course.isDownloaded && (
            <Button variant="default" size="sm" className="w-full">
              Continue Learning
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CourseCard;
