import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Globe from './Globe'

export default function Hero() {
  return (
    <div className='relative isolate overflow-hidden bg-gray-900'>
      <div className='mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8'>
        <div className='mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8'>
          <div className='mt-24 sm:mt-32 lg:mt-8'>
            <a href='#' className='inline-flex space-x-6'>
              <span className='rounded-full bg-pink-500/10 px-3 py-1 text-sm font-semibold leading-6 text-pink-400 ring-1 ring-inset ring-pink-500/20'>
                What's new
              </span>
              <span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300'>
                <span>Now Globally Distributed to 25 Cities</span>
                <ChevronRightIcon className='h-5 w-5 text-gray-500' aria-hidden='true' />
              </span>
            </a>
          </div>
          <h1 className='mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl'>
            Accelerate with the Multi World Database
          </h1>
          <p className='mt-6 text-lg leading-8 text-gray-300'>
            Leverage the natural expressiveness of the Graph Database World, 
            the flexibility of the Document Database World, 
            and the constraints with foreign keys and referential integrity 
            of the Relational Database World.
          </p>
          <div className='mt-10 flex items-center gap-x-6'>
            <a
              href='#'
              className='rounded-md bg-pink-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400'
            >
              Get started
            </a>
            <a href='#' className='text-sm font-semibold leading-6 text-white'>
              Learn more <span aria-hidden='true'>→</span>
            </a>
          </div>
        </div>
        <div className='mx-auto mt-2 flex max-w-2xl sm:mt-24 lg:ml-2 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-16'>
          <div className='max-w-3xl flex-initial sm:max-w-5xl lg:max-w-none'>
            <div
              width={800}
              height={800}
              className='w-[40rem]'
            >
              <Globe/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
