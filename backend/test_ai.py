#!/usr/bin/env python3

import os
import sys
sys.path.append('.')

from dotenv import load_dotenv
load_dotenv()

from app.services.ai_service import AIService

# Test the AI service
def test_ai():
    try:
        ai_service = AIService()
        result = ai_service.enhance_story("This is a test story about my grandmother.", "Test Story")
        print("AI Service Test Result:")
        print(f"Success: {result['success']}")
        if result['success']:
            print(f"Enhanced: {result['enhanced_content']}")
        else:
            print(f"Error: {result['error']}")
    except Exception as e:
        print(f"Test failed: {str(e)}")

if __name__ == "__main__":
    test_ai()