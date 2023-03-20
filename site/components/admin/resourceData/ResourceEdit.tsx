import { Box, Card, CardContent } from '@mui/material'
import { EditBase, EditButton, Form, ShowButton, TextInput, Toolbar, useEditContext } from 'react-admin'

export const ResourceEdit = () => (
  <EditBase redirect="show">
    <ResourceEditContent />
  </EditBase>
)

const ResourceEditContent = ({ link = 'show' }) => {
  const { isLoading, record } = useEditContext<any>()
  if (isLoading || !record) return null
  console.log('record', record)

  return (
    <Box display="flex" flexDirection="column" maxWidth={800} justifyContent="center" textAlign="center" marginX="auto">
      <div className="justify-end flex">
        {link === 'edit' ? (
          <EditButton sx={{ color: 'white', letterSpacing: 1.5 }} label="Edit Contact" />
        ) : (
          <ShowButton label="Show Contact" sx={{ fontSize: 13, letterSpacing: 1.5 }} />
        )}
      </div>
      <Box flex="1" maxWidth={800}>
        <Form>
          <Card>
            <CardContent>
              <Box maxWidth={800}>
                <Box display="flex" maxWidth={900} sx={{ display: 'flex' }}>
                  <ResourceInputs record={record} />
                </Box>
              </Box>
            </CardContent>
            <Toolbar />
          </Card>
        </Form>
      </Box>
    </Box>
  )
}

export const ResourceInputs = ({ record }: any) => {
  console.log('record', Object?.keys(record))
  return (
    <div className="flex flex-col w-full">
      <Box flex="1" mt={-1}>
        {record &&
          Object?.keys(record)
            .filter((item) => item)
            .map((item, i) => {
              return (
                <Box key={i} mt={2} maxWidth={800}>
                  <TextInput source={item} fullWidth />
                  <Spacer />
                </Box>
              )
            })}
      </Box>
    </div>
  )
}

const Spacer = () => <Box width={20} component="span" />
