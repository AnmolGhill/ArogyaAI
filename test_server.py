#!/usr/bin/env python3
"""
Quick server test script to verify ArogyaAI server is working
"""
import requests
import json
from datetime import datetime

def test_server():
    """Test server endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing ArogyaAI Server...")
    print("=" * 50)
    
    # Test 1: Health Check
    try:
        print("1. Testing Health Check...")
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health Check: {data.get('status', 'Unknown')}")
            print(f"   📊 Service: {data.get('service', 'Unknown')}")
        else:
            print(f"   ❌ Health Check Failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Health Check Error: {e}")
    
    # Test 2: Root Endpoint
    try:
        print("\n2. Testing Root Endpoint...")
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Root: {data.get('message', 'Unknown')}")
            print(f"   🏥 Status: {data.get('status', 'Unknown')}")
        else:
            print(f"   ❌ Root Failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Root Error: {e}")
    
    # Test 3: API Documentation
    try:
        print("\n3. Testing API Documentation...")
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print("   ✅ API Docs: Available at http://localhost:8000/docs")
        else:
            print(f"   ❌ API Docs Failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ API Docs Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Server Test Complete!")
    print("\n📖 Next Steps:")
    print("   1. Open http://localhost:8000/docs for API documentation")
    print("   2. Configure Firebase credentials in server/.env")
    print("   3. Set up client environment in client/.env")
    print("   4. Start the React client with: cd client && npm run dev")

if __name__ == "__main__":
    test_server()
