import api from '../api/axiosConfig';

const categoryService = {

  // Obtener todas las categorías
  async getAll() {
    const { data } = await api.get('/categories/');
    return data;
  },

  // Crear una categoría (solo admins)
  async create(name) {
    const { data } = await api.post('/categories/', { name });
    return data;
  },

  // Actualizar una categoría (solo admins)
  async update(id, name) {
    const { data } = await api.patch(`/categories/${id}/`, { name });
    return data;
  },

  // Eliminar una categoría (solo admins)
  async delete(id) {
    await api.delete(`/categories/${id}/`);
  },
};

export default categoryService;