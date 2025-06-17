
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { ServiceBookingRequest } from '@/types';

interface ServiceBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  professionalId: string;
  professionalName: string;
  skillName: string;
  onSubmit: (request: ServiceBookingRequest) => void;
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const ServiceBookingDialog: React.FC<ServiceBookingDialogProps> = ({
  isOpen,
  onClose,
  professionalId,
  professionalName,
  skillName,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [serviceDescription, setServiceDescription] = useState('');
  const [requestedDate, setRequestedDate] = useState<Date | undefined>(undefined);
  const [requestedTime, setRequestedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset form when dialog opens/closes or professional changes
    if (isOpen) {
      setServiceDescription('');
      setRequestedDate(undefined);
      setRequestedTime('');
    }
  }, [isOpen, professionalId]);

  const handleSubmit = async () => {
    if (!serviceDescription.trim()) {
      toast({ title: "Description Required", description: "Please describe the service you need.", variant: "destructive" });
      return;
    }
    if (!requestedDate) {
      toast({ title: "Date Required", description: "Please select a preferred date.", variant: "destructive" });
      return;
    }
    if (!requestedTime) {
      toast({ title: "Time Required", description: "Please select a preferred time.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const bookingRequest: ServiceBookingRequest = {
      professionalId,
      professionalName,
      skillName,
      serviceDescription,
      requestedDate: format(requestedDate, "yyyy-MM-dd"),
      requestedTime,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit(bookingRequest);
    setIsSubmitting(false);
    // onClose(); // Closing is handled by page.tsx after successful submission normally
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-primary" /> Book Service: {skillName}
          </DialogTitle>
          <DialogDescription>
            Request a booking with {professionalName}. Please provide details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-1.5">
            <Label htmlFor="serviceDescription">Service Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="serviceDescription"
              placeholder={`Describe the ${skillName.toLowerCase()} you need help with...`}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="requestedDate">Preferred Date <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !requestedDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestedDate ? format(requestedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={requestedDate}
                  onSelect={setRequestedDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="requestedTime">Preferred Time Slot <span className="text-destructive">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={requestedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRequestedTime(time)}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
             <Input
                id="customTime"
                type="time"
                value={timeSlots.includes(requestedTime) ? '' : requestedTime} // Clear if a slot is picked, allow custom if not
                onChange={(e) => {
                    setRequestedTime(e.target.value);
                     // If user types, deselect any chosen slot button (visual cue)
                     // Actual logic will take the input value if it's not empty and not in slots
                }}
                placeholder="Or specify time (e.g. 02:30 PM)"
                className="mt-2 text-sm"
                disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !serviceDescription || !requestedDate || !requestedTime}>
            {isSubmitting && <span className="mr-2 h-4 w-4 animate-spin border-2 border-primary-foreground border-t-transparent rounded-full"></span>}
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingDialog;
