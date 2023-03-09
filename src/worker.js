import { MongoFetchClient } from '@drivly/mongo-fetch'

// Import our routes
import './read.js'

// Now we can import the router with our routes preloaded.
import router from './router.js'

export const api = {
  name: 'db.mw',
  description: '🚀 Multiworld Database',
  url: 'https://db.mw/api',
  type: 'https://apis.do/data',
  login: 'https://templates.do/login',
  repo: 'https://github.com/drivly/db.mw',
}

export default {
  fetch: async (req, env) => {
    const client = new MongoFetchClient(
      'api',
      {
        url: env.DATA_API_URL,
        apiKey: env.DATA_API_KEY,
      }
    )

    const hostname = new URL(req.url).hostname

    let graph = await client
      .db('db')
      .collection('graphs')
      .findOne({
        _id: hostname
      })

    if (!graph) {
      graph = await client
        .db('db')
        .collection('graphs')
        .findOne({
          _id: 'northwind.graphdl.org'
        })
    }

    if (graph._seed && !graph._seeded) {
      // We have no data actually in the resources collection for this graph.
      // We need to seed it.

      const seedData = await fetch(graph._seed).then(res => res.json())

      // Each "Noun" parameter supports a template string for the value of the field.
      // We need to replace the template strings with the actual values using the context of the object itself.
      // For example, the _name field might contain "${customerName} - ${orderNumber}".
      // This needs to be transformed into "John Doe - 1234" for each object in the seed data.

      const process = (obj) => {
        const noun = graph[obj._noun]

        for (const field of Object.keys(noun)) {
          const meta = noun[field]

          if (typeof noun[field] == 'string' && noun[field].includes('${')) {
            obj[field] = noun[field].replace(/\${(.*?)}/g, (match, p1) => obj[p1])
          }

          if (noun[field] == 'date') {
            obj[field] = new Date(obj[field])
          }

          if (field.includes('_')) {
            if (field == '_id') {
              obj._id = `${obj._graph}/${obj._noun}/${obj[meta]}`
            } else {
              // This is always a lookup to another resource.
              if (meta.includes('$')) {
                obj[field] = meta.replace(/\${(.*?)}/g, (match, p1) => obj[p1])
              } else {
                obj[field] = obj[meta]
              }
            }
          }
        }

        return obj
      }

      // Seed data is an object containing arrays of resources.
      // In the format of { Customer: [ ... ], Order: [ ... ], ... }

      const resources = []

      for (const noun of Object.keys(seedData)) {
        if (!Array.isArray(seedData[noun])) continue

        for (const resource of seedData[noun]) {
          resource._graph = graph._id
          resource._noun = noun

          resources.push(process(resource))
        }
      }

      // Insert many resources, but chunk into 100 at a time.
      // This is to avoid the 16MB limit on a single document in MongoDB.

      await client
        .db('db')
        .collection('resources')
        .deleteMany({ _graph: graph._id })

      const chunks = []

      while (resources.length) {
        chunks.push(resources.splice(0, 100))
      }

      for (const chunk of chunks) {
        await client
          .db('db')
          .collection('resources')
          .insertMany(chunk)
      }

      await client
        .db('db')
        .collection('graphs')
        .updateOne({
          _id: graph._id
        }, {
          $set: {
            _seeded: true
          }
        })
    }

    router.client = client
    router.graph = graph

    router.api = api

    return await router.fetch(req, env)
  }
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj, null, 2), { status, headers: { 'content-type': 'application/json; charset=utf-8' }})
