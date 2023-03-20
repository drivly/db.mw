import fakeDataProvider from 'ra-data-fakerest'

export const getDataProvider = (url = 'https://json.fyi/northwind.json' ) => fetch(url).then(res => res.json()).then(data => fakeDataProvider(data))
