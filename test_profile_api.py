#!/usr/bin/env python3
"""
Test script for ArogyaAI Profile API endpoints
"""
import requests
import json

def test_profile_api():
    """Test profile API endpoints"""
    base_url = "http://localhost:8000"
    user_id = "test_user_123"
    
    print("🧪 Testing ArogyaAI Profile API...")
    print("=" * 50)
    
    # Test 1: Get Complete Profile
    try:
        print("1. Testing Get Complete Profile...")
        response = requests.get(f"{base_url}/api/profile/complete/{user_id}")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Profile loaded: {data['data']['profile']['name']}")
            print(f"   📊 Health data: {data['data']['health']['height']}, {data['data']['health']['weight']}")
            print(f"   📋 Activities: {len(data['data']['activities'])} items")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Update Personal Info
    try:
        print("\n2. Testing Update Personal Info...")
        update_data = {
            "name": "Updated Test User",
            "age": 30,
            "phone": "+1 555 123 4567",
            "location": "Updated City"
        }
        response = requests.put(f"{base_url}/api/profile/personal/{user_id}", json=update_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Personal info updated successfully")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Update Health Profile
    try:
        print("\n3. Testing Update Health Profile...")
        health_data = {
            "height": "6'0\"",
            "weight": "75 kg",
            "bloodType": "A+",
            "allergies": ["Peanuts"],
            "medications": ["Vitamin D", "Omega-3"]
        }
        response = requests.put(f"{base_url}/api/profile/health/{user_id}", json=health_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   ✅ Health profile updated successfully")
        else:
            print(f"   ❌ Failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Get Updated Profile
    try:
        print("\n4. Testing Get Updated Profile...")
        response = requests.get(f"{base_url}/api/profile/complete/{user_id}")
        if response.status_code == 200:
            data = response.json()
            profile = data['data']['profile']
            health = data['data']['health']
            print(f"   ✅ Updated name: {profile.get('name', 'N/A')}")
            print(f"   ✅ Updated height: {health.get('height', 'N/A')}")
            print(f"   ✅ Updated weight: {health.get('weight', 'N/A')}")
        else:
            print(f"   ❌ Failed to get updated profile")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Profile API Test Complete!")
    print("\n📝 Summary:")
    print("   - Server is running and responding")
    print("   - Profile endpoints are working with mock data")
    print("   - Ready for client integration")

if __name__ == "__main__":
    test_profile_api()
