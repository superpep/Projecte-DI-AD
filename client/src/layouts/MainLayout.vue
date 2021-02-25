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
          @click="drawerState = !drawerState"
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
      v-model="drawerState"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
        Menú
        </q-item-label>
        <div v-if="userLogged" align="center">
          <q-avatar v-if="avatar" size="56px" class="q-mb-sm" align="center">
            <img :src="avatar">
          </q-avatar>
          <q-avatar v-else size="56px" class="q-mb-sm" align="center">
            <img src="https://cdn.quasar.dev/img/avatar.png">
          </q-avatar>
        </div>
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

const notLoggedData = [
  {
    title: 'Login',
    caption: 'Logueja\'t',
    icon: 'login',
    link: '#/login'
  }
]
const foreverData = {
  title: 'About',
  caption: 'Informació',
  icon: 'info',
  link: '#/about'
}

const loggedData = [
  {
    title: 'Notes',
    caption: 'Veure notes',
    icon: 'grade',
    link: '#/notes'
  },
  {
    title: 'Logout',
    caption: 'Desconectar-se',
    icon: 'logout',
    link: '#/logout'
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
      var newLinks = []
      if (this.userLogged) {
        loggedData.forEach(ele => {
          newLinks.push(ele)
        })
      } else {
        notLoggedData.forEach(ele => {
          newLinks.push(ele)
        })
      }
      newLinks.push(foreverData)
      return newLinks
    },
    avatar: {
      get () {
        return this.$store.state.showcase.user.avatar
      }
    },
    userLogged: {
      get () {
        return this.$store.state.showcase.user.token != null
      }
    },
    drawerState: {
      get () {
        return this.$store.state.showcase.drawerState
      },
      set (val) {
        this.$store.commit('showcase/updateDrawerState', val)
      }
    }
  }
}
</script>
