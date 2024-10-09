type ReadingTimeResult = {
	minutes: number
}

export class ReadingTimeEstimator {
	private static readonly WORDS_PER_MINUTE = 250 // Adjusted for decent readers
	private static readonly DIALOGUE_MODIFIER = 1.1 // People read dialogue slightly faster
	private static readonly DESCRIPTION_MODIFIER = 0.9 // Descriptions might be read slower

	/**
	 * Estimates reading time for fictional content.
	 * @param text - The text to estimate reading time for
	 * @returns ReadingTimeResult object containing minutes, seconds, and formatted string
	 */
	static estimate(text: string): ReadingTimeResult {
		const wordCount = this.countWords(text)
		const adjustedWordCount = this.adjustForContentType(text, wordCount)

		const totalMinutes = adjustedWordCount / this.WORDS_PER_MINUTE
		const minutes = Math.floor(totalMinutes)

		return {
			minutes,
		}
	}

	private static countWords(text: string): number {
		return text.trim().split(/\s+/).length
	}

	private static adjustForContentType(text: string, wordCount: number): number {
		// Simple heuristic: if there are many quotation marks, assume more dialogue
		const dialoguePercentage = (text.match(/"/g) || []).length / wordCount

		if (dialoguePercentage > 0.05) {
			return wordCount * this.DIALOGUE_MODIFIER
		} else {
			return wordCount * this.DESCRIPTION_MODIFIER
		}
	}
}