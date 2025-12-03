export type UserType = 'student' | 'gp_student' | 'staff';

export interface User {
  id: string;
  fullName: string;
  universityId: string;
  phoneNumber: string;
  userType: UserType;
  freeHours: number; // 2 for student, 3 for gp_student, 8 for staff
  classSchedule?: ClassSchedule[]; // For students only
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ParkingSpot {
  id: string;
  spotNumber: string;
  location: string;
  status: 'available' | 'on_hold' | 'reserved';
  holdUntil?: Date;
  holdByUserId?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  spotId: string;
  spotNumber: string;
  location: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'started' | 'completed' | 'cancelled';
  entryQrCode: string;
  exitQrCode: string;
  actualEntryTime?: Date;
  actualExitTime?: Date;
  totalDuration?: number; // in minutes
  freeHoursUsed?: number;
  extraHours?: number;
  extraFee?: number;
  isRecurring?: boolean;
  recurringDays?: string[];
}

export interface MonthlyRecurringPlan {
  id: string;
  userId: string;
  days: string[];
  startTime: string;
  endTime: string;
  isActive: boolean;
}
