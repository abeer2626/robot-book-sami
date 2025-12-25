#!/bin/bash
# Vercel deployment script for the RAG backend

cd rag-backend

# Install dependencies
pip install -r requirements.txt

# Start the application with uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000