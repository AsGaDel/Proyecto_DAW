import api from '../api/axiosConfig';

const statsService = {

  // Obtener estadísticas globales (para Dashboard e IncidentList)
  async getGlobal() {
    const { data } = await api.get('/stats/');
    return data;
  },

  // Obtener estadísticas de un usuario concreto
  async getByUser(username) {
    const { data } = await api.get(`/stats/user/${username}/`);
    return data;
  },
};

export default statsService;