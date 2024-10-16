import random
import requests
import re
import os
import json
from pathlib import Path

def sanitize_filename(filename):
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    filename = filename.replace(' ', '_')
    return filename[:255]

def generate_text(prompt, min_length=1000):
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        generated_text = response.json()['response']
        
        while len(generated_text) < min_length:
            data["prompt"] = f"{generated_text}\nContinue:"
            response = requests.post(url, json=data)
            if response.status_code == 200:
                generated_text += " " + response.json()['response']
            else:
                print(f"Error: {response.status_code}")
                print(f"Response: {response.text}")
                break
        
        return generated_text
    else:
        print(f"Error: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def clean_chapter_content(content):
    # Remove any chapter title that might be at the beginning of the content
    lines = content.split('\n')
    clean_lines = []
    found_content = False
    for line in lines:
        if found_content or (line.strip() and not line.strip().startswith('Chapter')):
            clean_lines.append(line)
            found_content = True
    return '\n'.join(clean_lines).strip()

class StoryGenerator:
    def __init__(self, model: str = "llama3.2"):
        self.model = model
        self.api_url = "http://localhost:11434/api/generate"
        self.generated_dir = Path("generated")
        self.generated_dir.mkdir(exist_ok=True)

    def generate_text(self, prompt: str, min_length: int = 1000) -> str:
        return generate_text(prompt, min_length)

    def generate_chapter_title(self, chapter_content: str, story_genre: str) -> str:
        context = "\n\n".join(chapter_content.split("\n\n")[:2])
        
        prompt = f"""Based on the following chapter content from a {story_genre} story, 
        generate a short, compelling chapter title that captures the main theme or event. 
        The title should be 2-6 words. Here's the content:

        {context}

        Please provide only the title, without any additional text or formatting."""

        return self.generate_text(prompt, min_length=5).strip()

    def generate_story_description(self, story: dict) -> str:
        context = "\n\n".join([
            chapter["content"].split("\n\n")[0] 
            for chapter in story["chapters"]
        ])
        
        prompt = f"""Based on the following excerpts from a {story['genre']} story, 
        generate a compelling 2-3 sentence description of the story. 
        Make it engaging but avoid spoilers. Here are the excerpts:

        {context}

        Please provide only the description, without any additional text or formatting."""

        return self.generate_text(prompt, min_length=50).strip()

    def generate_story_title(self, story: dict) -> str:
        context = story["description"] + "\n\n" + "\n".join([
            f"Chapter {i+1}: {chapter['title']}"
            for i, chapter in enumerate(story["chapters"])
        ])
        
        prompt = f"""Based on the following description and chapter titles of a {story['genre']} story, 
        generate a captivating title for the entire story. The title should be 2-6 words. 
        Here's the context:

        {context}

        Please provide only the title, without any additional text or formatting."""

        return self.generate_text(prompt, min_length=5).strip()

    def generate_story(self, num_chapters: int, genre: str) -> dict:
        story = {"genre": genre, "chapters": []}
        
        for i in range(num_chapters):
            chapter = {"content": ""}
            
            if i == 0:
                chapter_prompt = f"Write the first chapter of a {genre} story. Make it engaging and set the stage for an epic adventure. Do not include any chapter title or number in the content:"
            else:
                chapter_prompt = f"Continue the {genre} story. Write the next chapter, advancing the plot and developing the characters. Do not include any chapter title or number in the content:"
            
            chapter["content"] = clean_chapter_content(self.generate_text(chapter_prompt))
            chapter["title"] = self.generate_chapter_title(chapter["content"], genre)
            story["chapters"].append(chapter)
        
        story["description"] = self.generate_story_description(story)
        story["title"] = self.generate_story_title(story)
        
        return story

    def save_story(self, story: dict) -> str:
        safe_filename = sanitize_filename(story["title"])
        filename = f"{safe_filename}.json"
        
        counter = 1
        while (self.generated_dir / filename).exists():
            filename = f"{safe_filename}_{counter}.json"
            counter += 1
        
        filepath = self.generated_dir / filename
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(story, f, ensure_ascii=False, indent=2)
            return str(filepath)
        except OSError as e:
            print(f"Error saving file: {e}")
            print(f"Attempted filepath: {filepath}")
            print(f"Story title: {story['title']}")
            return None

def main():
    num_stories = int(input("Enter the number of stories to generate: "))
    num_chapters = int(input("Enter the number of chapters per story: "))
    genres = ["fantasy", "science fiction", "space opera", "cyberpunk", "steampunk"]
    
    generator = StoryGenerator()
    
    for i in range(num_stories):
        genre = random.choice(genres)
        story = generator.generate_story(num_chapters, genre)
        
        filepath = generator.save_story(story)
        if filepath:
            print(f"Story '{story['title']}' has been generated and saved to {filepath}")
        else:
            print(f"Failed to save story '{story['title']}'")

if __name__ == "__main__":
    main()
