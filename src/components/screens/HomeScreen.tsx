
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Plumbing', 'Biryani', 'Carpentry', 'Solids Gym',
    'Skin Doctor', 'Lawyer', 'Belgium Waffle',
    'Indian Oil Petrol Pump', 'Samsung Electronics'
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
  const { toast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSuggestionClick = (search: string) => {
    setSearchTerm(search);
    // Add to recent searches if not already present, and move to front
    setRecentSearches(prev => [search, ...prev.filter(s => s !== search)].slice(0, 10));
    setIsSearchFocused(true); // Keep focus to allow immediate submission or further typing
    // Optionally, trigger search immediately:
    // handleQuerySubmit(search); 
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
      toast({
        title: "Suggestion Error",
        description: "Could not fetch search suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches, toast]);

  useEffect(() => {
    if (isSearchFocused && searchTerm.trim() !== '' && !isAnsweringQuery) {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else if (!isSearchFocused || searchTerm.trim() === '') {
      setAiSuggestions([]);
    }
  }, [searchTerm, isSearchFocused, fetchAiSuggestions, isAnsweringQuery]);

  const handleQuerySubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const query = searchTerm.trim();
    if (!query) {
      toast({
        title: "Empty Search",
        description: "Please enter a query to search.",
        variant: "destructive",
      });
      return;
    }

    setIsAnsweringQuery(true);
    setIsSearchFocused(false); 
    setAiSuggestions([]); 

    setRecentSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 10));

    try {
      const input: GeneralQueryInput = { query };
      const result = await answerGeneralQuery(input);
      toast({
        title: `Answer for "${query}"`,
        description: result.answer,
        duration: 8000, 
      });
      setSearchTerm(''); 
    } catch (error) {
      console.error("Error answering query:", error);
      toast({
        title: "AI Error",
        description: "Sorry, I couldn't get an answer for that. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnsweringQuery(false);
    }
  };


  const displaySuggestions = isSearchFocused && !isAnsweringQuery;
  const suggestionsToShow = searchTerm === '' ? recentSearches : aiSuggestions;
  const suggestionTitle = searchTerm === '' ? 'Recent Searches' : (isLoadingAiSuggestions ? 'Loading suggestions...' : 'AI Suggestions');

  return (
    <main className="flex-grow relative overflow-hidden h-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.924874452586!2d77.56708455!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44167%3A0xf8df77c050a12e21!2sBangalore%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1678234567890!5m2!1sen!2sus"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Interactive Map of Bangalore"
        aria-label="Interactive map showing the city of Bangalore"
      ></iframe>

      <div className="absolute bottom-4 left-0 right-0 px-4 z-20">
        <form onSubmit={handleQuerySubmit} className="bg-card rounded-full shadow-lg flex items-center p-2 pr-3">
          <Input
            type="text"
            placeholder="Ask Locality Hub AI..."
            className="flex-grow outline-none text-lg text-foreground bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-2"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => { if (!document.activeElement?.closest('form')) setIsSearchFocused(false); }, 200)}
            disabled={isAnsweringQuery}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="p-1 rounded-full text-muted-foreground hover:text-primary disabled:opacity-50"
            disabled={isAnsweringQuery || !searchTerm.trim()}
            aria-label="Submit search query"
          >
            <Search className="w-5 h-5" />
          </Button>
        </form>

        {displaySuggestions && (
          <SearchSuggestions
            suggestions={suggestionsToShow}
            onSuggestionClick={handleSuggestionClick}
            title={suggestionTitle}
          />
        )}
      </div>
    </main>
  );
};

export default HomeScreen;
