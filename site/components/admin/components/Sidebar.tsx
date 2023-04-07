/* eslint-disable @next/next/no-img-element */
import { Link, TitleComponent } from 'react-admin'

import NavMenu from './NavMenu'

export default function Sidebar({ title }: { title?: TitleComponent }) {
  
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-gray-700">
      <div className="flex min-h-0 flex-1 flex-col bg-[#161b22]">
        <Link to="/">
          <div className="flex h-16 flex-shrink-0 pl-[30px] items-center bg-[#161b22]">
            <p className="h-[15px] w-[15px] bg-white rounded-[3px]" />
            <p className="ml-1 h-[15px] w-[15px] bg-white rounded-full" />
            <p className="ml-2 text-lg text-white font-medium tracking-wide leading-[110%]">{title}</p>
          </div>
        </Link>
        <NavMenu />
      </div>
    </div>
  )
}
