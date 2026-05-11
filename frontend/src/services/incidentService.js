import api from '../api/axiosConfig';

const incidentService = {

  // Obtener todos los incidentes (con filtros opcionales)
  async getAll(params = {}) {
    const { data } = await api.get('/incidents/', { params });
    return data;
  },

  // Obtener un incidente por id
  async getById(id) {
    const { data } = await api.get(`/incidents/${id}/`);
    return data;
  },

  // Crear un incidente (con imagen)
  async create(formData) {
    const form = new FormData();
    form.append('title',       formData.title);
    form.append('description', formData.description);
    form.append('category',    formData.category);
    form.append('priority',    formData.priority);
    if (formData.location) {
      form.append('latitude',  formData.location.latlng.lat);
      form.append('longitude', formData.location.latlng.lng);
      form.append('address',   formData.location.address);
    }
    if (formData.photo) {
      form.append('photo', formData.photo);
    }
    const { data } = await api.post('/incidents/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Actualizar un incidente
  async update(id, formData) {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) form.append(key, value);
    });
    const { data } = await api.patch(`/incidents/${id}/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Eliminar un incidente
  async delete(id) {
    await api.delete(`/incidents/${id}/`);
  },

  // Obtener incidentes del usuario autenticado
  async getMine() {
    const { data } = await api.get('/incidents/mine/');
    return data;
  },

  // Obtener incidentes asignados al trabajador autenticado
  async getAssigned() {
    const { data } = await api.get('/incidents/assigned/');
    return data;
  },

  // Obtener incidentes suscritos por el usuario autenticado
  async getSubscribed() {
    const { data } = await api.get('/incidents/subscribed/');
    return data;
  },

  // Votar / quitar voto
  async vote(id) {
    const { data } = await api.post(`/incidents/${id}/vote/`);
    return data;
  },

  // Suscribirse / desuscribirse
  async subscribe(id) {
    const { data } = await api.post(`/incidents/${id}/subscribe/`);
    return data;
  },

  // Actualizar el estado (solo workers y admins)
  async updateStatus(id, status) {
    const { data } = await api.patch(`/incidents/${id}/`, { status });
    return data;
  },
};

export default incidentService;