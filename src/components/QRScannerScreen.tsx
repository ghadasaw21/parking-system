import { useState } from 'react';
import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { QrCode, CheckCircle } from 'lucide-react';

interface QRScannerScreenProps {
  onBack: () => void;
  onScanned: (code: string) => void;
  type: 'entry' | 'exit';
}

export function QRScannerScreen({ onBack, onScanned, type }: QRScannerScreenProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Mock QR scan
  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      const mockCode = `${type}-${Date.now()}`;
      setTimeout(() => {
        onScanned(mockCode);
      }, 1500);
    }, 2000);
  };

  if (scanned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-[28px] tracking-tight mb-2">
            {type === 'entry' ? 'Entry Successful' : 'Exit Scanned'}
          </h2>
          <p className="text-[15px] text-gray-500">
            {type === 'entry' 
              ? 'Your parking session has begun' 
              : 'Calculating your charges...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader 
        title={type === 'entry' ? 'Scan Entry QR' : 'Scan Exit QR'} 
        onBack={onBack} 
        showBack 
      />

      <div className="p-4">
        <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-blue-50 mb-4">
          <p className="text-[15px] text-blue-900">
            {type === 'entry'
              ? 'Scan the QR code at the parking entrance to start your session'
              : 'Scan the QR code at the parking exit to end your session'}
          </p>
        </Card>

        {/* Mock QR Scanner View */}
        <div className="relative aspect-square rounded-[14px] overflow-hidden bg-black mb-4">
          {scanning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-blue-500 animate-pulse" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white rounded-[14px]" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <QrCode className="w-24 h-24 text-white/50" />
          </div>
        </div>

        <Button
          onClick={handleScan}
          disabled={scanning}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
        >
          {scanning ? 'Scanning...' : 'Tap to Scan QR Code'}
        </Button>

        <p className="text-center text-[13px] text-gray-500 mt-4">
          Position the QR code within the frame
        </p>
      </div>
    </div>
  );
}
