import clientPromise from './mongodb'

export default async function getGraphs(input) {
  let graph
  const client = await clientPromise
  const coll = client.db('db').collection('graphs')

  graph = input ? await coll.findOne({ _id: input }) : await coll.find({}).toArray()
  return graph
}
