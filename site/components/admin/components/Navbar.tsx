/* eslint-disable @next/next/no-img-element */
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

import ProfileMenu from './ProfileMenu'
import Searchbar from './Searchbar'

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-[#161b22] shadow">
      <button
        type="button"
        className="border-r border-gray-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 justify-between">
        <Searchbar />
        <div className="ml-4 flex items-center lg:ml-6 px-4">
          <button
            type="button"
            className="rounded-full bg-[#161b22] p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6 " aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}
