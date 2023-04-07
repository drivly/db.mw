import {
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  List,
  NumberField,
  ReferenceField,
  RichTextField,
  SearchInput,
  TextField,
  TextInput,
  UrlField,
  useResourceContext,
} from 'react-admin'
import { Noun } from '../AdminApp'

const postFilters = (nounFields: any) => {
  const filterObject = Object.entries(nounFields).map(([key, field], index) => {
    return <TextInput key={index} label={key} source={key} />
  })
  return filterObject
}

// const ListToolbar = () => (
//   <Stack direction="row" justifyContent="space-between">
//     <div className="flex items-center">
//       <CreateButton />
//     </div>
//   </Stack>
// )

export default function ResourceList({ graph, noun }: any) {
  let nounFields: Noun<string, any> = {}
  const resource = useResourceContext()

  if (noun) {
    nounFields = Object.entries(noun).reduce((acc: Noun<string, any>, [key, value]) => {
      if (
        !key.startsWith('_') &&
        key !== 'photo' &&
        !graph._list?.exclude?.includes(key) &&
        !noun._list?.exclude?.includes(name) &&
        !(noun._list?.fields && !noun._list?.fields.includes(key))
      ) {
        acc[key] = value
      }
      return acc
    }, {})
  }

  return (
    <List
      hasCreate
      empty={false}
      perPage={10}
      hasList
      className=""
      filters={postFilters(nounFields).concat(<SearchInput source="q" alwaysOn={true} autoComplete="off" />)}
    >
      <Datagrid
        sx={{ '& .RaDatagrid-headerCell': { whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: 15 } }}
        bulkActionButtons={false}
        rowClick="show"
        size="medium"
        title={resource}
      >
        {Object?.entries((nounFields as Noun<string, any>) || {}).map(([key, field], index: number) => {
          const [refNoun, refProp] = (typeof field === 'string' && field.split('.')) || []

          if (refProp) {
            const targetName = graph[refNoun]?._name
            const targetSource = key === 'mgrId' ? 'Manager' : key

            return (
              <ReferenceField key={index} source={key} reference={refNoun} link="show">
                <TextField source={targetName} label={targetSource} />
              </ReferenceField>
            )
          }
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
            default:
              return <TextField key={index} source={key} noWrap />
          }
        })}
      </Datagrid>
    </List>
  )
}
