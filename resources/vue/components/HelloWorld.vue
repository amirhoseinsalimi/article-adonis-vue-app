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
