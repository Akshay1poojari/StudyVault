
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a listener for beforeinstallprompt event to handle PWA installation
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Optionally, show your own UI to notify the user that your app can be installed
  console.log('App can be installed, showing install prompt');
});

// Function to show the install prompt (can be called from a button click)
window.showInstallPrompt = () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      deferredPrompt = null;
    });
  }
};

createRoot(document.getElementById("root")!).render(<App />);
