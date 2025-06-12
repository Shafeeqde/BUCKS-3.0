
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput, type GeneralQueryOutput, type LocationResult } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const initialPlaceholders = [
  "What are you looking for?",
  "Where are you going today?",
  "Would you like to order something?",
  "Search for local services...",
  "Find nearby attractions...",
];

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiTextAnswer, setAiTextAnswer] = useState<string | null>(null);
  const [foundLocations, setFoundLocations] = useState<LocationResult[]>([]);
  const [currentQueryType, setCurrentQueryType] = useState<'general' | 'location_search' | null>(null);
  const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(initialPlaceholders[0]);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Plumbing', 'Biryani', 'Carpentry', 'Solids Gym',
    'Skin Doctor', 'Lawyer', 'Belgium Waffle',
    'Indian Oil Petrol Pump', 'Samsung Electronics'
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isSearchMode) {
      setCurrentPlaceholder(initialPlaceholders[currentPlaceholderIndex]); // Set initial immediately
      intervalId = setInterval(() => {
        setCurrentPlaceholderIndex(prevIndex => (prevIndex + 1) % initialPlaceholders.length);
      }, 3000); // Change placeholder every 3 seconds
    } else {
      setCurrentPlaceholder("Ask or search again...");
    }

    return () => clearInterval(intervalId);
  }, [isSearchMode, currentPlaceholderIndex]);

  useEffect(() => {
    if (!isSearchMode) {
        setCurrentPlaceholder(initialPlaceholders[currentPlaceholderIndex]);
    }
  }, [currentPlaceholderIndex, isSearchMode]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const activeFormElement = document.activeElement?.closest('form');
      const activeSuggestionButton = document.activeElement?.closest('button[data-suggestion-item="true"]');
      const activeCloseButton = document.activeElement?.closest('button[data-close-search="true"]');

      if (!activeFormElement && !activeSuggestionButton && !activeCloseButton) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  const fetchAiSuggestions = useCallback(async (currentSearchTerm: string) => {
    if (currentSearchTerm.trim() === '') {
      setAiSuggestions([]);
      return;
    }
    setIsLoadingAiSuggestions(true);
    try {
      const input: SuggestSearchTermsInput = {
        mapViewDescription: "Current map view shows Bangalore, Karnataka, India. Prominent landmarks include Vidhana Soudha, Cubbon Park. Categories of businesses include restaurants, shops, and tech companies.",
        recentSearches: recentSearches,
      };
      const result = await suggestSearchTerms(input);
      const filteredSuggestions = result.suggestedTerms.filter(term =>
        term.toLowerCase().includes(currentSearchTerm.toLowerCase()) && term.toLowerCase() !== currentSearchTerm.toLowerCase()
      );
      setAiSuggestions(filteredSuggestions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        title: "Suggestion Error",
        description: "Could not fetch AI suggestions. API rate limits might be exceeded.",
        variant: "destructive",
      });
      setAiSuggestions([]);
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches, toast]);

  useEffect(() => {
    if (showSuggestions && searchTerm.trim() !== '' && !isAnsweringQuery && currentQueryType === null) {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 750);
      return () => clearTimeout(debounceTimer);
    } else if (!showSuggestions || searchTerm.trim() === '' || currentQueryType !== null) {
      if(!isLoadingAiSuggestions) setAiSuggestions([]);
    }
  }, [searchTerm, showSuggestions, fetchAiSuggestions, isAnsweringQuery, currentQueryType, isLoadingAiSuggestions]);

  const handleQuerySubmit = async (event?: React.FormEvent<HTMLFormElement>, queryOverride?: string) => {
    if (event) event.preventDefault();
    const queryToSubmit = queryOverride || searchTerm.trim();

    if (!queryToSubmit) {
      toast({
        title: "Empty Search",
        description: "Please enter a query to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchMode(true);
    setShowSuggestions(false);
    setAiTextAnswer(null);
    setFoundLocations([]);
    setCurrentQueryType(null);
    setIsAnsweringQuery(true);
    setAiSuggestions([]);

    if (!queryOverride) {
        setRecentSearches(prev => [queryToSubmit, ...prev.filter(s => s !== queryToSubmit)].slice(0, 10));
    }

    try {
      const input: GeneralQueryInput = { query: queryToSubmit };
      const result: GeneralQueryOutput = await answerGeneralQuery(input);

      setAiTextAnswer(result.answer);
      setCurrentQueryType(result.queryType);
      if (result.queryType === 'location_search' && result.locations) {
        setFoundLocations(result.locations);
      } else {
        setFoundLocations([]);
      }

    } catch (error) {
      console.error("Error answering query:", error);
      setAiTextAnswer("Sorry, I couldn't get an answer for that. Please try again.");
      setCurrentQueryType('general');
      setFoundLocations([]);
      toast({
        title: "AI Query Error",
        description: "There was an issue getting a response from the AI. API rate limits might be exceeded or there was a network problem.",
        variant: "destructive",
      });
    } finally {
      setIsAnsweringQuery(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleQuerySubmit(undefined, suggestion);
  };

  const handleLocationItemClick = (location: LocationResult) => {
    toast({
        title: `Details for ${location.name}`,
        description: "Map navigation and more details would be shown here in a full implementation.",
    });
  };

  const handleCloseSearchResults = () => {
    setIsSearchMode(false);
    setSearchTerm('');
    setAiTextAnswer(null);
    setFoundLocations([]);
    setCurrentQueryType(null);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setCurrentPlaceholderIndex(0); // Reset placeholder cycle
  };

  let currentSuggestions: string[] = [];
  let currentSuggestionTitle: string = '';

  const shouldTryShowSuggestionsContainer = showSuggestions &&
                                          (!isSearchMode || (isSearchMode && !aiTextAnswer && !isAnsweringQuery && foundLocations.length === 0));

  if (shouldTryShowSuggestionsContainer) {
    if (searchTerm.trim() === '') {
      currentSuggestions = recentSearches.slice(0,5);
      if (currentSuggestions.length > 0) currentSuggestionTitle = 'Recent Searches';
    } else {
      currentSuggestions = aiSuggestions;
      if (isLoadingAiSuggestions) {
          currentSuggestionTitle = 'Loading suggestions...';
      } else if (aiSuggestions.length > 0) {
          currentSuggestionTitle = 'AI Suggestions';
      }
    }
  }
  const renderSuggestions = currentSuggestions.length > 0 && currentSuggestionTitle;

  const showMap = !isSearchMode;
  const showResultsArea = isSearchMode && (isAnsweringQuery || aiTextAnswer || foundLocations.length > 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* --- Search Bar and (conditionally) Suggestions Area --- */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out z-30",
          isSearchMode
            ? "bg-card shadow-md sticky top-0"
            : "absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2"
        )}
      >
        {!isSearchMode && renderSuggestions && (
          <div className="pb-2">
            <SearchSuggestions
              suggestions={currentSuggestions}
              onSuggestionClick={handleSuggestionClick}
              title={currentSuggestionTitle}
            />
          </div>
        )}

        <div className={cn("flex items-center", isSearchMode ? "p-4 space-x-2" : "")}>
          {isSearchMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseSearchResults}
              className="p-1 rounded-full text-muted-foreground hover:text-primary"
              aria-label="Close search results"
              data-close-search="true"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <form onSubmit={handleQuerySubmit} className={cn(
              "flex items-center p-2 pr-3 flex-grow",
              isSearchMode ? "bg-background rounded-md border" : "bg-card rounded-full shadow-lg"
          )}>
            <Input
              type="text"
              placeholder={currentPlaceholder}
              className={cn(
                "flex-grow outline-none text-lg text-foreground bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-2",
              )}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isAnsweringQuery && isSearchMode}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="p-1 rounded-full text-muted-foreground hover:text-primary disabled:opacity-50"
              disabled={(isAnsweringQuery && isSearchMode) || !searchTerm.trim()}
              aria-label="Submit search query"
            >
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {isSearchMode && renderSuggestions && (
          <div className="px-4 pb-2 bg-card sm:bg-transparent">
             <SearchSuggestions
              suggestions={currentSuggestions}
              onSuggestionClick={handleSuggestionClick}
              title={currentSuggestionTitle}
            />
          </div>
        )}
      </div>

      {/* --- Main Content Area: Map or Search Results --- */}
      <div className={cn(
          "flex-grow overflow-y-auto custom-scrollbar",
           showResultsArea ? "p-4" : "relative"
      )}>
        {showMap && (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.924874452586!2d77.56708455!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44167%3A0xf8df77c050a12e21!2sBangalore%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1678234567890!5m2!1sen!2sus"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Interactive Map of Bangalore"
            aria-label="Interactive map showing the city of Bangalore"
          ></iframe>
        )}

        {showResultsArea && (
          <>
            {isAnsweringQuery && (
               <div className="flex flex-col justify-center items-center h-full text-center">
                  <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-muted-foreground">Locality Hub AI is thinking...</p>
               </div>
            )}

            {!isAnsweringQuery && aiTextAnswer && (
              <Card className="mb-4 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">
                    {currentQueryType === 'location_search' ? "AI Summary:" : "Locality Hub AI Says:"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{aiTextAnswer}</p>
                </CardContent>
              </Card>
            )}

            {!isAnsweringQuery && currentQueryType === 'location_search' && foundLocations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground font-headline">Places Found:</h3>
                {foundLocations.map((location, index) => (
                  <Card
                    key={index}
                    className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleLocationItemClick(location)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationItemClick(location)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">{location.name}</h4>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isAnsweringQuery && !aiTextAnswer && foundLocations.length === 0 && (
              <div className="text-center mt-8 text-muted-foreground">
                <p>Ask a question or search for places, services, and more to see results here.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
    
