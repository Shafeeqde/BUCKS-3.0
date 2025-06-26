
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { XMarkIcon, UserIcon, TruckIcon, MapPinIcon, CubeIcon, CurrencyDollarIcon, PhoneIcon, ShoppingBagIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'; 
import { cn } from '@/lib/utils';
import type { ActivityDetails, ActivityStatus, ActivityType } from '@/types'; 

interface ActiveActivityViewProps {
  isVisible: boolean;
  onClose: () => void;
  userRole: 'rider' | 'driver' | 'business_owner' | null;
  activeActivityDetails: ActivityDetails; 
  // Ride actions
  onAcceptRequest?: () => void;
  onRejectRequest?: () => void;
  onArrivedAtPickup?: () => void;
  onStartRide?: () => void;
  onEndRide?: () => void;
  onCancelRide?: () => void;
  onContactDriver?: () => void;
  onGoOffline?: () => void;
  // Delivery actions
  onAcceptDelivery?: () => void;
  onRejectDelivery?: () => void;
  onArrivedAtDeliveryPickup?: () => void;
  onItemPickedUp?: () => void;
  onArrivedAtDeliveryDropoff?: () => void;
  onCompleteDelivery?: () => void;
  // Product Order actions
  onAcceptProductOrder?: () => void;
  onRejectProductOrder?: () => void;
  // onProcessOrder?: () => void; // Future: Mark as processing, ready, etc.
}

const ActiveActivityView: React.FC<ActiveActivityViewProps> = ({
  isVisible,
  onClose,
  userRole,
  activeActivityDetails,
  // Ride props
  onAcceptRequest,
  onRejectRequest,
  onArrivedAtPickup,
  onStartRide,
  onEndRide,
  onCancelRide,
  onContactDriver,
  onGoOffline,
  // Delivery props
  onAcceptDelivery,
  onRejectDelivery,
  onArrivedAtDeliveryPickup,
  onItemPickedUp,
  onArrivedAtDeliveryDropoff,
  onCompleteDelivery,
  // Product Order props
  onAcceptProductOrder,
  onRejectProductOrder,
}) => {
  if (!isVisible) {
    return null;
  }

  const InfoRow: React.FC<{ label: string; value?: string | null | number, icon?: React.ElementType }> = ({ label, value, icon: Icon }) => (
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
            <UserIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
              <InfoRow label="Driver" value={activeActivityDetails.driverName} />
              <InfoRow label="Vehicle" value={activeActivityDetails.vehicleInfo} />
            </div>
          </div>
        </DetailSection>
      ) : (
        <p className="text-sm text-muted-foreground py-2">Looking for a driver...</p>
      )}

      <DetailSection title="Location Details">
        <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
          <MapPinIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
          <div className="flex-1">
            <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
            <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
          </div>
        </div>
      </DetailSection>

      <div className="bg-muted h-40 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
        Map View Placeholder
      </div>

      {activeActivityDetails?.status !== 'ride_completed' && activeActivityDetails?.status !== 'ride_cancelled' && (
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
          {activeActivityDetails?.status === 'ride_in_progress' && onEndRide && (
             <Button size="sm" onClick={onEndRide} className="bg-orange-500 hover:bg-orange-600 text-white">
                End Ride (Rider)
             </Button>
          )}
        </div>
      )}
       {activeActivityDetails?.status === 'ride_completed' && (
          <p className="text-center text-green-600 font-semibold mt-4">Ride Completed!</p>
        )}
        {activeActivityDetails?.status === 'ride_cancelled' && (
          <p className="text-center text-destructive font-semibold mt-4">Ride Cancelled.</p>
        )}
    </>
  );

  const renderDriverRequestView = (type: 'request' | 'delivery_request') => {
    const isDelivery = type === 'delivery_request';
    return (
        <>
        <DetailSection title={isDelivery ? "Incoming Delivery Request!" : "Incoming Ride Request!"}>
            {isDelivery ? (
                <>
                    <InfoRow label="Item" value={activeActivityDetails?.itemName} icon={CubeIcon} />
                    <InfoRow label="Description" value={activeActivityDetails?.itemDescription} />
                    <InfoRow label="Est. Payment" value={activeActivityDetails?.estimatedPayment} icon={CurrencyDollarIcon}/>
                </>
            ) : (
                <InfoRow label="From" value={activeActivityDetails?.riderName} icon={UserIcon} />
            )}
        </DetailSection>

        <DetailSection title="Location Details">
            <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
                <MapPinIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
                    <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
                </div>
            </div>
            {!isDelivery && activeActivityDetails?.distance && <InfoRow label="Distance" value={activeActivityDetails.distance} />}
            {!isDelivery && activeActivityDetails?.fare && <InfoRow label="Est. Fare" value={activeActivityDetails.fare} />}
            {!isDelivery && activeActivityDetails?.vehicleType && <InfoRow label="Vehicle Type" value={activeActivityDetails.vehicleType} />}
        </DetailSection>

        <div className="flex justify-around mt-6 pt-4 border-t border-border">
            <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={isDelivery ? onAcceptDelivery : onAcceptRequest}
            disabled={isDelivery ? !onAcceptDelivery : !onAcceptRequest}
            >
            Accept {isDelivery ? 'Delivery' : 'Ride'}
            </Button>
            <Button 
            variant="destructive" 
            size="sm" 
            onClick={isDelivery ? onRejectDelivery : onRejectRequest}
            disabled={isDelivery ? !onRejectDelivery : !onRejectRequest}
            >
            Reject
            </Button>
        </div>
        </>
    );
  };
  
  const renderDriverActiveRideView = () => (
     <>
      <DetailSection title="Active Ride">
        <InfoRow label="Status" value={activeActivityDetails?.status} />
         <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <UserIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
                <InfoRow label="Rider" value={activeActivityDetails?.riderName} />
            </div>
        </div>
      </DetailSection>

      <DetailSection title="Location Details">
         <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
            <MapPinIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
            <div className="flex-1">
                <InfoRow label="Pickup" value={activeActivityDetails?.pickup} />
                <InfoRow label="Drop-off" value={activeActivityDetails?.dropoff} />
            </div>
        </div>
      </DetailSection>


      <div className="bg-muted h-40 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
        Driver Map/Navigation Placeholder
      </div>

      {activeActivityDetails?.status !== 'ride_completed' && activeActivityDetails?.status !== 'ride_cancelled' && (
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-border">
          {activeActivityDetails?.status === 'en_route_to_pickup' && onArrivedAtPickup && (
            <Button size="sm" onClick={onArrivedAtPickup} className="w-full sm:w-auto">
              Arrived at Pickup
            </Button>
          )}
          {activeActivityDetails?.status === 'arrived_at_pickup' && onStartRide && (
            <Button size="sm" onClick={onStartRide} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">
              Start Ride
            </Button>
          )}
          {activeActivityDetails?.status === 'ride_in_progress' && onEndRide && (
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
       {activeActivityDetails?.status === 'ride_completed' && (
          <p className="text-center text-green-600 font-semibold mt-4">Ride Completed!</p>
        )}
      {activeActivityDetails?.status === 'ride_cancelled' && (
          <p className="text-center text-destructive font-semibold mt-4">Ride Cancelled.</p>
        )}
    </>
  );

  const renderDriverActiveDeliveryView = () => (
    <>
        <DetailSection title="Active Delivery Task">
            <InfoRow label="Status" value={activeActivityDetails?.status} icon={TruckIcon} />
            <InfoRow label="Item" value={activeActivityDetails?.itemName} icon={CubeIcon} />
            <InfoRow label="Payment" value={activeActivityDetails?.estimatedPayment} icon={CurrencyDollarIcon} />
        </DetailSection>
        <DetailSection title="Locations">
            <div className="flex items-start p-3 border border-border rounded-md bg-muted/20 my-2">
                <MapPinIcon className="h-6 w-6 text-primary mr-3 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <InfoRow label="Pickup From" value={activeActivityDetails?.pickup} />
                    <InfoRow label="Deliver To" value={activeActivityDetails?.dropoff} />
                </div>
            </div>
        </DetailSection>
        {activeActivityDetails?.recipientName && (
             <InfoRow label="Recipient" value={activeActivityDetails.recipientName} icon={UserIcon} />
        )}
        {activeActivityDetails?.recipientPhone && (
             <InfoRow label="Contact Recipient" value={activeActivityDetails.recipientPhone} icon={PhoneIcon} />
        )}


        <div className="bg-muted h-32 flex justify-center items-center my-3 rounded-md text-muted-foreground text-xs">
            Delivery Map/Navigation Placeholder
        </div>

        {activeActivityDetails?.status !== 'delivery_completed' && activeActivityDetails?.status !== 'delivery_cancelled' && (
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 pt-4 border-t border-border">
                {activeActivityDetails?.status === 'delivery_accepted_en_route_pickup' && onArrivedAtDeliveryPickup && (
                    <Button size="sm" onClick={onArrivedAtDeliveryPickup} className="w-full sm:w-auto">Arrived at Pickup</Button>
                )}
                {activeActivityDetails?.status === 'delivery_arrived_at_pickup' && onItemPickedUp && (
                    <Button size="sm" onClick={onItemPickedUp} className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">Item Picked Up</Button>
                )}
                 {activeActivityDetails?.status === 'delivery_picked_up_en_route_dropoff' && onArrivedAtDeliveryDropoff && (
                    <Button size="sm" onClick={onArrivedAtDeliveryDropoff} className="w-full sm:w-auto">Arrived at Drop-off</Button>
                )}
                {(activeActivityDetails?.status === 'delivery_picked_up_en_route_dropoff' || activeActivityDetails?.status === 'delivery_arrived_at_dropoff') && onCompleteDelivery && (
                    <Button size="sm" onClick={onCompleteDelivery} className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">Complete Delivery</Button>
                )}
                {onCancelRide && ( 
                    <Button variant="destructive" size="sm" onClick={onCancelRide} className="w-full sm:w-auto">Cancel Delivery</Button>
                )}
            </div>
        )}
        {activeActivityDetails?.status === 'delivery_completed' && (
            <p className="text-center text-green-600 font-semibold mt-4">Delivery Completed!</p>
        )}
        {activeActivityDetails?.status === 'delivery_cancelled' && (
            <p className="text-center text-destructive font-semibold mt-4">Delivery Cancelled.</p>
        )}
    </>
  );
  
  const renderDriverStatusView = () => (
    <>
      <DetailSection title="Driver Status">
          <InfoRow label="Current Status" value={activeActivityDetails?.status || "Online"} icon={TruckIcon}/>
          <InfoRow label="Vehicle" value={activeActivityDetails?.vehicleType} />
          <InfoRow label="License Plate" value={activeActivityDetails?.licensePlate} />
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

  const renderProductOrderNotificationView = () => (
    <>
      <DetailSection title="New Product Order!">
        <InfoRow label="Order ID" value={activeActivityDetails?.orderId} icon={ClipboardDocumentCheckIcon} />
        <InfoRow label="For Business" value={activeActivityDetails?.businessName} />
      </DetailSection>
      <DetailSection title="Order Details">
        <InfoRow label="Product" value={activeActivityDetails?.productName} icon={ShoppingBagIcon} />
        <InfoRow label="Quantity" value={activeActivityDetails?.quantity} />
        <InfoRow label="Total Amount" value={activeActivityDetails?.totalAmount} icon={CurrencyDollarIcon}/>
      </DetailSection>
      <DetailSection title="Customer Information">
        <InfoRow label="Customer" value={activeActivityDetails?.customerName} icon={UserIcon} />
        {activeActivityDetails?.customerAddress && <InfoRow label="Address" value={activeActivityDetails.customerAddress} icon={MapPinIcon} />}
      </DetailSection>
      
      {(activeActivityDetails?.status === 'new_product_order' || activeActivityDetails?.status === 'product_order_accepted') && (
        <div className="flex justify-around mt-6 pt-4 border-t border-border">
          {activeActivityDetails?.status === 'new_product_order' && onAcceptProductOrder && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={onAcceptProductOrder}
            >
              Accept Order
            </Button>
          )}
          {activeActivityDetails?.status === 'product_order_accepted' && (
             <p className="text-sm text-green-600 font-semibold">Order Accepted. Start processing.</p>
             // Add further actions like "Mark as Ready", "Dispatch" etc. later
          )}
          {activeActivityDetails?.status === 'new_product_order' && onRejectProductOrder && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onRejectProductOrder}
            >
              Reject Order
            </Button>
          )}
        </div>
      )}
      {activeActivityDetails?.status === 'product_order_rejected' && (
        <p className="text-center text-destructive font-semibold mt-4">Order Rejected.</p>
      )}
      {activeActivityDetails?.status === 'product_order_completed' && (
        <p className="text-center text-green-600 font-semibold mt-4">Order Marked as Completed!</p>
      )}
      {activeActivityDetails?.status === 'product_order_cancelled' && (
        <p className="text-center text-destructive font-semibold mt-4">Order Cancelled by User/System.</p>
      )}
    </>
  );

  let viewTitle = "Active Activity";
  if (activeActivityDetails?.type === 'request') viewTitle = "New Ride Request";
  else if (activeActivityDetails?.type === 'delivery_request') viewTitle = "New Delivery Request";
  else if (activeActivityDetails?.type === 'driver_status') viewTitle = "Your Driver Status";
  else if (activeActivityDetails?.type === 'delivery_task') viewTitle = "Active Delivery Task";
  else if (activeActivityDetails?.type === 'product_order_notification') viewTitle = "New Product Order";


  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="active-activity-title">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 id="active-activity-title" className="text-lg font-semibold font-headline text-foreground">
            {viewTitle}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close active activity view">
            <XMarkIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-3">
          {userRole === 'rider' && activeActivityDetails?.type === 'ride' && renderRiderRideView()}
          
          {userRole === 'driver' && activeActivityDetails?.type === 'request' && renderDriverRequestView('request')}
          {userRole === 'driver' && activeActivityDetails?.type === 'delivery_request' && renderDriverRequestView('delivery_request')}
          
          {userRole === 'driver' && activeActivityDetails?.type === 'ride' && renderDriverActiveRideView()}
          {userRole === 'driver' && activeActivityDetails?.type === 'delivery_task' && renderDriverActiveDeliveryView()}

          {userRole === 'driver' && activeActivityDetails?.type === 'driver_status' && renderDriverStatusView()}

          {userRole === 'business_owner' && activeActivityDetails?.type === 'product_order_notification' && renderProductOrderNotificationView()}


          {!activeActivityDetails && (
            <p className="text-sm text-muted-foreground text-center py-10">No active activity details to display.</p>
          )}
           {(userRole === 'rider' && activeActivityDetails?.type !== 'ride') && 
             (userRole === 'driver' && activeActivityDetails?.type !== 'request' && activeActivityDetails?.type !== 'ride' && activeActivityDetails?.type !== 'driver_status' && activeActivityDetails?.type !== 'delivery_request' && activeActivityDetails?.type !== 'delivery_task') && 
             (userRole === 'business_owner' && activeActivityDetails?.type !== 'product_order_notification') && (
            <p className="text-sm text-muted-foreground text-center py-10">Loading activity details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveActivityView;

    