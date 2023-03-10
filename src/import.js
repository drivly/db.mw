// Importing data operations.
import router from './router.js'
import yaml from 'js-yaml'

router.get('/import/:url{.*}', async c => {
  const { url } = c.req.param()
  const graphText = await fetch(`https://${url}`).then(r => r.text())

  const graph = yaml.load(graphText)

  await router.client
    .db('db')
    .collection('graphs')
    .deleteOne({ _id: c.hostname })

  await router.client
    .db('db')
    .collection('graphs')
    .insertOne({
      _id: c.hostname,
      ...graph,
    })

  return c.json({
    api: c.api,
    data: graph,
    user: c.user,
  })
})