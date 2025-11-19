import { IOSHeader } from './IOSHeader';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Reservation } from '../types/parking';
import { QrCode as QrCodeIcon, MapPin, Clock, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ReservationConfirmationScreenProps {
  onBack: () => void;
  reservation: Reservation;
}

export function ReservationConfirmationScreen({ onBack, reservation }: ReservationConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <IOSHeader title="Confirmation" onBack={onBack} showBack />

      <div className="p-4 space-y-4">
        {/* Success Message */}
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-11 h-11 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-[28px] tracking-tight mb-1">Reservation Confirmed</h2>
          <p className="text-[15px] text-gray-500">Your parking spot is reserved</p>
        </div>

        {/* Reservation Details */}
        <Card className="p-4 rounded-[14px] border-0 shadow-sm">
          <div className="space-y-3">
            <div>
              <p className="text-[13px] text-gray-500">Reservation ID</p>
              <p className="text-[17px]">{reservation.id.substring(0, 8).toUpperCase()}</p>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-gray-500">Spot Number</p>
                <p className="text-[24px]">{reservation.spotNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-gray-500">Location</p>
                <p className="text-[15px]">{reservation.location}</p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-2 text-[15px]">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Time:</span>
              <span>
                {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </Card>

        {/* QR Code */}
        <Card className="p-6 rounded-[14px] border-0 shadow-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCodeIcon className="w-5 h-5 text-blue-500" />
              <p className="text-[17px]">Entry QR Code</p>
            </div>
            <div className="bg-white p-4 rounded-[14px] inline-block">
              <QRCodeSVG value={reservation.entryQrCode} size={200} />
            </div>
            <p className="text-[13px] text-gray-500 mt-4">
              Scan this code at the parking entrance
            </p>
          </div>
        </Card>

        <Card className="p-4 rounded-[14px] border-0 shadow-sm bg-blue-50">
          <p className="text-[13px] text-blue-900">
            💡 You can view this QR code anytime from "Manage Reservation"
          </p>
        </Card>

        <Button
          onClick={onBack}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-[17px] rounded-[10px]"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
