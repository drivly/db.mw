import { Hono } from 'hono'
import { MongoFetchClient } from 'mongo-fetch'

const router = new Hono()

router.use('*', async (c, next) => {
  const req = c.req.raw
  const env = c.env

  if (req.method == 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': req.headers.get('Origin') || req.headers.get('host'),
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Forwarded-Proto, X-Forwarded-For',
        'Access-Control-Max-Age': 86400,
      },
    })
  }

  const { user, hostname, rootPath, pathSegments, query, body } = await env.CTX.fetch(req).then(res => res.json())

  if (!user.authenticated) {
    if (user?.browser) {
      return Response.redirect(`https://${hostname}/login?redirect_uri=${encodeURIComponent(req.url)}`)
    } else {
      c.json({ error: 'Unauthorized', login: hostname + '/login' }, { status: 401 })
    }
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

  c.res.headers.set('Access-Control-Allow-Origin', c.hostname)
  c.res.headers.set('Access-Control-Allow-Credentials', 'true')
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Forwarded-Proto, X-Forwarded-For')
  c.res.headers.set('Access-Control-Max-Age', 86400)
})

export default router
