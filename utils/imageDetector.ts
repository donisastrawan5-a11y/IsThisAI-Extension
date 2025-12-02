import { ImageAnalysis, imageDetectionResult } from "@/types";

export class imageDetector {
    public async detecFromFile(file: File): Promise<imageDetectionResult> {
        try {
            const fileSize = file.size;
            const fileName = file.name.toLowerCase();

            const img = await this.loadImage(file);
            const dimensions = {
                width: img.width,
                height: img.height
            };

            const metadata = await this.extractMetadata(file);

            return this.analyzeImage({
                hasMetadata: Object.keys(metadata).length > 0,
                metadata,
                fileSize,
                dimensions
            }, fileName);

        } catch (error) {
            console.error('Image detection error:', error);
            return {
                isAI: false,
                confidance: 0,
                reason: ['failed to analyze image: ' + String(error)],
                category: 'image'
            };
        }
    }

    private loadImage (file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('Failed to load image'));
            };

            img.src = url;
        });
    }

    private async extractMetadata(file: File): Promise<Record<string, any>> {
        const metadata: Record<string, any> = {
            type: file.type,
            lastModified: file.lastModified,
            name: file.name
        };

        return metadata;
    }

    private analyzeImage(analysis: ImageAnalysis, fileName: string): imageDetectionResult {
        let score = 0;
        const reason: string[] = [];

        const aiImagePatterns = [
            'dalle', 'midjourney', 'stable-diffusion', 'generated',
            'ai-', 'synthetic', 'gan-', 'diffusion'
        ];

        if (aiImagePatterns.some(pattern => fileName.includes(pattern))) {
            score += 40;
            reason.push('Filename suggests AI generation');
        }


        const {width, height} = analysis.dimensions;
        const commonAISize = [
            { w: 512, h: 512, name: 'SD 1.x standard' },
            { w: 768, h: 768, name: 'SD 2.x standard' },
            { w: 1024, h: 1024, name: 'DALL-E/SD XL' },
            { w: 1024, h: 768, name: 'SD landscape' },
            { w: 768, h: 1024, name: 'SD portrait' },
            { w: 896, h: 896, name: 'Midjourney square' },
            { w: 1344, h: 768, name: 'Midjourney wide' },
            { w: 768, h: 1344, name: 'Midjourney tall' }
        ];

        const isPerfectSize = commonAISize.some(
            size => size.w == analysis.dimensions.width && size.h == analysis.dimensions.height
        );

        if (isPerfectSize) {
            score += 25;
            reason.push(`Perfect square/standard dimensions (${analysis.dimensions.width}x${analysis.dimensions.height}) common in AI images`);
        }

        if (width % 64 == 0 && height % 64 == 0 && (width > 512 || height > 512)) {
            score += 20;
            reason.push(`Dimensions perfectly divisible by 64 (${width}x${height}) - common in AI-generated images`);
        }

        const aspectRatio = width / height;
        const commonAspectRatios = [
            { ratio: 1.0, tolerance: 0.01, name: '1:1 square' },
            { ratio: 1.33, tolerance: 0.05, name: '4:3 ratio' },
            { ratio: 1.77, tolerance: 0.05, name: '16:9 ratio' },
            { ratio: 0.75, tolerance: 0.05, name: '3:4 portrait' }
        ];

        const matchesCommonRatio = commonAspectRatios.some(
            ar => Math.abs(aspectRatio - ar.ratio) < ar.tolerance
        );

        if (matchesCommonRatio && (width % 8 == 0 && height % 8 == 0)) {
            score += 15;
            reason.push(`Aspect ratio (${aspectRatio.toFixed(2)}) matches common AI generation ratios`);
        }

        const metaDataKeys = Object.keys(analysis.metadata);

        if (metaDataKeys.length <= 4) {
            score += 15;
            reason.push('Minimal metadata found - common in AI-generated images');
        }

        if (analysis.metadata.type == 'image/png') {
            score += 10;
            reason.push('PNG format detected - often used for AI-generated images due to lossless compression');
        }

        const pixelCount = analysis.dimensions.width * analysis.dimensions.height;
        const bytesPerPixel = analysis.fileSize / pixelCount;

        if (bytesPerPixel < 0.3) {
            score += 15;
            reason.push('very low bytes per pixel - possible indicator of AI generation');
        } else if (bytesPerPixel > 4 && analysis.fileSize < 5000000) {
            score += 10;
            reason.push('Unusual file size - possible indicator of AI generation');
        }

        const confidance = Math.min(100, Math.max(0, score));
        const isAI = confidance > 50;

        if (reason.length === 0) {
            reason.push('No clear indicators of AI generation found - appears to be regular image');
        }

        return {
            isAI,
            confidance,
            reason,
            category: 'image',
            imageAnalysis: analysis
        };
    }

    public async detecFromUrl(url: string): Promise<imageDetectionResult> {
        const fileName = url.split('/').pop()?.toLowerCase() || '';

        const reason: string[] = [];
        let score = 0;

        const aiDomains = ['openai.com', 'midjourney', 'stability.ai', 'dalle.com', 'replicate.com'];
        if (aiDomains.some(domain => url.includes(domain))) {
            score += 60;
            reason.push('Image hosted on known AI generation platform');
        }

        const imagePatterns = [
            'dalle', 'midjourney', 'stable-diffusion', 'generated',
            'ai-', 'synthetic', 'gan-', 'diffusion'
        ];

        if (imagePatterns.some(pattern => fileName.includes(pattern))) {
            score += 40;
            reason.push('Filename suggests AI generation');
        }

        if (reason.length == 0) {
            reason.push('Cannot determine AI generation from URL alone - upload file for detailed analysis');
        }

        return {
            isAI: score > 50,
            confidance: Math.min(100, score),
            reason,
            category: 'image'
        };
    }
}