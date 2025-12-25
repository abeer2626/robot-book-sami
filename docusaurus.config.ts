import type { Config } from '@docusaurus/types';
import type { Options as ClassicThemeOptions } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical Humanoid Robotics Textbook',
  tagline: 'A Comprehensive Guide to Physical Humanoid Robotics and AI',
  favicon: 'img/favicon.svg',

  url: process.env.DEPLOY_URL || 'https://abeer2626.github.io',
  baseUrl: process.env.DEPLOY_BASE_URL || '/robot-book-sami',

  organizationName: 'abeer2626',
  projectName: 'robot-book-sami',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies ClassicThemeOptions,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Physical Humanoid Robotics',
      logo: {
        alt: 'Physical Humanoid Robotics Logo',
        src: 'img/logo-horizontal.svg',
        width: 280,
        height: 80,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Modules',
        },
        {
          to: '/dashboard',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://github.com/abeer2626/humanoid-robotics-book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Modules',
          items: [
            {
              label: 'Module 1: Foundations',
              to: '/docs/module-01',
            },
            {
              label: 'Module 2: Core Concepts',
              to: '/docs/module-02',
            },
            {
              label: 'Module 3: Advanced Topics',
              to: '/docs/module-03',
            },
            {
              label: 'Module 4: Applications',
              to: '/docs/module-04',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/abeer2626/humanoid-robotics-book',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical Humanoid Robotics Textbook Project. Created by SAMI UR REHMAN.`,
    },
    prism: {
      additionalLanguages: ['python', 'javascript', 'typescript', 'bash', 'json'],
    },
  } satisfies ClassicThemeOptions['themeConfig'],

  plugins: [
    // Add custom plugins here for RAG integration later
  ],
};

export default config;