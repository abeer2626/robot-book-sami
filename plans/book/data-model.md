# Data Model: AI/Spec-Driven Book Creation

**Feature**: 001-ai-book-creation
**Date**: 2025-01-13
**Source**: [book.spec.md](../../specs/book.spec.md)

## Core Entities

### Book
The root entity representing the complete publication.

**Attributes**:
- bookId: Unique identifier (UUID)
- title: Book title (string)
- description: Book description (string)
- version: Semantic version (string)
- authors: List of author information
- createdAt: Creation timestamp
- lastModified: Last update timestamp
- status: Publication status (draft/published/archived)

**Validation Rules**:
- title: Required, max 200 characters
- description: Required, max 1000 characters
- version: Must follow semantic versioning (X.Y.Z)

### Module
Major sections organizing related chapters.

**Attributes**:
- moduleId: Unique identifier (UUID)
- bookId: Reference to parent book
- title: Module title (string)
- description: Module description (string)
- order: Sequential order within book (integer)
- learningObjectives: List of learning objectives
- estimatedReadingTime: Minutes (integer)

**Validation Rules**:
- title: Required, max 100 characters
- order: Must be unique within book
- learningObjectives: At least 1 required

### Chapter
Individual content pages within modules.

**Attributes**:
- chapterId: Unique identifier (UUID)
- moduleId: Reference to parent module
- title: Chapter title (string)
- content: MDX content (text)
- frontmatter: MDX frontmatter (JSON)
- order: Sequential order within module (integer)
- specificationId: Reference to originating specification
- wordCount: Total words (integer)
- estimatedReadingTime: Minutes (integer)

**Validation Rules**:
- title: Required, max 100 characters
- content: Required, valid MDX syntax
- frontmatter: Must include title, description, learningObjectives
- specificationId: Required for traceability

### ContentFragment
AI-generated content pieces with provenance.

**Attributes**:
- fragmentId: Unique identifier (UUID)
- chapterId: Reference to parent chapter
- content: Generated content (text)
- specificationId: Reference to originating specification
- generatedBy: AI model identifier (string)
- generatedAt: Generation timestamp
- reviewedBy: Human reviewer (string, optional)
- reviewedAt: Review timestamp (optional)
- status: Review status (pending/approved/rejected)

**Validation Rules**:
- content: Required, valid MDX
- specificationId: Required for traceability
- status transitions must follow workflow

## Relationships

```
Book (1) -----> (*) Module
Module (1) ---> (*) Chapter
Chapter (1) --> (*) ContentFragment
Specification (1) -> (*) ContentFragment
```

## State Transitions

### Chapter Status Flow
```
draft -> in_review -> approved -> published
  ^                               |
  |                               v
rejected <- review_feedback -------
```

### ContentFragment Status Flow
```
generated -> pending_review -> approved
                |                |
                v                v
            rejected        incorporated
```

## Indexing Strategy

### Search Indexes
- Full-text search on chapter titles and content
- Module-based navigation index
- Specification-to-content traceability index
- Author-based content index

### Performance Indexes
- Created/modified timestamps for recent changes
- Word count for reading time calculations
- Status-based filtering for deployment workflows

## Data Storage Format

### File System Structure
```
/content/
  book.json           # Book metadata
  modules/
    {moduleId}.json   # Module definitions
    {moduleId}/       # Module chapters
      {chapterId}.mdx # Chapter content
```

### Metadata Format
```json
{
  "bookId": "uuid",
  "title": "Book Title",
  "modules": [
    {
      "moduleId": "uuid",
      "title": "Module Title",
      "chapters": [
        {
          "chapterId": "uuid",
          "title": "Chapter Title",
          "file": "path/to/chapter.mdx",
          "specificationId": "uuid"
        }
      ]
    }
  ]
}
```