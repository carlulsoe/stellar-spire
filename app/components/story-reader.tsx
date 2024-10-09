'use client'

import { type Chapter, type Story } from '@prisma/client'
import { ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '#app/components/ui/button.tsx'
import { Card } from '#app/components/ui/card.tsx'
import { Switch } from '#app/components/ui/switch.tsx'

export function StoryReaderComponent(data: {
  story: Story
  username: string
  chapter: Chapter
  nextChapter: Chapter
  isLiked: boolean
}) {
  const [fontSize, setFontSize] = useState(16)
  const [darkMode, setDarkMode] = useState(false)
  const [progress, setProgress] = useState(0)

  // Mock story data
  const story = {
    title: data.chapter.title,
    author: data.username,
    content: data.chapter.content,
    estimatedReadingTime: 3, // in minutes
    currentChapter: data.chapter.number,
    totalChapters: data.story.chapters.length
  }

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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <Card className="max-w-3xl mx-auto my-8 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{story.title}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>
              A-
            </Button>
            <Button variant="outline" size="icon" onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>
              A+
            </Button>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="mb-4 text-sm text-gray-500">
          <span>By {story.author}</span>
          <span className="mx-2">•</span>
          <span>{story.estimatedReadingTime} min read</span>
        </div>
        <div className="prose max-w-none" style={{ fontSize: `${fontSize}px` }}>
          {story.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <Button variant="outline" disabled={story.currentChapter === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
          </Button>
          <span className="text-sm">
            Chapter {story.currentChapter} of {story.totalChapters}
          </span>
          <Button variant="outline" disabled={story.currentChapter === story.totalChapters}>
            Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
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