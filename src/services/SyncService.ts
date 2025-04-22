import DatabaseService from './DatabaseService';
import NetworkService from './NetworkService';
import { toast } from '@/components/ui/sonner';

class SyncService {
  private syncInProgress = false;

  // Initialize the sync mechanism
  async initialize() {
    // Listen for online status changes
    NetworkService.addStatusListener(this.handleNetworkStatusChange);
    
    // Initial check in case we're already online
    if (NetworkService.getOnlineStatus()) {
      this.syncData();
    }
  }

  private handleNetworkStatusChange = (online: boolean) => {
    if (online) {
      toast.info("You're back online! Syncing data...");
      this.syncData();
    } else {
      toast.warning("You're offline. Changes will be saved locally.");
    }
  };

  // Main sync function
  async syncData() {
    if (this.syncInProgress || !NetworkService.getOnlineStatus()) {
      return;
    }

    try {
      this.syncInProgress = true;
      
      // In a real app, you would fetch new course data from the server
      // and sync local changes back to the server
      
      // For this demo, we'll just simulate a success
      console.log('Syncing data with server...');
      
      // Simulating some network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sync completed successfully');
      toast.success('Data synchronized successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Will retry when connection improves.');
    } finally {
      this.syncInProgress = false;
    }
  }

  // This would be called when user manually triggers a sync
  async manualSync() {
    // First, test if we actually have a connection
    const isConnected = await NetworkService.testConnection();
    
    if (!isConnected) {
      toast.error("Can't sync - you're offline");
      return;
    }
    
    return this.syncData();
  }

  // This would be called when saving progress locally
  async saveProgressWithSync(lessonId: string, courseId: string, completed: boolean, position: number) {
    // First save locally
    const progress = {
      lessonId,
      courseId,
      completed,
      lastPosition: position,
      timestamp: Date.now()
    };
    
    await DatabaseService.saveProgress(progress);
    
    // If online, try to sync immediately
    if (NetworkService.getOnlineStatus()) {
      // In a real app, you would send this to your API
      console.log('Saving progress to server:', progress);
    } else {
      // Otherwise, add to outbox for later sync
      await DatabaseService.addToOutbox({
        type: 'progress',
        data: progress
      });
    }
  }

  // Download a course and its lessons for offline use
  async downloadCourse(courseId: string) {
    try {
      // In a real app, you would fetch the course and all its lessons from the API
      // and then save them locally
      
      // For this demo, we'll pretend we have the course and update its downloaded status
      const course = await DatabaseService.getCourse(courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      toast.info(`Downloading course: ${course.title}...`);
      
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark course as downloaded
      await DatabaseService.saveCourse({
        ...course,
        isDownloaded: true
      });
      
      // Get the lessons and mark them as downloaded
      const lessons = await DatabaseService.getLessons(courseId);
      
      for (const lesson of lessons) {
        await DatabaseService.saveLesson({
          ...lesson,
          isDownloaded: true
        });
      }
      
      toast.success(`Course downloaded successfully!`);
      return true;
    } catch (error) {
      console.error('Error downloading course:', error);
      toast.error('Failed to download course. Please try again.');
      return false;
    }
  }
}

export default new SyncService();
