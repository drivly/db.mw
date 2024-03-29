import { fetchUtils } from 'react-admin'
import { stringify } from 'querystring'

/* eslint-disable import/no-anonymous-default-export */
// 'https://admin.graphdl.org/'
const apiUrl = '/'
const httpClient = fetchUtils.fetchJson

function parseId(str) {
  return str.replace('https://', '').split('/').reverse()[0]
}

export default {
  getList: async (resource, params) => {
    const { page, perPage } = params?.pagination
    const { field, order } = params?.sort

    console.log('resource', resource)

    const request = await httpClient(`${apiUrl}${resource}?expand=true`)
    console.log('request', request)
    const records = request?.json
      ? Object?.entries(request?.json?.data)?.map(([key, value]) => {
          return { id: parseId(value['_id']), ...value }
        })
      : []
    // console.log('records', records)
    return {
      data: records,
      total: request?.json?.totalDocuments || 0,
    }
  },
  getOne: async (resource, params) => {
    // console.log('params', params)
    const record = await httpClient(`${apiUrl}${resource}/${params.id}?expand=true`)
    return { data: { id: parseId(record.json.data._id), ...record.json.data } }
  },
  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }

    const data = await Promise.all(
      params?.ids?.map(
        async (id) => await httpClient(`${apiUrl}${resource}/${id}`).then(({ json }) => json.data)
      )
    )

    const records = Object.entries(data).map(([key, value]) => {
      return { id: parseId(value['_id']), ...value }
    })
    // console.log('getMany data', data)
    return { data: records }
  },
  getManyReference: async (resource, params) => {
    const { page, perPage } = params?.pagination
    const { field, order } = params?.sort

    // const query = {
    //   filter: JSON.stringigy({ ...params?.filter, [params?.target]: params?.id }),
    //   sort: JSON.stringify([field, order]),
    //   range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
    // }

    const url = `${apiUrl}${resource}?expand=true&${stringify(query)}`
    const { json } = await httpClient(url)
    const records = Object.entries(json.data).map(([key, value]) => {
      return { id: parseId(value['_id']), ...value }
    })
    return {
      data: records,
      total: json.totalDocuments,
    }
  },

  create: async (resource, params) => {
    const { data } = params
    const { json } = await httpClient(`${apiUrl}${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return { data: { id: parseId(json.data._id), ...json.data } }
  },
  update: async (resource, params) => {
    const { data } = params
    console.log('params', { params, resource })

    const { json } = await httpClient(`${apiUrl}${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return { data: { id: parseId(json.data._id), ...json.data } }
  },
  updateMany: async (resource, params) => {
    const { data } = params
    const { json } = await httpClient(`${apiUrl}${resource}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    const records = Object.entries(json.data).map(([key, value]) => {
      return { id: parseId(value['_id']), ...value }
    })
    return {
      data: records,
    }
  },
  delete: async (resource, params) =>
    await httpClient(`${apiUrl}${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json.data })),

  deleteMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    }
    return httpClient(`${apiUrl}${resource}?${stringify(query)}`, {
      method: 'DELETE',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json.data }))
  },
}
