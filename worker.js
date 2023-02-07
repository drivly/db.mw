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

      const [ dataSource = 'src', database = 'edmunds', collection = 'makes', action = 'findOne' ] = pathSegments

  //     const {  }

      const data = await fetch(`https://data.mongodb-api.com/app/data-ahvqx/endpoint/data/v1/action/${action}`, {
        headers: { "Api-Key": env.MONGO_API_KEY, "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            collection,
            database,
            dataSource,
            filter: action.startsWith('find') ? query : undefined,
  //           projection: { _id : 1 }
        })
      }).then(res => res.json())

      const requestTime = new Date() - start

      return json({ api, requestTime, pathSegments, collection, database, dataSource, action, data, user })
     } catch ({ message, stack }) {
      return json({ error: { message, stack }}) 
    }
  }
}

const json = obj => new Response(JSON.stringify(obj, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8' }})
