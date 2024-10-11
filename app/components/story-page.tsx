'use client'

import { Bell, BellOff, Link } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#app/components/ui/button'
import { Card } from '#app/components/ui/card'
import CommentsRoute from '#app/routes/_marketing+/stories+/$storyId_+/chapter+/$chapterId_.index.comments'
import { StoryReaderComponent } from './story-reader'

type SuggestedStory = {
  id: string
  title: string
  author: string
}

export default function StoryPage({
  storyData,
  suggestedStories
}: {
  storyData: React.ComponentProps<typeof StoryReaderComponent>,
  suggestedStories: SuggestedStory[]
}) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollowToggle = () => {
    // TODO: Implement actual follow/unfollow logic
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto my-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{storyData.chapter.title}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFollowToggle}
            className="flex items-center gap-2"
          >
            {isFollowing ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        </div>
        <StoryReaderComponent {...storyData} />
      </div>
      {!storyData.nextChapterId && (
        <div className="max-w-3xl mx-auto my-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Suggested Stories</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestedStories.map((story) => (
                <Card key={story.id} className="p-4">
                  <h3 className="font-semibold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">by {story.author}</p>
                  <Link to={`/stories/${story.id}`}>
                    <Button variant="link" className="mt-2 p-0">
                      Read Now
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-3xl mx-auto my-8">
        <CommentsRoute />
      </div>
    </div>
  )
}