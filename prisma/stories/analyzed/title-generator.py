import json
import requests
from pathlib import Path

def generate_title(story: dict, model: str = "llama3.2") -> str:
    """Generate a title based on story content using Ollama API."""
    # Combine first paragraphs from each chapter for context
    context = "\n\n".join([
        chapter["content"].split("\n\n")[0] 
        for chapter in story["chapters"]
    ])
    
    prompt = f"""Based on the following story excerpts, generate a compelling and 
    memorable title that captures the essence of the story. The title should be 
    2-6 words. Here's the content:

    {context}

    Please provide only the title, without any additional text or formatting."""

    data = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post("http://localhost:11434/api/generate", json=data)
        response.raise_for_status()
        return response.json()['response'].strip()
    except Exception as e:
        print(f"Error generating title: {e}")
        return None

def update_story_file(filename: Path) -> None:
    """Read JSON file, generate new title, and update the file."""
    try:
        # Read the story
        with open(filename, 'r', encoding='utf-8') as f:
            story = json.load(f)
        
        # Generate new title
        suggested_title = generate_title(story)
        
        if suggested_title:
            # Update the story dictionary with original and suggested titles
            story["original_title"] = story["title"]
            story["suggested_title"] = suggested_title
            
            # Save the updated story
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(story, f, ensure_ascii=False, indent=2)
            
            print(f"\n{filename}:")
            print(f"Original title: {story['original_title']}")
            print(f"Suggested title: {story['suggested_title']}")
        else:
            print(f"\nFailed to generate title for {filename}")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

def main():
    # Get list of JSON files in current directory
    json_files = list(Path('.').glob('*.json'))
    
    if not json_files:
        print("No JSON files found in the current directory.")
        return
    
    print("Available story files:")
    for i, file in enumerate(json_files, 1):
        print(f"{i}. {file}")
    
    try:
        choice = int(input("\nEnter the number of the file to generate a title for (0 for all): "))
        
        if choice == 0:
            print("\nGenerating titles for all stories...")
            for file in json_files:
                update_story_file(file)
                
        elif 1 <= choice <= len(json_files):
            file = json_files[choice - 1]
            update_story_file(file)
        else:
            print("Invalid choice.")
            
    except ValueError:
        print("Please enter a valid number.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
