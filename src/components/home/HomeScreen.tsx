
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon, ChatBubbleLeftEllipsisIcon, AdjustmentsHorizontalIcon, ArrowUpOnSquareIcon, ShoppingCartIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput, type GeneralQueryOutput, type LocationResult } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

import IndividualProfessionalCard from '@/components/search/IndividualProfessionalCard';
import type { IndividualProfessionalCardData } from '@/components/search/IndividualProfessionalCard';
import BusinessProfileCard from '@/components/search/BusinessProfileCard';
import type { BusinessProfileCardData as BusinessCardDataType, BusinessProductCardItem, TabName } from '@/types';

const initialPlaceholders = [
  "What are you looking for, e.g., plumber, cafe?",
  "Search professionals, services, or businesses...",
  "Find local experts or ask bucks AI...",
];

export type SearchResultItem =
  | { type: 'individual'; data: IndividualProfessionalCardData }
  | { type: 'business'; data: BusinessCardDataType };

const simulatedSearchResults: SearchResultItem[] = [
  {
    type: 'individual',
    data: {
      id: 'jenson-interior-stylist-123', 
      name: 'Jenson Harris',
      avatarUrl: 'https://placehold.co/80x80.png',
      avatarAiHint: 'man smiling professional',
      professionalTitle: 'Interior Home Stylist',
      previewImages: [
        { url: 'https://placehold.co/200x150.png', aiHint: 'modern living room' },
        { url: 'https://placehold.co/200x150.png', aiHint: 'stylish kitchen' },
      ],
      shortBio: "I'm a qualified interior designer and stylist with a keen eye for furniture, objects and art curation.",
      averageRating: 4.8,
      totalReviews: 125,
      recommendationsCount: 98,
      phone: '+1 987 654 3210',
      email: 'jenson.h@example.com',
    },
  },
  {
    type: 'business',
    data: {
      id: 1, 
      name: 'Hot Griddle Restaurant',
      logoUrl: 'https://placehold.co/80x80.png',
      logoAiHint: 'restaurant logo',
      briefInfo: '10-15 mins • 3km away • BTM layout',
      tagline: "International, locally sourced specialties. Best Griddle in town!",
      averageRating: 4.5,
      totalReviews: 232,
      products: [
        { id: 'prod-biryani-101', name: 'Mutton Biryani (Serves 2)', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'mutton biryani', price: '299', discountPrice: '229', discountPercentage: '22%' },
        { id: 'prod-pizza-102', name: 'Spicy Chicken Pizza', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'pizza slice', price: '350' },
      ],
      phone: '+91 9876543210',
    },
  },
  {
    type: 'individual',
    data: {
      id: 'plumbing-profile-johndoe-123', 
      name: 'John Doe',
      avatarUrl: 'https://placehold.co/80x80.png',
      avatarAiHint: 'man plumber tools',
      professionalTitle: 'Master Plumber',
      previewImages: [
        { url: 'https://placehold.co/200x150.png', aiHint: 'pipe installation' },
      ],
      shortBio: 'Reliable plumbing services for residential and commercial properties.',
      averageRating: 4.9,
      totalReviews: 75,
      recommendationsCount: 60,
      phone: '555-0111',
      email: 'john.doe@example.com',
    },
  },
  {
    type: 'business',
    data: {
      id: 2, 
      name: 'Mikado UX UI & Branding Studio',
      logoUrl: 'https://placehold.co/80x80.png',
      logoAiHint: 'design studio',
      briefInfo: 'Indiranagar, Bengaluru',
      tagline: 'Curating digital experiences that connect with people.',
      averageRating: 4.9,
      totalReviews: 75,
      products: [
         { id: 'serv-brand-pkg', name: 'Brand Identity Package', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'branding design', price: 'Quote' },
      ],
      phone: '+91 8197278080',
    },
  },
];

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
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(initialPlaceholders[0]);

  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Plumbing", "Biryani", "Carpentry", "Solids Gym",
    "Skin Doctor", "Lawyer", "Belgium Waffle",
    "Indian Oil Petrol Pump", "Samsung Electronics"
  ]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAiSuggestions, setIsLoadingAiSuggestions] = useState(false);
  const { toast } = useToast();

  const [displayedSearchResults, setDisplayedSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoadingSimulatedResults, setIsLoadingSimulatedResults] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isSearchMode) {
      setCurrentPlaceholder(initialPlaceholders[currentPlaceholderIndex]);
      intervalId = setInterval(() => {
        setCurrentPlaceholderIndex(prevIndex => (prevIndex + 1) % initialPlaceholders.length);
      }, 3000);
    } else {
      setCurrentPlaceholder("Ask bucks AI or search again...");
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
    if (e.target.value.trim() === '' && isSearchMode) {
        setDisplayedSearchResults([]);
        setAiResponse(null);
    }
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
      setAiSuggestions([]);
    } finally {
      setIsLoadingAiSuggestions(false);
    }
  }, [recentSearches]);

  useEffect(() => {
    if (showSuggestions && searchTerm.trim() !== '' && !isAnsweringQuery && !aiResponse) {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 750);
      return () => clearTimeout(debounceTimer);
    } else if (!showSuggestions || searchTerm.trim() === '' || !!aiResponse) {
      if(!isLoadingAiSuggestions) setAiSuggestions([]);
    }
  }, [searchTerm, showSuggestions, fetchAiSuggestions, isAnsweringQuery, aiResponse, isLoadingAiSuggestions]);

  const performSimulatedSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    console.log('[HomeScreen] performSimulatedSearch called with query:', `"${trimmedQuery}" (lowercase: "${lowerQuery}")`);

    if (trimmedQuery === '') {
        console.log('[HomeScreen] Empty query, not showing simulated results by default.');
        setDisplayedSearchResults([]);
        setIsLoadingSimulatedResults(false);
        return;
    }

    setIsLoadingSimulatedResults(true);
    setTimeout(() => {
      const filtered = simulatedSearchResults.filter(item => {
        let match = false;
        if (item.type === 'individual') {
          match = item.data.name.toLowerCase().includes(lowerQuery) ||
                 (item.data.professionalTitle && item.data.professionalTitle.toLowerCase().includes(lowerQuery)) ||
                 (item.data.shortBio && item.data.shortBio.toLowerCase().includes(lowerQuery));
        } else if (item.type === 'business') {
          const nameMatch = item.data.name.toLowerCase().includes(lowerQuery);
          const taglineMatch = !!item.data.tagline && item.data.tagline.toLowerCase().includes(lowerQuery);
          const productMatch = !!item.data.products && item.data.products.some(p => p.name.toLowerCase().includes(lowerQuery));
          match = nameMatch || taglineMatch || productMatch;
        }
        return match;
      });
      console.log('[HomeScreen] Filtered results for query "' + trimmedQuery + '":', filtered.map(r => ({ id: r.data.id, type: r.type, name: r.data.name })));
      setDisplayedSearchResults(filtered);
      setIsLoadingSimulatedResults(false);
    }, 500);
  }, []);

  const handleQuerySubmit = async (event?: React.FormEvent<HTMLFormElement>, queryOverride?: string) => {
    if (event) event.preventDefault();
    const queryToSubmit = (queryOverride || searchTerm).trim();

    setIsSearchMode(true);
    setShowSuggestions(false);
    setAiSuggestions([]); 

    if (!queryToSubmit) {
      toast({
        title: "Empty Search",
        description: "Please enter a query to search.",
      });
      setAiResponse(null);
      setDisplayedSearchResults([]);
      setIsAnsweringQuery(false);
      setIsLoadingSimulatedResults(false);
      return;
    }
    
    if (!queryOverride && queryToSubmit) {
        setRecentSearches(prev => [queryToSubmit, ...prev.filter(s => s !== queryToSubmit)].slice(0, 10));
    }

    setIsAnsweringQuery(true);
    performSimulatedSearch(queryToSubmit);

    try {
      const input: GeneralQueryInput = { query: queryToSubmit };
      const result: GeneralQueryOutput = await answerGeneralQuery(input);
      setAiResponse(result);
    } catch (error) {
      console.error("Error answering query:", error);
      setAiResponse({
        answer: "Sorry, I couldn't get an AI answer for that. Please try again.",
        queryType: 'general'
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
        description: "Map navigation and more details would be shown here.",
    });
  };

  const handleCloseSearchResults = () => {
    setIsSearchMode(false);
    setSearchTerm('');
    setAiResponse(null);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setDisplayedSearchResults([]);
    setCurrentPlaceholderIndex(0);
  };

  let currentSuggestions: string[] = [];
  let currentSuggestionTitle: string = '';

  const shouldTryShowSuggestionsContainer = showSuggestions &&
                                          (!isSearchMode || (isSearchMode && !aiResponse && !isAnsweringQuery && displayedSearchResults.length === 0 && !isLoadingSimulatedResults));


  if (shouldTryShowSuggestionsContainer) {
    if (searchTerm.trim() === '') {
      currentSuggestions = recentSearches.slice(0,5);
      if (currentSuggestions.length > 0) currentSuggestionTitle = 'Recent Searches';
    } else {
      currentSuggestions = aiSuggestions;
      if (isLoadingAiSuggestions) {
          currentSuggestionTitle = 'Loading AI suggestions...';
      } else if (aiSuggestions.length > 0) {
          currentSuggestionTitle = 'AI Suggestions';
      }
    }
  }
  const renderAISuggestions = currentSuggestions.length > 0 && currentSuggestionTitle;

  const showMap = !isSearchMode;
  const showResultsArea = isSearchMode;

  const handleIndividualCardPress = (profileId: string) => {
    console.log(`[HomeScreen] Individual card pressed, navigating to individual profile: ${profileId}`);
    onSelectIndividualProfile(profileId);
  };

  const handleBusinessCardPress = (id: string | number) => {
    console.log(`[HomeScreen] Business card pressed: ${id}`);
    onSelectBusinessProfile(id);
  };
  
  const handleCardEnquiryClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Enquiry for ${type}: ${id} (Simulated)` });
  const handleCardCallClick = (id: string | number, phone: string | undefined, type: 'individual' | 'business') => toast({ title: `Call ${type}: ${id} (Simulated)`, description: phone ? `Dialing ${phone}` : "No phone." });
  const handleCardRecommendClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Recommend ${type}: ${id} (Simulated)` });
  const handleCardShareClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Share ${type}: ${id} (Simulated)` });
  const handleCardFollowClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Follow ${type}: ${id} (Simulated)` });
  const handleCardProductClick = (businessId: string | number, productId: string) => toast({ title: `Product ${productId} from Business ${businessId} clicked (Simulated).` });


  return (
    <div className="flex flex-col h-full bg-background">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out z-30",
          isSearchMode
            ? "bg-card shadow-md sticky top-0"
            : "absolute bottom-0 left-0 right-0 px-4 pt-2 pb-0"
        )}
      >
        {!isSearchMode && renderAISuggestions && (
          <div className="pb-2">
            <SearchSuggestions
              suggestions={currentSuggestions}
              onSuggestionClick={handleSuggestionClick}
              title={currentSuggestionTitle}
            />
          </div>
        )}

        <div className={cn("flex items-center", isSearchMode ? "p-4 space-x-2" : "p-4")}> {/* Added p-4 for non-search mode */}
          {isSearchMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseSearchResults}
              className="p-1 rounded-full text-foreground hover:text-primary hover:bg-primary/10"
              aria-label="Close search results"
              data-close-search="true"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          )}
          <form onSubmit={handleQuerySubmit} className={cn(
              "flex items-center p-2 pr-3 flex-grow",
              isSearchMode ? "bg-background rounded-md border border-input" : "bg-card rounded-full shadow-lg"
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
              disabled={(isAnsweringQuery && isSearchMode)}
              aria-label="Submit search query"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {isSearchMode && renderAISuggestions && (
          <div className="px-4 pb-2 bg-card sm:bg-transparent">
             <SearchSuggestions
              suggestions={currentSuggestions}
              onSuggestionClick={handleSuggestionClick}
              title={currentSuggestionTitle}
            />
          </div>
        )}
        
        {isSearchMode && (
          <div className="px-4 pt-2 pb-3 border-b bg-card sm:bg-transparent">
            <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1">
                <Button variant="outline" size="sm" className="rounded-full shrink-0"><AdjustmentsHorizontalIcon className="mr-1.5 h-3.5 w-3.5"/>Filters</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Available Now</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Most Recommend</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Ratings</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary"><ArrowUpOnSquareIcon className="mr-1.5 h-3.5 w-3.5"/>Sort</Button>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className={cn(
          "flex-grow",
           showResultsArea ? "pt-4 px-2 sm:px-4" : "relative" 
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
          <div className="space-y-6 pb-6">
            {isAnsweringQuery && (
               <div className="flex flex-col justify-center items-center h-40 text-center">
                  <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-muted-foreground">bucks AI is thinking...</p>
               </div>
            )}

            {!isAnsweringQuery && aiResponse?.answer && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center">
                    <ChatBubbleLeftEllipsisIcon className="mr-2 h-5 w-5 text-primary"/>
                    {aiResponse.queryType === 'location_search' ? "AI Summary:" : "bucks AI says:"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{aiResponse.answer}</p>
                  {aiResponse.suggestedAction && (
                    <Button 
                        onClick={() => setActiveTab(aiResponse.suggestedAction?.targetTab as TabName)}
                        className="mt-4"
                    >
                        {aiResponse.suggestedAction.label}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {!isAnsweringQuery && aiResponse?.queryType === 'location_search' && aiResponse.locations && aiResponse.locations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground font-headline mb-3 flex items-center">
                    <MapPinIcon className="mr-2 h-5 w-5 text-primary"/> Places Found:
                </h3>
                <div className="space-y-3">
                  {aiResponse.locations.map((location, index) => (
                    <Card
                      key={index}
                      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleLocationItemClick(location)}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleLocationItemClick(location)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-3">
                          <MapPinIcon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-foreground">{location.name}</h4>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {isLoadingSimulatedResults && !isAnsweringQuery && ( 
                <div className="flex flex-col justify-center items-center h-40 text-center">
                    <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            )}

            {!isLoadingSimulatedResults && displayedSearchResults.length > 0 && (
              <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-foreground font-headline mb-0 flex items-center">
                    <MagnifyingGlassIcon className="mr-2 h-5 w-5 text-primary"/> Matching Profiles & Businesses:
                </h3>
                {displayedSearchResults.map((item) => {
                  if (item.type === 'individual') {
                    return (
                      <IndividualProfessionalCard
                        key={item.data.id}
                        profile={item.data}
                        onPress={() => handleIndividualCardPress(item.data.id)}
                        onEnquiryClick={() => handleCardEnquiryClick(item.data.id, 'individual')}
                        onCallClick={() => handleCardCallClick(item.data.id, item.data.phone, 'individual')}
                        onRecommendClick={() => handleCardRecommendClick(item.data.id, 'individual')}
                        onShareClick={() => handleCardShareClick(item.data.id, 'individual')}
                        onFollowClick={() => handleCardFollowClick(item.data.id, 'individual')}
                      />
                    );
                  } else if (item.type === 'business') {
                     console.log('[HomeScreen Render] Rendering BusinessProfileCard for:', item.data.name);
                    return (
                      <BusinessProfileCard
                        key={item.data.id}
                        business={item.data}
                        onPress={() => handleBusinessCardPress(item.data.id)}
                        onProductClick={(productId) => handleCardProductClick(item.data.id, productId)}
                        onAddToCartClick={(productId) => onAddToCart(item.data.id, productId)}
                        onEnquiryClick={() => handleCardEnquiryClick(item.data.id, 'business')}
                        onCallClick={() => handleCardCallClick(item.data.id, item.data.phone, 'business')}
                        onRecommendClick={() => handleCardRecommendClick(item.data.id, 'business')}
                        onShareClick={() => handleCardShareClick(item.data.id, 'business')}
                        onFollowClick={() => handleCardFollowClick(item.data.id, 'business')}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {isSearchMode && !isAnsweringQuery && !isLoadingSimulatedResults && displayedSearchResults.length === 0 && searchTerm.trim() !== '' && (
                <div className="text-center py-10 text-muted-foreground">
                    <p className="text-lg">No results found for "{searchTerm}".</p>
                    <p className="text-sm">Try a different search term or check your spelling.</p>
                </div>
            )}
            
            {isSearchMode && !isAnsweringQuery && !isLoadingSimulatedResults && displayedSearchResults.length === 0 && searchTerm.trim() === '' && (
                 <div className="text-center py-10 text-muted-foreground">
                     <InformationCircleIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg">Please enter a search term to find professionals or businesses.</p>
                </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default HomeScreen;
