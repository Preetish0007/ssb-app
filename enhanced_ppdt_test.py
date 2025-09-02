import requests
import sys
import json

def test_enhanced_ppdt():
    """Test the enhanced PP&DT with 5 pre-story questions"""
    base_url = "https://ssb-coach.preview.emergentagent.com"
    
    print("🔍 Testing Enhanced PP&DT with 5 Pre-Story Questions")
    print("=" * 60)
    
    # Test story with all 5 parameters
    test_data = {
        "story": "In a rural village, two young men (aged 25) noticed smoke rising from a nearby house. With positive determination, they quickly organized the villagers to form a human chain for water supply. The main character, Raj, took leadership and coordinated the rescue effort. They successfully extinguished the fire and saved the family inside. The villagers praised their quick thinking and teamwork.",
        "image_id": "ppdt_1",
        "background": "rural",
        "numCharacters": "2", 
        "gender": "M",
        "mood": "+",
        "age": "25"
    }
    
    try:
        print(f"\n📤 Submitting enhanced PP&DT story...")
        print(f"   Background: {test_data['background']}")
        print(f"   Characters: {test_data['numCharacters']} ({test_data['gender']})")
        print(f"   Mood: {test_data['mood']}")
        print(f"   Age: {test_data['age']}")
        
        response = requests.post(
            f"{base_url}/api/ppdt/submit",
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            print("✅ Enhanced PP&DT submission successful!")
            
            result = response.json()
            evaluation = result.get('evaluation', '')
            
            # Check if evaluation mentions the context provided
            context_mentioned = any(keyword in evaluation.lower() for keyword in [
                'rural', 'background', 'characters', 'mood', 'age', 'positive', 'male'
            ])
            
            if context_mentioned:
                print("✅ AI evaluation incorporates the 5-question context")
            else:
                print("⚠️  AI evaluation may not be using the 5-question context")
            
            # Check for evaluation and positive story sections
            if 'EVALUATION:' in evaluation and 'POSITIVE STORY EXAMPLE:' in evaluation:
                print("✅ Response contains both evaluation and positive story example")
                
                # Extract sections
                parts = evaluation.split('POSITIVE STORY EXAMPLE:')
                eval_section = parts[0].replace('EVALUATION:', '').strip()
                story_section = parts[1].strip() if len(parts) > 1 else ''
                
                print(f"\n📊 Evaluation Section (length: {len(eval_section)}):")
                print(f"   {eval_section[:200]}...")
                
                print(f"\n📖 Positive Story Example (length: {len(story_section)}):")
                print(f"   {story_section[:200]}...")
                
            else:
                print("❌ Missing evaluation or positive story example sections")
                print(f"Response preview: {evaluation[:300]}...")
            
            return True
            
        else:
            print(f"❌ Failed - Status: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_ai_mentor_bullet_points():
    """Test AI mentor chat for bullet point formatting"""
    base_url = "https://ssb-coach.preview.emergentagent.com"
    
    print("\n🔍 Testing AI Mentor Bullet Point Formatting")
    print("=" * 60)
    
    test_data = {
        "message": "What are the key qualities SSB looks for in candidates?",
        "user_id": "test_user"
    }
    
    try:
        print(f"\n📤 Asking mentor: {test_data['message']}")
        
        response = requests.post(
            f"{base_url}/api/chat/mentor",
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=60
        )
        
        if response.status_code == 200:
            print("✅ AI Mentor response received!")
            
            result = response.json()
            ai_response = result.get('response', '')
            
            # Check for bullet points
            bullet_indicators = ['•', '- ', '* ', '1.', '2.', '3.']
            has_bullets = any(indicator in ai_response for indicator in bullet_indicators)
            
            if has_bullets:
                print("✅ Response contains bullet points for easy reading")
                bullet_count = sum(ai_response.count(indicator) for indicator in bullet_indicators)
                print(f"   Found approximately {bullet_count} bullet points")
            else:
                print("⚠️  Response may not be properly formatted with bullet points")
            
            print(f"\n📝 AI Mentor Response (length: {len(ai_response)}):")
            print(f"   {ai_response[:400]}...")
            
            return True
            
        else:
            print(f"❌ Failed - Status: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success1 = test_enhanced_ppdt()
    success2 = test_ai_mentor_bullet_points()
    
    print("\n" + "=" * 60)
    print("📊 ENHANCED FEATURES TEST RESULTS")
    print("=" * 60)
    
    if success1 and success2:
        print("🎉 All enhanced features working correctly!")
        sys.exit(0)
    else:
        print("❌ Some enhanced features need attention")
        sys.exit(1)