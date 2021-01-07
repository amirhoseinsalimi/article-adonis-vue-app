In this post, we're going to setup Vue.js in a newly created Adonis.js v5 project. Also we're going to write Single File Components (SFC) for the Vue part and SCSS for the styling part! You can see the final source code of this tutorial on my [GitHub](https://github.com/amirhoseinsalimi/adonis-vue-app-article):


## Create a new project
We start with a fresh project, so let's create a new Adonis.js v5 project, called adonis-vue-app:
```console
npm init adonis-ts-app adonis-vue-app
```
Choose Web Application when prompted, so we have `@adonis/view`, `@adonis/session` providers configured for us automatically.

I preferably choose to install ESLint and Prettier as well, so my code always looks perfect. After your project is created `cd` to it.


## Setup a static file server
For the rest of the article, we need a static file server because later on, we want to access generated JS and CSS files directly from the browser. If you already chose to have an API boilerplate, then you may configure a static file server by creating `config/static.ts` with the following code:
```typescript
// config/static.ts

import { AssetsConfig } from '@ioc:Adonis/Core/Static'

const staticConfig: AssetsConfig = {
  enabled: true,
  
  dotFiles: 'ignore',
  
  etag: true,
  
  lastModified: true,
}

export default staticConfig
```
In order to tell Adonis.js file to serve which files to serve, open `.adonisrc.json` file and add this to the corresponding field:
```json
//...

"metaFiles": [
    ".env",
    ".adonisrc.json",
    {
      "pattern": "resources/views/**/*.edge",
      "reloadServer": true
    },
    {
      "pattern": "public/**/css/*.css",
      "reloadServer": false
    },
    {
      "pattern": "public/**/js/*.js",
      "reloadServer": false
    }
  ],

//...
```


## Configure Laravel Mix
Now it's time to install the beloved laravel-mix, but how? Thankfully there's a provider for that, specifically implemented for Adonis.js v5, by [Wahyu Budi Saputra
](https://github.com/wahyubuci/). Let's install the package and its dependencies:
```console
npm i adonis-mix-asset && npm i --save-dev laravel-mix
```
After that, invoke the corresponding ace command to configure the provider for us.

```console
node ace invoke adonis-mix-asset
```
Done! A `webpack.mix.js` file has been created at the root of your project. Open it and see all the default configuration. It's a common laravel-mix file, ha? Replace the current configuration with the following code:
```javascript
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
```
What we're doing is simple. We want to load our entry Vue.js file from `resources/vue/main.js` and expose it to the public directory. We do the same for our SCSS files which reside under `resources/assets/scss/`. We also created aliases for Webpack, so we'll able to use `@/components/HelloWorld.vue` later in our SFCs. Feel free to have a look at the package documentation or Laravel Mix if you're new to it. The last line of code specifies that we want to use Vue.js Single File Components so it'll install required dependencies as we run laravel-mix. You also don't want to version control those dirty files created by laravel-mix so adding them to your `.gitignore` would be a wise move:

```
mix-manifest.json
hot
public/js/*
public/css/*
```


## Bring Vue.js to the game
For a clean Vue.js app we need an SFC compiler and a few extra packages like `sass`, `sass-loader`, `vue-loader`, etc. Although all these packages will be installed for you automatically by laravel-mix, I just list them here if you want to take a look at them. Let's install them all in one go:
```console
npm i vue vue-router && npm i -D sass sass-loader vue-loader vue-template-compiler autoprefixer postcss
```
Hmmm... good! Now go and delete all files inside `resources/views` directory and instead create a new file called `index.edge` there, and fill it with this content:
```html
<!-- resources/views/index.edge -->

<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
</head>

<body>
  <h1 class="center">
    This is index.edge file
  </h1>

  <div id="app"></div>
  <script src="{{ mix('/js/main.js') }}"></script>
</body>
</html>
```
Look how we're referring to the generated files by Laravel Mix using `mix()` helper. Also, we created an `#app` container in which our Vue.js app will be mounted. We also want to put the Vue.js app in a separate directory to be as neat as possible, so:
```console
mkdir -p ./resources/vue/
```
In the `vue` directory, create the following structure:
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/xzf7deso1ir6m2nl57im.png)
 

Now it's time to fill these files with some boilerplate. I go get some coffee, and you just place the codes below in their corresponding files:
```vue
<!-- resources/vue/App.vue -->

<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  
  mounted() {
    console.log('App has been mounted!!!')
  },
}
</script>

<style lang="scss">
a {
  border: 1px solid black;
  width: 100px;
  background: gray;
  padding: 5px 10px;
  text-align: center;

  &.active {
    background: tomato;
  }
}
</style>
```

```javascript
// resources/vue/main.js

import Vue from 'vue'
import router from './router/index'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
})
```

```javascript
// resources/vue/router/index.js

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue'),
    },
    // Should be the last route to handle 404
    {
      path: '*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})
```

```vue
<!-- resources/vue/components/HelloWorld.vue -->

<template>
  <div class="hello-world-component">
    <h2>
      {{ message }}
    </h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  data() {
    return {
      message: 'This is a message from Hello World component',
    }
  },
}
</script>

<style scoped lang="scss">
.hello-world-component {
  width: 70%;

  h2 {
    border: 1px dashed coral;
    background: brown;
    color: white;
    text-align: center;
  }
}
</style>
```

```vue
<!-- resources/vue/views/Home.vue -->

<template>
  <div>
    <h2>{{ homePageMessage }}</h2>

    <hello-world />

    <router-link to="/about">Go to About page</router-link>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',

  components: { HelloWorld },

  data() {
    return {
      homePageMessage: 'This is the Home page'
    }
  },
}
</script>
```

```vue
<!-- resources/vue/views/About.vue -->

<template>
  <div>
    <h2>This is the About page</h2>
    <router-link to="/">back To Home page</router-link>
  </div>
</template>

<script>
export default {
  name: 'About',
}
</script>
```

```vue
<!-- resources/vue/views/NotFound.vue -->

<template>
  <div class="not-found-page">
    This is the 404 page. Are you lost?

    <router-link class="go-back-btn" to="/">
      Go Back Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Register',
}
</script>

<style scoped lang="scss">
.not-found-page {
  color: red;
  text-align: center;

  .go-back-btn {
    display: block;
    margin: 10px auto;
    width: 400px;
  }
}
</style>
```

Finished it? Good! As you may already be noticed we created a typical Vue.js app structure within `./resources/vue/`. Now let's talk about routing.


## Setup server-side routes
We configured `vue-router` for client-side routing but we're yet to register server-side routes. We need only 2 of them, cause most of the routing will be handled by `vue-router`. Open `start/routes.ts` and add the following:
```typescript
# ./start/routes.ts

import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// A typical route handler
Route.get('/', async ({ view }: HttpContextContract) => {
  return view.render('index')
}).as('index')

/* A catch-all route handler. If a user hits the address http://example.com/a-route-that-does-not-exist directly in the browser, then our Vue.js app will mount, and routing will be delegated to vue-router.
 */
Route.get('*', async ({ view }: HttpContextContract) => {
  return view.render('index')
}).as('not_found')
```
The code above is the exact code we're told to do, when using `vue-router` (but for Adonis.js). The catch-all route will pass the routing to the Vue.js app if a user wants to go to a non-existing route.

## What about styling?
Remember the `webpack.mix.js` file we created earlier? We told Webpack to go compile `app.scss` file but we haven't created it yet. So, create it under `resources/assets/scss/` and copy these lines of code:

```scss
// resources/assets/scss/app.scss

@import url('https://fonts.googleapis.com/css2?family=Goldman&display=swap');

* {
  font-family: 'Goldman', cursive;
}
```
You may want to add more `.scss` files and import them inside this file to be applied.


## Add TypeScript to the cake
For the sake of simplicity, I make another post on how to setup TypeScript with Vue.js. That'll be fun cause having TypeScript both on the front-end and back-end gives you more confidence.

## Wiring things up
It's time to see what we just built. Open a terminal hit `node ace serve --watch` and in another session enter `node ace mix:watch`. The latter has been added by "adonis-mix-asset" when we invoked its provider. If you want to watch your assets and re-bundle them on the fly, you may use `--hot` switch. For a production build you can issue this command: `node ace mix:build --production`.

If you want to look into the source code directly, you can check it out here:
[GitHub](https://github.com/amirhoseinsalimi/adonis-vue-app-article)


## Conclusion
We just finished setting up an Adonis.js project with Vue.js front-end, we have used SFCs and SCSS for the good. Also, we separated back-end and front-end to have an opinionated code structure, which all Vue.js developer used to.

And the last sentence, Adonis.js is one of the strongest Node.js frameworks I've worked with. I can surely say, in 2021 we'll hear many good news about it; Enjoy using it.
