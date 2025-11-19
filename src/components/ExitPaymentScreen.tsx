import { useState } from 'react';
import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Reservation } from '../types/parking';
import { Clock, DollarSign, CheckCircle, CreditCard } from 'lucide-react';

interface ExitPaymentScreenProps {
  onBack: () => void;
  onPaymentComplete: () => void;
  reservation: Reservation;
  totalDuration: number;
  freeHours: number;
}

export function ExitPaymentScreen({ 
  onBack, 
  onPaymentComplete, 
  reservation, 
  totalDuration,
  freeHours 
}: ExitPaymentScreenProps) {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalHours = Math.ceil(totalDuration / 60);
  const freeHoursUsed = Math.min(totalHours, freeHours);
  const extraHours = Math.max(0, totalHours - freeHours);
  const extraFee = extraHours * 10; // 10 SAR per hour

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-[28px] tracking-tight mb-2">Payment Complete</h2>
          <p className="text-[15px] text-gray-500">Thank you for using our parking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader title="Exit & Payment" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        {/* Duration Summary */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <h3 className="text-[17px] mb-4">Parking Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Spot Number</span>
              <span>{reservation.spotNumber}</span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Location</span>
              <span>{reservation.location}</span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Entry Time</span>
              <span>
                {reservation.actualEntryTime 
                  ? new Date(reservation.actualEntryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Exit Time</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-[15px]">Total Duration</span>
              </div>
              <span className="text-[20px]">{totalHours} hours</span>
            </div>
          </div>
        </Card>

        {/* Fee Breakdown */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h3 className="text-[17px]">Fee Breakdown</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Free Hours Used</span>
              <span className="text-green-600">{freeHoursUsed}h (0 SAR)</span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Extra Hours</span>
              <span>{extraHours}h</span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-600">Rate</span>
              <span>10 SAR/hour</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-[17px]">Extra Fee</span>
              <span className="text-[24px] text-blue-500">{extraFee} SAR</span>
            </div>
          </div>
        </Card>

        {extraFee === 0 ? (
          <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-green-50">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-[17px] text-green-900">No Extra Charges</p>
              <p className="text-[13px] text-green-700 mt-1">
                You parked within your free hours
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* Payment Method */}
            <Card className="p-4 rounded-[14px] border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-[10px] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[17px]">Credit Card</p>
                  <p className="text-[13px] text-gray-500">**** **** **** 1234</p>
                </div>
              </div>
            </Card>

            {/* Pay Button */}
            <Button
              onClick={handlePay}
              disabled={processing}
              className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
            >
              {processing ? 'Processing...' : `Pay ${extraFee} SAR`}
            </Button>
          </>
        )}

        {extraFee === 0 && (
          <Button
            onClick={onPaymentComplete}
            className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
          >
            Complete Exit
          </Button>
        )}
      </div>
    </div>
  );
}
