import api from './axiosConfig'

const authService = {
  async login({ email, password }) {
    const { data } = await api.post('/auth/login/', { email, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async register({ fullName, username, email, password }) {
    const { data } = await api.post('/auth/register/', {
      full_name: fullName,
      username,
      email,
      password,
    })
    return data
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
}

export default authService
