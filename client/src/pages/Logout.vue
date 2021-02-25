<script>
import { Notify } from 'quasar'
export default {
  preFetch ({ store, redirect }) {
    if (store.state.showcase.user.token) { // SI ESTEM LOGUEJATS
      store.dispatch('showcase/logout') // ENS DESLOGUEEM
      Notify.create({
        type: 'positive',
        message: 'Desconectat correctament'
      })
    }
    redirect({ path: 'login' }) // REDIRECCIONEM A LOGIN
  },
  name: 'Logout'
}
</script>
