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
