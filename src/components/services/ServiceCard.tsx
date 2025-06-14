
"use client";

import { Lock, type LucideIcon } from 'lucide-react';
import SvgRenderer from '@/components/ui/SvgRenderer';
import type { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // Added
import { cn } from '@/lib/utils'; // Added

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const IconComponent = service.icon;

  const cardContent = (
    <CardContent className="flex flex-col items-center p-0">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background shadow-md text-primary mb-2">
        {typeof IconComponent === 'string' ? (
          <SvgRenderer svgString={IconComponent} className="w-6 h-6" />
        ) : (
          <IconComponent className="w-6 h-6" />
        )}
      </div>
      <span className="text-xs sm:text-sm font-medium text-foreground text-center">{service.name}</span>
    </CardContent>
  );

  return (
    <Card
      className="flex flex-col items-center p-3 bg-card hover:bg-accent/10 cursor-pointer transition-colors duration-200 relative shadow-sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {service.locked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full">
              {cardContent}
              <div className={cn(
                "absolute -top-0.5 -right-0.5 bg-muted rounded-full p-0.5 shadow-sm border border-transparent",
                "group-hover:border-accent transition-colors" 
              )}>
                <Lock className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Coming Soon!</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        cardContent
      )}
    </Card>
  );
};

export default ServiceCard;
