
import React from 'react';
import Header from '@/components/Header';
import CourseCard from '@/components/CourseCard';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useApp } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const { courses, isLoading } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <OfflineIndicator />
        
        <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-lg h-64"></div>
            ))}
          </div>
        ) : (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium">No courses available</h2>
                <p className="text-muted-foreground mt-2">Check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>LearnAnywhere - Learn even when you're offline</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
