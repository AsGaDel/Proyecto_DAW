import api from '../api/axiosConfig';

const userService = {

  // Obtener todos los usuarios (solo admins)
  async getAll(params = {}) {
    const { data } = await api.get('/users/', { params });
    return data.results ?? data;
  },

  // Obtener usuario por id
  async getById(id) {
    const { data } = await api.get(`/users/${id}/`);
    return data;
  },

  // Obtener usuario por username
  async getByUsername(username) {
    const { data } = await api.get(`/users/${username}/`);
    return data;
  },

  // Obtener el perfil del usuario autenticado
  async getMe() {
    const { data } = await api.get('/users/me/');
    return data;
  },

  // Actualizar datos del usuario autenticado
  async update(formData) {
    const { data } = await api.patch('/users/me/', formData);
    return data;
  },

  // Subir avatar
  async uploadAvatar(file) {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.patch('/users/me/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Cambiar rol de un usuario (solo admins)
  async changeRole(username, role) {
    const { data } = await api.patch(`/users/${username}/`, { role });
    return data;
  },

  // Eliminar un usuario (solo admins)
  async delete(username) {
    await api.delete(`/users/${username}/`);
  },
};

export default userService;