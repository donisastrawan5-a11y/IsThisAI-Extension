export interface DetectionResult {
    isAI: boolean;
    confidance: number;
    reason: string[];
    category: 'text' | 'image' | 'audio';
}

export interface TextAnalysis {
    avgWordLength: number;
    uniqueWords: number;
    todalWords: number;
    sentenceComplexity: number;
}