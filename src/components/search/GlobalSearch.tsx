import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import { SearchEngine, SearchResult, SearchOptions } from '../../lib/searchUtils';
import { buildSearchIndex, SearchIndex } from '../../lib/searchIndex';
import styles from './GlobalSearch.module.css';

// Search state interface
interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  isLoading: boolean;
  selectedIndex: number;
  showSuggestions: boolean;
}

export default function GlobalSearch(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchEngine, setSearchEngine] = useState<SearchEngine | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    suggestions: [],
    isLoading: false,
    selectedIndex: 0,
    showSuggestions: false
  });
  const [indexLoaded, setIndexLoaded] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Initialize search index on component mount
  useEffect(() => {
    initializeSearch();
  }, []);

  const initializeSearch = async () => {
    try {
      // Try to load the pre-built index from public directory
      const response = await fetch('/static/search-index.json');
      if (response.ok) {
        const index: SearchIndex = await response.json();
        const engine = new (await import('../../lib/searchUtils')).SearchEngine(index);
        setSearchEngine(engine);
        setIndexLoaded(true);
      } else {
        console.warn('Search index not found, using empty index');
        throw new Error('Index not found');
      }
    } catch (error) {
      console.error('Failed to load search index:', error);
      // Initialize with empty index for fallback
      const emptyIndex: SearchIndex = {
        documents: [],
        metadata: {
          totalDocuments: 0,
          lastUpdated: new Date().toISOString(),
          modules: []
        }
      };
      const engine = new (await import('../../lib/searchUtils')).SearchEngine(emptyIndex);
      setSearchEngine(engine);
      setIndexLoaded(true);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to toggle search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }

      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }

      // Arrow navigation in results
      if (isOpen && searchState.results.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.min(prev.selectedIndex + 1, prev.results.length - 1)
          }));
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0)
          }));
        } else if (event.key === 'Enter') {
          event.preventDefault();
          if (searchState.results[searchState.selectedIndex]) {
            handleResultClick(searchState.results[searchState.selectedIndex]);
          }
        }
      }

      // Arrow navigation in suggestions
      if (isOpen && searchState.showSuggestions && searchState.suggestions.length > 0) {
        if (event.key === 'ArrowDown' && !event.shiftKey) {
          event.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.min(prev.selectedIndex + 1, prev.suggestions.length - 1)
          }));
        } else if (event.key === 'ArrowUp' && !event.shiftKey) {
          event.preventDefault();
          setSearchState(prev => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0)
          }));
        } else if (event.key === 'Tab') {
          event.preventDefault();
          if (searchState.suggestions[searchState.selectedIndex]) {
            handleSuggestionClick(searchState.suggestions[searchState.selectedIndex]);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchState]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    },
    [searchEngine]
  );

  // Perform actual search
  const performSearch = useCallback((query: string) => {
    if (!searchEngine || !query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        showSuggestions: false
      }));
      return;
    }

    setSearchState(prev => ({ ...prev, isLoading: true }));

    const searchOptions: SearchOptions = {
      query,
      limit: 8,
      fuzzyThreshold: 0.6
    };

    const results = searchEngine.search(searchOptions);
    const suggestions = searchEngine.getSuggestions(query, 5);

    setSearchState(prev => ({
      ...prev,
      results,
      suggestions,
      isLoading: false,
      selectedIndex: 0,
      showSuggestions: results.length === 0 && suggestions.length > 0
    }));
  }, [searchEngine]);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchState(prev => ({
      ...prev,
      query: value,
      selectedIndex: 0
    }));
    debouncedSearch(value);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    handleClose();
    // Navigate to result URL
    window.location.href = result.url;
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchState(prev => ({
      ...prev,
      query: suggestion,
      showSuggestions: false
    }));
    performSearch(suggestion);
    searchInputRef.current?.focus();
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    setSearchState(prev => ({
      ...prev,
      query: '',
      results: [],
      suggestions: [],
      showSuggestions: false
    }));
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'module':
        return '📚';
      case 'chapter':
        return '📖';
      case 'section':
        return '📝';
      case 'exercise':
        return '✏️';
      case 'resource':
        return '📋';
      default:
        return '📄';
    }
  };

  // Get module color
  const getModuleColor = (module: string) => {
    const colors = {
      'module-01': 'var(--ifm-color-blue)',
      'module-02': 'var(--ifm-color-green)',
      'module-03': 'var(--ifm-color-purple)',
      'module-04': 'var(--ifm-color-orange)',
      'module-05': 'var(--ifm-color-red)'
    };
    return colors[module as keyof typeof colors] || 'var(--ifm-color-gray)';
  };

  // Highlight matching text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (!indexLoaded) {
    return (
      <div className={styles.globalSearch}>
        <button className={styles.searchTrigger} disabled>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span className={styles.searchTriggerText}>Loading...</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.globalSearch}>
      {/* Search Trigger Button */}
      <button
        className={styles.searchTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <span className={styles.searchTriggerText}>Search</span>
        <kbd className={styles.searchTriggerShortcut}>⌘K</kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className={styles.searchModal}>
          <div className={styles.searchModalContent}>
            {/* Search Input */}
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder="Search modules, chapters, and topics..."
                value={searchState.query}
                onChange={handleInputChange}
                autoFocus
              />
              {searchState.query && (
                <button
                  className={styles.clearButton}
                  onClick={() => {
                    setSearchState(prev => ({ ...prev, query: '', results: [], suggestions: [] }));
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Loading State */}
            {searchState.isLoading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <span>Searching...</span>
              </div>
            )}

            {/* Suggestions */}
            {!searchState.isLoading && searchState.showSuggestions && (
              <div ref={resultsRef} className={styles.suggestions}>
                <div className={styles.suggestionsHeader}>Suggestions</div>
                {searchState.suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`${styles.suggestion} ${index === searchState.selectedIndex ? styles.suggestionSelected : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <svg className={styles.suggestionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                    <span dangerouslySetInnerHTML={{ __html: highlightText(suggestion, searchState.query) }} />
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {!searchState.isLoading && searchState.results.length > 0 && (
              <div ref={resultsRef} className={styles.results}>
                {searchState.results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`${styles.result} ${index === searchState.selectedIndex ? styles.resultSelected : ''}`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className={styles.resultIcon} style={{ color: getModuleColor(result.module) }}>
                      {getTypeIcon(result.type)}
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitle}>
                        <span dangerouslySetInnerHTML={{ __html: highlightText(result.title, searchState.query) }} />
                        <span className={styles.resultType}>({result.type})</span>
                      </div>
                      <div className={styles.resultModule} style={{ color: getModuleColor(result.module) }}>
                        {result.module.replace('module-', 'Module ')}
                      </div>
                      {result.description && (
                        <div className={styles.resultDescription}>
                          <span dangerouslySetInnerHTML={{ __html: highlightText(result.description, searchState.query) }} />
                        </div>
                      )}
                      {result.highlights.length > 0 && (
                        <div className={styles.resultHighlights}>
                          {result.highlights.slice(0, 2).map((highlight, i) => (
                            <div key={i} className={styles.resultHighlight}>
                              <span dangerouslySetInnerHTML={{ __html: highlightText(highlight, searchState.query) }} />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={styles.resultMatches}>
                        {result.matches.title && <span className={styles.matchBadge}>Title</span>}
                        {result.matches.headings && <span className={styles.matchBadge}>Heading</span>}
                        {result.matches.description && <span className={styles.matchBadge}>Description</span>}
                        {result.matches.keywords && <span className={styles.matchBadge}>Keyword</span>}
                        {result.matches.content && <span className={styles.matchBadge}>Content</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!searchState.isLoading && searchState.query && searchState.results.length === 0 && !searchState.showSuggestions && (
              <div className={styles.noResults}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>No results found for "{searchState.query}"</p>
                <p>Try different keywords or browse the modules</p>
              </div>
            )}

            {/* Empty State */}
            {!searchState.isLoading && !searchState.query && (
              <div className={styles.emptyState}>
                <h3>Quick Search</h3>
                <p>Search through all modules and chapters</p>
                <div className={styles.quickLinks}>
                  <Link to="/docs/module-01" className={styles.quickLink}>
                    <span className={styles.quickLinkIcon}>📚</span>
                    <span>Module 1: Foundations</span>
                  </Link>
                  <Link to="/docs/module-02" className={styles.quickLink}>
                    <span className={styles.quickLinkIcon}>📚</span>
                    <span>Module 2: Core Concepts</span>
                  </Link>
                  <Link to="/docs/module-03" className={styles.quickLink}>
                    <span className={styles.quickLinkIcon}>📚</span>
                    <span>Module 3: Advanced Topics</span>
                  </Link>
                  <Link to="/docs/module-04" className={styles.quickLink}>
                    <span className={styles.quickLinkIcon}>📚</span>
                    <span>Module 4: Applications</span>
                  </Link>
                  <Link to="/docs/module-05" className={styles.quickLink}>
                    <span className={styles.quickLinkIcon}>📚</span>
                    <span>Module 5: Capstone</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}