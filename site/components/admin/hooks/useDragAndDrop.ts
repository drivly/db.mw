import { useCallback, useState } from 'react'
import useLocalStorage from './useLocalStorage'

export type Status = 'ideas' | 'backlog' | 'in-progress' | 'done'

interface DragAndDropProps {
  isDragging: boolean
  listItems: any
  handleDragging: (dragging: boolean) => void
  handleUpdateList: (id: string, status: Status) => void
}

const initalValue = [
  {
    id: '1',
    title: 'create a Kanban app with Tailwindcss',
    description: 'This will be a Tailwindcss based Kanban app',
    status: 'ideas',
  },
  {
    id: '2',
    title: 'master React-Admin',
    description: 'Embrace MUI and learn how to use it',
    status: 'backlog',
  },

  {
    id: '3',
    title: 'build a worker in Cloudflare',
    description: 'Build a service in Cloudflare',
    status: 'backlog',
  },

  {
    id: '4',
    title: 'building admin dashboard',
    description: 'React-Admin Tailwindcss Graphdl',
    status: 'in progress',
  },

  {
    id: '5',
    title: 'ate breakfast',
    description: '6 eggs yolks and all',
    status: 'done',
  },
]

export default function useDragAndDrop(): DragAndDropProps {
  const [isDragging, setIsDragging] = useState(false)
  const [persisted, setPersisted] = useLocalStorage('kanban-list', initalValue)
  const [listItems, setListItems] = useState(persisted)

  const handleUpdateList = useCallback(
    (id: any, status: Status) => {
      const card = listItems.find((item: any) => item.id === id)
      if (card && card.status !== status) {
        card.status = status

        setListItems(() => {
          const newList = [card, ...listItems?.filter((item: any) => item.id !== id)]
          setPersisted(newList)
          return newList
        })
      }
    },
    [listItems, setPersisted],
  )

  const handleDragging = useCallback((dragging: boolean) => setIsDragging(dragging), [])

  return {
    isDragging,
    listItems,
    handleDragging,
    handleUpdateList,
  }
}

interface DragAndDropOverProps {
  handleDragging: (dragging: boolean) => void
  handleUpdateList: (id: string, status: Status) => void
  status: Status
}

export function useDropAndDragOver({ handleDragging, handleUpdateList, status }: DragAndDropOverProps) {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const id = e.dataTransfer.getData('text')

      handleUpdateList(id, status)
      handleDragging(false)
    },
    [handleDragging, handleUpdateList, status],
  )

  return {
    handleDragOver,
    handleDrop,
  }
}

interface DragStartEndProps {
  handleDragging: (dragging: boolean) => void
  id: string
}

export function useDragStartAndEnd({ handleDragging, id }: DragStartEndProps) {
  const handleDragEnd = useCallback(() => handleDragging(false), [handleDragging])

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLLIElement>) => {
      e.dataTransfer.setData('text', `${id}`)
      handleDragging(true)
    },
    [id, handleDragging],
  )

  return {
    handleDragEnd,
    handleDragStart,
  }
}
