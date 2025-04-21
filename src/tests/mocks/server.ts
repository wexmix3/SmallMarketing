/**
 * MSW Server Setup
 * 
 * This file sets up a mock server using MSW (Mock Service Worker) for testing API calls.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server with all handlers
export const server = setupServer(...handlers);
