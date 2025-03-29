// metadata.js
export const staticMetadata = {
    title: 'Wolf Intelligence',
    description: 'Dashboard for managing your account and settings.',
    // other static metadata
  };
  
  export async function generateDynamicMetadata(params) {
    // Here you can use dynamic data (params, etc.) to generate dynamic metadata
    const title = params.page ? `Wolf Intelligence - ${params.user}` : 'Wolf Intelligence';
     description: 'This is a dynamically generated page description'
    return {
      title,
      description: 'This is a dynamically generated page description',
      icons: {
        icon: '/favicon.png', // This links to the favicon in the public directory
      },
    };
  }
  