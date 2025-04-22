
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import LessonItem from '@/components/LessonItem';
import LessonContent from '@/components/LessonContent';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lesson } from '@/services/DatabaseService';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { 
    courses,
    lessons,
    loadLessons,
    currentLesson,
    setCurrentLesson
  } = useApp();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!lessonId) return;
    
    // Find the lesson
    let foundLesson: Lesson | undefined;
    let courseId = '';
    
    // Search through all lessons to find the one with the matching ID
    Object.entries(lessons).forEach(([cId, courseLessons]) => {
      const lesson = courseLessons.find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        courseId = cId;
      }
    });
    
    // If we found the lesson
    if (foundLesson) {
      setCurrentLesson(foundLesson);
      
      // If we haven't loaded the course's lessons yet, load them
      if (!lessons[courseId] || lessons[courseId].length === 0) {
        loadLessons(courseId);
      }
    } else {
      // If we don't have the lesson data, try to load it
      setCurrentLesson(null);
      
      // Try to extract the course ID from the lesson ID (assuming format like "1-2")
      const extractedCourseId = lessonId.split('-')[0];
      if (extractedCourseId) {
        loadLessons(extractedCourseId);
      } else {
        // If we can't determine the course, navigate back
        navigate('/');
      }
    }
    
    return () => {
      setCurrentLesson(null);
    };
  }, [lessonId, lessons, loadLessons, navigate, setCurrentLesson]);
  
  if (!currentLesson) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading lesson...</h1>
          </div>
        </main>
      </div>
    );
  }
  
  // Get the course this lesson belongs to
  const course = courses.find(c => c.id === currentLesson.courseId);
  
  // Get all lessons for this course
  const courseLessons = lessons[currentLesson.courseId] || [];
  
  // Find current lesson index
  const currentIndex = courseLessons.findIndex(l => l.id === currentLesson.id);
  
  // Determine next and previous lessons
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
  
  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lessons/${nextLesson.id}`);
    } else {
      // If no next lesson, go back to course
      navigate(`/courses/${currentLesson.courseId}`);
    }
  };
  
  const handlePrevLesson = () => {
    if (prevLesson) {
      navigate(`/lessons/${prevLesson.id}`);
    }
  };
  
  const handleComplete = () => {
    // This is handled in the LessonContent component
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex relative">
        {/* Sidebar for lesson navigation - hidden on mobile unless toggled */}
        <div 
          className={cn(
            "bg-white border-r w-80 flex-shrink-0 fixed md:static inset-y-0 left-0 z-10 transform transition-transform duration-200 ease-in-out overflow-y-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
            <h2 className="font-bold truncate">{course?.title}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-2">
            {courseLessons.map((lesson) => (
              <LessonItem 
                key={lesson.id} 
                lesson={lesson}
                isActive={lesson.id === currentLesson.id}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile sidebar toggle */}
        <Button 
          variant="outline"
          size="icon"
          className="md:hidden fixed bottom-4 left-4 z-10 rounded-full shadow-md bg-white"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Main content */}
        <main className="flex-grow p-4 md:p-6 overflow-hidden">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/courses/${currentLesson.courseId}`)}
                >
                  ← Back to Course
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevLesson}
                  disabled={!prevLesson}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextLesson}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
            
            <LessonContent 
              lesson={currentLesson}
              onComplete={handleComplete}
              onNext={handleNextLesson}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
