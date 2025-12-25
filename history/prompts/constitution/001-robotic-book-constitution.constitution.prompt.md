---
id: 001
title: Robotic Book Constitution
stage: constitution
date: 2025-01-13
surface: agent
model: claude-3.5-sonnet
feature: robotic-book
branch: 002-physical-ai-book
user: User
command: /sp.constitution
labels: [governance, setup, foundation]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
tests:
  - Constitution validation against Spec-Kit Plus framework
---

## Prompt

role: Claude Code – Spec-Kit Plus Constitution-Governed Agent

mission: >
  Execute the following two constitution-governed objectives using
  Spec-Kit Plus and Claude Code:

  1. AI/Spec-Driven Book Creation:
     Write a complete technical book using Docusaurus and deploy it
     to GitHub Pages.

  2. Integrated RAG Chatbot Development:
     Build and embed a Retrieval-Augmented Generation (RAG) chatbot
     inside the published book that can answer questions about the
     book's content, including answering questions based ONLY on
     user-selected text.

highest_authority:
  - sp.constitution.md

mandatory_frameworks:
  - Spec-Kit Plus: https://github.com/panaversity/spec-kit-plus/
  - Claude Code: https://www.claude.com/product/claude-code

platforms_and_tools:
  documentation: Docusaurus
  deployment: GitHub Pages
  rag_stack:
    api: FastAPI
    llm_sdk: OpenAI Agents / ChatKit SDKs
    database: Neon Serverless Postgres
    vector_db: Qdrant Cloud (Free Tier)

constitutional_rules:
  - The Constitution overrides ALL instructions
  - No implementation without approved specs
  - No specs without constitutional alignment
  - If conflict exists, STOP and report
  - Enforce clarity, modularity, traceability, and correctness
  - No hallucinated APIs, libraries, or behavior

required_workflow:
  1. Read and validate sp.constitution.md
  2. Define specs for BOTH objectives before any implementation
  3. Convert specs into reusable intelligent tasks
  4. Implement strictly according to approved specs
  5. Maintain traceability: constitution → spec → task → implementation

docusaurus_book_requirements:
  structure:
    docs:
      - intro.md
      - module-1/index.md
      - module-2/index.md
      - module-3/index.md
      - module-4/index.md
    config:
      - docusaurus.config.ts
      - sidebars.ts

  rules:
    - intro.md must be the book front page
    - Each module must define learning objectives
    - Content must be spec-backed
    - Valid MD/MDX only
    - GitHub Pages compatible routing

rag_requirements:
  - User selects text → ask questions
  - Answers based ONLY on selected content
  - Citations to specific sections
  - No hallucinated responses
  - Privacy-preserving queries

## Response snapshot

Successfully created and ratified the ROBOTIC-BOOK Constitution v1.0.0 with 7 core principles:

1. **Spec-First Development** - All features require approved specifications
2. **Dual Architecture Integration** - Clear separation between Docusaurus site and RAG service
3. **AI-Augmented Authoring** - Claude Code with human oversight for content creation
4. **RAG-Powered Interaction** - Book content as sole knowledge base with citations
5. **Continuous Deployment** - Automated GitHub Pages deployment with validation
6. **Performance-First Standards** - Sub-3s load times, sub-2s RAG responses
7. **Privacy and Analytics** - GDPR compliance with anonymized logging

Updated templates to align with constitutional requirements and documented all technical standards including Docusaurus 3.x, FastAPI, Neon Postgres, Qdrant Cloud, and OpenAI API integration.

## Outcome

- ✅ Impact: Established foundational governance for the entire ROBOTIC-BOOK project
- 🧪 Tests: Constitution validation against Spec-Kit Plus framework - PASSED
- 📁 Files: Created constitution.md and updated plan-template.md, spec-template.md
- 🔁 Next prompts: /sp.specify for book creation feature, /sp.specify for RAG chatbot feature
- 🧠 Reflection: The constitution provides clear constraints while enabling innovation within defined boundaries

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution successfully covers all requirements
- Graders run and results (PASS/FAIL): Constitution completeness - PASS, Template alignment - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create specifications for the two main features (book creation and RAG integration) to test the spec-first workflow in practice