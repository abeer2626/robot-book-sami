# Search System Documentation

## Overview

The robotics textbook includes a powerful search indexing system that enables users to quickly find content across all modules, chapters, and sections. The search system provides:

- **Full-text search** across all markdown files
- **Relevance ranking** with intelligent scoring
- **Fuzzy matching** for typo tolerance
- **Auto-suggestions** for improved UX
- **Search result highlighting** with context snippets
- **Type-based filtering** (modules, chapters, exercises, etc.)

## Architecture

### Core Components

1. **Search Indexer** (`src/lib/searchIndex.ts`)
   - Crawls all markdown files in the docs directory
   - Extracts content, metadata, and structure
   - Builds a searchable index with weighted terms

2. **Search Engine** (`src/lib/searchUtils.ts`)
   - Performs searches with relevance scoring
   - Implements fuzzy matching and typo tolerance
   - Provides auto-suggestions and popular searches
   - Filters results by type and module

3. **Global Search Component** (`src/components/search/GlobalSearch.tsx`)
   - React component for the search UI
   - Handles keyboard shortcuts (Ctrl/Cmd + K)
   - Displays results with highlighting and context
   - Manages search state and navigation

## Features

### Search Indexing

The indexer extracts:

- **Document metadata** from frontmatter (title, description, keywords)
- **Content hierarchy** (headings, sections, subsections)
- **Important terms** (emphasized text, code, technical terms)
- **Learning objectives** and reading time estimates
- **Module and chapter relationships**

### Search Algorithm

The search engine uses multiple factors for relevance scoring:

1. **Title matches** (100x weight)
2. **Description matches** (80x weight)
3. **Heading matches** (10-60x weight based on level)
4. **Keyword matches** (60x weight)
5. **Learning objective matches** (40x weight)
6. **Content matches** (20x weight)

Additional boosts:
- **Type-based**: Modules (1.2x), Chapters (1.1x)
- **Recency-based**: Later modules get slight boost
- **Exact matches**: Full word matches score higher

### User Interface Features

- **Keyboard navigation**: Arrow keys, Enter, Escape
- **Auto-complete suggestions** as you type
- **Result highlighting** with context snippets
- **Match badges** showing where terms were found
- **Responsive design** for mobile devices
- **Dark mode support**

## Usage

### Building the Search Index

Before deploying or running the app, build the search index:

```bash
# Build search index only
npm run build:search

# Build search index and site
npm run build:all
```

This creates `static/search-index.json` that the frontend loads.

### Development

For development with hot-reloading:

1. Build the initial index: `npm run build:search`
2. Start the dev server: `npm start`
3. Rebuild index when docs change: `npm run build:search`

### Integration

The search component is automatically included in the site navigation. Users can:

1. Click the search button or press `Ctrl/Cmd + K`
2. Type to search with real-time suggestions
3. Navigate results with arrow keys
4. Press Enter or click to go to a result
5. Press Escape to close

## Configuration

### Search Options

The search engine accepts various options:

```typescript
const options: SearchOptions = {
  query: "kinematics",
  limit: 10,           // Maximum results
  moduleFilter: "module-02",  // Filter by module
  typeFilter: ["chapter", "section"],  // Filter by type
  boostRecent: true,   // Boost recent content
  fuzzyThreshold: 0.6  // Fuzzy matching threshold
};
```

### Customization

You can customize:

- **Search weights** in `searchUtils.ts`
- **Stop words** for better matching
- **Fuzzy threshold** for typo tolerance
- **Result highlighting** and context length
- **UI styling** in `GlobalSearch.module.css`

## Performance

### Optimization Features

- **Debounced search** (300ms) to reduce API calls
- **Limited results** to prevent UI overload
- **Efficient indexing** with cached metadata
- **Lightweight algorithm** for fast client-side search

### Index Size

The search index is optimized for:
- Small file size (< 100KB for 29 documents)
- Fast JSON parsing
- Minimal memory footprint
- Quick instantiation

## Troubleshooting

### Common Issues

1. **Search not working**
   - Ensure `static/search-index.json` exists
   - Check network tab for failed fetch
   - Verify JSON is valid

2. **No results found**
   - Check query spelling
   - Try broader terms
   - Use auto-suggestions

3. **Slow performance**
   - Reduce result limit
   - Increase debounce time
   - Optimize document content

### Debug Mode

Enable debug logging in browser console:

```javascript
localStorage.setItem('search-debug', 'true');
```

## Future Enhancements

Potential improvements:

1. **Analytics tracking** for popular searches
2. **Search history** and saved queries
3. **Advanced filters** (date, author, tags)
4. **Full-text indexing** for code blocks
5. **Search result grouping** by module
6. **Voice search** support
7. **Offline search** with Service Worker