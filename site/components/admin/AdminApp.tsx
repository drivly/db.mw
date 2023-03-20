import { Admin, Resource } from 'react-admin'
import dataProvider from './providers/dataProvider'

import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
import ResourceCreate from './resourceData/ResourceCreate'
import { ResourceEdit } from './resourceData/ResourceEdit'
import ResourceList from './resourceData/ResourceList'
import ResourceShow from './resourceData/ResourceShow'
import { Key } from 'react'

export type Noun<K extends keyof any, T> = {
  [P in K]: T
}

const AdminApp = ({ graph, resources }: any) => {
  const graphName = graph._id !== 'db.mw' ? graph._id.split('.')[0] : graph._id
  console.log('graph', graph)
  return (
    <Admin title={graphName} dataProvider={dataProvider} layout={Layout}>
      {graph &&
        resources.map((resource: string, index: Key) => {
          console.log('resourceadmin', resource)
          // console.log('name', name, 'noun', noun)
          return (
            <Resource
              key={index}
              name={resource}
              list={ResourceList({ graph, noun: graph[resource] })}
              show={ResourceShow({ graph, noun: graph[resource], name })}
              create={ResourceCreate({ graph, noun: graph[resource], name })}
              edit={ResourceEdit}
              recordRepresentation={graph[resource]?._name}
            />
          )
        })}
    </Admin>
  )
}

export default AdminApp
