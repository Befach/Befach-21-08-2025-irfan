import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/health'

describe('/api/health', () => {
  it('returns 200 status and correct response', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    
    const jsonResponse = JSON.parse(res._getData())
    expect(jsonResponse).toHaveProperty('status', 'ok')
    expect(jsonResponse).toHaveProperty('message', 'API is working')
    expect(jsonResponse).toHaveProperty('timestamp')
  })
}) 