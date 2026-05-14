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
  { id: 1,  name: "Bache en la calle Mayor",              description: "Bache de gran tamaño en el carril derecho.",                 priority: "Moderado", status: "Pendiente",  category: "Infraestructura",    latitude: 28.4636, longitude: -16.2518, address: "Calle Mayor, 12",              photo: "https://cordis.europa.eu/docs/news/images/2024-01/448771.jpg",                                                                                                                                                                                                   date: "2026-04-13T08:00:00", created_at: "2026-04-13T08:00:00", votes: 5,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "edwar_g",     avatar: null } },
  { id: 2,  name: "Señal de tráfico caída",               description: "Señal de stop tirada en el suelo del cruce.",                priority: "Leve",     status: "En proceso", category: "Movilidad",          latitude: 28.4712, longitude: -16.2480, address: "Avenida de Anaga, 45",         photo: "https://motor.elpais.com/wp-content/uploads/2024/08/senal-trafico-rota.jpg",                                                                                                                                                                                     date: "2026-04-12T10:30:00", created_at: "2026-04-12T10:30:00", votes: 3,  user_voted: false, user_subscribed: true,  assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 3,  name: "Acera en mal estado",                  description: "Varias baldosas levantadas, peligro para peatones.",         priority: "Moderado", status: "Pendiente",  category: "Infraestructura",    latitude: 28.4698, longitude: -16.2550, address: "Calle Castillo, 8",            photo: "https://imagenes.segre.com/files/og_thumbnail/uploads/2025/12/30/69535736dbb2e.webp",                                                                                                                                                                            date: "2026-04-13T11:00:00", created_at: "2026-04-13T11:00:00", votes: 20, user_voted: true,  user_subscribed: false, assigned: true,  assigned_to: "laura_g", author: { username: "laura_g",     avatar: null } },
  { id: 4,  name: "Farola apagada zona oscura",           description: "Farola sin luz desde hace semanas en zona peligrosa.",       priority: "Crítico",  status: "Finalizado", category: "Infraestructura",    latitude: 28.4650, longitude: -16.2490, address: "Calle del Pilar, 3",           photo: "https://cadenaser.com/resizer/v2/PXJFDXWSDFPCRBMK3RBF6A3BCM.jpg?auth=75e9c22036368d022e9b649be041fb5c0b9c61d816887fb49d1b88ffcfe7ac6e",                                                                                                                          date: "2026-04-12T22:00:00", created_at: "2026-04-12T22:00:00", votes: 12, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 5,  name: "Banco roto en el parque",              description: "Banco con el asiento partido, peligroso.",                   priority: "Leve",     status: "Pendiente",  category: "Infraestructura",    latitude: 28.4720, longitude: -16.2530, address: "Parque García Sanabria",       photo: "https://laguindilla.larioja.com/wp-content/uploads/2023/05/banco-1040x780.jpeg",                                                                                                                                                                                 date: "2026-04-06T09:00:00", created_at: "2026-04-06T09:00:00", votes: 2,  user_voted: false, user_subscribed: true,  assigned: true,  assigned_to: "edwar_g", author: { username: "edwar_g",     avatar: null } },
  { id: 6,  name: "Alcantarilla sin tapa",                description: "Alcantarilla abierta en medio de la calzada.",               priority: "Crítico",  status: "En proceso", category: "Infraestructura",    latitude: 28.4680, longitude: -16.2510, address: "Calle Imeldo Serís, 21",       photo: "https://tecolotito.elsiglodetorreon.com.mx/i/2018/11/1115854.jpeg",                                                                                                                                                                                              date: "2026-04-10T14:00:00", created_at: "2026-04-10T14:00:00", votes: 20, user_voted: false, user_subscribed: false, assigned: true,  assigned_to: "ana_s",   author: { username: "ana_s",       avatar: null } },
  { id: 7,  name: "Contenedor de basura quemado",         description: "Contenedor completamente quemado bloqueando la vía.",        priority: "Crítico",  status: "Pendiente",  category: "Medio ambiente",     latitude: 28.4701, longitude: -16.2495, address: "Calle Méndez Núñez, 5",        photo: "https://images.ecestaticos.com/Jh_7w62cLygjH7eSsFvrpUBzXjE=/24x7:2244x1522/1440x1080/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fcdd%2F42a%2Fb32%2Fcdd42ab32e006c6faee29aae8d171d3f.jpg",                                                  date: "2026-04-11T07:30:00", created_at: "2026-04-11T07:30:00", votes: 8,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 8,  name: "Árbol caído sobre la calzada",         description: "Árbol caído tras la tormenta bloqueando el paso.",           priority: "Crítico",  status: "Finalizado", category: "Medio ambiente",     latitude: 28.4655, longitude: -16.2531, address: "Rambla del General Franço, 10",photo: "https://static.eldiario.es/clip/d8cfb579-9834-46a1-a9f9-db16934a2a07_16-9-discover-aspect-ratio_default_0.jpg",                                                                                                                                                  date: "2026-04-09T15:45:00", created_at: "2026-04-09T15:45:00", votes: 15, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 9,  name: "Pintadas en fachada patrimonio",       description: "Grafitis en edificio catalogado como patrimonio.",           priority: "Moderado", status: "Pendiente",  category: "Seguridad",          latitude: 28.4688, longitude: -16.2543, address: "Plaza de España, 1",           photo: "https://estaticos-cdn.prensaiberica.es/clip/3d76cae2-7b91-42cf-ac98-41ecd8c44c9e_alta-libre-aspect-ratio_default_0.jpg",                                                                                                                                         date: "2026-04-08T09:00:00", created_at: "2026-04-08T09:00:00", votes: 6,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "ana_s",       avatar: null } },
  { id: 10, name: "Semáforo siempre en rojo",             description: "Semáforo atascado en rojo todo el día.",                     priority: "Moderado", status: "En proceso", category: "Movilidad",          latitude: 28.4722, longitude: -16.2505, address: "Avenida de Tres de Mayo, 20",  photo: "https://motor.elpais.com/wp-content/uploads/2025/06/Semaforo-rojo-ambulancia.jpg",                                                                                                                                                                               date: "2026-04-07T13:00:00", created_at: "2026-04-07T13:00:00", votes: 9,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "laura_g",     avatar: null } },
  { id: 11, name: "Fuga de agua en la calzada",           description: "Agua brotando del asfalto desde hace dos días.",             priority: "Crítico",  status: "Pendiente",  category: "Suministro",         latitude: 28.4669, longitude: -16.2521, address: "Calle San Francisco, 33",      photo: "https://s2.ppllstatics.com/elnortedecastilla/www/multimedia/2025/07/26/fuga1-kToC-U23024829012081LD-1200x840@El%20Norte.jpg",                                                                                                                                    date: "2026-04-06T08:15:00", created_at: "2026-04-06T08:15:00", votes: 25, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "edwar_g",     avatar: null } },
  { id: 12, name: "Cable eléctrico colgando",             description: "Cable de alta tensión suelto y colgando.",                   priority: "Crítico",  status: "Finalizado", category: "Suministro",         latitude: 28.4644, longitude: -16.2478, address: "Calle Noria, 7",               photo: "https://teldeactualidad.com/upload/images/03_2026/934_whatsapp-image-2026-03-14-at-082040.jpeg",                                                                                                                                                                 date: "2026-04-05T17:20:00", created_at: "2026-04-05T17:20:00", votes: 30, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 13, name: "Papelera desbordada",                  description: "Papelera llena y basura por el suelo alrededor.",            priority: "Leve",     status: "Finalizado", category: "Medio ambiente",     latitude: 28.4733, longitude: -16.2489, address: "Paseo de Salamanca, 14",       photo: "https://www.lavanguardia.com/files/og_thumbnail/uploads/2013/08/13/5f9b1ccf9cebc.jpeg",                                                                                                                                                                          date: "2026-04-04T11:00:00", created_at: "2026-04-04T11:00:00", votes: 1,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "miguel_f",    avatar: null } },
  { id: 14, name: "Paso de peatones borrado",             description: "Marcas del paso de cebra completamente borradas.",           priority: "Moderado", status: "Pendiente",  category: "Movilidad",          latitude: 28.4711, longitude: -16.2515, address: "Calle La Rosa, 2",             photo: "https://teldeactualidad.com/upload/images/06_2024/6960_e201b206-fff4-4ca7-b04b-f6be447be820.jpg",                                                                                                                                                                date: "2026-04-03T09:30:00", created_at: "2026-04-03T09:30:00", votes: 7,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "sofia_l",     avatar: null } },
  { id: 15, name: "Parque infantil con equipo roto",      description: "Tobogán roto con bordes cortantes.",                         priority: "Crítico",  status: "En proceso", category: "Infraestructura",    latitude: 28.4692, longitude: -16.2467, address: "Parque Las Delicias",          photo: "https://www.lavozdelanzarote.com/uploads/s1/19/71/21/2/suelo-roto-en-el-parque-infantil-de-costa-teguise_1_766x440.jpeg",                                                                                                                                        date: "2026-04-02T14:45:00", created_at: "2026-04-02T14:45:00", votes: 18, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "marta_d",     avatar: null } },
  { id: 16, name: "Corte de agua sin aviso",              description: "Corte de suministro de agua sin previo aviso.",              priority: "Moderado", status: "Finalizado", category: "Suministro",         latitude: 28.4678, longitude: -16.2502, address: "Barrio de Los Hoteles",        photo: "https://www.atlanticohoy.com/uploads/s1/32/55/58/4/imagen-de-corte-de-agua-ah.webp",                                                                                                                                                                             date: "2026-04-01T08:00:00", created_at: "2026-04-01T08:00:00", votes: 11, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "edwar_g",     avatar: null } },
  { id: 17, name: "Zona WiFi pública sin cobertura",      description: "La red WiFi municipal lleva semanas sin funcionar.",         priority: "Leve",     status: "Pendiente",  category: "Red / Conectividad", latitude: 28.4725, longitude: -16.2533, address: "Plaza de la Candelaria",       photo: "https://www.comunidadbaratz.com/wp-content/uploads/La-biblioteca-es-inclusion-social-e-igualdad-de-oportunidades.jpg",                                                                                                                                           date: "2026-03-31T10:00:00", created_at: "2026-03-31T10:00:00", votes: 4,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "elena_r",     avatar: null } },
  { id: 18, name: "Vehículo abandonado",                  description: "Coche sin matrícula abandonado hace más de un mes.",         priority: "Leve",     status: "En proceso", category: "Movilidad",          latitude: 28.4658, longitude: -16.2488, address: "Calle Villalba Hervás, 9",     photo: "https://www.lavanguardia.com/files/og_thumbnail/files/fp/uploads/2022/03/25/623dc6a3d1621.r_d.593-484-9569.jpeg",                                                                                                                                                date: "2026-03-30T16:30:00", created_at: "2026-03-30T16:30:00", votes: 3,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "david_m",     avatar: null } },
  { id: 19, name: "Zona peatonal invadida por motos",     description: "Motos aparcadas constantemente en zona peatonal.",           priority: "Moderado", status: "Pendiente",  category: "Movilidad",          latitude: 28.4703, longitude: -16.2541, address: "Calle del Castillo, 45",       photo: "https://elfarodeceuta.es/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-03-at-12.00.01.jpeg",                                                                                                                                                                 date: "2026-03-29T12:00:00", created_at: "2026-03-29T12:00:00", votes: 6,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "lucia_p",     avatar: null } },
  { id: 20, name: "Fuente pública averiada",              description: "Fuente sin agua y con grifo roto.",                          priority: "Leve",     status: "Finalizado", category: "Suministro",         latitude: 28.4719, longitude: -16.2499, address: "Jardines de la Granja",        photo: "https://cadenaser.com/resizer/lRlvmjj4iZ_NTyt-IPKAUXhUnVg=/arc-photo-prisaradio/eu-central-1-prod/public/STSDRXOBGJJKBK62DLQG5HTN7Y.jpg",                                                                                                                        date: "2026-03-28T09:00:00", created_at: "2026-03-28T09:00:00", votes: 2,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "jorge_v",     avatar: null } },
  { id: 21, name: "Pintadas en marquesina bus",           description: "Marquesina del bus llena de grafitis.",                      priority: "Leve",     status: "Pendiente",  category: "Seguridad",          latitude: 28.4688, longitude: -16.2516, address: "Avenida de la Constitución, 3",photo: "https://www.vilapress.cat/images/showid/6663444",                                                                                                                                                                                                                date: "2026-03-27T14:00:00", created_at: "2026-03-27T14:00:00", votes: 1,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "marta_d",     avatar: null } },
  { id: 22, name: "Desprendimiento de fachada",           description: "Trozos de fachada cayendo a la acera.",                      priority: "Crítico",  status: "En proceso", category: "Seguridad",          latitude: 28.4661, longitude: -16.2527, address: "Calle Bethencourt Alfonso, 12",photo: "https://www.arquitodoestudio.com/wp-content/uploads/2019/05/old-4073927_1280.jpg",                                                                                                                                                                               date: "2026-03-26T08:30:00", created_at: "2026-03-26T08:30:00", votes: 22, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "isabel_n",    avatar: null } },
  { id: 23, name: "Contenedor de reciclaje lleno",        description: "Contenedor de papel sin vaciar desde hace días.",            priority: "Leve",     status: "Finalizado", category: "Medio ambiente",     latitude: 28.4736, longitude: -16.2482, address: "Calle Pilar, 8",               photo: "https://www.residuosprofesional.com/wp-content/uploads/2022/07/residuos-junto-al-contenedor-18072022-copyright-RESIDUOS-PROFESIONAL.jpg",                                                                                                                        date: "2026-03-25T11:00:00", created_at: "2026-03-25T11:00:00", votes: 1,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 24, name: "Poste de luz inclinado",               description: "Poste de alumbrado muy inclinado por accidente.",            priority: "Moderado", status: "Pendiente",  category: "Infraestructura",    latitude: 28.4674, longitude: -16.2509, address: "Calle San Sebastián, 19",      photo: "https://www.noticiasdevillaelvira.com/data/fotos2/bbx_1013077166_1_poste_caido.jpg",                                                                                                                                                                             date: "2026-03-24T17:45:00", created_at: "2026-03-24T17:45:00", votes: 5,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pablo_c",     avatar: null } },
  { id: 25, name: "Rampa accesibilidad bloqueada",        description: "Rampa para sillas de ruedas bloqueada por obras.",           priority: "Moderado", status: "En proceso", category: "Movilidad",          latitude: 28.4708, longitude: -16.2537, address: "Calle Valentín Sanz, 4",       photo: "https://eldoce.tv/resizer/v2/rampa-bloqueada-en-cordoba-DPCPMAUGI5GMFFXBDRMGQCDS24.jpeg?auth=acf561280d9a8c00fdde0e9b453a329498b129ec70c9409aeb746ca0982d02d8&width=767",                                                                                        date: "2026-03-23T10:15:00", created_at: "2026-03-23T10:15:00", votes: 9,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "raul_o",      avatar: null } },
  { id: 26, name: "Hueco peligroso en bordillo",          description: "Gran hueco en el bordillo que puede causar caídas.",         priority: "Moderado", status: "Pendiente",  category: "Infraestructura",    latitude: 28.4646, longitude: -16.2494, address: "Calle Cruz Verde, 27",         photo: "https://fotografias.atresmedia.com/clipping/cmsimages02/2021/09/06/53475B72-0B0C-443E-98A0-C5F5173CF3E1/70.jpg",                                                                                                                                                 date: "2026-03-22T09:00:00", created_at: "2026-03-22T09:00:00", votes: 4,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "fernando_b",  avatar: null } },
  { id: 27, name: "Zona sin iluminación nocturna",        description: "Tramo de calle completamente oscuro de noche.",              priority: "Crítico",  status: "Pendiente",  category: "Seguridad",          latitude: 28.4683, longitude: -16.2475, address: "Calle Progreso, 15",           photo: "https://www.ntesistemas.es/wp-content/uploads/2022/10/indice-criminalidad-calles-sin-luz.jpg",                                                                                                                                                                   date: "2026-03-21T20:00:00", created_at: "2026-03-21T20:00:00", votes: 17, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 28, name: "Red municipal caída en plaza",         description: "Señal sin cobertura WiFi en la plaza principal.",            priority: "Leve",     status: "Finalizado", category: "Red / Conectividad", latitude: 28.4727, longitude: -16.2511, address: "Plaza del Príncipe",           photo: "https://imagenes.elpais.com/resizer/v2/https%3A%2F%2Fcloudfront-eu-central-1.images.arcpublishing.com%2Fprisa%2FUPYORTZLWNAKTFNQMFJXF43FWM.jpg?auth=ccc0ed468f4693002ae5eeaa8db93f2a7725232232e315ef9f591fd489439f01&width=1960&height=1470&smart=true",         date: "2026-03-20T13:30:00", created_at: "2026-03-20T13:30:00", votes: 2,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 29, name: "Obra sin señalizar correctamente",     description: "Zona de obras sin vallas ni señales de advertencia.",        priority: "Crítico",  status: "En proceso", category: "Seguridad",          latitude: 28.4663, longitude: -16.2520, address: "Calle Heraclio Sánchez, 6",    photo: "https://www.elseisdoble.com/uploads/6905-15353-19719792.jpg",                                                                                                                                                                                                    date: "2026-03-19T08:45:00", created_at: "2026-03-19T08:45:00", votes: 13, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "ana_s",       avatar: null } },
  { id: 30, name: "Mancha de aceite en calzada",          description: "Gran mancha de aceite resbaladiza en la calzada.",           priority: "Moderado", status: "Finalizado", category: "Movilidad",          latitude: 28.4717, longitude: -16.2498, address: "Calle Imeldo Serís, 40",       photo: "https://www.pontevedraviva.com/uploads/s1/47/13/77/0/mancha-de-aceite-en-augusto-garcia-sanchez.jpeg",                                                                                                                                                           date: "2026-03-18T15:00:00", created_at: "2026-03-18T15:00:00", votes: 6,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "laura_g",     avatar: null } },
  { id: 31, name: "Basura acumulada en solar",            description: "Solar abandonado lleno de basura y escombros.",              priority: "Moderado", status: "Pendiente",  category: "Medio ambiente",     latitude: 28.4691, longitude: -16.2543, address: "Calle Cuatro Cañones, 3",      photo: "https://estaticos-cdn.prensaiberica.es/clip/af78ec8e-626c-4ca2-95c3-25e45ff99192_alta-libre-aspect-ratio_default_0.jpg",                                                                                                                                         date: "2026-03-17T11:00:00", created_at: "2026-03-17T11:00:00", votes: 8,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "edwar_g",     avatar: null } },
  { id: 32, name: "Ascensor averiado zona pública",       description: "Ascensor de acceso al parking público sin funcionar.",       priority: "Moderado", status: "En proceso", category: "Infraestructura",    latitude: 28.4652, longitude: -16.2487, address: "Calle Rambla, 22",             photo: "https://cadenaser.com/resizer/v2/https%3A%2F%2Fcloudfront-eu-central-1.images.arcpublishing.com%2Fprisaradio%2FEQTKEYVPHNG55FJZKH3EPDASVY.jpg?auth=39c80d26253f8fb74916937b161fb9539f1c21d7a311799ca91104d6f3c34975&quality=70&width=736&height=414&smart=true", date: "2026-03-16T09:30:00", created_at: "2026-03-16T09:30:00", votes: 5,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 33, name: "Carril bici obstruido",                description: "Carril bici bloqueado por contenedores mal colocados.",      priority: "Leve",     status: "Pendiente",  category: "Movilidad",          latitude: 28.4729, longitude: -16.2503, address: "Avenida de Anaga, 80",         photo: "https://estaticos-cdn.prensaiberica.es/clip/a7c743b2-00a3-4515-82de-3804df959447_alta-libre-aspect-ratio_default_0.jpg",                                                                                                                                         date: "2026-03-15T08:00:00", created_at: "2026-03-15T08:00:00", votes: 3,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 34, name: "Fugas en tuberías de riego",           description: "Sistema de riego de jardines con fugas visibles.",           priority: "Leve",     status: "Finalizado", category: "Suministro",         latitude: 28.4676, longitude: -16.2515, address: "Parque de La Granja",          photo: "https://www.fontaneriaysaneamientogb.es/wp-content/uploads/2023/02/Snapshot_40edit-1-1024x576-1.webp",                                                                                                                                                           date: "2026-03-14T14:00:00", created_at: "2026-03-14T14:00:00", votes: 2,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "ana_s",       avatar: null } },
  { id: 35, name: "Señal de dirección girada",            description: "Señal de dirección girada apuntando en sentido incorrecto.", priority: "Moderado", status: "En proceso", category: "Movilidad",          latitude: 28.4705, longitude: -16.2531, address: "Calle El Pilar, 11",           photo: "https://www.sobrarbedigital.com/wp-content/uploads/2017/12/SE%C3%91AL-ROTA-18-DIC-2017-UNO.jpg",                                                                                                                                                                 date: "2026-03-13T10:00:00", created_at: "2026-03-13T10:00:00", votes: 4,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "cristina_f",  avatar: null } },
  { id: 36, name: "Muro con riesgo de derrumbe",          description: "Muro de contención con grietas peligrosas.",                 priority: "Crítico",  status: "Pendiente",  category: "Seguridad",          latitude: 28.4648, longitude: -16.2497, address: "Calle San Martín, 5",          photo: "https://estaticos-cdn.prensaiberica.es/clip/dce47d15-3f00-459d-b30f-d464dadde25d_alta-libre-aspect-ratio_default_0_x699y308.jpg",                                                                                                                                date: "2026-03-12T09:00:00", created_at: "2026-03-12T09:00:00", votes: 19, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "edwar_g",     avatar: null } },
  { id: 37, name: "Punto limpio cerrado indefinidamente", description: "Punto limpio municipal cerrado sin fecha de reapertura.",    priority: "Moderado", status: "Pendiente",  category: "Medio ambiente",     latitude: 28.4718, longitude: -16.2478, address: "Calle Prolongación Numancia",  photo: "https://www.madrid.es/UnidadesDescentralizadas/LimpiezaUrbanaYResiduos/RESIDUOS/PuntosLimpios_y_ReMAD/PLProximidad/PLP_AvdaAndes_800x350.jpg",                                                                                                                   date: "2026-03-11T11:00:00", created_at: "2026-03-11T11:00:00", votes: 7,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "carlos_m",    avatar: null } },
  { id: 38, name: "Interrupción fibra óptica barrio",     description: "Sin internet en todo el barrio desde ayer.",                 priority: "Crítico",  status: "En proceso", category: "Red / Conectividad", latitude: 28.4685, longitude: -16.2539, address: "Barrio de La Salud",           photo: "https://men.gsstatic.es/sfAttachPlugin/getCachedContent/id/3480901/width/379/height/284/crop/1",                                                                                                                                                                 date: "2026-03-10T08:30:00", created_at: "2026-03-10T08:30:00", votes: 28, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "pedro_r",     avatar: null } },
  { id: 39, name: "Escalones rotos en paso peatonal",     description: "Varios escalones rotos en acceso al puente peatonal.",       priority: "Moderado", status: "Finalizado", category: "Infraestructura",    latitude: 28.4660, longitude: -16.2506, address: "Puente Serrador",              photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWn-YYba0W5077hRU_bjY7zIPROyc26SI_7w&s",                                                                                                                                                                   date: "2026-03-09T15:00:00", created_at: "2026-03-09T15:00:00", votes: 5,  user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "ana_s",       avatar: null } },
  { id: 40, name: "Perro suelto zona escolar",            description: "Perro agresivo suelto cerca del colegio.",                   priority: "Crítico",  status: "Finalizado", category: "Seguridad",          latitude: 28.4730, longitude: -16.2519, address: "Calle Virgen de la Peña, 3",   photo: "https://imagenes.heraldo.es/files/image_1920_1080/uploads/imagenes/2025/07/22/zona-de-suelta-de-perros-en-la-plaza-de-los-sitios-de-zaragoza-8.jpeg",                                                                                                            date: "2026-03-08T08:00:00", created_at: "2026-03-08T08:00:00", votes: 14, user_voted: false, user_subscribed: false, assigned: false, assigned_to: null,      author: { username: "alejandro_p", avatar: null } },
]

let users = [
  { id: 1,  username: "carlos_m",   full_name: "Carlos Martínez",    email: "carlos@arit.com",    role: "admin",  avatar: null, created_at: "2025-09-01T00:00:00" },
  { id: 2,  username: "laura_g",    full_name: "Laura García",       email: "laura@arit.com",     role: "worker", avatar: null, created_at: "2025-10-15T00:00:00" },
  { id: 3,  username: "pedro_r",    full_name: "Pedro Rodríguez",    email: "pedro@arit.com",     role: "user",   avatar: null, created_at: "2025-11-20T00:00:00" },
  { id: 4,  username: "ana_s",      full_name: "Ana Sánchez",        email: "ana@arit.com",       role: "worker", avatar: null, created_at: "2025-12-05T00:00:00" },
  { id: 5,  username: "edwar_g",    full_name: "Edwar González",     email: "edwar@arit.com",     role: "admin",  avatar: null, created_at: "2025-09-01T00:00:00" },
  { id: 6,  username: "sofia_l",    full_name: "Sofía López",        email: "sofia@arit.com",     role: "user",   avatar: null, created_at: "2026-01-10T00:00:00" },
  { id: 7,  username: "miguel_f",   full_name: "Miguel Fernández",   email: "miguel@arit.com",    role: "user",   avatar: null, created_at: "2026-01-15T00:00:00" },
  { id: 8,  username: "elena_r",    full_name: "Elena Romero",       email: "elena@arit.com",     role: "worker", avatar: null, created_at: "2026-01-20T00:00:00" },
  { id: 9,  username: "david_m",    full_name: "David Moreno",       email: "david@arit.com",     role: "user",   avatar: null, created_at: "2026-01-25T00:00:00" },
  { id: 10, username: "lucia_p",    full_name: "Lucía Pérez",        email: "lucia@arit.com",     role: "user",   avatar: null, created_at: "2026-02-01T00:00:00" },
  { id: 11, username: "jorge_v",    full_name: "Jorge Vega",         email: "jorge@arit.com",     role: "worker", avatar: null, created_at: "2026-02-05T00:00:00" },
  { id: 12, username: "marta_d",    full_name: "Marta Delgado",      email: "marta@arit.com",     role: "user",   avatar: null, created_at: "2026-02-10T00:00:00" },
  { id: 13, username: "pablo_c",    full_name: "Pablo Castro",       email: "pablo@arit.com",     role: "user",   avatar: null, created_at: "2026-02-15T00:00:00" },
  { id: 14, username: "isabel_n",   full_name: "Isabel Navarro",     email: "isabel@arit.com",    role: "user",   avatar: null, created_at: "2026-02-20T00:00:00" },
  { id: 15, username: "antonio_h",  full_name: "Antonio Herrera",    email: "antonio@arit.com",   role: "worker", avatar: null, created_at: "2026-02-25T00:00:00" },
  { id: 16, username: "carmen_t",   full_name: "Carmen Torres",      email: "carmen@arit.com",    role: "user",   avatar: null, created_at: "2026-03-01T00:00:00" },
  { id: 17, username: "raul_o",     full_name: "Raúl Ortega",        email: "raul@arit.com",      role: "user",   avatar: null, created_at: "2026-03-05T00:00:00" },
  { id: 18, username: "nuria_a",    full_name: "Nuria Alonso",       email: "nuria@arit.com",     role: "user",   avatar: null, created_at: "2026-03-10T00:00:00" },
  { id: 19, username: "fernando_b", full_name: "Fernando Blanco",    email: "fernando@arit.com",  role: "worker", avatar: null, created_at: "2026-03-15T00:00:00" },
  { id: 20, username: "patricia_m", full_name: "Patricia Molina",    email: "patricia@arit.com",  role: "user",   avatar: null, created_at: "2026-03-20T00:00:00" },
  { id: 21, username: "jose_r",     full_name: "José Ruiz",          email: "jose@arit.com",      role: "user",   avatar: null, created_at: "2026-03-25T00:00:00" },
  { id: 22, username: "beatriz_g",  full_name: "Beatriz Gil",        email: "beatriz@arit.com",   role: "user",   avatar: null, created_at: "2026-03-28T00:00:00" },
  { id: 23, username: "marcos_s",   full_name: "Marcos Serrano",     email: "marcos@arit.com",    role: "worker", avatar: null, created_at: "2026-04-01T00:00:00" },
  { id: 24, username: "cristina_f", full_name: "Cristina Fuentes",   email: "cristina@arit.com",  role: "user",   avatar: null, created_at: "2026-04-05T00:00:00" },
  { id: 25, username: "alejandro_p",full_name: "Alejandro Pardo",    email: "alejandro@arit.com", role: "user",   avatar: null, created_at: "2026-04-08T00:00:00" },
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
  { id: 1, incidentId: 1,  text: "Llevo semanas viendo este problema.",          date: "2026-04-13T09:15:00", created_at: "2026-04-13T09:15:00", author: { username: "laura_g",  avatar: null } },
  { id: 2, incidentId: 1,  text: "Ya avisé al ayuntamiento pero no responden.",  date: "2026-04-13T11:42:00", created_at: "2026-04-13T11:42:00", author: { username: "pedro_r",  avatar: null } },
  { id: 3, incidentId: 2,  text: "Sigue igual esta mañana, nadie lo arregla.",   date: "2026-04-14T08:05:00", created_at: "2026-04-14T08:05:00", author: { username: "carlos_m", avatar: null } },
  { id: 4, incidentId: 3,  text: "Mi abuela casi se cae ayer por esto.",         date: "2026-04-14T10:30:00", created_at: "2026-04-14T10:30:00", author: { username: "edwar_g",  avatar: null } },
  { id: 5, incidentId: 6,  text: "Es muy peligroso, hay que taparlo urgente.",   date: "2026-04-11T09:00:00", created_at: "2026-04-11T09:00:00", author: { username: "pedro_r",  avatar: null } },
  { id: 6, incidentId: 11, text: "Llevamos sin agua desde ayer por la tarde.",   date: "2026-04-07T08:00:00", created_at: "2026-04-07T08:00:00", author: { username: "ana_s",    avatar: null } },
  { id: 7, incidentId: 22, text: "Pasé por allí y había un trozo en el suelo.",  date: "2026-03-27T09:00:00", created_at: "2026-03-27T09:00:00", author: { username: "laura_g",  avatar: null } },
  { id: 8, incidentId: 38, text: "Trabajo desde casa y llevo dos días sin poder conectarme.", date: "2026-03-11T10:00:00", created_at: "2026-03-11T10:00:00", author: { username: "carlos_m", avatar: null } },
]

let notifications = [
  { id: 1, text: "carlos_m ha comentado en tu incidente.", date: "2026-04-28T10:15:00", created_at: "2026-04-28T10:15:00", read: false, type: "comment",  incident: { id: 1,  name: "Bache en la calle Mayor"    } },
  { id: 2, text: "Tu incidente ha sido resuelto.",         date: "2026-04-27T18:30:00", created_at: "2026-04-27T18:30:00", read: false, type: "resolved", incident: { id: 4,  name: "Farola apagada zona oscura"  } },
  { id: 3, text: "laura_g ha votado tu incidente.",        date: "2026-04-27T09:00:00", created_at: "2026-04-27T09:00:00", read: true,  type: "vote",     incident: { id: 3,  name: "Acera en mal estado"         } },
  { id: 4, text: "Nuevo incidente en tu zona.",            date: "2026-04-26T14:20:00", created_at: "2026-04-26T14:20:00", read: true,  type: "new",      incident: { id: 6,  name: "Alcantarilla sin tapa"       } },
  { id: 5, text: "pedro_r se ha suscrito a tu incidente.",date: "2026-04-25T11:00:00", created_at: "2026-04-25T11:00:00", read: true,  type: "subscribe",incident: { id: 1,  name: "Bache en la calle Mayor"    } },
  { id: 6, text: "ana_s ha comentado en tu incidente.",   date: "2026-04-24T16:00:00", created_at: "2026-04-24T16:00:00", read: true,  type: "comment",  incident: { id: 5,  name: "Banco roto en el parque"     } },
  { id: 7, text: "Tu incidente tiene 10 votos.",           date: "2026-04-23T09:00:00", created_at: "2026-04-23T09:00:00", read: true,  type: "vote",     incident: { id: 11, name: "Fuga de agua en la calzada"  } },
  { id: 8, text: "Nuevo incidente cerca de tu zona.",      date: "2026-04-22T08:00:00", created_at: "2026-04-22T08:00:00", read: true,  type: "new",      incident: { id: 22, name: "Desprendimiento de fachada"  } },
]

const stats = { active: 6, pending: 2, resolved: 9, reportados: 4, votos: 19, suscritos: 7 }