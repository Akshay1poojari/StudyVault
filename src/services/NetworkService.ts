
type NetworkStatusListener = (online: boolean) => void;

class NetworkService {
  private listeners: NetworkStatusListener[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Initialize and add event listeners for online/offline status
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  private handleNetworkChange = () => {
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;
    
    if (wasOnline !== this.isOnline) {
      // Only notify listeners if the status actually changed
      this.notifyListeners();
    }
  };

  private notifyListeners = () => {
    this.listeners.forEach(listener => {
      listener(this.isOnline);
    });
  };

  public addStatusListener(listener: NetworkStatusListener): () => void {
    this.listeners.push(listener);
    
    // Immediately notify the new listener of the current status
    listener(this.isOnline);
    
    // Return a function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Attempts to make a network request to test true connectivity
  public async testConnection(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    }

    try {
      // Try to fetch a small resource
      const response = await fetch('/ping.txt', {
        method: 'HEAD',
        // Add cache busting query parameter
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      return response.ok;
    } catch (error) {
      console.log('Connection test failed', error);
      return false;
    }
  }
}

export default new NetworkService();
