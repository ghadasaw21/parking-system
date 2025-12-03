import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { BookParkingScreen } from './components/BookParkingScreen';
import { AvailableSpotsScreen } from './components/AvailableSpotsScreen';
import { ReservationConfirmationScreen } from './components/ReservationConfirmationScreen';
import { ManageReservationScreen } from './components/ManageReservationScreen';
import { ExitPaymentScreen } from './components/ExitPaymentScreen';
import { ViewReservationsScreen } from './components/ViewReservationsScreen';
import { User, Reservation, ParkingSpot } from './types/parking';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

type Screen =
  | 'login'
  | 'createAccount'
  | 'home'
  | 'profile'
  | 'book'
  | 'availableSpots'
  | 'confirmation'
  | 'manage'
  | 'exitPayment'
  | 'viewReservations';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookingTimes, setBookingTimes] = useState<{ start: string; end: string } | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const activeReservation = reservations.find(r => r.status === 'pending' || r.status === 'started') || null;

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentScreen('home');
    toast.success(`Welcome, ${loggedInUser.fullName}!`);
  };

  const handleCreateAccount = () => {
    setCurrentScreen('createAccount');
  };

  const handleAccountCreated = (verifiedUser: User) => {
    setUser(verifiedUser);
    setCurrentScreen('home');
    toast.success('Account created successfully!');
  };

  const handleLogout = () => {
    setUser(null);
    setReservations([]);
    setCurrentScreen('login');
    toast.success('Logged out successfully');
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'book') {
      // Check if user already has an active reservation
      if (activeReservation) {
        toast.error('Active Reservation Exists', {
          description: 'You already have an active reservation. Please complete or cancel it before making a new booking.',
          duration: 5000,
        });
        return;
      }
      setCurrentScreen('book');
    } else if (screen === 'manage') {
      setCurrentScreen('manage');
    } else if (screen === 'viewReservations') {
      setCurrentScreen('viewReservations');
    } else if (screen === 'profile') {
      setCurrentScreen('profile');
    }
  };

  const handleShowAvailableSpots = (startTime: string, endTime: string) => {
    setBookingTimes({ start: startTime, end: endTime });
    setCurrentScreen('availableSpots');
  };

  const handleConfirmSpot = (spot: ParkingSpot) => {
    if (!user || !bookingTimes) return;

    const today = new Date();
    const [startHour, startMinute] = bookingTimes.start.split(':');
    const [endHour, endMinute] = bookingTimes.end.split(':');

    const startTime = new Date(today);
    startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

    const endTime = new Date(today);
    endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

    const newReservation: Reservation = {
      id: crypto.randomUUID(),
      userId: user.id,
      spotId: spot.id,
      spotNumber: spot.spotNumber,
      location: spot.location,
      startTime,
      endTime,
      status: 'pending',
      entryQrCode: `ENTRY-${Date.now()}`,
      exitQrCode: `EXIT-${Date.now()}`,
    };

    setReservations(prev => [...prev, newReservation]);
    setCurrentReservation(newReservation);
    setSelectedSpot(null);
    setBookingTimes(null);
    setCurrentScreen('confirmation');
  };

  const handleEntryScanned = (code: string) => {
    if (activeReservation) {
      setReservations(prev =>
        prev.map(r =>
          r.id === activeReservation.id
            ? { ...r, status: 'started', actualEntryTime: new Date() }
            : r
        )
      );
      toast.success('Entry successful. Your session has begun.');
      setTimeout(() => {
        setCurrentScreen('home');
      }, 2000);
    }
  };

  const handleExitScanned = (code: string) => {
    if (activeReservation && activeReservation.status === 'started') {
      const entryTime = activeReservation.actualEntryTime || activeReservation.startTime;
      const exitTime = new Date();
      const duration = Math.floor((exitTime.getTime() - entryTime.getTime()) / 1000 / 60);
      
      setCurrentReservation({
        ...activeReservation,
        actualExitTime: exitTime,
        totalDuration: duration,
      });
      
      setCurrentScreen('exitPayment');
    } else {
      toast.error('No active parking session found');
      setCurrentScreen('home');
    }
  };

  const handlePaymentComplete = () => {
    if (currentReservation && user) {
      const totalHours = Math.ceil((currentReservation.totalDuration || 0) / 60);
      const extraHours = Math.max(0, totalHours - user.freeHours);
      const extraFee = extraHours * 10;

      setReservations(prev =>
        prev.map(r =>
          r.id === currentReservation.id
            ? {
                ...r,
                status: 'completed',
                actualExitTime: new Date(),
                totalDuration: currentReservation.totalDuration,
                freeHoursUsed: Math.min(totalHours, user.freeHours),
                extraHours,
                extraFee,
              }
            : r
        )
      );

      setCurrentReservation(null);
      setCurrentScreen('home');
      toast.success('Exit completed successfully!');
    }
  };

  const handleCancelReservation = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (activeReservation) {
      setReservations(prev =>
        prev.map(r =>
          r.id === activeReservation.id
            ? { ...r, status: 'cancelled' }
            : r
        )
      );
      toast.success('Reservation cancelled');
      setCancelDialogOpen(false);
      setCurrentScreen('home');
    }
  };

  const handleUpdateReservation = (startTime: Date, endTime: Date) => {
    if (activeReservation) {
      setReservations(prev =>
        prev.map(r =>
          r.id === activeReservation.id
            ? { ...r, startTime, endTime }
            : r
        )
      );
      toast.success('Reservation updated successfully');
    }
  };

  return (
    <>
      <div className="max-w-[430px] mx-auto bg-white min-h-screen shadow-2xl">
        {currentScreen === 'login' && (
          <LoginScreen onLogin={handleLogin} onCreateAccount={handleCreateAccount} />
        )}

        {currentScreen === 'createAccount' && (
          <CreateAccountScreen
            onBack={() => setCurrentScreen('login')}
            onVerify={handleAccountCreated}
          />
        )}

        {currentScreen === 'home' && user && (
          <HomeDashboard
            user={user}
            activeReservation={activeReservation}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'profile' && user && (
          <ProfileScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'book' && user && (
          <BookParkingScreen
            user={user}
            onBack={() => setCurrentScreen('home')}
            onShowAvailableSpots={handleShowAvailableSpots}
          />
        )}

        {currentScreen === 'availableSpots' && bookingTimes && (
          <AvailableSpotsScreen
            onBack={() => setCurrentScreen('book')}
            onConfirm={handleConfirmSpot}
            startTime={bookingTimes.start}
            endTime={bookingTimes.end}
          />
        )}

        {currentScreen === 'confirmation' && currentReservation && (
          <ReservationConfirmationScreen
            onBack={() => setCurrentScreen('home')}
            reservation={currentReservation}
          />
        )}

        {currentScreen === 'manage' && (
          <ManageReservationScreen
            onBack={() => setCurrentScreen('home')}
            reservation={activeReservation}
            onCancel={handleCancelReservation}
            onSimulateEntry={() => handleEntryScanned('mock')}
            onSimulateExit={() => handleExitScanned('mock')}
            onUpdateReservation={handleUpdateReservation}
          />
        )}

        {currentScreen === 'exitPayment' && currentReservation && user && (
          <ExitPaymentScreen
            onBack={() => setCurrentScreen('home')}
            onPaymentComplete={handlePaymentComplete}
            reservation={currentReservation}
            totalDuration={currentReservation.totalDuration || 0}
            freeHours={user.freeHours}
          />
        )}

        {currentScreen === 'viewReservations' && (
          <ViewReservationsScreen
            onBack={() => setCurrentScreen('home')}
            reservations={reservations}
          />
        )}
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="max-w-sm rounded-[20px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[20px]">Cancel Reservation?</AlertDialogTitle>
            <AlertDialogDescription className="text-[15px]">
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[10px]">Keep It</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-red-500 hover:bg-red-600 rounded-[10px]"
            >
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </>
  );
}

export default App;
