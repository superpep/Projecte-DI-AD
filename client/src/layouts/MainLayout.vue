<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Qualifications App
        </q-toolbar-title>
        <q-toolbar-subtitle>
          {{todayDate()}}
        </q-toolbar-subtitle>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
        </q-item-label>
        <EssentialLink
          v-for="link in getLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Login',
    caption: 'Logueja\'t',
    icon: 'login',
    link: '#'
  },
  {
    title: 'About',
    caption: 'Informació',
    icon: 'info',
    link: '#/about'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [],
      logged: false
    }
  },
  methods: {
    todayDate () {
      // DIMECRES, 16 DE FEBRER DE 2021
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd, DD') + ' de ' + date.formatDate(timeStamp, 'MMMM') + ' de ' + date.formatDate(timeStamp, 'YYYY')
    }
  },
  computed: {
    getLinks () {
      return linksData.filter(e => (e.title !== 'Login' || !this.logged))
    }
  }
}
</script>
