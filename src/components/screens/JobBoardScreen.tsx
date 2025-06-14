
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Search, Building, Loader2, ExternalLink, Filter as FilterIcon } from 'lucide-react';
import type { BusinessJob } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobBoardScreenProps {
  jobs: BusinessJob[];
  onSelectJob: (jobId: string | number) => void;
}

const jobTypeOptions = [
  { value: "", label: "All Job Types" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

const JobBoardScreen: React.FC<JobBoardScreenProps> = ({ jobs: initialJobs, onSelectJob }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<BusinessJob[]>(initialJobs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerLocationFilter = locationFilter.toLowerCase();
    const lowerJobTypeFilter = jobTypeFilter.toLowerCase();

    const results = initialJobs.filter(job => {
      const titleMatch = job.title.toLowerCase().includes(lowerSearchTerm);
      const companyMatch = job.businessName.toLowerCase().includes(lowerSearchTerm);
      const descriptionMatch = job.description?.toLowerCase().includes(lowerSearchTerm) || false;
      const searchCritMatch = searchTerm ? (titleMatch || companyMatch || descriptionMatch) : true;
      
      const locationMatch = locationFilter ? (job.location?.toLowerCase().includes(lowerLocationFilter) || false) : true;
      const typeMatch = jobTypeFilter ? (job.type?.toLowerCase() === lowerJobTypeFilter) : true;
      
      return searchCritMatch && locationMatch && typeMatch;
    });
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredJobs(results);
      setLoading(false);
    }, 300);
  }, [searchTerm, locationFilter, jobTypeFilter, initialJobs]);

  return (
    <ScrollArea className="h-full bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
              <Briefcase className="mr-3 h-7 w-7 text-primary" /> Job Board
            </CardTitle>
            <CardDescription>Find your next career opportunity. Use the filters below to narrow your search.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Filter by location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger className="w-full">
                     <FilterIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No jobs found matching your criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectJob(job.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectJob(job.id)}
                tabIndex={0}
              >
                <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                  {job.businessLogoUrl ? (
                    <Image
                      src={job.businessLogoUrl}
                      alt={`${job.businessName} logo`}
                      width={60}
                      height={60}
                      className="rounded-md border object-contain flex-shrink-0"
                      data-ai-hint="business logo"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                      <Building className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-primary hover:underline">{job.title}</h3>
                    <p className="text-sm font-medium text-foreground">{job.businessName}</p>
                    {job.location && <p className="text-xs text-muted-foreground flex items-center mt-1"><MapPin className="h-3 w-3 mr-1" />{job.location}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.type && <Badge variant="secondary" className="text-xs">{job.type}</Badge>}
                      {job.salaryRange && <Badge variant="outline" className="text-xs">{job.salaryRange}</Badge>}
                    </div>
                    {job.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>}
                  </div>
                  <div className="mt-2 sm:mt-0 flex-shrink-0">
                     <Button size="sm" variant="outline" onClick={(e) => {e.stopPropagation(); onSelectJob(job.id);}}>
                        View Details
                     </Button>
                  </div>
                </CardContent>
                {job.postedDate && 
                  <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 px-4 border-t justify-end">
                    Posted: {job.postedDate}
                  </CardFooter>
                }
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default JobBoardScreen;

