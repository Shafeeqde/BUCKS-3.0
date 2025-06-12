
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, User, Car, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActiveActivityViewProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'rider' | 'driver' | null;
  activeActivityDetails: {
    type?: 'ride' | 'request';
    status?: string;
    pickup?: string;
    dropoff?: string;
    driverName?: string;
    riderName?: string;
    vehicle?: string;
    fare?: string;
  } | null;
}

const ActiveActivityView: React.FC<ActiveActivityViewProps> = ({
  isVisible,
  onClose,
  userRole,
  activeActivityDetails,
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

      {activeActivityDetails?.driverName && (
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" onClick={() => console.log('Contact Driver')}>
            Contact Driver
          </Button>
          <Button variant="destructive" size="sm" onClick={() => console.log('Cancel Ride')}>
            Cancel Ride
          </Button>
        </div>
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
        <InfoRow label="Est. Fare" value={activeActivityDetails?.fare} />
      </DetailSection>

      <div className="flex justify-around mt-6 pt-4 border-t border-border">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => console.log('Accept Request')}
        >
          Accept
        </Button>
        <Button variant="destructive" size="sm" onClick={() => console.log('Reject Request')}>
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

      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-border">
        {activeActivityDetails?.status === 'en_route' && (
          <Button size="sm" onClick={() => console.log('Arrived at Pickup')}>
            Arrived at Pickup
          </Button>
        )}
        {activeActivityDetails?.status === 'arrived' && (
          <Button size="sm" onClick={() => console.log('Start Ride')}>
            Start Ride
          </Button>
        )}
        {activeActivityDetails?.status === 'on_the_way' && (
          <Button size="sm" onClick={() => console.log('End Ride')}>
            End Ride
          </Button>
        )}
      </div>
    </>
  );


  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="active-activity-title">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 id="active-activity-title" className="text-lg font-semibold font-headline text-foreground">
            Active Activity
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close active activity view">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">
          {userRole === 'rider' && activeActivityDetails?.type === 'ride' && renderRiderRideView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'request' && renderDriverRequestView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'ride' && renderDriverActiveRideView()}

          {!activeActivityDetails && (
            <p className="text-sm text-muted-foreground text-center py-10">No active activity details to display.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveActivityView;
