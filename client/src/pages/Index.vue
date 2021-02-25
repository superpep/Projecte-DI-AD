<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
            <q-form class="q-gutter-md" @submit.prevent="login">
              <q-card-section>
                <q-input square :rules="[val => val.length > 0|| 'L\'usuari no pot estar buit']" filled clearable v-model="username" type="username" label="Usuari" icon="login"/>
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
                <q-input square :rules="[val => val.length > 0|| 'La contrasenya no pot estar buida']" filled clearable v-model="password" type="password" label="Contrasenya" />
              </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="secondary" size="lg" type="submit" class="full-width" label="Login" />
            </q-card-actions>
            <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">No estàs registrat? <a href="#/register">Registra't</a></p>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
const crypto = require('crypto')
export default {
  preFetch ({ store, redirect }) {
    if (store.state.showcase.user.token) { // SI JA ESTEM LOGUEJATS
      redirect({ path: 'welcome' }) // REDIRECCIONEM A WELCOME
    }
  },
  name: 'PageIndex',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$store.dispatch('showcase/login', {
        username: this.username,
        password: crypto.createHash('md5').update(this.password).digest('hex')
      })
        .then(algo => {
          this.$q.notify({
            type: 'positive',
            message: 'Login correcte'
          })
          this.$router.push('welcome')
        })
        .catch(err =>
          this.$q.notify({
            type: 'negative',
            message: err
          })
        )
    }
  }
}
</script>
