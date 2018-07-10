import environment from './environment';

const config = {
  title: 'SiteInspector.js',
  aboutUrl: 'https://aka.ms/storeinspector',
  authentication: {
    message: 'with onmicrosoft.com credentials',
    client: environment.siteInspectorAuthUrl,
  },
  tabs: [
    {
      title: 'Bugs',
      id: 'bugs',
      parameters: {
        bugAreaPaths: ['OSGS\\Data and Engineering Services\\EPIC\\Continuous Delivery, Integration and Diagnostics\\StoreInspector'],
      },
    },
    {
      title: 'Scripts',
      id: 'scripts',
    },
    {
      title: 'Contact Us',
      id: 'contact',
    },
  ],
};

export default config;
