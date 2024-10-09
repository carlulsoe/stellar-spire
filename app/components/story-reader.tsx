'use client'

import { type Chapter, type Story } from '@prisma/client'
import { Link } from '@remix-run/react' // Add this import
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '#app/components/ui/button.tsx'
import { Card } from '#app/components/ui/card.tsx'
import { ReadingTimeEstimator } from '#app/utils/readingTimeEstimate.ts'

export function StoryReaderComponent(data: {
  storyId: Story['id']
  author: string
  previousChapterId: Chapter['id'] | null
  chapter: {
    number: number;
    id: string;
    title: string;
    content: string;
    updatedAt: string;
  }
  nextChapterId: Chapter['id'] | null
  isLiked: boolean
  totalChapters: number
}) {
  const [fontSize, setFontSize] = useState(16)
  const [progress, setProgress] = useState(0)

  const estimatedReadingTime = ReadingTimeEstimator.estimate(data.chapter.content).minutes


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const newProgress = (scrollPosition / (documentHeight - windowHeight)) * 100
      setProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Card className="max-w-3xl mx-auto my-8 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{data.chapter.title}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>
              A-
            </Button>
            <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>
              A+
            </Button>
          </div>
        </div>
        <div className="mb-4 text-sm text-gray-500">
          <span>By {data.author}</span>
          <span className="mx-2">•</span>
          <span>{estimatedReadingTime} min read</span>
        </div>
        <div className="prose max-w-none" style={{ fontSize: `${fontSize}px` }}>
          {data.chapter.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {data.previousChapterId ? (
            <Link to={`/stories/${data.storyId}/chapter/${data.previousChapterId}`} prefetch="viewport">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
            </Button>
          )}
          <span className="text-sm">
            Chapter {data.chapter.number} of {data.totalChapters}
          </span>
          {data.nextChapterId ? (
            <Link to={`/stories/${data.storyId}/chapter/${data.nextChapterId}`} prefetch="viewport">
              <Button variant="outline">
                Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-300">
        <div
          className="h-full bg-blue-600"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  )
}