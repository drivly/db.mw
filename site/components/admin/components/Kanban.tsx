import useDragAndDrop, { Status, useDragStartAndEnd, useDropAndDragOver } from '../hooks/useDragAndDrop'

const boardTypes: Status[] = ['ideas', 'backlog', 'in-progress', 'done']

type KanbanCard = {
  [x: string]: string
  id: string
  title: string
  description: string
}

interface KanbanColumnProps {
  status: Status
  items: KanbanCard[]
  handleDragging: (dragging: boolean) => void
  isDragging: boolean
  handleUpdateList: (id: string, status: Status) => void
}

interface KanbanCardProps {
  data: {
    id: any
    title: string
    description: string
  }
  handleDragging: (dragging: boolean) => void
}

export default function Kanban() {
  const { isDragging, listItems, handleDragging, handleUpdateList } = useDragAndDrop()

  return (
    <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 2xl:grid-cols-4 w-full">
      {boardTypes.map((status, index) => (
        <KanbanColumn
          key={index}
          status={status}
          handleDragging={handleDragging}
          isDragging={isDragging}
          handleUpdateList={handleUpdateList}
          items={listItems}
        />
      ))}
    </div>
  )
}

function KanbanColumn({ status, items, handleDragging, isDragging, handleUpdateList }: KanbanColumnProps) {
  const { handleDragOver, handleDrop } = useDropAndDragOver({ handleDragging, handleUpdateList, status })
  const count = items?.filter((item) => item.status === status).length || 0

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${
        isDragging ? 'border border-dashed' : ''
      } flex flex-col min-w-80 h-full mx-1 dark:bg-black bg-white border border-gray-200 dark:border-gray-700 rounded-[4px] col-span-1`}
    >
      <div className="flex items-center justify-between p-3.5 font-semibold text-[16px] text-black dark:text-white bg-white dark:bg-black rounded-[4px]">
        <h1 className="flex items-center gap-x-4 whitespace-nowrap capitalize">
          {status}{' '}
          <span className="text-xs dark:bg-[#161b22] bg-gray-200 text-gray-600 dark:text-[#8b949e] flex items-center justify-center rounded-full h-5 mb-px w-full p-2">
            {count}
          </span>
        </h1>
      </div>
      <ul className="flex flex-col flex-1 p-2 space-y-2 rounded-b-md">
        {items &&
          items?.map(
            (item) =>
              status === item.status && <KanbanCard key={item.id} data={item} handleDragging={handleDragging} />,
          )}
      </ul>
      <AddNewItemButton status={status} />
    </div>
  )
}

function KanbanCard({ data, handleDragging }: KanbanCardProps) {
  const { handleDragEnd, handleDragStart } = useDragStartAndEnd({ handleDragging, id: data.id })

  return (
    <li
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      draggable
      id={data.id}
      className="flex flex-col w-full h-fit p-2 bg-gray-200 dark:bg-[#161b22] rounded-md shadow-md"
    >
      <div className="flex flex-col flex-1 mb-4 m-1.5">
        <h3 className="text-[12px] font-semibold text-[#060611] dark:text-[#8b949e] mb-2.5 flex items-center leading-[110%]">
          <GithubCircleIcon variant="mr-1 text-green-500" />
          {data.title}
        </h3>
        <p className="text-[15px] leading-[110%] text-black dark:text-white">{data.description}</p>
      </div>
    </li>
  )
}

const GithubCircleIcon = ({ variant }: { variant: string }) => {
  return (
    <svg
      aria-hidden="false"
      focusable="false"
      aria-label="Open issue"
      role="img"
      className={variant}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      style={{ display: 'inline-block', userSelect: 'none', verticalAlign: 'text-bottom', overflow: 'visible' }}
    >
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
    </svg>
  )
}

function AddNewItemButton({ status }: { status: Status }) {
  return (
    <button
      className="flex items-center justify-start w-full h-fit text-sm font-semibold text-[#060611] dark:text-[#8b949e] rounded-md pl-4 py-2 hover:bg-gray-50 dark:hover:bg-[#161b22]"
      onClick={() => console.log(status)}
    >
      <AddIcon /> <span className="ml-1">Add item</span>
    </button>
  )
}

function AddIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  )
}

// TODO Add form to add new item to the list
