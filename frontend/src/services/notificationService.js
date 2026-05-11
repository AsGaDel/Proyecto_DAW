import api from '../api/axiosConfig';

const notificationService = {

  // Obtener todas las notificaciones del usuario autenticado
  async getAll() {
    const { data } = await api.get('/notifications/');
    return data;
  },

  // Marcar una notificación como leída
  async markRead(id) {
    const { data } = await api.patch(`/notifications/${id}/`, { read: true });
    return data;
  },

  // Marcar todas como leídas
  async markAllRead() {
    const { data } = await api.post('/notifications/mark-all-read/');
    return data;
  },

  // Eliminar una notificación
  async delete(id) {
    await api.delete(`/notifications/${id}/`);
  },
};

export default notificationService;