#!/usr/bin/env python3
"""
Generate environment variables for Railway deployment
"""

import secrets
import json

def generate_secret_key():
    """Generate a 32-character secret key"""
    return secrets.token_hex(16)

def create_env_template():
    """Create environment variables template"""
    secret_key = generate_secret_key()

    env_vars = {
        "OPENAI_API_KEY": {
            "value": "sk-your-actual-openai-api-key-here",
            "description": "Get from https://platform.openai.com/api-keys",
            "required": True
        },
        "OPENAI_ORG_ID": {
            "value": "your-openai-org-id-here",
            "description": "Get from OpenAI account settings",
            "required": True
        },
        "NEON_DATABASE_URL": {
            "value": "postgresql://user:password@host:port/dbname?sslmode=require",
            "description": "Get from https://neon.tech",
            "required": True
        },
        "QDRANT_URL": {
            "value": "https://your-qdrant-cluster.qdrant.tech",
            "description": "Get from https://cloud.qdrant.io",
            "required": True
        },
        "QDRANT_API_KEY": {
            "value": "your-qdrant-api-key-here",
            "description": "Get from Qdrant Cloud dashboard",
            "required": True
        },
        "SECRET_KEY": {
            "value": secret_key,
            "description": f"Generated secret key (keep this secret!)",
            "required": True
        },
        "ENVIRONMENT": {
            "value": "production",
            "description": "Deployment environment",
            "required": True
        },
        "PORT": {
            "value": "8000",
            "description": "Application port",
            "required": True
        },
        "REDIS_URL": {
            "value": "redis://localhost:6379",
            "description": "Optional: Redis for caching",
            "required": False
        },
        "RATE_LIMIT_REQUESTS_PER_MINUTE": {
            "value": "10",
            "description": "Rate limit per minute per IP",
            "required": False
        },
        "RATE_LIMIT_BURST": {
            "value": "20",
            "description": "Rate limit burst capacity",
            "required": False
        },
        "LOG_LEVEL": {
            "value": "INFO",
            "description": "Logging level",
            "required": False
        }
    }

    return env_vars

def print_railway_instructions(env_vars):
    """Print instructions for adding env vars to Railway"""
    print("=" * 70)
    print("RAILWAY ENVIRONMENT VARIABLES SETUP")
    print("=" * 70)
    print("\n1. Go to your Railway project dashboard")
    print("2. Click on your rag-chatbot project")
    print("3. Go to the 'Variables' tab")
    print("4. Add these variables:")
    print()

    for key, config in env_vars.items():
        marker = "⚠️" if config["required"] else "💡"
        print(f"\n{marker} {key}")
        print(f"   Value: {config['value']}")
        print(f"   Description: {config['description']}")

    print("\n" + "=" * 70)
    print("COPY-PASTE READY VARIABLES:")
    print("=" * 70)

    # Create copy-paste format
    for key, config in env_vars.items():
        print(f"{key}={config['value']}")

    print("\n" + "=" * 70)
    print("HOW TO GET VALUES:")
    print("=" * 70)
    print("\n🔑 OpenAI:")
    print("1. Visit https://platform.openai.com/api-keys")
    print("2. Create a new API key")
    print("3. Copy your Organization ID from https://platform.openai.com/account/organization")

    print("\n🐘 Neon Database:")
    print("1. Visit https://neon.tech")
    print("2. Create a new PostgreSQL project")
    print("3. Copy the connection string")

    print("\n🔍 Qdrant:")
    print("1. Visit https://cloud.qdrant.io")
    print("2. Create a new cluster")
    print("3. Copy the cluster URL and API key")

    print(f"\n🔐 Your generated SECRET_KEY: {env_vars['SECRET_KEY']['value']}")
    print("   Keep this secure and don't share it!")

def main():
    env_vars = create_env_template()
    print_railway_instructions(env_vars)

    # Save to file for reference
    with open('railway-env-vars.json', 'w') as f:
        json.dump(env_vars, f, indent=2)
    print(f"\n✅ Environment variables saved to 'railway-env-vars.json'")

if __name__ == "__main__":
    main()