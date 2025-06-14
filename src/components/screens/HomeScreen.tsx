
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, X, PocketKnife, Filter, ArrowDownUp, ShoppingCart, LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchSuggestions from '@/components/home/SearchSuggestions';
import { suggestSearchTerms, type SuggestSearchTermsInput } from '@/ai/flows/suggest-search-terms';
import { answerGeneralQuery, type GeneralQueryInput, type GeneralQueryOutput, type LocationResult } from '@/ai/flows/answer-general-query-flow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

import IndividualProfessionalCard, { type IndividualProfessionalCardData } from '@/components/search/IndividualProfessionalCard';
import BusinessProfileCard from '@/components/search/BusinessProfileCard';
import type { TabName, BusinessProfileCardData as BusinessCardDataType, BusinessProductCardItem } from '@/types';

const initialPlaceholders = [
  "What are you looking for?",
  "Search professionals, services, or businesses...",
  "e.g., Interior Designer, Plumber, Cafe",
  "Find local experts...",
  "Ask Locality Hub AI...",
];

export type SearchResultItem =
  | { type: 'individual'; data: IndividualProfessionalCardData }
  | { type: 'business'; data: BusinessCardDataType };

const simulatedSearchResults: SearchResultItem[] = [
  {
    type: 'individual',
    data: {
      id: 'individual-jenson-1', // Matches ID for SkillsetProfileScreen navigation
      name: 'Jenson Harris',
      avatarUrl: 'https://placehold.co/80x80.png',
      avatarAiHint: 'man smiling professional',
      professionalTitle: 'Interior Home Stylist',
      previewImages: [
        { url: 'https://placehold.co/200x150.png', aiHint: 'modern living room' },
        { url: 'https://placehold.co/200x150.png', aiHint: 'stylish kitchen' },
        { url: 'https://placehold.co/200x150.png', aiHint: 'cozy bedroom' },
        { url: 'https://placehold.co/200x150.png', aiHint: 'elegant dining area' },
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
      id: 'business-hotgriddle-1', // Matches ID for UserBusinessProfileDetailScreen navigation
      name: 'Hot Griddle Restaurant',
      logoUrl: 'https://placehold.co/80x80.png',
      logoAiHint: 'restaurant logo',
      briefInfo: '10-15 mins • 3km away • BTM layout',
      tagline: "International, locally sourced specialties. Best Griddle in town!",
      averageRating: 4.5,
      totalReviews: 232,
      products: [
        { id: 'p-biryani-1', name: 'Mutton Biryani (Serves 2)', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'mutton biryani', price: '299', discountPrice: '229', discountPercentage: '22%' },
        { id: 'p-pizza-1', name: 'Spicy Chicken Pizza', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'pizza slice', price: '350' },
        { id: 'p-burger-1', name: 'Classic Griddle Burger', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'burger', price: '180' },
      ],
      phone: '+91 9876543210',
    },
  },
    {
    type: 'individual',
    data: {
      id: 'prof2-ux-designer-skillset', // Made up ID for a skillset
      name: 'Alicia Keyson',
      avatarUrl: 'https://placehold.co/80x80.png',
      avatarAiHint: 'woman architect',
      professionalTitle: 'Lead UX Designer',
      previewImages: [
        { url: 'https://placehold.co/200x150.png', aiHint: 'app interface' },
        { url: 'https://placehold.co/200x150.png', aiHint: 'website mockup' },
      ],
      shortBio: 'Crafting intuitive and engaging digital experiences. Expert in user research, prototyping, and usability testing.',
      averageRating: 4.9,
      totalReviews: 210,
      recommendationsCount: 180,
      phone: '555-0102',
      email: 'alicia.k@example.com',
    },
  },
  {
    type: 'business',
    data: {
      id: 'business-aromas-2', // Matches ID for UserBusinessProfileDetailScreen navigation (using 2 from page.tsx)
      name: 'Aromas of Biryani Cafe',
      logoUrl: 'https://placehold.co/80x80.png',
      logoAiHint: 'biryani shop',
      briefInfo: '10-15 mins • 3km away • BTM layout',
      tagline: 'Authentic Biryani Experience & Cafe Delights',
      averageRating: 4.2,
      totalReviews: 150,
       products: [
        { id: 'aroma-p1', name: 'Chicken Dum Biryani', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'dum biryani', price: '280' },
        { id: 'aroma-p2', name: 'Paneer Biryani Special', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'paneer biryani', price: '250', discountPrice: '220', discountPercentage: '10%' },
        { id: 'aroma-coffee-1', name: 'Cappuccino Cafe Special', imageUrl: 'https://placehold.co/150x150.png', imageAiHint: 'coffee cup', price: '120' },
      ],
      phone: '+91 9123456789',
    },
  },
];

interface HomeScreenProps {
  setActiveTab: (tab: TabName) => void;
  onSelectIndividualProfile: (profileId: string) => void; // Kept for potential general profiles
  onSelectBusinessProfile: (profileId: string | number) => void;
  onSelectSkillsetProfile: (skillsetProfileId: string) => void; // For specific skill profiles
  onAddToCart: (businessId: string | number, productId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  setActiveTab,
  onSelectIndividualProfile,
  onSelectBusinessProfile,
  onSelectSkillsetProfile,
  onAddToCart
}) => {
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
    if (e.target.value.trim() === '' && isSearchMode) { // Clear results if search term cleared in search mode
        setDisplayedSearchResults([]);
        setAiTextAnswer(null);
        setFoundLocations([]);
        setCurrentQueryType(null);
    }
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (!isSearchMode) { // If focusing from map view, don't immediately set to search mode
      // but allow suggestions to show
    }
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
    if (showSuggestions && searchTerm.trim() !== '' && !isAnsweringQuery && currentQueryType === null) {
      const debounceTimer = setTimeout(() => {
        fetchAiSuggestions(searchTerm);
      }, 750);
      return () => clearTimeout(debounceTimer);
    } else if (!showSuggestions || searchTerm.trim() === '' || currentQueryType !== null) {
      if(!isLoadingAiSuggestions) setAiSuggestions([]);
    }
  }, [searchTerm, showSuggestions, fetchAiSuggestions, isAnsweringQuery, currentQueryType, isLoadingAiSuggestions]);


  const performSimulatedSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    console.log('[HomeScreen] performSimulatedSearch called with query:', `"${trimmedQuery}" (lowercase: "${lowerQuery}")`);

    if (trimmedQuery === '') {
        console.log('[HomeScreen] Empty query, clearing simulated results.');
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
          
          console.log(`[HomeScreen] Business Check: ${item.data.name}`);
          console.log(`  Query: "${lowerQuery}"`);
          console.log(`  Name (${item.data.name.toLowerCase()}): ${nameMatch}`);
          console.log(`  Tagline (${item.data.tagline?.toLowerCase()}): ${taglineMatch}`);
          console.log(`  Products: ${productMatch}`);
          console.log(`  Overall Match: ${match}`);
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
      setAiTextAnswer(null);
      setFoundLocations([]);
      setCurrentQueryType(null);
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

      setAiTextAnswer(result.answer);
      setCurrentQueryType(result.queryType);
      if (result.queryType === 'location_search' && result.locations) {
        setFoundLocations(result.locations);
      } else {
        setFoundLocations([]);
      }
    } catch (error) {
      console.error("Error answering query:", error);
      setAiTextAnswer("Sorry, I couldn't get an AI answer for that. Please try again.");
      setCurrentQueryType('general');
      setFoundLocations([]);
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
    setAiTextAnswer(null);
    setFoundLocations([]);
    setCurrentQueryType(null);
    setShowSuggestions(false);
    setAiSuggestions([]);
    setDisplayedSearchResults([]);
    setCurrentPlaceholderIndex(0);
  };

  let currentSuggestions: string[] = [];
  let currentSuggestionTitle: string = '';

  const shouldTryShowSuggestionsContainer = showSuggestions &&
                                          (!isSearchMode || (isSearchMode && !aiTextAnswer && !isAnsweringQuery && foundLocations.length === 0 && displayedSearchResults.length === 0));


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
    console.log(`Individual card pressed, navigating to skillset profile: ${profileId}`);
    // Assuming individual cards always link to skillset profiles now
    onSelectSkillsetProfile(profileId);
  };
  const handleBusinessCardPress = (id: string | number) => {
    console.log(`Business card pressed: ${id}`);
    onSelectBusinessProfile(id);
  };
  
  const handleCardEnquiryClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Enquiry for ${type}: ${id}` });
  const handleCardCallClick = (id: string | number, phone: string | undefined, type: 'individual' | 'business') => toast({ title: `Call ${type}: ${id}`, description: phone ? `Dialing ${phone}` : "No phone." });
  const handleCardRecommendClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Recommend ${type}: ${id}` });
  const handleCardShareClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Share ${type}: ${id}` });
  const handleCardFollowClick = (id: string | number, type: 'individual' | 'business') => toast({ title: `Follow ${type}: ${id}` });
  const handleCardProductClick = (businessId: string | number, productId: string) => toast({ title: `Product ${productId} from Business ${businessId} clicked.` });

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
              disabled={(isAnsweringQuery && isSearchMode)}
              aria-label="Submit search query"
            >
              <Search className="w-5 h-5" />
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
                <Button variant="outline" size="sm" className="rounded-full shrink-0"><Filter className="mr-1.5 h-3.5 w-3.5"/>Filters</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Available Now</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Most Recommend</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">Ratings</Button>
                <Button variant="ghost" size="sm" className="rounded-full shrink-0 text-muted-foreground hover:text-primary"><ArrowDownUp className="mr-1.5 h-3.5 w-3.5"/>Sort</Button>
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
                  <p className="text-muted-foreground">Locality Hub AI is thinking...</p>
               </div>
            )}

            {!isAnsweringQuery && aiTextAnswer && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline flex items-center">
                    <PocketKnife className="mr-2 h-5 w-5 text-primary"/>
                    {currentQueryType === 'location_search' ? "AI Summary:" : "Locality Hub AI says:"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{aiTextAnswer}</p>
                </CardContent>
              </Card>
            )}

            {!isAnsweringQuery && currentQueryType === 'location_search' && foundLocations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground font-headline mb-3 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-primary"/> Places Found:
                </h3>
                <div className="space-y-3">
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
                    <Search className="mr-2 h-5 w-5 text-primary"/> Matching Profiles & Businesses:
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

    