
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import Header from '@/components/Header';
import LessonItem from '@/components/LessonItem';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import OfflineIndicator from '@/components/OfflineIndicator';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { 
    courses, 
    lessons, 
    loadLessons, 
    isLoading, 
    currentCourse,
    setCurrentCourse,
    setCurrentLesson,
    downloadCourse,
    isOnline
  } = useApp();
  
  const [isDownloading, setIsDownloading] = React.useState(false);
  
  useEffect(() => {
    if (!courseId) return;
    
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
      setCurrentCourse(course);
      loadLessons(courseId);
    } else {
      // Course not found
      navigate('/');
    }
    
    return () => {
      setCurrentCourse(null);
    };
  }, [courseId, courses, loadLessons, navigate, setCurrentCourse]);
  
  const handleStartLearning = () => {
    if (!courseId || !lessons[courseId] || lessons[courseId].length === 0) return;
    
    // Navigate to the first lesson
    navigate(`/lessons/${lessons[courseId][0].id}`);
  };
  
  const handleDownload = async () => {
    if (!courseId || !currentCourse) return;
    
    setIsDownloading(true);
    await downloadCourse(courseId);
    setIsDownloading(false);
  };
  
  if (!currentCourse) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading course...</h1>
          </div>
        </main>
      </div>
    );
  }
  
  const courseLessons = lessons[courseId || ''] || [];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <OfflineIndicator />
        
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            ← Back to Courses
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img 
                src={currentCourse.thumbnail} 
                alt={currentCourse.title} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <h1 className="text-xl font-bold mb-2">{currentCourse.title}</h1>
                <p className="text-muted-foreground mb-4">{currentCourse.description}</p>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleStartLearning}
                    disabled={isLoading || courseLessons.length === 0}
                  >
                    Start Learning
                  </Button>
                  
                  {!currentCourse.isDownloaded && (
                    <Button 
                      variant="outline" 
                      onClick={handleDownload}
                      disabled={isDownloading || !isOnline}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isDownloading ? 'Downloading...' : 'Download Course'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold mb-4">Course Content</h2>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="animate-pulse bg-gray-100 h-14 rounded-md"></div>
                  ))}
                </div>
              ) : (
                <>
                  {courseLessons.length === 0 ? (
                    <p className="text-muted-foreground">No lessons available for this course.</p>
                  ) : (
                    <div className="space-y-2">
                      {courseLessons.map((lesson) => (
                        <LessonItem 
                          key={lesson.id} 
                          lesson={lesson} 
                          isActive={false}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>LearnAnywhere - Learn even when you're offline</p>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetails;
