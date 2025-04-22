
import React, { createContext, useContext, useEffect, useState } from 'react';
import DatabaseService, { Course, Lesson, Progress } from '@/services/DatabaseService';
import SyncService from '@/services/SyncService';
import NetworkService from '@/services/NetworkService';
import { toast } from '@/components/ui/sonner';

// Add mock data for demo
import { mockCourses, mockLessons } from '@/data/mockData';

interface AppContextType {
  courses: Course[];
  lessons: Record<string, Lesson[]>;
  progress: Record<string, Progress>;
  isOnline: boolean;
  isLoading: boolean;
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  
  // Actions
  loadCourses: () => Promise<void>;
  loadLessons: (courseId: string) => Promise<void>;
  downloadCourse: (courseId: string) => Promise<boolean>;
  saveProgress: (lessonId: string, courseId: string, completed: boolean, position: number) => Promise<void>;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        // Load courses from database
        let dbCourses = await DatabaseService.getCourses();
        
        // If there are no courses in the database, seed with mock data
        if (dbCourses.length === 0) {
          for (const course of mockCourses) {
            await DatabaseService.saveCourse(course);
          }
          
          for (const lesson of mockLessons) {
            await DatabaseService.saveLesson(lesson);
          }
          
          // Load the courses again
          dbCourses = await DatabaseService.getCourses();
        }
        
        setCourses(dbCourses);
        
        // Initialize sync service
        await SyncService.initialize();
        
        // Listen for network status changes
        const unsubscribe = NetworkService.addStatusListener((online) => {
          setIsOnline(online);
        });
        
        setIsLoading(false);
        
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
        toast.error('Error loading courses. Please refresh the page.');
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const dbCourses = await DatabaseService.getCourses();
      setCourses(dbCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Error loading courses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLessons = async (courseId: string) => {
    try {
      // If we already have the lessons for this course, don't reload
      if (lessons[courseId]) {
        return;
      }
      
      setIsLoading(true);
      const courseLessons = await DatabaseService.getLessons(courseId);
      
      // Sort lessons by order
      courseLessons.sort((a, b) => a.order - b.order);
      
      // Update the lessons state
      setLessons(prev => ({
        ...prev,
        [courseId]: courseLessons
      }));
      
      // Load progress for each lesson
      const lessonProgress: Record<string, Progress> = {};
      
      for (const lesson of courseLessons) {
        const progress = await DatabaseService.getProgress(lesson.id);
        if (progress) {
          lessonProgress[lesson.id] = progress;
        }
      }
      
      // Update progress state
      setProgress(prev => ({
        ...prev,
        ...lessonProgress
      }));
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast.error('Error loading lessons');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCourse = async (courseId: string) => {
    return SyncService.downloadCourse(courseId);
  };

  const saveProgress = async (lessonId: string, courseId: string, completed: boolean, position: number) => {
    try {
      await SyncService.saveProgressWithSync(lessonId, courseId, completed, position);
      
      // Update local state
      const newProgress: Progress = {
        lessonId,
        courseId,
        completed,
        lastPosition: position,
        timestamp: Date.now()
      };
      
      setProgress(prev => ({
        ...prev,
        [lessonId]: newProgress
      }));
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Error saving progress');
    }
  };

  const syncData = async () => {
    return SyncService.manualSync();
  };

  const value = {
    courses,
    lessons,
    progress,
    isOnline,
    isLoading,
    currentCourse,
    currentLesson,
    
    loadCourses,
    loadLessons,
    downloadCourse,
    saveProgress,
    setCurrentCourse,
    setCurrentLesson,
    syncData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
