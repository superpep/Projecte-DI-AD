/*
export function someAction (context) {
}
*/
import { api } from '../../boot/axios'

export function register ({ commit }, form) {
  return new Promise((resolve, reject) => {
    api.post('/register', form)
      .then(response => {
        console.log(response.data)
        commit('updateLoggedUser', response.data.data)
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}
export function login ({ commit }, payload) {
  return new Promise((resolve, reject) => {
    api.post('/login', payload)
      .then((response) => {
        commit('updateLoggedUser', response.data.data)
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}
