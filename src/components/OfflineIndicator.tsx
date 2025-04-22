
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useApp();
  
  if (isOnline) {
    return null;
  }
  
  return (
    <Alert variant="warning" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>You're offline</AlertTitle>
      <AlertDescription>
        You can access your downloaded courses, but new content isn't available until you reconnect.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineIndicator;
