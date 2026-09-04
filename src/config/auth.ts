/**
 * Google OAuth & Authentication Configuration
 * 
 * Keep your Google Cloud Console Client ID defined here or in a `.env` file with `VITE_GOOGLE_CLIENT_ID`.
 */
export const GOOGLE_CLIENT_ID = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) || 
  'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
