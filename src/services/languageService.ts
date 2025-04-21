/**
 * Language Service
 * 
 * This service provides language detection and translation capabilities.
 */

import { generateEmbedding } from './embeddingService';
import { openai } from './openaiService';

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' }
];

// Language detection patterns
const languagePatterns: Record<string, RegExp[]> = {
  en: [/\b(the|is|are|and|in|to|for|with|that|this)\b/i],
  es: [/\b(el|la|los|las|es|son|y|en|para|con|que|este)\b/i],
  fr: [/\b(le|la|les|est|sont|et|dans|pour|avec|que|ce)\b/i],
  de: [/\b(der|die|das|ist|sind|und|in|für|mit|dass|diese)\b/i],
  it: [/\b(il|la|i|le|è|sono|e|in|per|con|che|questo)\b/i],
  pt: [/\b(o|a|os|as|é|são|e|em|para|com|que|este)\b/i],
  zh: [/[\u4e00-\u9fff]/], // Chinese characters
  ja: [/[\u3040-\u309f\u30a0-\u30ff]/], // Japanese characters
  ko: [/[\uac00-\ud7af]/], // Korean characters
  ar: [/[\u0600-\u06ff]/], // Arabic characters
  ru: [/[\u0400-\u04ff]/] // Cyrillic characters
};

/**
 * Detect the language of a text
 * 
 * @param text - The text to detect
 * @returns The detected language code
 */
export async function detectLanguage(text: string): Promise<string> {
  // First try pattern matching for efficiency
  for (const [langCode, patterns] of Object.entries(languagePatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return langCode;
      }
    }
  }
  
  // If pattern matching fails, use AI for more accurate detection
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a language detection system. Respond with only the ISO 639-1 language code.'
        },
        {
          role: 'user',
          content: `Detect the language of this text: "${text.substring(0, 100)}..."`
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    });
    
    const detectedLanguage = response.choices[0].message.content?.trim().toLowerCase();
    
    // Validate the detected language
    if (detectedLanguage && supportedLanguages.some(lang => lang.code === detectedLanguage)) {
      return detectedLanguage;
    }
    
    // Default to English if detection fails
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}

/**
 * Translate text to another language
 * 
 * @param text - The text to translate
 * @param targetLanguage - The target language code
 * @param sourceLanguage - The source language code (optional)
 * @returns The translated text
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> {
  try {
    // Detect source language if not provided
    if (!sourceLanguage) {
      sourceLanguage = await detectLanguage(text);
    }
    
    // If source and target languages are the same, return the original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }
    
    // Get language names for better translation
    const sourceLangName = supportedLanguages.find(lang => lang.code === sourceLanguage)?.name || sourceLanguage;
    const targetLangName = supportedLanguages.find(lang => lang.code === targetLanguage)?.name || targetLanguage;
    
    // Use OpenAI for translation
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate from ${sourceLangName} to ${targetLangName}. Preserve formatting, tone, and meaning. Only respond with the translation, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3
    });
    
    return response.choices[0].message.content?.trim() || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Get localized templates for common responses
 * 
 * @param languageCode - The language code
 * @returns Object containing localized templates
 */
export function getLocalizedTemplates(languageCode: string = 'en'): Record<string, string> {
  // Default English templates
  const defaultTemplates = {
    greeting: 'Hello! How can I help you today?',
    farewell: 'Thank you for chatting with us. Have a great day!',
    notUnderstood: 'I\'m sorry, I didn\'t understand that. Could you please rephrase?',
    humanHandoff: 'I\'ll connect you with a human agent. Please wait a moment.',
    businessHours: 'Our business hours are:',
    productInfo: 'Here\'s information about the product:',
    serviceInfo: 'Here\'s information about the service:',
    appointmentConfirmation: 'Your appointment has been confirmed for:',
    leadCaptureRequest: 'Would you like to receive updates about our products and services?',
    errorMessage: 'I\'m sorry, something went wrong. Please try again later.'
  };
  
  // Return default templates for English
  if (languageCode === 'en') {
    return defaultTemplates;
  }
  
  // Templates for other languages
  const localizedTemplates: Record<string, Record<string, string>> = {
    es: {
      greeting: '¡Hola! ¿Cómo puedo ayudarte hoy?',
      farewell: 'Gracias por chatear con nosotros. ¡Que tengas un buen día!',
      notUnderstood: 'Lo siento, no entendí eso. ¿Podrías reformularlo, por favor?',
      humanHandoff: 'Te conectaré con un agente humano. Por favor, espera un momento.',
      businessHours: 'Nuestro horario de atención es:',
      productInfo: 'Aquí tienes información sobre el producto:',
      serviceInfo: 'Aquí tienes información sobre el servicio:',
      appointmentConfirmation: 'Tu cita ha sido confirmada para:',
      leadCaptureRequest: '¿Te gustaría recibir actualizaciones sobre nuestros productos y servicios?',
      errorMessage: 'Lo siento, algo salió mal. Por favor, inténtalo de nuevo más tarde.'
    },
    fr: {
      greeting: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      farewell: 'Merci d\'avoir discuté avec nous. Passez une excellente journée !',
      notUnderstood: 'Je suis désolé, je n\'ai pas compris. Pourriez-vous reformuler, s\'il vous plaît ?',
      humanHandoff: 'Je vais vous mettre en relation avec un agent humain. Veuillez patienter un instant.',
      businessHours: 'Nos heures d\'ouverture sont :',
      productInfo: 'Voici des informations sur le produit :',
      serviceInfo: 'Voici des informations sur le service :',
      appointmentConfirmation: 'Votre rendez-vous a été confirmé pour :',
      leadCaptureRequest: 'Souhaitez-vous recevoir des mises à jour sur nos produits et services ?',
      errorMessage: 'Je suis désolé, quelque chose s\'est mal passé. Veuillez réessayer plus tard.'
    },
    de: {
      greeting: 'Hallo! Wie kann ich Ihnen heute helfen?',
      farewell: 'Vielen Dank für Ihren Chat mit uns. Haben Sie einen schönen Tag!',
      notUnderstood: 'Es tut mir leid, ich habe das nicht verstanden. Könnten Sie das bitte umformulieren?',
      humanHandoff: 'Ich verbinde Sie mit einem menschlichen Mitarbeiter. Bitte warten Sie einen Moment.',
      businessHours: 'Unsere Geschäftszeiten sind:',
      productInfo: 'Hier sind Informationen zum Produkt:',
      serviceInfo: 'Hier sind Informationen zum Service:',
      appointmentConfirmation: 'Ihr Termin wurde bestätigt für:',
      leadCaptureRequest: 'Möchten Sie Updates zu unseren Produkten und Dienstleistungen erhalten?',
      errorMessage: 'Es tut mir leid, etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal.'
    }
    // Add more languages as needed
  };
  
  // Return localized templates if available, otherwise default to English
  return localizedTemplates[languageCode] || defaultTemplates;
}

/**
 * Format a response in the user's language
 * 
 * @param templateKey - The template key
 * @param languageCode - The language code
 * @param variables - Variables to replace in the template
 * @returns The formatted response
 */
export function formatLocalizedResponse(
  templateKey: string,
  languageCode: string = 'en',
  variables: Record<string, string> = {}
): string {
  const templates = getLocalizedTemplates(languageCode);
  let template = templates[templateKey] || '';
  
  // Replace variables in the template
  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(`{${key}}`, value);
  }
  
  return template;
}
