import { DetectionResult, TextAnalysis } from "@/types";
import { AI_PATTERNS } from "./pattern";

export class TextDetector {
    private analyzeText(text: string): TextAnalysis {
        const Words = text.split(/\s+/).filter(w => w.length > 0);
        const sentence = text.split(/[.!?]/).filter(s => s.trim().length > 0);

        const todalWords = Words.length;
        const uniqueWords = new Set(Words.map(w => w.toLowerCase())).size;
        const avgWordLength = Words.reduce((sum , w) => sum + w.length, 0) / todalWords;
        
        const sentenceComplexity = todalWords / sentence.length;

        return {
            avgWordLength,
            todalWords,
            uniqueWords,
            sentenceComplexity
        };
    }

    private checkAIpattern(text: string): {score: number; matches: string[]} {
        const lowerText = text.toLowerCase();
        let score = 0;
        const matches: string[] = [];

        AI_PATTERNS.commonPhrases.forEach(phrase => {
            if (lowerText.includes(phrase.toLowerCase())) {
                score += 10;
                matches.push(`Contains phrase: "${phrase}"`);
            }
        });

        AI_PATTERNS.formalMaker.forEach(marker => {
             if (lowerText.includes(marker.toLowerCase())) {
                score += 8;
                matches.push(`Formal structure: "${marker}"`)
            }
        })
           

        return {score, matches};

    }

    private checkHumanPattern(text: string): { score: number; matches: string[] } {
        let score = 0;
        const matches: string[] = [];

        const contractions = ["don't", "won't", "can't", "it's", "i'm", "you're", "we're", "they're", "isn't", "aren't", "weren't", "haven't", "hasn't", "hadn't"];
        const lowerText = text.toLowerCase();

        let contractionCount = 0;
        contractions.forEach(contraction => {
            if (lowerText.includes(contraction)) {
                contractionCount++;
            }
        });

        if (contractionCount > 2) {
            score += 15;
            matches.push(`Uses contractions (${contractionCount} found) - common in human writing`);
        }

        const informalExpressions = [
            "lol", "haha", "omg", "tbh", "btw", "yeah", "nah", "gonna", "wanna",
            "kinda", "sorta", "pretty much", "you know", "i mean", "like,", "well,",
            "honestly", "basically", "literally", "actually", "seriously"
        ];

        let informalCount = 0;
        informalExpressions.forEach(expr => {
            if (lowerText.includes(expr)) {
                informalCount++;
            }
        });

        if (informalCount > 1) {
            score += 20;
            matches.push(`Informal language detected (${informalCount} expression) - typical human style`);
        }

        const questionMarks = (text.match(/\?/g) || []).length;
        const exclamations = (text.match(/!/g) || []).length;

        if (questionMarks > 1 || exclamations > 1) {
            score += 10;
            matches.push('Emotional punctuation - suggests human writer');
        }

        const sentence = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const shortSentence = sentence.filter (s => s.trim().split(/\s+/).length < 8);

        if (shortSentence.length > sentence.length * 0.3) {
            score += 12;
            matches.push('Many short sentences - conversational human style');
        }

        const irregularCaps = text.match(/[a-z][A-Z]/g);
        if (irregularCaps && irregularCaps.length > 0) {
            score += 8;
            matches.push('Irregular formatting - human imperfection');
        }

        return {score, matches};
    }

    private checkUniformity(analysis: TextAnalysis): {score: number; reason: string} {
        let score = 0 ;
        let reason = '';

        const uniqueRatio = analysis.uniqueWords / analysis.todalWords;

        if(uniqueRatio > 0.75) {
            score += 15;
            reason = 'Exeptionally high vocabulary diversity (AI tends to avoid repetition)';
        }

        if(analysis.sentenceComplexity > 15 && analysis.sentenceComplexity < 25) {
            score += 12;
            reason += reason ? '|' : '';
            reason += 'Very consistent sentence structure';
        }

        if (analysis.avgWordLength > 5.5 && analysis.avgWordLength < 6.5) {
            score += 8;
            reason += reason ? '|' : '';
            reason += 'Unusually consistent word length';
        }

        return{score, reason};
    }

    private checkTextFlow(text: string): {score: number; reason: string} {
        let score = 0;
        let reason = "";

        const sentence = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceLength = sentence.map(s => s.trim().split(/\s+/).length);

        const avgLength = sentenceLength.reduce((a,b) => a + b, 0) / sentenceLength.length;
        const variance = sentenceLength.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLength.length;

        if (variance <20) {
            score +=15;
            reason = 'Very uniform sentence length - AI pattern';
        } else if (variance > 80) {
            score -= 10;
            reason = 'Varied sentence structure - human pattern';
        }

        return { score, reason};
    }

    public detect(text: string): DetectionResult {
        if (text.length < 50) {
            return {
                isAI: false,
                confidance: 0,
                reason: ['text too shorts to analyze (minimum 50 characters)'],
                category: 'text'
            };
        }

        const analysis = this.analyzeText(text);
        const aiPatterns = this.checkAIpattern(text);
        const checkUniformity = this.checkUniformity(analysis);
        const humanPattern = this.checkHumanPattern(text);
        const textFlow = this.checkTextFlow(text);

       let aiScore = aiPatterns.score + checkUniformity.score + textFlow.score;

       aiScore -= humanPattern.score;

       let confidance = Math.max(0, Math.min(100, aiScore));

       const reason: string[] = [];

       if (humanPattern.matches.length > 0) {
        reason.push(...humanPattern.matches);
       }

       if (aiPatterns.matches.length > 0) {
        reason.push(...aiPatterns.matches);
       }

       if (checkUniformity.reason) {
        reason.push(checkUniformity.reason);
       }

       if (textFlow.reason) {
        reason.push(textFlow.reason);
       }

       if (reason.length == 0) {
        reason.push('Analysis inconclusive - text appears neutral');
       }

       const isAI = confidance > 55;

       return {
        isAI,
        confidance: Math.round(confidance),
        reason,
        category: 'text'
       }
    }
}