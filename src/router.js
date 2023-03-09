import { Hono } from 'hono'
import { MongoFetchClient } from '@drivly/mongo-fetch'

const router = new Hono()

router.use('*', async (c, next) => {
  const req = c.req.raw
  const env = c.env

  const patch = new Request(
    req.url,
    {
      // headers are unpacked headers from req
      headers: {
        Authorization: req.headers.get('Authorization'),
        Cookie: req.headers.get('Cookie'),
        'Content-Type': req.headers.get('Content-Type'),
        'X-Forwarded-Proto': req.headers.get('X-Forwarded-Proto'),
        'X-Forwarded-For': req.headers.get('X-Forwarded-For'),
      },
      method: req.method,
      cf: req.cf,
    }
  )

  const { user, hostname, rootPath, pathSegments, query } = await env.CTX.fetch(patch).then(res => res.json())

  if (!user) {
    return c.json({
      error: 'You need to be logged in',
      link: `https://${hostname}/login`
    }, 403)
  }

  if (user.role != 'admin') {
    return c.json({
      error: 'You need to be an admin to access this API',
      link: `https://${hostname}/login`
    }, 403)
  }

  c.user = user
  c.hostname = hostname
  c.rootPath = rootPath
  c.pathSegments = pathSegments

  globalThis.hostname = hostname

  await next()
})

export default router