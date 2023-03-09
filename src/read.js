// Read operations for the database

import router from './router.js'

const processResult = (obj, noun, isExpanded) => {
  // We need to make all fields with underlines at the top of the object
  // so that they can be accessed by the client
  if (!isExpanded) {
    return `https://${hostname}/${noun}/${obj._id.replace(`${obj._graph}/${obj._noun}/`, '')}`
  }

  const result = {}

  for (const key in obj) {
    if (key.startsWith('_')) {

      if (key == '_id') {
        // Turn into a clickable URL
        result[key] = `https://${hostname}/${noun}/${obj[key].replace(`${obj._graph}/${obj._noun}/`, '')}`
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

  const pipeline = [
    {
      $match: {
        _graph: router.graph._id,
        _noun: noun,
        ...filter,
      }
    }
  ]

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

  const results = await router.client
    .db('db')
    .collection('resources')
    .aggregate(pipeline)
    .toArray()

  const nounSpec = router.graph[noun]

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
    resultsData[result._name] = processResult(result, noun, isExpanded)
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
  const { noun, id } = c.req.param()

  const result = await router.client
    .db('db')
    .collection('resources')
    .findOne({
      _id: `${router.graph._id}/${noun}/${id}`,
    })

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

    const results = await router.client
      .db('db')
      .collection('resources')
      .find({
        _graph: router.graph._id,
        _noun: reference.noun,
        [reference.field]: _id,
      })
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
    data: processResult(result, noun, true),
    relationships: referenceData,
    user: c.user,
  })
})