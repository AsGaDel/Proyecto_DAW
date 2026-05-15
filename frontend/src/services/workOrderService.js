import api from '../api/axiosConfig';

const workOrderService = {

  async create({ incidentId, workerId, priority, adminInstructions }) {
    const { data } = await api.post('/admin/work-orders/', {
      incident:           incidentId,
      assigned_worker:    workerId,
      priority,
      admin_instructions: adminInstructions,
    });
    return data;
  },

  async updateStatus(workOrderId, status, workerNotes = '') {
    const { data } = await api.patch(`/work-orders/${workOrderId}/status/`, {
      status,
      worker_notes: workerNotes,
    });
    return data;
  },

  async getAll() {
    const { data } = await api.get('/work-orders/');
    return data.results ?? data;
  },
};

export default workOrderService;
