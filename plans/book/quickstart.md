# Quickstart Guide: AI/Spec-Driven Book Creation

**Feature**: 001-ai-book-creation
**Version**: 1.0.0
**Last Updated**: 2025-01-13

## Prerequisites

- Node.js 18+ installed
- Git repository initialized with GitHub Pages enabled
- Claude Code API access configured
- Familiarity with Markdown and technical writing

## Initial Setup (5 minutes)

### 1. Initialize Book Structure
```bash
# Run the book initialization script
npm run init-book

# This creates:
# - Docusaurus configuration
# - Module structure (module-01 to module-04)
# - Navigation setup
# - GitHub Actions workflows
```

### 2. Verify Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm start

# View at http://localhost:3000
```

### 3. Configure Claude Code Integration
```bash
# Create environment file
cp .env.example .env

# Edit .env with your Claude Code API key
CLAUDE_API_KEY=your_api_key_here
```

## Creating Your First Content (15 minutes)

### 1. Create Chapter Specification
Create a new file in your specs directory:
```markdown
---
title: "Introduction to Robotics"
learningObjectives:
  - Understand basic robotics concepts
  - Identify key components
estimatedTime: 15
---

# Specification for Introduction Chapter

## Content Requirements
- Define robotics and its applications
- Explain key components (sensors, actuators, controllers)
- Provide real-world examples
```

### 2. Generate Content with AI
```bash
# Generate content from specification
npm run generate-content -- --spec specs/intro.md --output docs/module-01/chapters/intro.mdx
```

### 3. Review and Edit
- Review generated content for accuracy
- Add personal insights and examples
- Ensure all learning objectives are addressed
- Validate MDX syntax: `npm run validate-content`

## Publishing Your Book (5 minutes)

### 1. Commit Changes
```bash
git add .
git commit -m "Add introduction chapter"
git push
```

### 2. Automatic Deployment
- GitHub Actions will automatically build and deploy
- Your book will be available at your GitHub Pages URL
- Build typically completes within 3-5 minutes

## Common Workflows

### Adding a New Module
```bash
# Create module directory
mkdir docs/module-05

# Create module index
touch docs/module-05/index.md

# Add to navigation (auto-detected)
```

### Updating Content
1. Edit MDX files directly or regenerate from specs
2. Run content validation: `npm run validate-content`
3. Commit and push for automatic deployment

### Content Validation
```bash
# Check all content
npm run validate-content

# Check specific file
npm run validate-content -- docs/module-01/chapters/intro.mdx

# Fix common issues automatically
npm run fix-content
```

## Best Practices

### Content Organization
- Each module should focus on a specific topic area
- Chapters should be 500-2000 words
- Include code examples for technical content
- Add diagrams using Mermaid syntax

### Specification Writing
- Be specific about learning objectives
- Include examples of what to cover
- Specify target audience level
- Reference related content

### AI-Assisted Writing
- Always review AI-generated content
- Add your expertise and unique insights
- Ensure technical accuracy
- Verify code examples work correctly

## Troubleshooting

### Common Issues

**Build fails on GitHub Pages**
- Check MDX syntax errors
- Verify all internal links are valid
- Ensure images are in static directory

**Content not appearing**
- Verify file is in correct module directory
- Check frontmatter includes required fields
- Run `npm run validate-content` to find issues

**Claude Code integration not working**
- Verify API key in .env file
- Check internet connectivity
- Review API quota limits

### Getting Help

- Check console logs for specific error messages
- Review validation output for content issues
- Consult Docusaurus documentation for configuration
- Join our community discussions for support

## Next Steps

1. Complete your first module with 3-4 chapters
2. Set up content review workflow
3. Configure custom domain for GitHub Pages
4. Add analytics to track reader engagement
5. Consider contributing to the template improvements