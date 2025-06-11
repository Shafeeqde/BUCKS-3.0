"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchTerm(search);
    setIsSearchFocused(false); 
    // Add to recent searches if not already present, and move to front
    setRecentSearches(prev => [search, ...prev.filter(s => s !== search)].slice(0, 10));
    // In a real app, trigger a search here
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
      // Filter AI suggestions based on current search term for better relevance,
      // or use them as is. For this example, let's assume the AI provides relevant terms
      // that may or may not include the search term.
      const filteredSuggestions = result.suggestedTerms.filter(term =>
        term.toLowerCase().includes(currentSearchTerm.toLowerCase()) && term.toLowerCase() !== currentSearchTerm.toLowerCase()
      );
      setAiSuggestions(filteredSuggestions.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestions([]);
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches]);

  useEffect(() => {
    if (isSearchFocused && searchTerm.trim() !== '') {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 300); // Debounce API calls
      return () => clearTimeout(debounceTimer);
    } else if (!isSearchFocused || searchTerm.trim() === '') {
      setAiSuggestions([]); // Clear AI suggestions if not focused or search term is empty
    }
  }, [searchTerm, isSearchFocused, fetchAiSuggestions]);

  const displaySuggestions = isSearchFocused || searchTerm !== '';
  const suggestionsToShow = searchTerm === '' ? recentSearches : aiSuggestions;
  const suggestionTitle = searchTerm === '' ? 'Recent Searches' : (isLoadingAiSuggestions ? 'Loading suggestions...' : 'Suggestions');

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
        <div className="bg-card rounded-full shadow-lg flex items-center p-3">
          <Search className="w-5 h-5 text-muted-foreground mr-2" />
          <Input
            type="text"
            placeholder="Search Locality Hub"
            className="flex-grow outline-none text-lg text-foreground bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click on suggestions
          />
        </div>

        {displaySuggestions && (
          <SearchSuggestions
            suggestions={suggestionsToShow}
            onSuggestionClick={handleRecentSearchClick} // Also handles AI suggestion click
            title={suggestionTitle}
          />
        )}
      </div>
    </main>
  );
};

export default HomeScreen;
