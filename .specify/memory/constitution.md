<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0 (Initial ratification)
- Modified principles: All 7 principles defined for the first time
- Added sections: Development Workflow, Technical Standards, Governance
- Templates requiring updates: ✅ plan-template.md (Constitution Check aligned), ⚠ spec-template.md (book-specific validation needed), ⚠ tasks-template.md (RAG integration tasks)
- Follow-up TODOs: Add book-specific constraints to spec template, add RAG task patterns to tasks template
-->

# ROBOTIC-BOOK Constitution

## Core Principles

### I. Spec-First Development
Every feature MUST start with a ratified specification. No code shall be written without an approved spec that includes user stories, functional requirements, and measurable success criteria. Specs are living documents that MUST be updated when requirements change.

### II. Dual Architecture Integration
The project consists of two tightly integrated but architecturally distinct components: (1) Docusaurus-based static documentation site and (2) FastAPI-based RAG chatbot service. These components MUST maintain clear separation of concerns while providing seamless user experience. Integration points MUST be explicitly documented and versioned.

### III. AI-Augmented Authoring
All book content MUST be created using Spec-Kit Plus workflow with Claude Code. Human oversight is mandatory for all AI-generated content. Each piece of content MUST trace back to an approved specification and be validateable against its acceptance criteria.

### IV. RAG-Powered Interaction
The chatbot MUST use Retrieval-Augmented Generation with the actual book content as its sole knowledge base. The system MUST support user-selected text context for questions. All responses MUST include citations to specific book sections. No hallucinated or external knowledge is permitted.

### V. Continuous Deployment
All changes MUST deploy automatically to GitHub Pages via pull request. The deployment pipeline MUST run validation checks including MDX syntax, link verification, and RAG service health checks. No manual deployment steps are permitted.

### VI. Performance-First Standards
The complete system (book + chatbot) MUST load in under 3 seconds on standard mobile connections. The RAG API MUST respond in under 2 seconds for 95th percentile queries. Bundle size MUST be optimized and lazy loading implemented for all non-critical resources.

### VII. Privacy and Analytics
User data MUST be handled according to GDPR principles. No personal data is stored without explicit consent. All RAG queries and responses MUST be logged for service improvement but with privacy preservation. Analytics MUST be anonymized and aggregated.

## Technical Standards

### Technology Stack
- **Frontend**: Docusaurus 3.x with React 18+, TypeScript, MDX
- **Backend**: FastAPI with Python 3.11+, async/await patterns
- **Database**: Neon Serverless Postgres with connection pooling
- **Vector Storage**: Qdrant Cloud (Free Tier) with proper indexing strategy
- **LLM Integration**: OpenAI API with proper fallback handling
- **Deployment**: GitHub Pages for frontend, Fly.io/Railway for backend

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint + Prettier with shared config across projects
- Minimum 90% test coverage for RAG service
- No external dependencies without security review
- All API endpoints MUST have OpenAPI documentation

### Content Standards
- All book content in MDX format with proper frontmatter
- Code examples MUST be tested and verified
- Diagrams MUST be in Mermaid or SVG format
- All images MUST include alt text and responsive sizing
- Content MUST be screen reader accessible

## Development Workflow

### Feature Development Process
1. Specification creation using `/sp.specify` command
2. Architecture planning with `/sp.plan` command
3. Task generation via `/sp.tasks` command
4. Implementation following `/sp.implement` workflow
5. PR creation with `/sp.git.commit_pr` automation
6. Deployment and monitoring

### Quality Gates
- All PRs require two approvals
- Automated tests MUST pass
- MDX build MUST succeed
- RAG service health checks MUST pass
- Performance budgets MUST be respected
- Security scans MUST be clean

### Branch Strategy
- `main`: Always deployable, protected branch
- `develop`: Integration branch for features
- `feature/###-name`: Feature branches from develop
- `hotfix/###-name`: Critical fixes from main

## Governance

### Amendment Process
Constitutional amendments require:
1. Proposal with clear rationale and impact analysis
2. 48-hour review period for all contributors
3. 75% supermajority approval from maintainers
4. Version increment according to semantic versioning
5. Migration plan for existing artifacts

### Compliance Verification
- All templates MUST be validated against constitution quarterly
- ADRs MUST be created for any constitutional exceptions
- Non-compliance MUST be documented with remediation timeline
- Compliance status MUST be included in all PR descriptions

### Decision Making
- Technical decisions follow ADR process
- Architectural changes require RFC (Request for Comments)
- Breaking changes MUST be announced 30 days in advance
- Emergency decisions MUST be documented and reviewed within 7 days

**Version**: 1.0.0 | **Ratified**: 2025-01-13 | **Last Amended**: 2025-01-13