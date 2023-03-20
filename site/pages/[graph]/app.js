// TODO: is the UI Library published on NPM yet?
// import App from 'graphdl/ui`

import dynamic from 'next/dynamic'
import getGraphs from '../../lib/getGraphs'
// import sass from '../../admin/saas.json'

const AdminApp = dynamic(() => import('../../components/admin/AdminApp'), { ssr: false })

const Home = ({ graph }) => {
  const resources = graph && Object?.keys(graph).filter((item) => !item.startsWith('_'))
  console.log('resources', resources)
  return <AdminApp graph={graph} resources={resources} />
}

export async function getStaticPaths() {

  return {
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const graph = await getGraphs(params?.graph)
  console.log('app page', graph)
  return { props: { graph } }
}

export default Home