import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vuejs Kenya",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Fundamentals', link: '/fundamentals/introduction' },
      { text: 'Project Guides', link: '/project-guides/todo-app-complete' }
    ],

    sidebar: [
      {
        text: 'Fundamentals',
        items: [
          { text: 'Introduction', link: '/fundamentals/introduction' },
          { text: 'Reactive data', link: '/fundamentals/reactive-data' },
          { text: 'Methods events', link: '/fundamentals/methods-events' },
          { text: 'Conditional lists', link: '/fundamentals/conditional-lists' },
          { text: 'Simple calculator', link: '/fundamentals/simple-calculator' },
          { text: 'Options vs Composition API', link: '/fundamentals/options-vs-composition-api' },
          { text: 'Vue CLI starter', link: '/fundamentals/vue-cli-starter' },
          { text: 'Vite setup', link: '/fundamentals/vite-setup' },
          { text: 'Component communication', link: '/fundamentals/component-communication' },
          { text: 'Computed watchers', link: '/fundamentals/computed-watchers' },
          { text: 'Lifecycle hooks', link: '/fundamentals/lifecycle-hooks' },
          { text: 'Slots content', link: '/fundamentals/slots-content' },
        ]
      },
      {
        text: 'Project Guides',
        items: [
          {
            text: 'Todo app',
            link: '/project-guides/todo-app-complete'
          },
          {
            text: 'Shopping cart',
            link: '/project-guides/shopping-cart'
          },
          {
            text: 'Weather dashboard',
            link: '/project-guides/weather-dashboard'
          },
          {
            text: 'Contact manager',
            link: '/project-guides/contact-manager'
          },
          {
            text: 'Dynamic components',
            link: '/project-guides/dynamic-components'
          },
          {
            text: 'Custom directives',
            link: '/project-guides/custom-directives'
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/thecodingmontana/vuejs-kenya-docs' }
    ],

    search: {
      provider: 'local'
    },
    logo: '/logo.svg',
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },
})
