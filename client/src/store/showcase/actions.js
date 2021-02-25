/*
export function someAction (context) {
}
*/
import { api } from '../../boot/axios'

export function register ({ commit }, form) {
  return new Promise((resolve, reject) => {
    api.post('/register', form)
      .then(response => {
        commit('updateLoggedUser', response.data.data)
        resolve()
      })
      .catch((err) => {
        reject(err.toString())
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
        reject(err.toString())
      })
  })
}
export function logout ({ commit }) {
  commit('logout')
}
export function getAssigs ({ commit }, direccio) {
  return new Promise((resolve, reject) => {
    api.get('/' + direccio)
      .then((response) => {
        commit('updateNotes', response.data.data)
        resolve()
      })
      .catch((err) => {
        reject(err.toString())
      })
  })
}
