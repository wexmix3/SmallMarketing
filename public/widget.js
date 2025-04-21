/**
 * AI Customer Service Assistant - Widget Embedding Script
 * 
 * This script allows businesses to embed the AI Customer Service Assistant
 * on their websites with minimal code.
 * 
 * Usage:
 * <script src="https://your-domain.com/widget.js"></script>
 * <script>
 *   aichat('init', 'YOUR_BUSINESS_ID', { theme: 'light' });
 * </script>
 */

(function(w, d, s, o, f, js, fjs) {
  w['AIChatWidget'] = o;
  w[o] = w[o] || function() {
    (w[o].q = w[o].q || []).push(arguments)
  };
  js = d.createElement(s);
  fjs = d.getElementsByTagName(s)[0];
  js.id = o;
  js.src = f;
  js.async = 1;
  fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', 'aichat', 'https://your-domain.com/chatbot-loader.js'));
