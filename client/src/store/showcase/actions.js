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

export function getProfeAssig ({ commit }, assigId) {
  return new Promise((resolve, reject) => {
    api.get('/moduls/' + assigId)
      .then((response) => {
        commit('getAlumnes', response.data.data)
        resolve()
      })
      .catch((err) => {
        reject(err.toString())
      })
  })
}

export function setNewNota ({ commit, state }, data) {
  const { nota, numAlu } = data
  const idAssig = state.user.alumnes[numAlu].id_assig
  const idAlu = state.user.alumnes[numAlu].id_alumne
  return new Promise((resolve, reject) => {
    api.put('/moduls/' + idAssig + '/' + idAlu, { nota: nota })
      .then((response) => {
        commit('commitNewNota', { nota, numAlu })
        resolve(nota)
      })
      .catch((err) => {
        reject(err.toString())
      })
  })
}
