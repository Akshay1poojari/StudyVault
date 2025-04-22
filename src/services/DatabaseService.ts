
class DatabaseService {
  private dbName = 'LearningApp';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async openDatabase(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = request.result;

        // Create our object stores if they don't exist
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('lessons')) {
          db.createObjectStore('lessons', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'lessonId' });
        }

        if (!db.objectStoreNames.contains('outbox')) {
          db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async getCourses(): Promise<Course[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('courses', 'readonly');
      const store = transaction.objectStore('courses');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting courses');
        reject(request.error);
      };
    });
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('courses', 'readonly');
      const store = transaction.objectStore('courses');
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting course');
        reject(request.error);
      };
    });
  }

  async saveCourse(course: Course): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('courses', 'readwrite');
      const store = transaction.objectStore('courses');
      const request = store.put(course);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving course');
        reject(request.error);
      };
    });
  }

  async getLessons(courseId: string): Promise<Lesson[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('lessons', 'readonly');
      const store = transaction.objectStore('lessons');
      
      // Since we don't have an index on courseId, we'll get all lessons
      // and filter by courseId in memory
      const request = store.getAll();

      request.onsuccess = () => {
        const lessons = request.result.filter(
          (lesson) => lesson.courseId === courseId
        );
        resolve(lessons);
      };

      request.onerror = () => {
        console.error('Error getting lessons');
        reject(request.error);
      };
    });
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('lessons', 'readonly');
      const store = transaction.objectStore('lessons');
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting lesson');
        reject(request.error);
      };
    });
  }

  async saveLesson(lesson: Lesson): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('lessons', 'readwrite');
      const store = transaction.objectStore('lessons');
      const request = store.put(lesson);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving lesson');
        reject(request.error);
      };
    });
  }

  async getProgress(lessonId: string): Promise<Progress | undefined> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('progress', 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get(lessonId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Error getting progress');
        reject(request.error);
      };
    });
  }

  async saveProgress(progress: Progress): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('progress', 'readwrite');
      const store = transaction.objectStore('progress');
      const request = store.put(progress);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving progress');
        reject(request.error);
      };
    });
  }

  async addToOutbox(data: any): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('outbox', 'readwrite');
      const store = transaction.objectStore('outbox');
      const request = store.add(data);

      request.onsuccess = () => {
        // Try to trigger a sync if possible
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(registration => {
            registration.sync.register('sync-progress')
              .catch(err => console.error('Sync registration failed:', err));
          });
        }
        resolve();
      };

      request.onerror = () => {
        console.error('Error adding to outbox');
        reject(request.error);
      };
    });
  }
}

export default new DatabaseService();

// Type definitions
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessonsCount: number;
  isDownloaded: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  isDownloaded: boolean;
}

export interface Progress {
  lessonId: string;
  courseId: string;
  completed: boolean;
  lastPosition: number;
  timestamp: number;
}
