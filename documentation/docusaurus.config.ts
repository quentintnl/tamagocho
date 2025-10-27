import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Tamagotcho Documentation',
  tagline: 'Documentation technique du projet Tamagotchi My Digital School',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://tamagotcho.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/documentation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'RiusmaX', // Usually your GitHub org/user name.
  projectName: 'tamagotcho', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr']
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/RiusmaX/tamagotcho/tree/master/documentation/'
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        },
      } satisfies Preset.Options
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'Tamagotcho',
      logo: {
        alt: 'Tamagotcho Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation'
        },
        {
          href: 'https://github.com/RiusmaX/tamagotcho',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/'
            }
          ]
        },
        {
          title: 'Projet',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/RiusmaX/tamagotcho'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Digital School - Tamagotcho.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
}

export default config
