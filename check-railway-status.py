#!/usr/bin/env python3
"""
Quick script to help check Railway deployment status
"""

print("=" * 60)
print("RAILWAY DEPLOYMENT STATUS CHECK")
print("=" * 60)
print()

print("1. Railway Dashboard should be open in your browser")
print("   URL: https://railway.app/dashboard")
print()

print("2. Look for your project named:")
print("   - rag-chatbot")
print("   - or your custom project name")
print()

print("3. Check project status:")
print("   [RUNNING]  = Green - Deployed successfully")
print("   [BUILDING] = Yellow - Still deploying (wait 2-5 mins)")
print("   [FAILED]   = Red - Error occurred")
print()

print("4. To view logs:")
print("   - Click on your project")
print("   - Click on your service")
print("   - Click 'Logs' tab")
print()

print("5. Common log patterns to check:")
print("   SUCCESS: 'Build completed successfully'")
print("   SUCCESS: 'Application startup complete'")
print("   SUCCESS: 'Server listening on port 8000'")
print()
print("   ERROR:   'Missing environment variable'")
print("   ERROR:   'Database connection failed'")
print("   ERROR:   'OpenAI API error'")
print()

print("6. Required Environment Variables in Railway:")
print("   - OPENAI_API_KEY")
print("   - NEON_DATABASE_URL")
print("   - QDRANT_URL")
print("   - QDRANT_API_KEY")
print("   - SECRET_KEY")
print("   - ENVIRONMENT=production")
print("   - PORT=8000")
print()

print("7. After successful deployment:")
print("   - Health: https://your-app.up.railway.app/api/v1/health")
print("   - Docs:   https://your-app.up.railway.app/docs")
print()

print("8. If deployment failed:")
print("   - Check error messages in logs")
print("   - Verify environment variables")
print("   - Ensure API keys are valid")
print()

input("Press Enter to continue...")
print()
print("For detailed log interpretation, see RAILWAY_LOGS_GUIDE.md")