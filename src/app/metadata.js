
  // metadata.js
export const staticMetadata = {
  title: 'Wolf Intelligence ',
  description: 'Dashboard for managing your account and settings.',
  // other static metadata
};

// This function can be used to generate dynamic metadata for specific pages
export async function generateDynamicMetadata(params) {
  // Use params to create a dynamic title
  const title = params.page ? `Wolf Intelligence - ${params.page}` : 'Wolf Intelligence';

  // Dynamically generate a description based on params (or use a default one)
  const description = params.page ? `Details about ${params.page}` : 'This is the default page description.';

  return {
    title,
    description,
    icons: {
      icon: '/favicon.png', // This links to the favicon in the public directory
    },
  };
}
