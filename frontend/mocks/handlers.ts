import { http, HttpResponse, delay } from 'msw'
const PROPERTIES: any[] = []


const API_URL = 'http://localhost:5000/api'

export const handlers = [
  // Properties
  http.get(`${API_URL}/properties`, async ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const query = url.searchParams.get('q')?.toLowerCase()
    
    await delay(800)
    
    let filtered = PROPERTIES
    if (type && type !== 'all') {
      const intentId = type === 'buy' ? 1 : type === 'rent' ? 2 : null
      if (intentId) {
        filtered = filtered.filter(p => p.listingIntentId === intentId)
      }
    }
    if (query) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.localityName.toLowerCase().includes(query) || 
        p.cityName.toLowerCase().includes(query)
      )
    }
    
    return HttpResponse.json(filtered)
  }),

  http.get(`${API_URL}/properties/my`, async () => {
    await delay(800)
    // Return first 3 properties as "my listings" for mock user
    return HttpResponse.json(PROPERTIES.slice(0, 3))
  }),

  http.get(`${API_URL}/leads`, async () => {
    await delay(800)
    return HttpResponse.json([
      {
        id: 'l1',
        propertyId: 'p1111111-1111-1111-1111-111111111111',
        buyerName: 'Amit Sharma',
        buyerPhone: '+91 99887 76655',
        buyerEmail: 'amit@example.com',
        message: 'I am interested in this property. Please call me.',
        statusId: 1,
        createdAt: new Date().toISOString()
      }
    ])
  }),

  http.post(`${API_URL}/leads`, async () => {
    await delay(800)
    return HttpResponse.json({ leadId: 'mock-lead-id-1234', message: 'Your enquiry has been sent successfully!' })
  }),

  http.get(`${API_URL}/properties/:id`, async ({ params }) => {
    const { id } = params
    const property = PROPERTIES.find(p => p.id === id)
    
    await delay(500)
    
    if (!property) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(property)
  }),

  // Saved Properties
  http.post(`${API_URL}/properties/:id/save`, async () => {
    await delay(300)
    return HttpResponse.json({ message: 'Property saved' })
  }),

  http.delete(`${API_URL}/properties/:id/save`, async () => {
    await delay(300)
    return new HttpResponse(null, { status: 204 })
  }),

  // Auth
  http.post(`${API_URL}/auth/login-otp`, async ({ request }) => {
    const { phone } = await request.json() as { phone: string }
    await delay(1000)
    return HttpResponse.json({ message: 'OTP sent successfully', phone })
  }),

  http.post(`${API_URL}/auth/verify-otp`, async ({ request }) => {
    const { phone, otp } = await request.json() as { phone: string, otp: string }
    await delay(1000)
    
    if (otp === '123456') {
      return HttpResponse.json({
        user: { id: 'u1111111-1111-1111-1111-111111111111', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Owner' },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      })
    }
    
    return new HttpResponse(JSON.stringify({ message: 'Invalid OTP' }), { status: 400 })
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json() as any
    await delay(1000)
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: { id: 'u1111111-1111-1111-1111-111111111111', name: 'Rajesh Kumar', email: 'rajesh@example.com', role: 'Owner' },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      })
    }
    
    return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
  }),

  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const data = await request.json() as any
    await delay(1500)
    return HttpResponse.json({
      user: { id: 'u2', ...data },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    })
  }),

  http.post(`${API_URL}/auth/refresh`, async () => {
    await delay(200)
    return HttpResponse.json({
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token'
    })
  }),
]
