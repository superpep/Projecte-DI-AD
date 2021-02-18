<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Registre</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-form class="q-gutter-md" @submit="validateForm" action="/" method="post">
            <q-card-section>
              <q-input square filled clearable v-model="name" type="text" label="Nom complet" />
              <q-input square filled clearable :class="{ 'bg-red' : dni.error }" v-model="dni.string" type="text" label="DNI" />
              <q-input square filled clearable v-model="username" type="text" label="Usuari" />
              <q-input square filled clearable :class="{ 'bg-red' : password.error }" v-model="password.string" type="password" label="Contrasenya" />
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="secondary" type="submit" size="lg" class="full-width" label="Registra't" />
            </q-card-actions>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      name: null,
      dni: {
        error: false,
        string: null
      },
      username: null,
      password: {
        error: false,
        string: null
      },
      validated: null
    }
  },
  methods: {
    validateForm () {
      if (!(this.name && this.dni.string && this.username && this.password.string)) { // SI S'HAN INTRODUÏT TOTS ELS CAMPS
        this.$q.notify('Tots els camps son obligatoris')
        return false
      }
      this.validated = true
      if (this.dni.string.length !== 9) { // Si el DNI NO té 9 digits
        this.$q.notify({
          group: false,
          message: 'El DNI ha de tindre 9 caràcters'
        })
        this.dni.error = true
        this.validated = false
      } else {
        this.dni.error = false
      }
      if (this.password.string.length < 8) { // Si la contrasenya té menys de 8 carácters
        this.$q.notify({
          group: false,
          message: 'La contrasenya no pot ser menor a 9 caràcters'
        })
        this.password.error = true
        this.validated = false
      } else {
        this.password.error = false
      }
      return this.validated
    }
  }
}
</script>
