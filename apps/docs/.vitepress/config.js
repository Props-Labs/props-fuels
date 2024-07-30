module.exports = {
  title: "Octane for Fuel Docs",
  description: "Octane minting SDK documentation for Fuel Network",
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: "Home", link: "/" },
      { text: "Editions", link: "/editions" },
      { text: "API", link: "/api/README" },
    ],
    sidebar: {
      "/api/": [
        {
          text: "API Documentation",
          items: [
            { text: "EditionManager", link: "/api/classes/EditionManager" },
            { text: "Octane", link: "/api/classes/Octane" },
          ],
        },
      ],
      "/": [
        {
          text: "Octane for Fuel",
          items: [
            { text: "Introduction", link: "/#octane-sdk" },
            { text: "Getting Started", link: "/#getting-started" },
            { text: "Usage", link: "/#usage" },
          ],
        },
        {
          text: "Guide",
          items: [
            {
              text: "Editions",
              items: [
                { text: "Overview", link: "/editions" },
                { text: "Create Edition", link: "/editions/create" },
                { text: "Mint Edition", link: "/editions/mint" },
              ],
            },
            {
              text: "Advanced",
              items: [
                { text: "Edition Metadata", link: "/editions/metadata" },
                { text: "Edition Configuration", link: "/editions/configuration" },
              ],
            },
          ],
        },
      ],
    },
  },
};
