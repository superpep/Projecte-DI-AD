/*
export function someMutation (state) {
}
*/
import { api } from '../../boot/axios'

export const updateDrawerState = (state, opened) => {
  state.drawerState = opened
}

export const updateLoggedUser = (state, data) => {
  const user = JSON.parse(atob(data.tokenAuth.split('.')[1])) // AGAFEM EL PAYLOAD I EL FORMATEM A JSON
  state.user = {
    username: user.username,
    id: user.user_id,
    role: user.role,
    avatar: data.avatar,
    token: data.tokenAuth
  }
  api.defaults.headers.common.Authorization = 'Bearer ' + data.tokenAuth
}

export const logout = (state) => {
  state.user = {
    username: null,
    id: null,
    role: null,
    avatar: null,
    token: null
  }
  api.defaults.headers.common.Authorization = null
}

export const updateNotes = (state, data) => {
  console.log(data)
  state.user.assignatures = data
}

export const getAlumnes = (state, data) => {
  console.log(data)
  state.user.alumnes = data
}

export const commitNewNota = (state, data) => {
  const { numAlu, nota } = data
  console.log(nota)
  state.user.alumnes[numAlu].nota = nota
}
