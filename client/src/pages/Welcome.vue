<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <h1>Benvolgut, {{ username }}</h1>
  </q-page>
</template>
<script>
export default {
  preFetch ({ store, redirect }) {
    if (!store.state.showcase.user.token) { // SI NO HI HA TOKEN...
      redirect({ path: '/' }) // REDIRECCIONEM A LOGIN JA QUE NO TÉ PERMISSOS PER A VEURE AQUESTA PÀGINA
    }
  },
  name: 'Welcome',
  computed: {
    username: {
      get () {
        return this.$store.state.showcase.user.username
      }
    }
  }
}
</script>
