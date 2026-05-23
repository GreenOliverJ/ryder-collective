const { configure } = require('quasar/wrappers')

module.exports = configure(() => ({
  boot: ['axios', 'auth'],
  css: ['app.scss'],
  extras: ['material-icons', 'roboto-font'],
  build: {
    target: { browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'], node: 'node16' },
    vueRouterMode: 'history',
    env: {
      VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:4000/api'
    }
  },
  devServer: {
    port: 9000,
    open: true
  },
  framework: {
    config: {
      dark: true,
      brand: {
        primary: '#7c4dff',
        secondary: '#26a69a',
        accent: '#ff6b35',
        dark: '#0d1117',
        'dark-page': '#0a0e14'
      }
    },
    plugins: ['Notify', 'Dialog', 'Loading']
  },
  animations: [],
  sourceFiles: {
    router: 'src/router/index.js',
    store: 'src/stores/index.js'
  }
}))
