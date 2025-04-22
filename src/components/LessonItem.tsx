
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Lesson } from '@/services/DatabaseService';
import { useApp } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LessonItemProps {
  lesson: Lesson;
  isActive: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, isActive }) => {
  const { progress } = useApp();
  
  const isCompleted = progress[lesson.id]?.completed || false;
  
  return (
    <Link
      to={`/lessons/${lesson.id}`}
      className={cn(
        "flex items-center p-3 rounded-md transition-colors",
        isActive 
          ? "bg-primary text-white" 
          : "hover:bg-muted"
      )}
    >
      <div className="mr-3">
        {isCompleted ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className={cn(
          "font-medium",
          isActive ? "text-white" : "text-foreground"
        )}>
          {lesson.title}
        </h3>
      </div>
      
      {lesson.isDownloaded && (
        <div className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Offline
        </div>
      )}
    </Link>
  );
};

export default LessonItem;
