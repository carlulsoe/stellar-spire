import random
import requests
import re
import os
import json

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

def generate_story(num_chapters, genre):
    story = {"title": "", "chapters": []}
    
    # Generate story title
    title_prompt = f"Generate a captivating title for a {genre} story. Provide only the title, without any additional text or explanations:"
    story["title"] = generate_text(title_prompt, min_length=10).strip()
    
    for i in range(num_chapters):
        chapter = {"title": "", "content": ""}
        
        # Generate chapter title
        chapter_title_prompt = f"Generate a title for chapter {i+1} of the {genre} story '{story['title']}'. Provide only the title, without any additional text or explanations:"
        chapter["title"] = generate_text(chapter_title_prompt, min_length=5).strip()
        
        # Generate chapter content
        if i == 0:
            chapter_prompt = f"Write the first chapter titled '{chapter['title']}' of a {genre} story titled '{story['title']}'. Make it engaging and set the stage for an epic adventure:"
        else:
            chapter_prompt = f"Continue the {genre} story '{story['title']}'. Write chapter {i+1} titled '{chapter['title']}', advancing the plot and developing the characters:"
        
        chapter["content"] = generate_text(chapter_prompt)
        story["chapters"].append(chapter)
    
    return story

def main():
    num_stories = int(input("Enter the number of stories to generate: "))
    num_chapters = int(input("Enter the number of chapters per story: "))
    genres = ["fantasy", "science fiction", "space opera", "cyberpunk", "steampunk"]
    
    for i in range(num_stories):
        genre = random.choice(genres)
        story = generate_story(num_chapters, genre)
        
        # Sanitize the filename
        safe_filename = sanitize_filename(story["title"])
        filename = f"{safe_filename}.json"
        
        # Ensure the filename is unique
        counter = 1
        while os.path.exists(filename):
            filename = f"{safe_filename}_{counter}.json"
            counter += 1
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(story, f, ensure_ascii=False, indent=2)
            print(f"Story '{story['title']}' has been generated and saved to {filename}")
        except OSError as e:
            print(f"Error saving file: {e}")
            print(f"Attempted filename: {filename}")
            print(f"Story title: {story['title']}")

if __name__ == "__main__":
    main()