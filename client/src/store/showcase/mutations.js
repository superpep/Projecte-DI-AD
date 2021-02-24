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
  console.log(user)
}
