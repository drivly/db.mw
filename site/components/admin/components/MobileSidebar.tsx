/* eslint-disable @next/next/no-img-element */
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { Link, TitleComponent } from 'react-admin'
import NavMenu from './NavMenu'

export function MobileSidebar({
  sidebarOpen,
  onClose,
  title,
}: {
  sidebarOpen: boolean
  onClose: () => void
  title?: TitleComponent
}) {
  return (
    <Dialog
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-40 lg:hidden"
      open={sidebarOpen}
      onClose={onClose}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />

      <div className="fixed inset-0 z-40 flex">
        <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <Link to="/" onClick={onClose}>
            <div className="flex flex-shrink-0 items-center pl-3.5">
              <span className="h-[15px] w-[15px] bg-white rounded-[3px]" />
              <span className="ml-1 h-[15px] w-[15px] bg-white rounded-full" />
              <span className="ml-2 text-lg text-white font-medium tracking-wide leading-[110%]">{title}</span>
            </div>
          </Link>
          <NavMenu mobile onClose={onClose} />
        </Dialog.Panel>

        <div className="w-14 flex-shrink-0" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
    </Dialog>
  )
}
