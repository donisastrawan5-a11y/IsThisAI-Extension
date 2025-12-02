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

export interface ImageAnalysis {
    hasMetadata: boolean;
    metadata: Record<string, any>;
    fileSize: number;
    dimensions: {
        width: number;
        height: number;
    };
}

export interface imageDetectionResult extends DetectionResult {
    imageAnalysis?: ImageAnalysis;
}