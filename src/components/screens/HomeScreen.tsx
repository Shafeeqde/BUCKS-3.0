
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
  
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Plumbing', 'Biryani', 'Carpentry', 'Solids Gym',
    'Skin Doctor', 'Lawyer', 'Belgium Waffle',
    'Indian Oil Petrol Pump', 'Samsung Electronics'
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '' && isSearchMode) {
      setSearchResult(null); // Clear results if search term is cleared
    }
  };

  const handleFocus = () => {
    setIsSearchMode(true);
    if (!searchTerm.trim()) {
      // Consider showing recent searches if input is empty on focus
      setAiSuggestions([]); 
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      const activeFormElement = document.activeElement?.closest('form');
      const activeSuggestionButton = document.activeElement?.closest('button[data-suggestion-item="true"]');

      if (!searchTerm.trim() && !activeFormElement && !activeSuggestionButton && !isAnsweringQuery) {
        setIsSearchMode(false);
        setSearchResult(null);
        setAiSuggestions([]);
      } else if (!activeFormElement && !activeSuggestionButton && !isAnsweringQuery) {
        // If blurred and not onto a suggestion or submit, and not currently answering, clear AI suggestions
         // setAiSuggestions([]); // This might be too aggressive, let's test
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
      setAiSuggestions([]);
      // Toast for suggestion error might be too noisy, consider logging or a subtle indicator
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches]);

  useEffect(() => {
    if (isSearchMode && searchTerm.trim() !== '' && !isAnsweringQuery && !searchResult) {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else if (!isSearchMode || searchTerm.trim() === '' || searchResult) {
      if(!isLoadingAiSuggestions) setAiSuggestions([]);
    }
  }, [searchTerm, isSearchMode, fetchAiSuggestions, isAnsweringQuery, searchResult, isLoadingAiSuggestions]);

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
    setAiSuggestions([]); 
    setSearchResult(null); // Clear previous results
    setIsAnsweringQuery(true);

    if (!queryOverride) { // Only add to recent searches if it's not from a suggestion click that already did it
        setRecentSearches(prev => [queryToSubmit, ...prev.filter(s => s !== queryToSubmit)].slice(0, 10));
    }
    
    try {
      const input: GeneralQueryInput = { query: queryToSubmit };
      const result = await answerGeneralQuery(input);
      setSearchResult(result.answer);
      // setSearchTerm(''); // Optional: clear search term after displaying answer
    } catch (error) {
      console.error("Error answering query:", error);
      setSearchResult("Sorry, I couldn't get an answer for that. Please try again.");
      // No toast here, message displayed in results area
    } finally {
      setIsAnsweringQuery(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setRecentSearches(prev => [suggestion, ...prev.filter(s => s !== suggestion)].slice(0, 10));
    handleQuerySubmit(undefined, suggestion);
  };

  const suggestionsToShow = searchTerm.trim() === '' && isSearchMode && !searchResult ? recentSearches : aiSuggestions;
  const suggestionTitle = searchTerm.trim() === '' && isSearchMode && !searchResult 
    ? 'Recent Searches' 
    : (isLoadingAiSuggestions ? 'Loading suggestions...' : (aiSuggestions.length > 0 ? 'AI Suggestions' : ''));


  return (
    <div className="flex flex-col h-full bg-background">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out z-30",
          isSearchMode
            ? "bg-card shadow-md sticky top-0"
            : "absolute bottom-4 left-0 right-0 px-4"
        )}
      >
        <div className={cn(isSearchMode ? "p-4" : "")}>
          <form onSubmit={handleQuerySubmit} className={cn(
              "flex items-center p-2 pr-3",
              isSearchMode ? "bg-background rounded-md border" : "bg-card rounded-full shadow-lg"
          )}>
            <Input
              type="text"
              placeholder={isSearchMode ? "Ask anything or search..." : "Ask Locality Hub AI..."}
              className={cn(
                "flex-grow outline-none text-lg text-foreground bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-2",
              )}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={isAnsweringQuery && isSearchMode} // Disable input when answering in top mode
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
        {isSearchMode && suggestionsToShow.length > 0 && suggestionTitle && !searchResult && !isAnsweringQuery && (
          <div className="px-4 pb-2 bg-card sm:bg-transparent"> {/* Ensure suggestions have a background in sticky mode if needed */}
             <SearchSuggestions
              suggestions={suggestionsToShow}
              onSuggestionClick={handleSuggestionClick}
              title={suggestionTitle}
            />
          </div>
        )}
      </div>

      <div className={cn(
          "flex-grow overflow-y-auto",
          isSearchMode ? "p-4" : "relative" 
      )}>
        {isSearchMode ? (
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
            {searchResult && !isAnsweringQuery && (
              <Card className="mt-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">Locality Hub AI Says:</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{searchResult}</p>
                </CardContent>
              </Card>
            )}
            {!searchResult && !isAnsweringQuery && searchTerm && !isSearchMode && ( 
              // This case should ideally not be hit if isSearchMode logic is correct
              // Or, this is for after a search fails and user has cleared input to exit search mode
              <div className="text-center mt-8">
                  <p className="text-muted-foreground">Enter a query to get started.</p>
              </div>
            )}
             {!searchResult && !isAnsweringQuery && !searchTerm && isSearchMode && (
              <div className="text-center mt-8 text-muted-foreground">
                <p>Ask a question or search for places, services, and more.</p>
              </div>
            )}
          </>
        ) : (
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
      </div>
    </div>
  );
};

export default HomeScreen;

    