# AI Customer Service Assistant - Project Structure

```
/ai-customer-assistant/
├── /public/
│   ├── /images/
│   │   └── logo.svg
│   └── /js/
│       └── chatbot-embed.js
├── /src/
│   ├── /components/
│   │   ├── /chatbot/
│   │   │   ├── ChatWidget.js
│   │   │   ├── MessageBubble.js
│   │   │   └── TypingIndicator.js
│   │   └── /setup/
│   │       ├── SetupWizard.js
│   │       └── /steps/
│   │           ├── BusinessInfoStep.js
│   │           ├── KnowledgeBaseStep.js
│   │           ├── CustomizationStep.js
│   │           ├── IntegrationStep.js
│   │           ├── PreviewStep.js
│   │           └── CompletionStep.js
│   ├── /services/
│   │   ├── integrationService.js
│   │   ├── contentExtractionService.js
│   │   ├── fallbackService.js
│   │   └── pricingService.js
│   ├── /models/
│   │   ├── businessTypes.js
│   │   └── knowledgeBaseSchema.js
│   ├── /utils/
│   │   ├── auth.js
│   │   └── dataEncryption.js
│   └── /middleware/
│       └── securityMiddleware.js
├── /api/
│   ├── /routes/
│   │   ├── auth.js
│   │   ├── setup.js
│   │   ├── chatbot.js
│   │   └── integration.js
│   └── /controllers/
│       ├── authController.js
│       ├── setupController.js
│       ├── chatbotController.js
│       └── integrationController.js
├── /deployment/
│   ├── wordpress-plugin/
│   ├── shopify-app/
│   ├── wix-component/
│   └── squarespace-block/
├── index.html
├── package.json
└── README.md
```
