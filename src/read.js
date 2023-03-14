// Read operations for the database

import router from './router.js'
import { nanoid } from './utils.js'

const processResult = (obj, noun, isExpanded) => {
  // We need to make all fields with underlines at the top of the object
  // so that they can be accessed by the client
  if (!isExpanded) {
    return `https://${hostname}/${noun}/${encodeURIComponent(obj._id.replace(`${obj._graph}/${obj._noun}/`, ''))}`
  }

  const result = {}

  for (const key in obj) {
    if (key.startsWith('_')) {

      if (key == '_id') {
        // Turn into a clickable URL
        result[key] = `https://${hostname}/${noun}/${encodeURIComponent(obj[key].replace(`${obj._graph}/${obj._noun}/`, ''))}`
      } else {
        result[key] = obj[key]
      }
    }
  }

  for (const key in obj) {
    if (!key.startsWith('_')) {
      result[key] = obj[key]
    }
  }

  // Look through every key in the object, looking for an array with a `_noun` property in the object.
  // Then run the processResult function on that array and replace it with the result.

  for (const key in result) {
    if (Array.isArray(result[key])) {
      if (result[key][0] && result[key][0]._noun) {
        result[key] = result[key].map(item => processResult(item, item._noun, true))
      }
    }
  }

  delete result._graph
  delete result._noun

  return result
}

const humanCase = (str) => {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
}

const camelCase = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index == 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

const unwrap = (ref) => {
  if (Array.isArray(ref)) {
    return {
      isArray: true,
      ref: ref[0],
    }
  } else {
    return {
      isArray: false,
      ref,
    }
  }
}

const resolveReverse = (graph, noun, field) => {
  // Given an example of:
  // Noun1: 
  //  field1: Noun2.field2
  // Noun2:
  //  field2: [Noun1->field1]
  // We need to return if the field is an array or not, and the field name
  // And the otherside of the relationship and the type of relationship
  // If our side is -> and the other side is also ->, this is a many to many relationship
  // If our side is . and the other side is ->, this is a one to many relationship. Meaning we can write on our end but not the other.
  // If our side is -> and the other side is ., this is a many to one relationship. Meaning we can write on the other end but not ours.
  // If our side is . and the other side is ., this is an illegal relationship as dot references need to be pointing to a single object, not each other.

  const { ref, isArray } = unwrap(graph[noun][field])
  let canWrite = false

  console.log('ref', ref)

  if (ref.includes('->')) {
    const [otherNoun, otherField] = ref.split('->')

    const otherNounSpec = graph[otherNoun]

    if (otherNounSpec[otherField].includes('->')) {
      canWrite = true
    }

    return {
      isArray,
      field: otherField,
      noun: otherNoun,
      canWrite,
    }
  }

  if (ref.includes('.')) {
    const [otherNoun, otherField] = ref.split('.')

    const otherNounSpec = graph[otherNoun]

    if (!otherNounSpec[otherField].includes('.')) {
      canWrite = true
    }

    return {
      isArray,
      field: otherField,
      noun: otherNoun,
      canWrite,
    }
  }

  return {
    isArray: false,
    field: null,
    noun: null,
    canWrite: true, // This isnt a relationship, so we can write
  }
}

router.get('/', async c => {
  // List all nouns we can access.

  const nouns = {}

  for (const noun in router.graph) {
    if (!noun.includes('_')) {
      nouns[noun] = `https://${c.hostname}/${noun}`
    }
  }

  return c.json({
    api: router.api,
    links: {
      self: `https://${c.hostname}/`,
    },
    data: {
      nouns,
      graph: c.graph,
    },
    user: c.user,
  })
})

router.get('/graph', async c => {
  return c.json({
    api: router.api,
    data: router.graph,
    user: c.user,
  })
})

router.get('/:noun', async c => {
  const start = new Date()
  const { noun } = c.req.param()

  let {
    page,
    pageSize,
    expand,
    debug,
    ...filter
  } = Object.fromEntries(new URLSearchParams(c.req.raw.url.split('?')[1] || ''))

  let skip = page ? (page - 1) * pageSize : 0
  let limit = pageSize

  // Process the filter param, turning props like _id=one,two,three into an $in query
  for (const key in filter) {
    if (filter[key].includes(',')) {
      filter[key] = { $in: filter[key].split(',').map(item => item.trim()).map(item => `${router.graph._id}/${noun}/${item}`) }
    }

    if (key == 'of') {
      filter.of = `${router.graph._id}/${filter.of}`
    }
  }

  let isVerb = false
  const nounSpec = router.graph[noun]

  if (nounSpec._action) {
    // This is a verb
    isVerb = true
  }

  const pipeline = [
    {
      $match: {
        _graph: router.graph._id,
        _noun: noun,
        ...filter,
      }
    }
  ]

  console.log(pipeline)

  if (expand === undefined) {
    pipeline.push({
      $project: {
        _id: 1,
        _name: 1,
        _graph: 1,
        _noun: 1
      }
    })
  }

  if (skip) {
    skip = parseInt(skip)
    pipeline.push({ $skip: skip })
  } else {
    skip = 0
    pipeline.push({ $skip: 0 })
  }

  if (limit && limit != '0') {
    limit = parseInt(limit)
    pipeline.push({ $limit: parseInt(limit) })
  }

  if (!limit) {
    limit = 100
    pipeline.push({ $limit: 100 })
  }

  // Process the spec and find lookups
  const lookups = []

  for (const key in nounSpec) {
    const value = nounSpec[key]

    if (Array.isArray(value)) {
      if (value[0].includes('->')) {
        const [lookup, lookupField] = value[0].split('->')

        // Find the verb that connects the two nouns
        let verb = Object.keys(router.graph).find(key => {
          const spec = router.graph[key]

          if (spec._object === undefined) return false

          return ([
            ( spec._object == noun && spec._subject == lookup ) || ( spec._object == lookup && spec._subject == noun ),
            ( spec._action == lookupField || spec._reverse == lookupField ) || ( spec._action == key || spec._reverse == key ),
          ]).every(x => !!x)
        })

        const verbName = verb

        if (!verb) continue

        verb = router.graph[verb]

        // Figure out what side this noun is on
        const side = verb._object == noun ? 'object' : 'subject'

        console.log(
          'verb', verb,
          lookup,
          lookupField,
          value[0]
        )

        console.log(side)

        lookups.push({
          from: 'resources',
          as: key,
          let: { id: `$_id` },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ '$_graph', router.graph._id ] },
                    { $eq: [ '$_noun', verbName ] },
                    { $eq: [ `$_${side}`, '$$id' ] },
                    { $eq: [ `$_action`, verb._action ] },
                  ]
                }
              }
            },
            {
              $lookup: {
                from: 'resources',
                as: 'resource',
                let: { id: `$_${side == 'object' ? 'subject' : 'object'}` },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: [ '$_id', '$$id' ] },
                        ]
                      }
                    }
                  },
                  {
                    $limit: 1,
                  }
                ]
              }
            },
            // Replace root with the found resource
            {
              $unwind: '$resource'
            },
            {
              $replaceRoot: {
                newRoot: '$resource'
              }
            }
          ]
        })
      }
    }
  }

  if (lookups.length) {
    for (const lookup of lookups) {
      pipeline.push({ $lookup: lookup })
    }
  }

  const results = await router.client
    .db('db')
    .collection('resources')
    .aggregate(pipeline)
    .toArray()

  const facetItems = {}

  for (const key in nounSpec) {
    if (['string', 'integer'].includes(nounSpec[key])) {
      facetItems[humanCase(key)] = [
        { $unwind: `$${key}` },
        { $sortByCount: `$${key}` },
      ]
    }
  }

  const facetsData = Object.keys(facetItems).length > 1 ? await router.client
    .db('db')
    .collection('resources')
    .aggregate([
      {
        $match: {
          _graph: router.graph._id,
          _noun: noun,
          ...filter,
        }
      },
      {
        $facet: facetItems
      }
    ])
    .toArray() : []

  // Remove any facets that have 1 count.
  // This is because we don't want to show facets that have only 1 item

  const processFacet = (facet) => {
    const result = {}

    for (const key in facet) {
      const count = facet[key]

      for (const item of count) {
        if (item.count > 1) {
          if (!result[key]) {
            result[key] = {}
          }

          result[key][`${item._id} (${item.count})`] = `https://${c.hostname}/${encodeURIComponent(noun)}?${camelCase(key)}=${encodeURIComponent(item._id).replace('%20', '+')}`
        }
      }
    }

    return result
  }

  const facets = processFacet(facetsData[0])

  const count = await router.client
    .db('db')
    .collection('resources')
    .countDocuments({
      _graph: router.graph._id,
      _noun: noun,
      ...filter,
    })

  const resultsData = {}

  const isExpanded = expand != undefined

  for (const result of results) {
    resultsData[(result._name || result._id).replaceAll(router.graph._id + '/', '')] = processResult(result, noun, isExpanded)
  }

  const currentQueryParams = new URLSearchParams(c.req.query()).toString()

  const withQuery = (key, value) => {
    return new URLSearchParams({
      ...c.req.query(),
      [key]: value,
    }).toString()
  }

  return c.json({
    api: router.api,
    responseTime: new Date() - start,
    totalDocuments: count,
    links: {
      self: `https://${c.hostname}/${noun}`,
      next: results.length == limit ? `https://${c.hostname}/${noun}?${withQuery('page', (page || 0) + 1)}` : undefined,
      first: `https://${c.hostname}/${noun}?${withQuery('page', 0)}`,
      last: results.length == limit ? `https://${c.hostname}/${noun}?${withQuery('page', parseInt(count / pageSize))}` : `https://${c.hostname}/${noun}?${withQuery('page', 1)}`, 
      expandedResults: `https://${c.hostname}/${noun}?${withQuery('expand', '')}`,
    },
    data: resultsData,
    facets,
    user: c.user,
  })
})

router.get('/:noun/:id', async c => {
  const start = new Date()
  let { noun, id } = c.req.param()

  id = decodeURIComponent(id)

  const result = await router.client
    .db('db')
    .collection('resources')
    .findOne({
      _id: `${router.graph._id}/${noun}/${id}`,
    })

  console.log(result, noun, id)

  const references = []

  // We need to do a reverse lookup on the graph to find all the references to this object.
  // For example if Product.categoryId is a reference to Category._id then we need to find all the products that reference this category.

  for (const key in router.graph) {
    const spec = router.graph[key]

    for (const field in spec) {
      if (spec[field] == noun) {
        references.push({
          noun: key,
          field,
        })
      }
    }
  }

  const referenceData = {}

  for (const reference of references) {
    let _id = id

    try {
      _id = parseInt(id)
    } catch (e) {}

    const query = {
      _graph: router.graph._id,
      _noun: reference.noun
    }

    const refNoun = router.graph[reference.noun]

    if (refNoun._action) {
      // This is a verb we are referencing.
      query.of = result._id
    } else {
      query[reference.field] = _id
    }

    const results = await router.client
      .db('db')
      .collection('resources')
      .find(query)
      .project({
        _id: 1,
        _name: 1,
        _noun: 1,
        _graph: 1,
      })
      .toArray()

    referenceData[reference.noun] = {}

    for (const result of results) {
      referenceData[reference.noun][result._name] = processResult(result, reference.noun, false)
    }
  }

  let parsedId = result._id.replace(`${router.graph._id}/${noun}/`, '')

  try {
    parsedId = parseInt(parsedId)
  } catch (e) {}

  return c.json({
    api: router.api,
    graph: router.graph._id,
    noun: noun,
    id: parsedId,
    name: result._name,
    responseTime: new Date() - start,
    links: {
      delete: `https://${c.hostname}/${noun}/${id}/delete`,
    },
    data: processResult(result, noun, true),
    relationships: referenceData,
    user: c.user,
  })
})

router.get('/:noun/:id/delete', async c => {

})

router.post('/:noun', async c => {
  // Write a new document to the database
  const { noun } = c.req.param()

  if (!router.graph[noun]) {
    return c.json({
      error: `The noun "${noun}" does not exist in the database.`
    }, 404)
  }

  let data = await c.req.json()

  // Perform validation.
  // If a field has a !, it is required.
  // If a field is an array and the item inside has a ->, this is a lookup not a reference.
  // if a field is an array and the first element is capitalized, it is a reference to another noun. An array of IDs basically.
  // If a field is an array and the first element is lowercase, it is a standard type

  // Demo graph:
  // SaaS:
  //   plans: [Plan]
  //   visitors: [Visitors->visits]
  //   registrations: [Visitor->registrations]
  //   logins: [User->logsIn]
  //   users: [User->uses]
  //   onboardings: [User->onboards]
  //   activations: [User->activates]
  //   subscriptions: [User->subscribes]
  //   payments: [Customer->payments]
  //   upgrades: [Customer->upgrades]
  //   retention: [Customer->retains]
  //   expansion: [Customer->expands]
  //   refererrals: [Customer->refers]
  //   churn: [Customer->cancels]
  //   reactivations: [Customer->reactivates]
  //   apiKeys: [User->apiKeys]
  //   requests: [Request->SaaS]
  //   errors: [Error->SaaS]

  const graph = router.graph

  const actions = [] // An array of documents to insert / update

  // Our goal is to resolve all references and lookups before we insert the document.
  // This means we need to know the ID of the document we are referencing.

  // We can do this by first checking if the document exists, and if it does, we can use the ID.
  // If it doesn't exist, we can insert it and then use the ID.

  const validationErrors = [] 

  const process = (obj) => {
    const noun = router.graph[obj._noun]

    for (const field of Object.keys(noun)) {
      const meta = noun[field]

      if (typeof noun[field] == 'string' && noun[field].includes('${')) {
        obj[field] = noun[field].replace(/\${(.*?)}/g, (match, p1) => obj[p1])
      }

      if (noun[field] == 'date' || noun[field] == 'createdAt') {
        obj[field] = new Date(obj[field] || Date.now())
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

    obj._id = obj._id ? obj._id : `${ router.graph._id }/${ obj._noun }/${ nanoid() }`

    return obj
  }

  data = process({
    _graph: router.graph._id,
    _noun: noun,
    ...data,
  })

  // Insert now before we resolve any references.
  // This allows us to verify the ID is actually free to use.
  try {
    await router.client
      .db('db')
      .collection('resources')
      .insertOne({
        _id: data._id,
        _pending: true
      })
  } catch (e) {
    return c.json({
      error: `Object of type ${noun} already exists with ID: ${data._id}`
    }, 500)
  }

  const pendingId = data._id

  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') {
      // We don't want to allow the user to set the ID of the document.
      // We will generate a new ID for them.
      continue
    }

    if (key.includes('_')) continue

    const field = router.graph[noun][key]

    if (!field) {
      // The field does not exist in the graph.
      validationErrors.push(`The field "${key}" does not exist in the graph.`)
      continue
    }

    const { ref, isArray } = unwrap(field)
    const resolved = resolveReverse(router.graph, noun, key)

    if (ref.includes('.')) {
      // The field is a reference.
      // We need to find the document that matches the reference.
      if (!resolved.canWrite) {
        validationErrors.push(`The field "${key}" is a reference to the field "${ref}", but the field "${ref}" is not writable.`)
        continue
      }

      // See if the document that is being referenced exists.
      const [lookup, lookupField] = ref.split('.')

      const lookupDoc = await router.client
        .db('db')
        .collection('resources')
        .findOne({
          _id: `${router.graph._id}/${lookup}/${data[key]}`
        })

      if (!lookupDoc) {
        validationErrors.push(`The field "${key}" is a reference to the field "${ref}", but the document "${data[key]}" does not exist.`)
        continue
      }
    }

    if (Array.isArray(value)) {
      // The field is an array.

      for (const val of value) {
        if (ref.includes('->')) {
          delete data[key]

          // The field is a lookup.
          // We need to find the document that matches the lookup.
          const [lookup, lookupField] = ref.split('->')

          // Find the verb that describes this relationship.
          let verb = Object.keys(router.graph).find(key => {
            const spec = router.graph[key]

            return (( spec._object == noun && spec._subject == lookup ) || ( spec._object == lookup && spec._subject == noun )) && spec._action == lookupField
          })

          const verbName = verb

          if (!verb) {
            validationErrors.push(
              `The field "${key}" is a lookup to the field "${lookupField}" on the noun "${lookup}", but no verb exists to describe this relationship.`
            )
            continue
          }

          verb = router.graph[verb]

          let target

          if (typeof val == 'object') {
            // We need to insert new data into the database.
            const doc = process(
              {
                _graph: router.graph._id,
                _noun: lookup,
                ...val
              }
            )

            doc._id = doc._id ? doc._id : `${router.graph._id}/${lookup}/${ nanoid() }`

            await router.client.db('db').collection('resources').insertOne(doc)

            target = doc

            console.log('Created', doc)
          } else {
            target = await router.client.db('db').collection('resources').findOne({
              _id: `${router.graph._id}/${lookup}/${value[0]}`,
            })
          }

          if (target) {
            // Create an Action document.
            // This will bind the two documents together.
            
            const subject = verb._subject == noun ? data : target
            const object = verb._object == noun ? data : target

            await router.client.db('db').collection('resources').insertOne({
              _graph: router.graph._id,
              _noun: verbName,
              _id: `${router.graph._id}/${verbName}/${ subject._id }/${ verb._action }/${ object._id }`,
              _name: `${ subject._name || subject._id } ${ verb._action } ${ object._name || object._id }`,
              _subject: subject._id,
              _object: object._id,
              _action: verb._action,
              of: [
                subject._id,
                object._id
              ] // For searching later.
            })

          } else {
            validationErrors.push(`The lookup on field "${ lookup }.${ lookupField }.${ value[0] }" does not exist. Does this document exist?`)
            continue
          }
        }
      }
    }
  }

  if (validationErrors.length) {
    await router.client.db('db').collection('resources').deleteOne({
      _id: pendingId
    })

    return c.json({
      errors: validationErrors
    }, 400)
  }

  await router.client.db('db').collection('resources').updateOne({
    _id: pendingId
  }, {
    $set: {
      _pending: false,
      ...data
    }
  })

  return c.json({
    api: c.api,
    data,
    user: c.user,
  })
})

// Update a document.

router.put('/:noun/:id', async (c) => {
  const { noun, id } = c.param()
  let data = await c.req.json()

  const validationErrors = []

  const toChange = {}

  for (const [key, value] of Object.entries(data)) {
  }
})