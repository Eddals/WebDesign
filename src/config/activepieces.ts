// ActivePieces webhook configuration
// For production, these should be stored in environment variables

export const ACTIVEPIECES_CONFIG = {
  webhookUrl: 'https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg',
  username: import.meta.env.VITE_ACTIVEPIECES_USERNAME || 'eae',
  password: import.meta.env.VITE_ACTIVEPIECES_PASSWORD || 'eae!!!'
};

// Helper function to create authorization header
export const getActivePiecesAuthHeader = () => {
  return 'Basic ' + btoa(ACTIVEPIECES_CONFIG.username + ':' + ACTIVEPIECES_CONFIG.password);
};