// metadata.js
export const staticMetadata = {
  title: 'Wolf Intelligence',
  description: 'Dashboard for managing your account and settings.',
  favicon: '/favicon.ico', // Add favicon link here
  ogImage: '/default-og-image.jpg', // Add default Open Graph image link
  robots: 'noindex, nofollow', // Prevent search engines from indexing this page
};

// This function can be used to generate dynamic metadata for specific pages
export async function generateDynamicMetadata(params) {
  const title = params.page ? `Wolf Intelligence - ${params.page}` : 'Wolf Intelligence';
  const description = params.page ? `Details about ${params.page}` : 'This is the default page description.';

  return {
    title,
    description,
    icons: {
      icon: '/favicon.ico', // This links to the favicon in the public directory
    },
    ogImage: params.page ? `/og-images/${params.page}.jpg` : '/default-og-image.jpg', // Dynamic Open Graph image
    robots: 'noindex, nofollow', // Prevent search engines from indexing this page
    icons: {
      icon: '/favicon.png', // This links to the favicon in the public directory
    },
  };
}
