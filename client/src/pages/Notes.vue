<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <q-card square bordered class="q-pa-sm shadow-1" style="width:300px">
        <q-list class="q-gutter-md" bordered separator>
          <q-item
          @click="toAssig(num_assig)"
          clickable
          v-ripple
          v-for="(assig, num_assig) in assignatures"
          :key="assig.cod_assig">
            <q-item-section avatar>
              <q-icon v-if="isAlumne" color="primary" name="find_in_page" />
              <q-icon v-else color="primary" name="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ assig.cod_assig }}</q-item-label>
              <q-item-label caption>{{ assig.nom_assig }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>{{ assig.nota }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { Loading } from 'quasar'
export default {
  preFetch ({ store, redirect }) {
    if (!store.state.showcase.user.token) { // SI NO ESTEM LOGUEJATS
      redirect({ path: 'login' }) // REDIRECCIONEM A LOGIN
    } else { // PER ARA SOLS FUNCIONA ACTUALITZANT I TAMBÉ ESTARÍA BÉ FER UNA COMPROVACIÓ JA QUE SI ASSIGNATURES JA ESTÀ EMPLENAT NO VOLEM TORNAR A CARREGAR DADES
      Loading.show()
      const direccio = store.state.showcase.user.role === 'alumne' ? 'notes' : 'moduls'
      store.dispatch('showcase/getAssigs', direccio).then(res => Loading.hide()).catch((err) => console.log(err))
    }
  },
  name: 'Notes',
  computed: {
    isAlumne () {
      return this.userRole === 'alumne'
    },
    userRole: {
      get () {
        return this.$store.state.showcase.user.role
      }
    },
    assignatures: {
      get () {
        return this.$store.state.showcase.user.assignatures
      }
    }
  },
  methods: {
    toAssig (numAssig) { // Deixe aço implementat PER SI ACÀS
      console.log(this.assignatures[numAssig].links.get)
      this.$router.push(this.assignatures[numAssig])
    }
  }
}
</script>
