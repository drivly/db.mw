import { CloudArrowUpIcon } from '@heroicons/react/20/solid'
import React from 'react'
import Link from 'next/link'

export default function Graphs({ graphs }) {
  console.log('Graphs', graphs)
  return (
    <div id='features' className='bg-gray-900 py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl lg:text-center'>
          <p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
            Graphdl schemas available:
          </p>
        </div>
        <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
          <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
            {graphs.map((graph, index) => (
              <Link href={`/${graph._id}/app`} key={index} className='flex flex-col items-center'>
                <div className='flex items-center gap-x-3 text-base font-semibold leading-7 text-white relative'>
                  <dt className='text-sm font-semibold leading-6 text-white/90 flex items-center gap-x-3'>
                    <CloudArrowUpIcon className='h-5 w-5 flex-none text-pink-400' aria-hidden='true' /> {graph._id}
                  <span className='absolute rounded-full bg-pink-500/10 px-3 py-1 text-sm font-semibold leading-6 text-white/90 ring-1 ring-inset ring-pink-500/20 h-12 w-12 -left-[15px]' />
                  </dt>
                </div>
              </Link>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
