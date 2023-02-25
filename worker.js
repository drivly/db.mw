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
      const { user, method, origin, subdomain, hostname, pathname, url, rootPath, pathSegments, search, query, body } = await env.CTX.fetch(req).then(res => res.json())
  //     if (rootPath) return json({ api, gettingStarted, examples, user })
      
      if (pathname == ('/_')) return fetch('https://ui.db.mw')
      if (pathname.startsWith('/_next/')) return fetch('https://ui.db.mw' + pathname + search)
      
      if (!user.authenticated) return user?.browser ? Response.redirect(origin + '/login') :
                                                      json({ api, error: 'Unauthorized', login: origin + '/login' }, 401)
      
      const start = new Date()
      
      const [ resource, id, getAction ] = pathSegments
      const project = subdomain ?? 'ui'
      
      let { limit, skip, page = 1, pageSize = 100, sort, fields, ...filter } = query
      
      limit = limit ? parseInt(limit) : parseInt(pageSize)
      skip = skip ? parseInt(skip) : parseInt(page) * (parseInt(pageSize) - 1)
      
      const created = method == 'POST ' ? start : undefined
      const createdBy = method == 'POST ' ? user.email : undefined
      
      const updated = method == 'GET' ? undefined : start
      const updatedBy = method == 'GET ' ? user.email : undefined
      
      const document = method == 'GET' ? undefined : { _id: `${project}/${resource}/${id}`, project, resource, id, data: body, created, createdBy, updated, updatedBy }
      
      const action = method == 'GET' ? (getAction ?? id ? 'findOne' : 'find') :
                     method == 'POST' ? 'insertOne' :
                     method == 'PUT' ? 'updateOne' :
                     method == 'PATCH' ? 'updateOne' :
                     method == 'DELETE' ? 'deleteOne' : 'find'
      
      
      const headers = { 'api-key': env.MONGO_API_KEY }
      const data = await fetch('https://data.mongodb-api.com/app/data-ahvqx/endpoint/data/v1/action/' + action, { 
        headers, 
        method: 'POST', 
        body: JSON.stringify({ 
          dataSource: 'api',
          database: 'db',
          collection: 'resources',
          document,
          filter,
          skip,
          limit,
        }),
      })


//       const data = await fetch('https://mongo.do/api' + pathname).then(res => res.json())

      const requestTime = new Date() - start

      return json({ api, requestTime, project, resource, id, action, data, user })
     } catch ({ message, stack }) {
      return json({ error: { message, stack }}, 500) 
    }
  }
}



const json = (obj, status = 200) => new Response(JSON.stringify(obj, null, 2), { status, headers: { 'content-type': 'application/json; charset=utf-8' }})
