import json
import os
import requests
from typing import Dict, List, Union
from pathlib import Path

class StoryAnalyzer:
    def __init__(self, model: str = "llama3.2"):
        self.model = model
        self.api_url = "http://localhost:11434/api/generate"
        # Create analyzed directory if it doesn't exist
        self.analyzed_dir = Path("analyzed")
        self.analyzed_dir.mkdir(exist_ok=True)

    def generate_text(self, prompt: str) -> str:
        """Generate text using Ollama API."""
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        try:
            response = requests.post(self.api_url, json=data)
            response.raise_for_status()
            return response.json()['response'].strip()
        except Exception as e:
            print(f"Error generating text: {e}")
            return None

    def generate_story_description(self, story: Dict) -> str:
        """Generate a concise description of the entire story."""
        # Combine the first paragraph of each chapter to create context
        context = "\n\n".join([
            chapter["content"].split("\n\n")[0] 
            for chapter in story["chapters"]
        ])
        
        prompt = f"""Based on the following excerpts from '{story["title"]}', 
        generate a compelling 2-3 sentence description of the story. 
        Make it engaging but avoid spoilers. Here are the excerpts:

        {context}

        Please provide only the description, without any additional text or formatting."""

        return self.generate_text(prompt)

    def generate_chapter_titles(self, chapter_content: str) -> str:
        """Generate a title for a chapter based on its content."""
        # Take the first few paragraphs to get the chapter's essence
        context = "\n\n".join(chapter_content.split("\n\n")[:2])
        
        prompt = f"""Based on the following chapter content, generate a short, 
        compelling chapter title that captures the main theme or event. 
        The title should be 2-6 words. Here's the content:

        {context}

        Please provide only the title, without any additional text or formatting."""

        return self.generate_text(prompt)

    def analyze_story_file(self, filename: str) -> Dict:
        """Analyze a story file and generate description and chapter titles."""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                story = json.load(f)
            
            # Generate story description
            description = self.generate_story_description(story)
            
            # Generate chapter titles
            new_chapters = []
            for chapter in story["chapters"]:
                suggested_title = self.generate_chapter_titles(chapter["content"])
                new_chapters.append({
                    "original_title": chapter["title"],
                    "suggested_title": suggested_title,
                    "content": chapter["content"]
                })
            
            # Create analyzed story structure
            analyzed_story = {
                "title": story["title"],
                "description": description,
                "chapters": new_chapters
            }
            
            # Save analyzed version in the analyzed directory
            output_filename = self.analyzed_dir / f"analyzed_{os.path.basename(filename)}"
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(analyzed_story, f, ensure_ascii=False, indent=2)
            
            return analyzed_story
            
        except Exception as e:
            print(f"Error analyzing story file {filename}: {e}")
            return None

def main():
    # Get list of JSON files in current directory
    json_files = [f for f in os.listdir('.') if f.endswith('.json') and not f.startswith('analyzed_')]
    
    if not json_files:
        print("No JSON story files found in the current directory.")
        return
    
    print("Available story files:")
    for i, file in enumerate(json_files, 1):
        print(f"{i}. {file}")
    
    try:
        choice = int(input("\nEnter the number of the file you want to analyze (0 to analyze all): "))
        analyzer = StoryAnalyzer()
        
        if choice == 0:
            print("\nAnalyzing all stories...")
            for file in json_files:
                print(f"\nAnalyzing {file}...")
                analyzed = analyzer.analyze_story_file(file)
                if analyzed:
                    print(f"Analysis saved to analyzed/analyzed_{file}")
                    print(f"Description: {analyzed['description']}")
                    print("\nSuggested chapter titles:")
                    for i, chapter in enumerate(analyzed['chapters'], 1):
                        print(f"Chapter {i}:")
                        print(f"  Original: {chapter['original_title']}")
                        print(f"  Suggested: {chapter['suggested_title']}")
        elif 1 <= choice <= len(json_files):
            file = json_files[choice - 1]
            print(f"\nAnalyzing {file}...")
            analyzed = analyzer.analyze_story_file(file)
            if analyzed:
                print(f"Analysis saved to analyzed/analyzed_{file}")
                print(f"\nDescription: {analyzed['description']}")
                print("\nSuggested chapter titles:")
                for i, chapter in enumerate(analyzed['chapters'], 1):
                    print(f"Chapter {i}:")
                    print(f"  Original: {chapter['original_title']}")
                    print(f"  Suggested: {chapter['suggested_title']}")
        else:
            print("Invalid choice.")
            
    except ValueError:
        print("Please enter a valid number.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()