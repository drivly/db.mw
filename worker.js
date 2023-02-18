export const api = {
  name: 'db.mw',
  description: '🚀 Database API',
  url: 'https://db.mw/api',
  type: 'https://apis.do/data',
  login: 'https://templates.do/login',
  repo: 'https://github.com/drivly/db.mw',
}

// export const gettingStarted = [
//   `If you don't already have a JSON Viewer Browser Extension, get that first:`,
//   `https://extensions.do`,
// ]

// export const examples = {
//   listItems: 'https://templates.do/worker',
// }

export default {
  fetch: async (req, env) => {
    try {
      const { user, hostname, pathname, rootPath, pathSegments, query } = await env.CTX.fetch(req).then(res => res.json())
  //     if (rootPath) return json({ api, gettingStarted, examples, user })

      const start = new Date()

  //     const projection = query?.select?.map

      const [ dataSource = 'api', database, collection ] = pathSegments

      const data = await fetch('https://mongo.do/api' + pathname).then(res => res.json())

      const requestTime = new Date() - start

      return json({ api, requestTime, pathSegments, collection, database, dataSource, action, data, user })
     } catch ({ message, stack }) {
      return json({ error: { message, stack }}) 
    }
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
