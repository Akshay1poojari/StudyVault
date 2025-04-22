
import React from 'react';
import { Button } from "@/components/ui/button";
import { useApp } from '@/contexts/AppContext';
import { Wifi, WifiOff } from 'lucide-react';

const Header: React.FC = () => {
  const { isOnline, syncData } = useApp();

  const handleSyncClick = async () => {
    await syncData();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-sky-600">LearnAnywhere</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center mr-2">
            {isOnline ? (
              <div className="flex items-center text-green-600 text-sm">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-orange-500 text-sm">
                <WifiOff className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncClick}
            disabled={!isOnline}
          >
            Sync
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
