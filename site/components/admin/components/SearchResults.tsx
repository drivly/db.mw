import React from 'react'

interface SearchResultsProps {
  results: any[]
  query: string
}

export default function SearchResults({results, query}: SearchResultsProps) {
  if (!results || query.length === 0) return null

  console.log('results', results)

  return (
    <div className='absolute left-0 w-full bg-[#161b22] top-16 rounded-b-[4px] pb-4'>
      <div className='text-gray-200 px-6 pt-2 space-y-4 text-[15px] font-medium'>
        {results.map((result) => {
          console.log('result', result)
          return (
          <div key={result._id}>
            <p className='tracking-wide leading-[110%] cursor-pointer'>{result._name}</p>
            <hr className='border-gray-700 mt-3' />
          </div>
        )})}

        <div>
          <p className='text-gray-100'>Veiw all results for - {query}</p>
        </div>
      </div>
    </div>
  )
}
