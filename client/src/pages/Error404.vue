<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        {{num_error}}
      </div>

      <div class="text-h2" style="opacity:.4">
        {{msg_error}}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="msg_boto"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  data () {
    return {
      num_error: '404',
      msg_error: 'Pàgina inexistent',
      msg_boto: 'Torna enrere'
    }
  }
}
</script>
