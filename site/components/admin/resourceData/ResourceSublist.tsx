import { useEffect, useState } from 'react'
import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  NumberField,
  ReferenceField,
  RichTextField,
  TextField,
  UrlField
} from 'react-admin'
import { useParams } from 'react-router-dom'
import { Noun } from '../AdminApp'
import dataProvider from '../providers/dataProvider'
import { humanCase } from '../utils'


export default function ResourceSublist({ graph, noun, resource: SOURCE }: { graph: any; noun: any; resource: any }) {
  const { id } = useParams()
  const [data, setData] = useState<any[]>([])
  const resource = graph[noun]

  useEffect(() => {
    const getSubList = async () => {
      const products = await dataProvider
        .getManyReference(noun, {
          target: SOURCE.toLowerCase() + 'Id',
          id: Number(id),
          pagination: { page: 1, perPage: 10 },
          sort: { field: 'id', order: 'ASC' },
          filter: undefined,
        })
        .then((res) => res.data)
      setData(products)
    }
    getSubList()
  }, [SOURCE, id, noun])


  let nounFields: Noun<string, any> = {}

  if (resource) {
    nounFields = Object.entries(resource).reduce((acc: Noun<string, any>, [key, value]) => {
      if (
        !key.startsWith('_') &&
        !graph._list?.exclude?.includes(key) &&
        !resource._list?.exclude?.includes(name) &&
        !(resource._list?.fields && !resource._list?.fields.includes(key))
      ) {
        acc[key] = value
      }
      return acc
    }, {})
  }

 
  return (
    <>
      <div className="pt-10 -mb-14">
        <h1 className="text-xl font-medium">{humanCase(noun)}</h1>
      </div>

      <List hasCreate empty={false} resource={noun} title={noun}>
        <Datagrid
          sx={{ '& .RaDatagrid-headerCell': { whiteSpace: 'nowrap' } }}
          bulkActionButtons={false}
          rowClick="show"
          size="medium"
          data={data}
        >
          {Object?.entries((nounFields as Noun<string, any>) || {}).map(([key, field], index: number) => {
            const [refNoun, refProp] = (typeof field === 'string' && field.split('.')) || []
            console.log('hey here you go',refProp, refNoun, key)
            if (refProp)
              return <ReferenceField key={index} label={refNoun} source={key} reference={refNoun} link="show" />

            switch (field) {
              case 'string':
                return <TextField key={index} source={key} noWrap />
              case 'datetime':
                return <DateField key={index} source={key} />
              case 'date':
                return <DateField key={index} source={key} />
              case 'number':
                return <NumberField key={index} source={key} noWrap />
              case 'int':
                return <NumberField key={index} source={key} noWrap />
              case 'phone':
                return <NumberField key={index} source={key} noWrap />
              case 'email':
                return <EmailField key={index} source={key} noWrap />
              case 'url':
                return <UrlField key={index} source={key} />
              case 'bool':
                return <BooleanField key={index} source={key} />
              case 'richtext':
                return <RichTextField key={index} source={key} />
              case 'id':
                return <ReferenceField key={index} source={key} reference={refNoun} link="show" />
              default:
                return <TextField key={index} source={key} noWrap />
            }
          })}
        </Datagrid>
      </List>
    </>
  )
}
