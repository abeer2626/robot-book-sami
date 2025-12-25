#!/usr/bin/env python3
"""
Script to check Railway deployment logs and status
Provides instructions for accessing logs via Railway dashboard
"""

import webbrowser
from datetime import datetime

def print_header():
    print("=" * 70)
    print("RAILWAY DEPLOYMENT LOG CHECKER")
    print("=" * 70)
    print(f"Time: {datetime.now().isoformat()}")
    print("\n")

def print_direct_links():
    """Print direct links to Railway resources"""
    print("DIRECT LINKS TO RAILWAY RESOURCES:")
    print("-" * 40)

    print("\n1. RAILWAY DASHBOARD:")
    print("   https://railway.app/dashboard")

    print("\n2. NEW PROJECT (DEPLOY FROM GITHUB):")
    print("   https://railway.app/new")

    print("\n3. YOUR GITHUB REPOSITORY:")
    print("   https://github.com/abeer2626/rag-chatbot")

    print("\n4. DEPLOYMENT TEMPLATE LINK:")
    print("   https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot")

    print("\n5. RAILWAY DOCUMENTATION:")
    print("   https://docs.railway.app")

def print_log_instructions():
    """Print instructions for checking logs"""
    print("\n" + "=" * 70)
    print("HOW TO CHECK DEPLOYMENT LOGS:")
    print("=" * 70)

    print("\nSTEP 1: LOGIN TO RAILWAY")
    print("1. Go to: https://railway.app/login")
    print("2. Login with your GitHub account")

    print("\nSTEP 2: FIND YOUR PROJECT")
    print("1. After deploying, go to Dashboard")
    print("2. Look for 'rag-chatbot' project")
    print("3. If not deployed yet, deploy from GitHub:")

    print("\nSTEP 3: CHECK LOGS")
    print("1. Click on your 'rag-chatbot' project")
    print("2. Navigate to the 'Services' tab")
    print("3. Click on your API service")
    print("4. Click on the 'Logs' tab")
    print("5. Look for recent log entries")

    print("\nSTEP 4: COMMON LOG PATTERNS TO CHECK:")
    print("✅ Success patterns:")
    print("   - 'Application startup complete'")
    print("   - 'Server listening on port 8000'")
    print("   - 'Health check passed'")
    print("   - 'Database connected'")
    print("   - 'Qdrant connected'")

    print("\n❌ Error patterns:")
    print("   - 'Build failed'")
    print("   - 'Missing environment variable'")
    print("   - 'Database connection failed'")
    print("   - 'OpenAI API error'")
    print("   - 'Port already in use'")

def print_troubleshooting():
    """Print troubleshooting information"""
    print("\n" + "=" * 70)
    print("COMMON DEPLOYMENT ISSUES & SOLUTIONS:")
    print("=" * 70)

    print("\n1. BUILD FAILS:")
    print("   Cause: Missing dependencies or Python version mismatch")
    print("   Solution: Check requirements.txt and Python 3.11 compatibility")

    print("\n2. MISSING ENVIRONMENT VARIABLES:")
    print("   Cause: OPENAI_API_KEY, DATABASE_URL, etc. not configured")
    print("   Solution: Add all required environment variables in Railway settings")

    print("\n3. DATABASE CONNECTION ERRORS:")
    print("   Cause: Incorrect Neon database URL")
    print("   Solution: Verify NEON_DATABASE_URL format")

    print("\n4. PORT BINDING ERRORS:")
    print("   Cause: Application trying to bind to wrong port")
    print("   Solution: Ensure PORT=8000 is set in environment variables")

    print("\n5. MEMORY LIMIT EXCEEDED:")
    print("   Cause: Railway free tier memory limit")
    print("   Solution: Check if application is memory-efficient")

def print_expected_logs():
    """Show what successful logs should look like"""
    print("\n" + "=" * 70)
    print("EXPECTED SUCCESSFUL LOGS:")
    print("=" * 70)

    print("\n📋 BUILD LOGS (Should show):")
    print("   - Installing Python 3.11")
    print("   - Installing dependencies from requirements.txt")
    print("   - Copying application code")
    print("   - Build completed successfully")

    print("\n📋 RUNTIME LOGS (Should show):")
    print("   - Starting uvicorn server")
    print("   - Application startup complete")
    print("   - Database connection established")
    print("   - Qdrant connection established")
    print("   - OpenAI API configured")
    print("   - Server listening on http://0.0.0.0:8000")

    print("\n📋 HEALTH CHECK LOGS (When you hit /api/v1/health):")
    print("   - GET /api/v1/health")
    print("   - Database health: OK")
    print("   - Qdrant health: OK")
    print("   - OpenAI health: OK")
    print("   - Response sent: 200 OK")

def open_dashboard():
    """Optionally open Railway dashboard in browser"""
    choice = input("\n" + "=" * 70)
    print("Would you like to open Railway dashboard in your browser? (y/n): ", end="")

    try:
        choice = input().lower().strip()
        if choice in ['y', 'yes']:
            webbrowser.open('https://railway.app/dashboard')
            print("✅ Railway dashboard opened in your browser")
    except:
        pass

def main():
    print_header()
    print_direct_links()
    print_log_instructions()
    print_troubleshooting()
    print_expected_logs()

    print("\n" + "=" * 70)
    print("NEXT STEPS:")
    print("=" * 70)
    print("1. Deploy the application from GitHub:")
    print("   https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Fabeer2626%2Frag-chatbot")
    print("\n2. Configure environment variables in Railway settings")
    print("\n3. Check logs using the instructions above")
    print("\n4. Verify deployment by testing:")
    print("   - Health check: https://your-app.up.railway.app/api/v1/health")
    print("   - API docs: https://your-app.up.railway.app/docs")

    # Uncomment to enable browser opening
    # open_dashboard()

if __name__ == "__main__":
    main()