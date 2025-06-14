
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, BriefcaseIcon, MapPinIcon, BuildingOfficeIcon, CalendarDaysIcon, CurrencyDollarIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import type { BusinessJob } from '@/types';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

interface JobDetailScreenProps {
  job: BusinessJob;
  onBack: () => void;
}

const JobDetailScreen: React.FC<JobDetailScreenProps> = ({ job, onBack }) => {
  const { toast } = useToast();

  const handleApply = () => {
    if (job.applyLink) {
      window.open(job.applyLink, '_blank');
      toast({ title: "Redirecting to Apply", description: `Opening application link for ${job.title}.` });
    } else {
      toast({ title: "Apply (Simulated)", description: `Simulating application for ${job.title} at ${job.businessName}.` });
    }
  };

  return (
    <ScrollArea className="h-full bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={onBack} className="mb-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Job Board
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {job.businessLogoUrl ? (
                <Image
                  src={job.businessLogoUrl}
                  alt={`${job.businessName} logo`}
                  width={80}
                  height={80}
                  className="rounded-lg border object-contain flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <div className="flex-grow">
                <CardTitle className="text-2xl sm:text-3xl font-headline text-primary">{job.title}</CardTitle>
                <CardDescription className="text-lg font-medium text-foreground">{job.businessName}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {job.location && (
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">{job.location}</p>
                  </div>
                </div>
              )}
              {job.type && (
                <div className="flex items-start">
                  <BriefcaseIcon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Job Type</p>
                    <p className="text-muted-foreground">{job.type}</p>
                  </div>
                </div>
              )}
              {job.postedDate && (
                <div className="flex items-start">
                  <CalendarDaysIcon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Date Posted</p>
                    <p className="text-muted-foreground">{job.postedDate}</p>
                  </div>
                </div>
              )}
              {job.salaryRange && (
                <div className="flex items-start">
                  <CurrencyDollarIcon className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Salary</p>
                    <p className="text-muted-foreground">{job.salaryRange}</p>
                  </div>
                </div>
              )}
            </div>

            {job.description && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-headline">Job Description</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{job.description}</p>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-headline flex items-center">
                  <ClipboardDocumentListIcon className="mr-2 h-5 w-5 text-primary" /> Requirements
                </h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-6 flex flex-col sm:flex-row items-center gap-3">
            <Button size="lg" onClick={handleApply} className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              {job.applyLink ? 'Apply via Link' : 'Apply Now (Simulated)'}
              {job.applyLink && <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: "Saved (Simulated)"})}>
              Save Job
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default JobDetailScreen;
