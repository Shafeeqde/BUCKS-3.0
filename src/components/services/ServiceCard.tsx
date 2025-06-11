"use client";

import { Lock } from 'lucide-react';
import SvgRenderer from '@/components/ui/SvgRenderer';
import type { Service } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  service: Service;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <Card
      className="flex flex-col items-center p-3 bg-card hover:bg-accent/10 cursor-pointer transition-colors duration-200 relative shadow-sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <CardContent className="flex flex-col items-center p-0">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background shadow-md text-primary mb-2">
          <SvgRenderer svgString={service.icon} className="w-6 h-6" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-foreground text-center">{service.name}</span>
        {service.locked && (
          <div className="absolute top-1 right-1 bg-muted rounded-full p-1 shadow">
            <Lock className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
