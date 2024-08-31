<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'GoFileServer',
  data() {
    return {
      url: 'https://github.com/ctxgo/go-file-server-ui.git'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
