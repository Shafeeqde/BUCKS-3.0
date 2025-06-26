
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon, ChatBubbleLeftEllipsisIcon, AdjustmentsHorizontalIcon, ArrowUpOnSquareIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput, type GeneralQueryOutput, type LocationResult } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import IndividualProfessionalCard from '@/components/search/IndividualProfessionalCard';
import BusinessProfileCard from '@/components/search/BusinessProfileCard';
import type { UserBusinessProfile, OverallProfessionalProfileData, TabName } from '@/types';

const initialPlaceholders = [
  "What are you looking for, e.g., plumber, cafe?",
  "Search professionals, services, or businesses...",
  "Find local experts or ask bucks AI...",
];

export type SearchResultItem =
  | { type: 'individual'; data: OverallProfessionalProfileData }
  | { type: 'business'; data: UserBusinessProfile };

interface HomeScreenProps {
  setActiveTab: (tab: TabName) => void;
  onSelectBusinessProfile: (profileId: string | number) => void;
  onSelectIndividualProfile: (profileId: string) => void;
  onAddToCart: (businessId: string | number, productId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  onSelectBusinessProfile,
  onSelectIndividualProfile,
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiResponse, setAiResponse] = useState<GeneralQueryOutput | null>(null);
  const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(initialPlaceholders[0]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const { toast } = useToast();
  const [displayedSearchResults, setDisplayedSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isSearchMode) {
      let currentIndex = 0;
      setCurrentPlaceholder(initialPlaceholders[currentIndex]);
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % initialPlaceholders.length;
        setCurrentPlaceholder(initialPlaceholders[currentIndex]);
      }, 3000);
    } else {
      setCurrentPlaceholder("Ask bucks AI or search again...");
    }
    return () => clearInterval(intervalId);
  }, [isSearchMode]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '' && isSearchMode) {
      setDisplayedSearchResults([]);
      setAiResponse(null);
    }
  };

  const handleFocus = () => setShowSuggestions(true);
  const handleBlur = () => setTimeout(() => setShowSuggestions(false), 200);

  const fetchAiSuggestions = useCallback(async (currentSearchTerm: string) => {
    if (currentSearchTerm.trim().length < 3) {
      setAiSuggestions([]);
      return;
    }
    setIsLoadingAiSuggestions(true);
    try {
      const input: SuggestSearchTermsInput = {
        mapViewDescription: "Bangalore, Karnataka, India.",
        recentSearches: recentSearches,
      };
      const result = await suggestSearchTerms(input);
      setAiSuggestions(result.suggestedTerms.slice(0, 5));
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setAiSuggestions([]);
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches]);

  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setDisplayedSearchResults([]);
      return;
    }
    setIsLoadingSearchResults(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) throw new Error('Search request failed');
      const results = await response.json();
      setDisplayedSearchResults(results);
    } catch (error) {
      console.error("Error performing search:", error);
      toast({ title: "Search Error", description: "Could not fetch search results.", variant: "destructive" });
      setDisplayedSearchResults([]);
    } finally {
      setIsLoadingSearchResults(false);
    }
  }, [toast]);

  const handleQuerySubmit = async (event?: React.FormEvent<HTMLFormElement>, queryOverride?: string) => {
    event?.preventDefault();
    const queryToSubmit = (queryOverride || searchTerm).trim();

    setIsSearchMode(true);
    setShowSuggestions(false);
    setAiSuggestions([]);

    if (!queryToSubmit) {
      setAiResponse(null);
      setDisplayedSearchResults([]);
      return;
    }
    
    setRecentSearches(prev => [queryToSubmit, ...prev.filter(s => s.toLowerCase() !== queryToSubmit.toLowerCase())].slice(0, 10));

    setIsAnsweringQuery(true);
    performSearch(queryToSubmit);

    try {
      const input: GeneralQueryInput = { query: queryToSubmit };
      const result = await answerGeneralQuery(input);
      setAiResponse(result);
    } catch (error) {
      console.error("Error answering query:", error);
      setAiResponse({ answer: "Sorry, the AI assistant is currently unavailable.", queryType: 'general' });
    } finally {
      setIsAnsweringQuery(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleQuerySubmit(undefined, suggestion);
  };

  const handleLocationItemClick = (location: LocationResult) => {
    toast({ title: `Details for ${location.name}`, description: "Map navigation would be shown here." });
  };

  const handleCloseSearchResults = () => {
    setIsSearchMode(false);
    setSearchTerm('');
    setAiResponse(null);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setDisplayedSearchResults([]);
  };

  const renderSuggestions = () => {
    const shouldShow = showSuggestions && (!isSearchMode || (isSearchMode && !aiResponse && !isLoadingSearchResults && displayedSearchResults.length === 0));
    if (!shouldShow) return null;

    const suggestions = searchTerm.trim() === '' ? recentSearches.slice(0,5) : aiSuggestions;
    let title = '';
    if (searchTerm.trim() === '' && suggestions.length > 0) title = 'Recent Searches';
    if (searchTerm.trim() !== '') title = isLoadingAiSuggestions ? 'Loading AI suggestions...' : 'AI Suggestions';
    if (!title || suggestions.length === 0) return null;

    return <SearchSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} title={title} />;
  };
  
  const handleCardPress = (item: SearchResultItem) => {
    if (item.type === 'business') {
      onSelectBusinessProfile(item.data.id);
    } else if (item.type === 'individual') {
      onSelectIndividualProfile(item.data.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className={cn("transition-all duration-300 ease-in-out z-30", isSearchMode ? "bg-card shadow-md sticky top-0" : "absolute bottom-0 left-0 right-0 p-4 pt-2 pb-0")}>
        {renderSuggestions()}
        <div className={cn("flex items-center", isSearchMode ? "p-4 space-x-2" : "p-0")}>
          {isSearchMode && (
            <Button variant="ghost" size="icon" onClick={handleCloseSearchResults} aria-label="Close search results">
              <XMarkIcon className="w-6 h-6" />
            </Button>
          )}
          <form onSubmit={handleQuerySubmit} className={cn("flex items-center p-2 pr-3 flex-grow", isSearchMode ? "bg-background rounded-md border border-input" : "bg-card rounded-full shadow-lg")}>
            <Input type="text" placeholder={currentPlaceholder} className="flex-grow outline-none text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-2" value={searchTerm} onChange={handleSearchChange} onFocus={handleFocus} onBlur={handleBlur} disabled={isAnsweringQuery && isSearchMode} />
            <Button type="submit" variant="ghost" size="icon" className="p-1 rounded-full text-muted-foreground hover:text-primary disabled:opacity-50" disabled={isAnsweringQuery && isSearchMode} aria-label="Submit search query">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>
        {isSearchMode && (
          <div className="px-4 pt-2 pb-3 border-b bg-card">
            <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1">
                <Button variant="outline" size="sm" className="rounded-full shrink-0"><AdjustmentsHorizontalIcon className="mr-1.5 h-3.5 w-3.5"/>Filters</Button>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className={cn("flex-grow", isSearchMode ? "pt-4 px-2 sm:px-4" : "relative")}>
        {!isSearchMode && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.924874452586!2d77.56708455!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44167%3A0xf8df77c050a12e21!2sBangalore%2C%20Karnataka%2C%20India!5e0!3m2!1sen!2sus!4v1678234567890!5m2!1sen!2sus" className="absolute inset-0 w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Interactive Map" aria-label="Interactive map"></iframe>}
        
        {isSearchMode && (
          <div className="space-y-6 pb-6">
            {(isAnsweringQuery || isLoadingSearchResults) && <div className="text-center p-10"><span className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full inline-block"></span></div>}
            
            {!isAnsweringQuery && aiResponse?.answer && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center"><ChatBubbleLeftEllipsisIcon className="mr-2 h-5 w-5 text-primary"/>{aiResponse.queryType === 'location_search' ? "AI Summary:" : "bucks AI says:"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{aiResponse.answer}</p>
                  {aiResponse.suggestedAction && <Button onClick={() => setActiveTab(aiResponse.suggestedAction?.targetTab as TabName)} className="mt-4">{aiResponse.suggestedAction.label}</Button>}
                </CardContent>
              </Card>
            )}

            {!isAnsweringQuery && aiResponse?.queryType === 'location_search' && aiResponse.locations && aiResponse.locations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground font-headline mb-3 flex items-center"><MapPinIcon className="mr-2 h-5 w-5 text-primary"/>Places Found:</h3>
                <div className="space-y-3">{aiResponse.locations.map((loc, i) => <Card key={i} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleLocationItemClick(loc)}><CardContent className="pt-4 flex items-start space-x-3"><MapPinIcon className="w-5 h-5 text-primary mt-1 shrink-0" /><div><h4 className="font-semibold">{loc.name}</h4><p className="text-sm text-muted-foreground">{loc.address}</p></div></CardContent></Card>)}</div>
              </div>
            )}
            
            {!isLoadingSearchResults && displayedSearchResults.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground font-headline mb-0 flex items-center"><MagnifyingGlassIcon className="mr-2 h-5 w-5 text-primary"/>Matching Profiles & Businesses:</h3>
                {displayedSearchResults.map((item) => {
                  if (item.type === 'business') {
                    // Adapt UserBusinessProfile to BusinessProfileCardData
                    const businessCardData = {
                      id: item.data.id,
                      name: item.data.name,
                      logoUrl: item.data.logo,
                      logoAiHint: item.data.logoAiHint,
                      briefInfo: item.data.location,
                      tagline: item.data.bio,
                      averageRating: item.data.averageRating,
                      totalReviews: item.data.totalReviews,
                      products: item.data.products,
                      phone: item.data.phone,
                    };
                    return (
                      <BusinessProfileCard 
                        key={item.data.id} 
                        business={businessCardData}
                        onPress={() => handleCardPress(item)}
                        onAddToCartClick={(productId) => onAddToCart(item.data.id, productId)}
                      />
                    );
                  } else if (item.type === 'individual') {
                     // Adapt OverallProfessionalProfileData to IndividualProfessionalCardData
                     const individualCardData = {
                      id: item.data.id,
                      name: item.data.name || 'N/A',
                      avatarUrl: item.data.avatarUrl,
                      avatarAiHint: item.data.avatarAiHint,
                      professionalTitle: item.data.professionalTitle,
                      shortBio: item.data.professionalBio,
                      // You might need to add logic here to derive rating, reviews from the full profile
                    };
                    return (
                      <IndividualProfessionalCard 
                        key={item.data.id} 
                        profile={individualCardData} 
                        onPress={() => handleCardPress(item)} 
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {isSearchMode && !isAnsweringQuery && !isLoadingSearchResults && displayedSearchResults.length === 0 && searchTerm.trim() !== '' && (
                <div className="text-center py-10 text-muted-foreground"><p className="text-lg">No results found for "{searchTerm}".</p><p className="text-sm">Try a different search term or check your spelling.</p></div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HomeScreen;
