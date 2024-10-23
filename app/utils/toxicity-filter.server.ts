import { pipeline, TextClassificationPipeline } from '@xenova/transformers';

interface ToxicityScores {
  toxic: number;
  severe_toxic: number;
  obscene: number;
  threat: number;
  insult: number;
  identity_hate: number;
}

interface ContentAnalysis {
  scores: ToxicityScores;
  isAcceptable: boolean;
  flags: string[];
}

export class ContentFilter {
  private classifier: TextClassificationPipeline | null = null;
  private readonly thresholds = {
    toxic: 0.5,
    severe_toxic: 0.3,
    obscene: 0.5,
    threat: 0.3,
    insult: 0.5,
    identity_hate: 0.3
  };

  constructor() {
    this.initializeModel();
  }

  private async initializeModel() {
    try {
      // Initialize the model only once and reuse it
      this.classifier = await pipeline('text-classification', 'Xenova/toxic-bert', { quantized: true });
      console.log('Toxic-bert model loaded')
    } catch (error) {
      console.error('Failed to initialize toxic-bert model:', error);
      throw new Error('Model initialization failed');
    }
  }

  async analyzeContent(text: string): Promise<ContentAnalysis> {
    if (!this.classifier) {
      await this.initializeModel();
    }

    try {
      // Get raw classification results
      const results = await this.classifier!(text, { topk: 6 });
      // Convert results to a more usable format
      const scores: ToxicityScores = {
        toxic: 0,
        severe_toxic: 0,
        obscene: 0,
        threat: 0,
        insult: 0,
        identity_hate: 0
      };

      // Parse the results
      results.forEach((result: any) => {
        const label = result.label.toLowerCase();
        scores[label as keyof ToxicityScores] = result.score;
      });

      // Generate flags for categories exceeding thresholds
      const flags = Object.entries(scores)
        .filter(([category, score]) => score > this.thresholds[category as keyof ToxicityScores])
        .map(([category]) => category);

      // Determine if content is acceptable based on flags
      const isAcceptable = flags.length === 0;

      return {
        scores,
        isAcceptable,
        flags
      };
    } catch (error) {
      console.error('Content analysis failed:', error);
      throw new Error('Failed to analyze content');
    }
  }
}

export let filter: ContentFilter;

export async function startToxicityFilter() {
  filter = new ContentFilter();
}

// Example usage:
// async function example() {
//   const filter = new ContentFilter();
//   
//   // Analyze some text
//   const result = await filter.analyzeContent("Your text here");
//   console.log(result);
//   
//   // Optionally adjust thresholds
//   filter.setThresholds({ toxic: 0.7, threat: 0.2 });
// }
