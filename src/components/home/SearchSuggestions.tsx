
"use client";

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  title: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSuggestionClick, title }) => {
  if (suggestions.length === 0 || !title) {
    return null;
  }

  return (
    <div className="mt-2 bg-card rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto custom-scrollbar"> {/* Increased max-h slightly */}
      <h3 className="font-semibold text-foreground mb-3 font-headline">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full text-sm px-3 py-1"
            onClick={() => onSuggestionClick(suggestion)}
            data-suggestion-item="true" // Added for blur handling
          >
            <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" />
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;

    