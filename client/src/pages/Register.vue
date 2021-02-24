<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Registre</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-sm shadow-1">
          <q-form class="q-gutter-md" ref="myForm" @submit.prevent="onSubmit" greedy>
            <q-card-section>
              <q-input
              square
              filled
              clearable
              v-model="full_name"
              type="text"
              label="Nom complet"
              :rules="[
                val => val.split(' ').length >= 2 || 'Has de ficar, com a mínim, el primer cognom',
                val => val.split(' ')[1].length >= 1 || 'Els cognoms no poden ser espais en blanc'
              ]"/>
              <q-input
              square
              class="q-pt-md"
              filled
              clearable
              ref="input"
              v-model="dni"
              type="text"
              label="DNI"
              :rules="[
                val => new RegExp('^[0-9]{8,8}[A-Z]$').test(this.dni) || 'El DNI ha de ser 00000000X'
              ]"/>
              <q-input
              square
              class="q-pt-md"
              filled
              clearable
              v-model="username"
              type="text"
              label="Usuari"
              :rules="[
                val => val.length >= 3 || 'El nom d\'usuari ha de tindre com a mínim tres caràcters',
                val => val.split(' ').length == 1 || 'El nom d\'usuari no pot contindre espais',
              ]"/>
              <q-input
              class="q-pt-md"
              square
              filled
              clearable
              v-model="password"
              type="password"
              label="Contrasenya"
              :rules="[
                val => val.length > 8 || 'La contrasenya ha de tindre com a mínim 8 caràcers'
              ]"/>
              <q-input
              class="q-pt-md"
              square
              filled
              clearable
              v-model="repeatPass"
              type="password"
              label="Repetir contrasenya"
              :rules="[
                val => val === this.password || 'Les contrasenyes no coincideixen'
              ]"/>
            </q-card-section>
            <q-card-actions class="q-pt-xs">
              <q-btn unelevated color="secondary" type="submit" size="lg" class="full-width" label="Registra't" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
const crypto = require('crypto')
export default {
  name: 'Register',
  data () {
    return {
      full_name: '',
      dni: '',
      username: '',
      password: '',
      repeatPass: ''
    }
  },
  methods: {
    onSubmit () {
      this.$refs.myForm.validate().then(success => {
        if (success) {
          this.$store.dispatch('showcase/register', {
            username: this.username,
            password: crypto.createHash('md5').update(this.password).digest('hex'),
            full_name: this.full_name,
            dni: this.dni
          })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: 'Registrat correctament'
              })
              this.$router.push('/')
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err * ' a '
              })
            })
        }
      })
    }
  }
}
</script>
