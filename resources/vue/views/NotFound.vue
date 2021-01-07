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
