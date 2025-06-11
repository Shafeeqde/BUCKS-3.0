"use client";

import React from 'react';

interface SvgRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  svgString: string;
}

const SvgRenderer: React.FC<SvgRendererProps> = ({ svgString, className, ...props }) => {
  // Basic sanitization: remove script tags. For production, a more robust sanitizer is recommended.
  const sanitizedSvgString = svgString.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedSvgString }}
      {...props}
    />
  );
};

export default SvgRenderer;
