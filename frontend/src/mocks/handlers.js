import { http, HttpResponse } from 'msw'

const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVkd2FyX2ciLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImVkd2FyQGFyaXQuY29tIiwiZnVsbF9uYW1lIjoiRWR3YXIgR29uemFsZXoifQ.fake_signature"
const workerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVkd2FyX2ciLCJyb2xlIjoid29ya2VyIiwiZW1haWwiOiJlZHdhckBhcml0LmNvbSIsImZ1bGxfbmFtZSI6IkVkd2FyIEdvbnrDoWxleiJ9.qXQ-mDL1EgXPluvhxrqzxQwX4Lokq-cqBjmMLDIyZPY"
const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVkd2FyX2ciLCJyb2xlIjoidXNlciIsImVtYWlsIjoiZWR3YXJAYXJpdC5jb20iLCJmdWxsX25hbWUiOiJFZHdhciBHb256w6FsZXoifQ.rwSw7eluWmVtd3O0IEx3x7csAVZYWsnEzTp87O4689U"

export const handlers = [

  // ─── Auth ─────────────────────────────────────────────────────────────────

  http.post('/api/auth/login/', () => {
    return HttpResponse.json({ access: adminToken, refresh: "fake_refresh_token" })
  }),

  http.post('/api/auth/register/', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 6, username: body.username, email: body.email }, { status: 201 })
  }),

  // ─── Incidents — rutas específicas primero ────────────────────────────────

  http.get('/api/incidents/mine/', () => {
    return HttpResponse.json(incidents.filter((i) => i.author.username === "edwar_g"))
  }),

  http.get('/api/incidents/subscribed/', () => {
    return HttpResponse.json(incidents.filter((i) => i.user_subscribed))
  }),

  http.get('/api/incidents/assigned/', () => {
    return HttpResponse.json(incidents.filter((i) => i.assigned))
  }),

  http.post('/api/incidents/:id/vote/', ({ params }) => {
    const idx = incidents.findIndex((i) => i.id === Number(params.id))
    if (idx !== -1) {
      incidents[idx].user_voted = !incidents[idx].user_voted
      incidents[idx].votes += incidents[idx].user_voted ? 1 : -1
    }
    return HttpResponse.json({ success: true })
  }),

  http.post('/api/incidents/:id/subscribe/', ({ params }) => {
    const idx = incidents.findIndex((i) => i.id === Number(params.id))
    if (idx !== -1) {
      incidents[idx].user_subscribed = !incidents[idx].user_subscribed
    }
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/incidents/:id/comments/', ({ params }) => {
    return HttpResponse.json(comments.filter((c) => c.incidentId === Number(params.id)))
  }),

  http.post('/api/incidents/:id/comments/', async ({ params, request }) => {
    const body = await request.json()
    const newComment = {
      id:         comments.length + 1,
      incidentId: Number(params.id),
      text:       body.text,
      date:       new Date().toISOString(),
      created_at: new Date().toISOString(),
      author:     { username: "edwar_g", avatar: null },
    }
    comments.push(newComment)
    return HttpResponse.json(newComment, { status: 201 })
  }),

  // ─── Incidents — rutas genéricas después ──────────────────────────────────

  http.get('/api/incidents/', ({ request }) => {
    const url    = new URL(request.url)
    const author = url.searchParams.get('author')
    const filtered = author
      ? incidents.filter((i) => i.author.username === author)
      : incidents
    return HttpResponse.json(filtered)
  }),

  http.get('/api/incidents/:id/', ({ params }) => {
    const incident = incidents.find((i) => i.id === Number(params.id))
    return incident
      ? HttpResponse.json(incident)
      : HttpResponse.json({ detail: "No encontrado" }, { status: 404 })
  }),

  http.post('/api/incidents/', async ({ request }) => {
    const body = await request.formData().catch(() => request.json())
    const photoFile = body.get?.('photo')
    const newIncident = {
      id:              incidents.length + 1,
      name:            body.get?.('title')       ?? body.title,
      description:     body.get?.('description') ?? body.description,
      priority:        body.get?.('priority')    ?? body.priority,
      status:          "Pendiente",
      category:        body.get?.('category')    ?? body.category,
      date:            new Date().toISOString(),
      created_at:      new Date().toISOString(),
      votes:           0,
      user_voted:      false,
      user_subscribed: false,
      assigned:        false,
      author:          { username: "edwar_g", avatar: null },
      latitude:        28.4636,
      longitude:       -16.2518,
      address:         body.get?.('address') ?? "",
      photo: photoFile ? "https://placehold.co/400x300?text=Foto+subida" : null,
    }
    incidents.push(newIncident)
    return HttpResponse.json(newIncident, { status: 201 })
  }),

  http.patch('/api/incidents/:id/', async ({ params, request }) => {
    const body = await request.json()
    const idx  = incidents.findIndex((i) => i.id === Number(params.id))
    if (idx === -1) return HttpResponse.json({ detail: "No encontrado" }, { status: 404 })
    incidents[idx] = { ...incidents[idx], ...body }
    return HttpResponse.json(incidents[idx])
  }),

  // ─── Users — rutas específicas primero ───────────────────────────────────

  http.get('/api/users/me/', () => {
    return HttpResponse.json(users.find((u) => u.username === "edwar_g"))
  }),

  http.patch('/api/users/me/', async ({ request }) => {
    const contentType = request.headers.get('content-type') ?? ''
    const idx = users.findIndex((u) => u.username === "edwar_g")

    if (contentType.includes('multipart/form-data')) {
      // uploadAvatar — ignora el archivo, simula que se subió
      users[idx] = { ...users[idx], avatar: "https://i.pravatar.cc/150?u=edwar_g" }
    } else {
      const body = await request.json()
      users[idx] = { ...users[idx], ...body }
    }

    return HttpResponse.json(users[idx])
  }),

  // ─── Users — rutas genéricas después ─────────────────────────────────────

  http.get('/api/users/', () => HttpResponse.json(users)),

  http.get('/api/users/:username/', ({ params }) => {
    const user = users.find((u) => u.username === params.username)
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({ detail: "No encontrado" }, { status: 404 })
  }),

  http.patch('/api/users/:username/', async ({ params, request }) => {
    const body = await request.json()
    const idx  = users.findIndex((u) => u.username === params.username)
    if (idx === -1) return HttpResponse.json({ detail: "No encontrado" }, { status: 404 })
    users[idx] = { ...users[idx], ...body }
    return HttpResponse.json(users[idx])
  }),

  http.delete('/api/users/:username/', ({ params }) => {
    const idx = users.findIndex((u) => u.username === params.username)
    if (idx !== -1) users.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Categories ───────────────────────────────────────────────────────────

  http.get('/api/categories/', () => HttpResponse.json(categories)),

  http.post('/api/categories/', async ({ request }) => {
    const body   = await request.json()
    const newCat = { id: categories.length + 1, name: body.name, incidentCount: 0 }
    categories.push(newCat)
    return HttpResponse.json(newCat, { status: 201 })
  }),

  http.patch('/api/categories/:id/', async ({ params, request }) => {
    const body = await request.json()
    const idx  = categories.findIndex((c) => c.id === Number(params.id))
    if (idx === -1) return HttpResponse.json({ detail: "No encontrado" }, { status: 404 })
    categories[idx] = { ...categories[idx], ...body }
    return HttpResponse.json(categories[idx])
  }),

  http.delete('/api/categories/:id/', ({ params }) => {
    const idx = categories.findIndex((c) => c.id === Number(params.id))
    if (idx !== -1) categories.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Notifications — rutas específicas primero ───────────────────────────

  http.post('/api/notifications/mark-all-read/', () => {
    notifications.forEach((n) => { n.read = true })
    return HttpResponse.json({ success: true })
  }),

  // ─── Notifications — rutas genéricas después ─────────────────────────────

  http.get('/api/notifications/', () => HttpResponse.json(notifications)),

  http.patch('/api/notifications/:id/', async ({ params, request }) => {
    const body = await request.json()
    const idx  = notifications.findIndex((n) => n.id === Number(params.id))
    if (idx !== -1) notifications[idx] = { ...notifications[idx], ...body }
    return HttpResponse.json(notifications[idx])
  }),

  http.delete('/api/notifications/:id/', ({ params }) => {
    const idx = notifications.findIndex((n) => n.id === Number(params.id))
    if (idx !== -1) notifications.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // ─── Stats ────────────────────────────────────────────────────────────────

  http.get('/api/stats/', () => HttpResponse.json(stats)),
  http.get('/api/stats/user/:username/', () => HttpResponse.json(stats)),
]

// ─── Datos ────────────────────────────────────────────────────────────────────

let incidents = [
  { id: 1, name: "Bache en la calle Mayor",  description: "Bache de gran tamaño.",    priority: "Moderado", status: "Pendiente",  category: "Infraestructura", latitude: 28.4636, longitude: -16.2518, address: "Calle Mayor, 12",          photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg", date: "2026-04-13T08:00:00", created_at: "2026-04-13T08:00:00", votes: 5,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null, author: { username: "edwar_g",  avatar: null } },
  { id: 2, name: "Señal de tráfico caída",   description: "Señal de stop caída.",     priority: "Leve",     status: "En proceso", category: "Movilidad",       latitude: 28.4712, longitude: -16.2480, address: "Avenida de Anaga, 45",     photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg", date: "2026-04-12T10:30:00", created_at: "2026-04-12T10:30:00", votes: 0,  user_voted: false, user_subscribed: true,  assigned: false, assigned_to: null, author: { username: "carlos_m", avatar: null } },
  { id: 3, name: "Acera en mal estado",      description: "Baldosas levantadas.",     priority: "Moderado", status: "Pendiente",  category: "Infraestructura", latitude: 28.4698, longitude: -16.2550, address: "Calle Castillo, 8",        photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp", date: "2026-04-13T11:00:00", created_at: "2026-04-13T11:00:00", votes: 20,  user_voted: true,  user_subscribed: false, assigned: true, assigned_to: "laura_g", author: { username: "laura_g",  avatar: null } },
  { id: 4, name: "Farola en mal estado",     description: "Farola apagada.",          priority: "Crítico",  status: "Finalizado", category: "Infraestructura", latitude: 28.4650, longitude: -16.2490, address: "Calle del Pilar, 3",       photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e", date: "2026-04-12T22:00:00", created_at: "2026-04-12T22:00:00", votes: 12, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null, author: { username: "pedro_r",  avatar: null } },
  { id: 5, name: "Banco roto en el parque",  description: "Banco partido.",           priority: "Leve",     status: "Pendiente",  category: "Infraestructura", latitude: 28.4720, longitude: -16.2530, address: "Parque García Sanabria",   photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg", date: "2026-04-06T09:00:00", created_at: "2026-04-06T09:00:00", votes: 2,  user_voted: false, user_subscribed: true,  assigned: true, assigned_to: "edwar_g", author: { username: "edwar_g",  avatar: null } },
  { id: 6, name: "Alcantarilla sin tapa",    description: "Alcantarilla peligrosa.",  priority: "Crítico",  status: "En proceso", category: "Infraestructura", latitude: 28.4680, longitude: -16.2510, address: "Calle Imeldo Serís, 21",   photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg", date: "2026-04-10T14:00:00", created_at: "2026-04-10T14:00:00", votes: 20, user_voted: false, user_subscribed: false, assigned: true, assigned_to: "ana_s", author: { username: "ana_s",    avatar: null } },
]

let users = [
  { id: 1, username: "carlos_m", full_name: "Carlos Martínez", email: "carlos@arit.com", role: "admin",  avatar: null, created_at: "2025-09-01T00:00:00",  stats: { reportados: 3, votos: 24, suscritos: 8  } },
  { id: 2, username: "laura_g",  full_name: "Laura García",    email: "laura@arit.com",  role: "worker", avatar: null, created_at: "2025-10-15T00:00:00", stats: { reportados: 5, votos: 41, suscritos: 3  } },
  { id: 3, username: "pedro_r",  full_name: "Pedro Rodríguez", email: "pedro@arit.com",  role: "user",   avatar: null, created_at: "2025-11-20T00:00:00", stats: { reportados: 2, votos: 10, suscritos: 6  } },
  { id: 4, username: "ana_s",    full_name: "Ana Sánchez",     email: "ana@arit.com",    role: "worker", avatar: null, created_at: "2025-12-05T00:00:00", stats: { reportados: 7, votos: 58, suscritos: 12 } },
  { id: 5, username: "edwar_g",  full_name: "Edwar González",  email: "edwar@arit.com",  role: "admin",  avatar: null, created_at: "2025-09-01T00:00:00",  stats: { reportados: 4, votos: 19, suscritos: 7  } },
]

let categories = [
  { id: 1, name: "Infraestructura",    incidentCount: 12 },
  { id: 2, name: "Red / Conectividad", incidentCount: 5  },
  { id: 3, name: "Suministro",         incidentCount: 8  },
  { id: 4, name: "Movilidad",          incidentCount: 3  },
  { id: 5, name: "Medio ambiente",     incidentCount: 7  },
  { id: 6, name: "Seguridad",          incidentCount: 2  },
  { id: 7, name: "Otro",               incidentCount: 9  },
]

let comments = [
  { id: 1, incidentId: 1, text: "Llevo semanas viendo este problema.", date: "2026-04-13T09:15:00", created_at: "2026-04-13T09:15:00", author: { username: "laura_g",  avatar: null } },
  { id: 2, incidentId: 1, text: "Ya avisé al ayuntamiento.",           date: "2026-04-13T11:42:00", created_at: "2026-04-13T11:42:00", author: { username: "pedro_r",  avatar: null } },
  { id: 3, incidentId: 2, text: "Sigue igual esta mañana.",            date: "2026-04-14T08:05:00", created_at: "2026-04-14T08:05:00", author: { username: "carlos_m", avatar: null } },
]

let notifications = [
  { id: 1, text: "carlos_m ha comentado en tu incidente.", date: "2026-04-28T10:15:00", created_at: "2026-04-28T10:15:00", read: false, type: "comment",  incident: { id: 1, name: "Bache en la calle Mayor" } },
  { id: 2, text: "Tu incidente ha sido resuelto.",         date: "2026-04-27T18:30:00", created_at: "2026-04-27T18:30:00", read: false, type: "resolved", incident: { id: 4, name: "Farola en mal estado"    } },
  { id: 3, text: "laura_g ha votado tu incidente.",        date: "2026-04-27T09:00:00", created_at: "2026-04-27T09:00:00", read: true,  type: "vote",     incident: { id: 3, name: "Acera en mal estado"     } },
  { id: 4, text: "Nuevo incidente en tu zona.",            date: "2026-04-26T14:20:00", created_at: "2026-04-26T14:20:00", read: true,  type: "new",      incident: { id: 6, name: "Alcantarilla sin tapa"   } },
]

const stats = { active: 6, pending: 2, resolved: 9, reportados: 4, votos: 19, suscritos: 7 }