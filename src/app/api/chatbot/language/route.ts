/**
 * Language API
 * 
 * This API endpoint provides language detection and translation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { detectLanguage, translateText, supportedLanguages } from '@/services/languageService';

/**
 * GET /api/chatbot/language/supported
 * 
 * Get supported languages.
 * 
 * @param request - The request object
 * @returns The list of supported languages
 */
export async function GET(request: NextRequest) {
  try {
    // Check if this is a request for supported languages
    const path = request.nextUrl.pathname;
    
    if (path.endsWith('/supported')) {
      return NextResponse.json(supportedLanguages);
    }
    
    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error getting supported languages:', error);
    
    return NextResponse.json(
      { error: 'Failed to get supported languages' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chatbot/language/detect
 * 
 * Detect the language of text.
 * 
 * @param request - The request object
 * @returns The detected language
 */
export async function POST(request: NextRequest) {
  try {
    // Get path to determine the action
    const path = request.nextUrl.pathname;
    
    // Parse request body
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }
    
    // Detect language
    if (path.endsWith('/detect')) {
      const language = await detectLanguage(text);
      
      return NextResponse.json({
        language,
        name: supportedLanguages.find(lang => lang.code === language)?.name || language
      });
    }
    
    // Translate text
    if (path.endsWith('/translate')) {
      const { targetLanguage, sourceLanguage } = body;
      
      if (!targetLanguage) {
        return NextResponse.json(
          { error: 'Target language is required' },
          { status: 400 }
        );
      }
      
      // Check if target language is supported
      if (!supportedLanguages.some(lang => lang.code === targetLanguage)) {
        return NextResponse.json(
          { error: 'Unsupported target language' },
          { status: 400 }
        );
      }
      
      // Translate text
      const translatedText = await translateText(text, targetLanguage, sourceLanguage);
      
      return NextResponse.json({
        originalText: text,
        translatedText,
        sourceLanguage: sourceLanguage || await detectLanguage(text),
        targetLanguage
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid endpoint' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing language request:', error);
    
    return NextResponse.json(
      { error: 'Failed to process language request' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
