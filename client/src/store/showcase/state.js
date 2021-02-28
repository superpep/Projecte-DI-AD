export default function () {
  return {
    drawerState: false,
    user: {
      username: null,
      id: null,
      role: null,
      avatar: null,
      token: null,
      assignatures: []
      // alumnes: [] Sols en cas de que siga professor s'inclou aquest últim atribut
    }
  }
}
