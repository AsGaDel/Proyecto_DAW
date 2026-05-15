import api from '../api/axiosConfig';

const commentService = {

  // Obtener comentarios de un incidente
  async getByIncident(incidentId) {
    const { data } = await api.get(`/incidents/${incidentId}/comments/`);
    return data.results ?? data;
  },

  // Añadir un comentario
  async add(incidentId, text) {
    const { data } = await api.post(`/incidents/${incidentId}/comments/`, { text });
    return data;
  },

  // Eliminar un comentario
  async delete(incidentId, commentId) {
    await api.delete(`/incidents/${incidentId}/comments/${commentId}/`);
  },
};

export default commentService;