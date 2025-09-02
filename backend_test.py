import requests
import sys
import json
from datetime import datetime

class SSBAppAPITester:
    def __init__(self, base_url="https://ssb-coach.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout} seconds")
            self.failed_tests.append(f"{name}: Request timeout")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_oir_questions(self):
        """Test OIR questions endpoint"""
        success, response = self.run_test("OIR Questions", "GET", "api/oir/questions", 200)
        if success and isinstance(response, dict):
            questions = response.get('questions', [])
            if len(questions) == 3:
                print(f"   ✅ Found {len(questions)} questions as expected")
                # Check question structure
                first_q = questions[0]
                required_keys = ['id', 'question', 'options', 'correct_answer', 'explanation']
                if all(key in first_q for key in required_keys):
                    print(f"   ✅ Question structure is correct")
                else:
                    print(f"   ⚠️  Missing keys in question structure")
            else:
                print(f"   ⚠️  Expected 3 questions, got {len(questions)}")
        return success, response

    def test_oir_submit(self):
        """Test OIR answer submission"""
        test_data = {
            "answer": 0,
            "question_id": "oir_1", 
            "correct_answer": 0
        }
        success, response = self.run_test("OIR Submit Answer", "POST", "api/oir/submit", 200, test_data, timeout=60)
        if success and isinstance(response, dict):
            required_keys = ['correct', 'score', 'feedback']
            if all(key in response for key in required_keys):
                print(f"   ✅ Response contains all required keys")
                print(f"   AI Feedback length: {len(response.get('feedback', ''))}")
            else:
                print(f"   ⚠️  Missing keys in response")
        return success, response

    def test_ppdt_images(self):
        """Test PP&DT images endpoint"""
        success, response = self.run_test("PP&DT Images", "GET", "api/ppdt/images", 200)
        if success and isinstance(response, dict):
            images = response.get('images', [])
            if len(images) == 8:
                print(f"   ✅ Found {len(images)} images as expected")
                # Check image structure
                first_img = images[0]
                required_keys = ['id', 'url', 'description']
                if all(key in first_img for key in required_keys):
                    print(f"   ✅ Image structure is correct")
                    print(f"   Sample image URL: {first_img['url'][:50]}...")
                else:
                    print(f"   ⚠️  Missing keys in image structure")
            else:
                print(f"   ⚠️  Expected 8 images, got {len(images)}")
        return success, response

    def test_ppdt_submit(self):
        """Test PP&DT story submission - KEY FEATURE"""
        test_story = "A young officer sees smoke rising from a distant village. He quickly organizes his team to investigate and help. They discover a small fire that started accidentally. The officer leads the rescue effort, coordinates with local authorities, and successfully helps evacuate people safely. His quick thinking and leadership save the day, and the villagers are grateful for his help."
        
        test_data = {
            "story": test_story,
            "image_id": "ppdt_1"
        }
        success, response = self.run_test("PP&DT Submit Story", "POST", "api/ppdt/submit", 200, test_data, timeout=60)
        if success and isinstance(response, dict):
            evaluation = response.get('evaluation', '')
            if 'EVALUATION:' in evaluation and 'POSITIVE STORY EXAMPLE:' in evaluation:
                print(f"   ✅ Response contains both evaluation and positive story example")
                print(f"   Evaluation length: {len(evaluation)}")
            else:
                print(f"   ⚠️  Response missing evaluation or positive story example")
                print(f"   Response preview: {evaluation[:200]}...")
        return success, response

    def test_mentor_chat(self):
        """Test AI mentor chat"""
        test_data = {
            "message": "How can I improve my confidence for SSB interviews?",
            "user_id": "test_user"
        }
        success, response = self.run_test("AI Mentor Chat", "POST", "api/chat/mentor", 200, test_data, timeout=60)
        if success and isinstance(response, dict):
            ai_response = response.get('response', '')
            if len(ai_response) > 50:
                print(f"   ✅ AI response received (length: {len(ai_response)})")
                print(f"   Response preview: {ai_response[:100]}...")
            else:
                print(f"   ⚠️  AI response seems too short")
        return success, response

    def test_additional_endpoints(self):
        """Test other available endpoints"""
        endpoints_to_test = [
            ("TAT Scenarios", "GET", "api/tat/scenarios", 200),
            ("WAT Words", "GET", "api/wat/words", 200),
            ("SRT Situations", "GET", "api/srt/situations", 200),
            ("Defense GK Quiz", "GET", "api/defense-gk/quiz", 200),
            ("Current Affairs Quiz", "GET", "api/current-affairs/quiz", 200),
            ("GTO Tasks", "GET", "api/gto/tasks", 200),
        ]
        
        for name, method, endpoint, expected_status in endpoints_to_test:
            self.run_test(name, method, endpoint, expected_status)

def main():
    print("🚀 Starting SSB Preparation App API Testing")
    print("=" * 60)
    
    tester = SSBAppAPITester()
    
    # Test core functionality
    print("\n📋 CORE FUNCTIONALITY TESTS")
    print("-" * 40)
    
    # Health check
    tester.test_health_check()
    
    # OIR Practice
    tester.test_oir_questions()
    tester.test_oir_submit()
    
    # PP&DT Practice (Key Feature)
    tester.test_ppdt_images()
    tester.test_ppdt_submit()
    
    # AI Mentor Chat
    tester.test_mentor_chat()
    
    # Additional endpoints
    print("\n📋 ADDITIONAL ENDPOINTS")
    print("-" * 40)
    tester.test_additional_endpoints()
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 FINAL TEST RESULTS")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for i, failure in enumerate(tester.failed_tests, 1):
            print(f"{i}. {failure}")
    else:
        print("\n🎉 ALL TESTS PASSED!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())