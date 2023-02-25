export const api = {
  name: 'db.mw',
  description: '🚀 Database API',
  url: 'https://db.mw/api',
  type: 'https://apis.do/data',
  login: 'https://templates.do/login',
  repo: 'https://github.com/drivly/db.mw',
}


export default {
  fetch: async (req, env) => {
    try {
      const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
  //     if (rootPath) return json({ api, gettingStarted, examples, user })
      
      if (!user.authenticated) return user?.browser ? Response.redirect(origin + '/login?redirect_uri=' + encodeURIComponent(req.url)) :
                                                      json({ api, error: 'Unauthorized', login: origin + '/login' }, 401)

      const start = new Date()

      const [ dataSource = 'api', database, collection, action ] = pathSegments

      const data = await fetch('https://mongo.do/api' + pathname).then(res => res.json())

      const requestTime = new Date() - start

      return json({ api, requestTime, pathSegments, collection, database, dataSource, action, data, user })
     } catch ({ message, stack }) {
      return json({ error: { message, stack }}, 500) 
    }
  }
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj, null, 2), { status, headers: { 'content-type': 'application/json; charset=utf-8' }})
