
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, User, Car, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityDetails } from '@/types'; // Ensure ActivityDetails is imported

interface ActiveActivityViewProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'rider' | 'driver' | null;
  activeActivityDetails: ActivityDetails; // Use the imported type
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onArrivedAtPickup?: () => void;
  onStartRide?: () => void;
  onEndRide?: () => void;
  onCancelRide?: () => void;
  onContactDriver?: () => void;
  onGoOffline?: () => void;
}

const ActiveActivityView: React.FC<ActiveActivityViewProps> = ({
  isVisible,
  onClose,
  userRole,
  activeActivityDetails,
  onAcceptRequest,
  onRejectRequest,
  onArrivedAtPickup,
  onStartRide,
  onEndRide,
  onCancelRide,
  onContactDriver,
  onGoOffline,
}) => {
  if (!isVisible) {
    return null;
  }

  const InfoRow: React.FC<{ label: string; value?: string | null, icon?: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-start py-2">
      {Icon && <Icon className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />}
      <p className="text-sm font-medium text-muted-foreground w-28 shrink-0">{label}:</p>
      <p className="text-sm text-foreground flex-grow">{value || 'N/A'}</p>
    </div>
  );

  const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
      <h3 className="text-md font-semibold text-primary mt-3 mb-2 pb-1 border-b border-border">
        {title}
      </h3>
      {children}
    </div>
  );

  const renderRiderRideView = () => (
    <>
      <DetailSection title="Your Ride Details">
        <InfoRow label="Status" value={activeActivityDetails?.status} />
      </DetailSection>

      {activeActivityDetails?.driverName ? (
        <DetailSection title="Driver Information">
          <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <User className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
              <InfoRow label="Driver" value={activeActivityDetails.driverName} />
              <InfoRow label="Vehicle" value={activeActivityDetails.vehicle} />
            </div>
          </div>
        </DetailSection>
      ) : (
        <p className="text-sm text-muted-foreground py-2">Looking for a driver...</p>
      )}

      <DetailSection title="Location Details">
        <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
          <MapPin className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
          <div className="flex-1">
            <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
            <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
          </div>
        </div>
      </DetailSection>

      <div className="bg-muted h-40 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
        Map View Placeholder
      </div>

      {activeActivityDetails?.status !== 'completed' && activeActivityDetails?.status !== 'cancelled' && (
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-border">
          {activeActivityDetails?.driverName && onContactDriver && (
            <Button variant="outline" size="sm" onClick={onContactDriver}>
              Contact Driver
            </Button>
          )}
          {onCancelRide && (
             <Button variant="destructive" size="sm" onClick={onCancelRide}>
                Cancel Ride
             </Button>
          )}
          {activeActivityDetails?.status === 'on_the_way' && onEndRide && (
             <Button size="sm" onClick={onEndRide} className="bg-orange-500 hover:bg-orange-600 text-white">
                End Ride (Rider)
             </Button>
          )}
        </div>
      )}
       {activeActivityDetails?.status === 'completed' && (
          <p className="text-center text-green-600 font-semibold mt-4">Ride Completed!</p>
        )}
        {activeActivityDetails?.status === 'cancelled' && (
          <p className="text-center text-destructive font-semibold mt-4">Ride Cancelled.</p>
        )}
    </>
  );

  const renderDriverRequestView = () => (
    <>
      <DetailSection title="Incoming Ride Request!">
        <InfoRow label="From" value={activeActivityDetails?.riderName} icon={User} />
      </DetailSection>

      <DetailSection title="Trip Details">
         <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <MapPin className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
                <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
                <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
            </div>
        </div>
        <InfoRow label="Distance" value={activeActivityDetails?.distance} />
        <InfoRow label="Est. Fare" value={activeActivityDetails?.fare} />
        <InfoRow label="Vehicle Type" value={activeActivityDetails?.vehicleType} />
      </DetailSection>

      <div className="flex justify-around mt-6 pt-4 border-t border-border">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onAcceptRequest}
          disabled={!onAcceptRequest}
        >
          Accept
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onRejectRequest}
          disabled={!onRejectRequest}
        >
          Reject
        </Button>
      </div>
    </>
  );

  const renderDriverActiveRideView = () => (
     <>
      <DetailSection title="Active Ride">
        <InfoRow label="Status" value={activeActivityDetails?.status} />
         <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <User className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
                <InfoRow label="Rider" value={activeActivityDetails?.riderName} />
            </div>
        </div>
      </DetailSection>

      <DetailSection title="Location Details">
         <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <MapPin className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
                <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
                <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
            </div>
        </div>
      </DetailSection>


      <div className="bg-muted h-40 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
        Driver Map/Navigation Placeholder
      </div>

      {activeActivityDetails?.status !== 'completed' && activeActivityDetails?.status !== 'cancelled' && (
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-border">
          {activeActivityDetails?.status === 'en_route' && onArrivedAtPickup && (
            <Button size="sm" onClick={onArrivedAtPickup} className="w-full sm:w-auto">
              Arrived at Pickup
            </Button>
          )}
          {activeActivityDetails?.status === 'arrived' && onStartRide && (
            <Button size="sm" onClick={onStartRide} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">
              Start Ride
            </Button>
          )}
          {activeActivityDetails?.status === 'on_the_way' && onEndRide && (
            <Button size="sm" onClick={onEndRide} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
              End Ride
            </Button>
          )}
          {onCancelRide && (
            <Button variant="destructive" size="sm" onClick={onCancelRide} className="w-full sm:w-auto">
              Cancel Ride
            </Button>
          )}
        </div>
      )}
       {activeActivityDetails?.status === 'completed' && (
          <p className="text-center text-green-600 font-semibold mt-4">Ride Completed!</p>
        )}
      {activeActivityDetails?.status === 'cancelled' && (
          <p className="text-center text-destructive font-semibold mt-4">Ride Cancelled.</p>
        )}
    </>
  );
  
  const renderDriverStatusView = () => (
    <>
      <DetailSection title="Driver Status">
          <InfoRow label="Current Status" value={activeActivityDetails?.status || "Online"} icon={Car}/>
          <p className="text-sm text-muted-foreground mt-2">
              You are currently online and available for ride requests.
          </p>
      </DetailSection>
       <div className="bg-muted h-40 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
        Area Map Placeholder (Showing you are online)
      </div>
       <div className="mt-6 pt-4 border-t border-border">
         <Button 
          variant="destructive" 
          className="w-full"
          onClick={onGoOffline}
          disabled={!onGoOffline}
        >
          Go Offline
        </Button>
      </div>
    </>
  );


  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="active-activity-title">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 id="active-activity-title" className="text-lg font-semibold font-headline text-foreground">
            {userRole === 'driver' && activeActivityDetails?.type === 'request' ? "New Ride Request" :
             userRole === 'driver' && activeActivityDetails?.type === 'driver_status' ? "Your Driver Status" :
             "Active Activity"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close active activity view">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">
          {userRole === 'rider' && activeActivityDetails?.type === 'ride' && renderRiderRideView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'request' && renderDriverRequestView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'ride' && renderDriverActiveRideView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'driver_status' && renderDriverStatusView()}


          {!activeActivityDetails && (
            <p className="text-sm text-muted-foreground text-center py-10">No active activity details to display.</p>
          )}
           {(userRole === 'rider' && activeActivityDetails?.type !== 'ride') && 
             (userRole === 'driver' && activeActivityDetails?.type !== 'request' && activeActivityDetails?.type !== 'ride' && activeActivityDetails?.type !== 'driver_status') && (
            <p className="text-sm text-muted-foreground text-center py-10">Loading activity details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveActivityView;
