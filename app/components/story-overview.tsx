'use client'

import { Link } from '@remix-run/react'
import { Clock, User, BookOpen, Star } from 'lucide-react'
import { Badge } from "#app/components/ui/badge"
import { Button } from "#app/components/ui/button"
import { Card, CardHeader, CardTitle } from "#app/components/ui/card"

export function StoryOverviewComponent({ story }: {
  story: {
    id: string;
    title: string;
    author: {
      username: string;
    };
    description: string;
    coverImage?: string;
    genre?: string;
    totalChapters?: number;
    estimatedReadTime?: number;
    rating?: number;
    reviews?: number;
    updatedAt: string;
    images: Array<{
      id: string;
      altText: string | null;
    }>;
    chapters: Array<{
      id: string;
      title: string;
      content: string;
      updatedAt: string;
      number: number;
    }>;
  };
  timeAgo: string;
  estimatedReadTime: number;
}) {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={story.coverImage}
              alt={`Cover of ${story.title}`}
              width={300}
              height={400}
              className="rounded-lg object-cover"
            />
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <CardTitle className="text-3xl mb-2">{story.title}</CardTitle>
                <p className="text-muted-foreground mb-4">by {story.author.username}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{story.genre}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-primary" />
                    {story.rating} ({story.reviews} reviews)
                  </Badge>
                </div>
                <div className="flex gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} />
                    <span>{story.totalChapters} chapters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{story.estimatedReadTime ? Math.round(story.estimatedReadTime / 60) : 'N/A'} hours</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{story.description}</p>
              <div className="flex gap-4">
                <Link to={`/users/${story.author}`} className="flex-grow" prefetch="viewport" >
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" /> Author Profile
                  </Button>
                </Link>
                {story.chapters.length > 0 && story.chapters[0] && (
                  <Link to={`/stories/${story.id}/chapter/${story.chapters[0].id}`} className="flex-grow" prefetch="viewport">
                    <Button className="w-full">
                      Read Now <BookOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}