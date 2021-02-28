<template>
  <q-page class="bg-secondary window-height window-width row justify-center items-center">
    <div class="column">
      <h1 class="text-h3 text-primary text-center absolute-top">
        Alumnes
      </h1>
      <q-card v-if="alumnes.length" square bordered class="q-pa-sm shadow-1" style="width:300px">
        <q-list class="q-gutter-md" bordered separator>
          <q-item
          @click="setNota(num_alu)"
          clickable
          v-ripple
          v-model="alumnes"
          v-for="(alu, num_alu) in alumnes"
          :key="alu.id_alumne">
            <q-item-section avatar>
              <q-icon color="primary" name="edit" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ alu.full_name }}</q-item-label>
              <q-item-label caption>Nota: {{ alu.nota }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>
<script>
export default { // A aquesta pàgina sols es pot accedir desde la funció toAssig de Notes.vue
  preFetch ({ store, redirect }) {
    if (store.state.showcase.user.role !== 'profe') { // SI NO ÉS PROFESSOR
      redirect({ path: 'notes' }) // REDIRECCIONEM A NOTES
    }
  },
  name: 'Moduls',
  methods: {
    setNota (numAlu) {
      this.$q.dialog({
        title: 'Indica la nota',
        message: 'Indica la nota de l\'alumne ' + this.alumnes[numAlu].full_name,
        prompt: {
          model: '',
          isValid: val => (Number(val) >= 0 && Number(val) <= 10 && val !== ''),
          type: 'number'
        },
        cancel: true,
        persistent: true
      }).onOk(nota => {
        this.$store.dispatch('showcase/setNewNota', { nota, numAlu })
          .then((res) => {
            console.log(numAlu + ' ' + nota)
            this.$forceUpdate()
          })
          .catch((err) => {
            console.error(err)
          })
      })
    }
  },
  computed: {
    alumnes: {
      get () {
        return this.$store.state.showcase.user.alumnes
      }
    }
  }
}
</script>
