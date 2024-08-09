module.exports = {
  title: "PropsSDK for Fuel",
  description: "PropsSDK minting documentation for Fuel Network",
  themeConfig: {
    logo: {
      light: "/logo.svg",
      dark: "/logo-white.svg",
    },
    nav: [
      { text: "API", link: "/api/README" },
    ],
    sidebar: {
      "/api/": [
        {
          text: "API Documentation",
          items: [
            { text: "Overview", link: "/api/README.html" },
            { text: "PropsSDK", link: "/api/classes/PropsSDK" },
            { text: "EditionManager", link: "/api/classes/EditionManager" },
            { text: "Edition", link: "/api/classes/Edition" },
            {
              text: "CollectionManager",
              link: "/api/classes/CollectionManager",
            },
            { text: "Collection", link: "/api/classes/Collection" },
          ],
        },
      ],
      "/": [
        {
          text: "PropsSDK for Fuel",
          items: [
            { text: "Introduction", link: "/#octane-sdk" },
            { text: "Getting Started", link: "/#getting-started" },
            { text: "Usage", link: "/#usage" },
            {
              text: "Protocol Incentives",
              link: "/incentives",
            },
          ],
        },
        {
          text: "Guides",
          items: [
            {
              text: "Editions",
              link: "/editions",
            },
            {
              text: "Collections",
              link: "/collections",
            },
          ],
        },
        {
          text: "Future Considerations",
          link: "/future-considerations",
        },
      ],
    },
  },
};
