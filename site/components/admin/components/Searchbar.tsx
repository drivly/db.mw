import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { debounce } from '@mui/material'
import SearchResults from './SearchResults'

export default function Searchbar() {
  const [query, setQuery] = React.useState('')
  const [isLoading, setLoading] = useState(false)
  const [results, setResults] = React.useState([])
  const inputRef = React.useRef<any>(null)
  const location = useLocation()

  console.log('location', location)

  const { pathname } = useLocation()
  const activeResource = pathname?.split('/')[1]

  useEffect(() => {
    setResults([])
    setQuery('')
  }, [location.pathname])

  useEffect(() => {
    const searchDb = debounce(async () => {
      try {
        setLoading(true)
        const request = await fetch('/search?q=' + query).then((res) => res.json())
        const searchResults = await request.data || []
        setResults(searchResults)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }, 500)
    if (query.trim().length > 0) {
      searchDb()
    }
  }, [query])

  return (
    <div className="flex flex-1 pl-4 relative">
      <form className="flex w-full lg:ml-0" action="#" method="GET">
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <div className="relative w-full text-gray-600 focus-within:text-gray-300">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            id="search-field"
            className="bg-inherit block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-100 placeholder-gray-300 focus:border-transparent focus:placeholder-gray-600 focus:outline-none focus:ring-0 tracking-wide font-medium"
            placeholder="Search"
            autoComplete="off"
            type="search"
            name="search"
            value={query}
            ref={inputRef}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isLoading && 'loading...'}
        </div>
      </form>
      <SearchResults query={query} results={results} />
    </div>
  )
}
