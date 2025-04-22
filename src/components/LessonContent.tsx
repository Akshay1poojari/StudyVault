
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from '@/contexts/AppContext';
import { Lesson } from '@/services/DatabaseService';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete, onNext }) => {
  const { progress, saveProgress } = useApp();
  const lessonProgress = progress[lesson.id];
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lessonProgress?.completed || false);
  
  // Track scroll position to calculate progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPosition = element.scrollTop;
    const maxScroll = element.scrollHeight - element.clientHeight;
    
    // Calculate percentage (0-100)
    const percentage = Math.min(Math.round((scrollPosition / maxScroll) * 100), 100);
    
    // Only update if scrolled more than before
    if (percentage > scrollPosition) {
      setScrollPosition(percentage);
      
      // Save progress every 10%
      if (percentage % 10 === 0) {
        saveProgress(lesson.id, lesson.courseId, false, percentage);
      }
      
      // If reached 90%, mark as completed
      if (percentage >= 90 && !isCompleted) {
        setIsCompleted(true);
        saveProgress(lesson.id, lesson.courseId, true, percentage);
      }
    }
  };
  
  // Mark as complete when user clicks the button
  const handleComplete = () => {
    setIsCompleted(true);
    saveProgress(lesson.id, lesson.courseId, true, 100);
    onComplete();
  };
  
  // Restore scroll position when lesson changes
  useEffect(() => {
    setIsCompleted(lessonProgress?.completed || false);
    
    if (lessonProgress) {
      setScrollPosition(lessonProgress.lastPosition);
    } else {
      setScrollPosition(0);
    }
  }, [lesson.id, lessonProgress]);
  
  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow overflow-hidden">
        <CardContent className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto" onScroll={handleScroll}>
          <div 
            className="prose prose-slate max-w-none" 
            dangerouslySetInnerHTML={{ __html: lesson.content }} 
          />
        </CardContent>
      </Card>
      
      <div className="pt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Progress: {scrollPosition}%
        </div>
        
        <div className="flex gap-2">
          {!isCompleted && (
            <Button variant="outline" onClick={handleComplete}>
              Mark as Complete
            </Button>
          )}
          
          <Button onClick={onNext} disabled={!isCompleted}>
            Next Lesson
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
