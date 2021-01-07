const mix = require('laravel-mix')
const path = require('path')

// NOTE: Don't remove this, Because it's the default public folder path on AdonisJs
mix.setPublicPath('public')

mix
  .js('resources/vue/main.js', path.resolve(__dirname, 'public/js'))
  .webpackConfig({
    context: __dirname,
    node: {
      __filename: true,
      __dirname: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'resources/vue'),
        '~': path.resolve(__dirname, 'resources/vue'),
        '@sass': path.resolve(__dirname, 'resources/assets/sass'),
      },
    },
  })
  .sass('resources/assets/scss/app.scss', path.resolve(__dirname, 'public/css'))
  .options({
    processCssUrls: false,
  })
  .vue() // Magic here!!
