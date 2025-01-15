import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  aggregationFns,
  columnFilteringFeature,
  columnGroupingFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHelper,
  filterFns,
  flexRender,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type { ColumnDef, GroupingState } from '@tanstack/react-table'
import type { Person } from './makeData'

const tableHelper = createTableHelper({
  _features: {
    columnFilteringFeature,
    columnGroupingFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
  },
  _rowModels: {
    expandedRowModel: createExpandedRowModel(),
    filteredRowModel: createFilteredRowModel(filterFns),
    groupedRowModel: createGroupedRowModel(aggregationFns),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(sortFns),
  },
  TData: {} as Person,
})

function App() {
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo<
    Array<ColumnDef<typeof tableHelper.features, Person>>
  >(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => info.getValue(),
        /**
         * override the value used for row grouping
         * (otherwise, defaults to the value derived from accessorKey / accessorFn)
         */
        getGroupingValue: (row) => `${row.firstName} ${row.lastName}`,
        // helloWorld: {
        //   features: {},
        //   data: {}
        // }
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: () => <span>Last Name</span>,
        cell: (info) => info.getValue(),
      },

      {
        accessorKey: 'age',
        header: () => 'Age',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100,
        aggregationFn: 'median',
      },

      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        aggregationFn: 'sum',
        aggregatedCell: ({ getValue }) => getValue<number>().toLocaleString(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        cell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100 + '%',
        aggregationFn: 'mean',
        aggregatedCell: ({ getValue }) =>
          Math.round(getValue<number>() * 100) / 100 + '%',
      },
    ],
    [],
  )

  const [data, setData] = React.useState(() => makeData(10_000))
  const refreshData = () => setData(() => makeData(100_000)) // stress test

  const [grouping, setGrouping] = React.useState<GroupingState>([])

  const table = tableHelper.useTable({
    columns,
    data,
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    debugTable: true,
  })

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {header.column.getCanGroup() ? (
                          // If the header can be grouped, let's add a toggle
                          <button
                            onClick={header.column.getToggleGroupingHandler()}
                            style={{ cursor: 'pointer' }}
                          >
                            {header.column.getIsGrouped()
                              ? `🛑(${header.column.getGroupedIndex()}) `
                              : `👊 `}
                          </button>
                        ) : null}{' '}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getAllCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      style={{
                        background: cell.getIsGrouped()
                          ? '#0aff0082'
                          : cell.getIsAggregated()
                            ? '#ffa50078'
                            : cell.getIsPlaceholder()
                              ? '#ff000042'
                              : 'white',
                      }}
                    >
                      {cell.getIsGrouped() ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <button
                            onClick={row.getToggleExpandedHandler()}
                            style={{
                              cursor: row.getCanExpand() ? 'pointer' : 'normal',
                            }}
                          >
                            {row.getIsExpanded() ? '👇' : '👉'}{' '}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}{' '}
                            ({row.subRows.length})
                          </button>
                        </>
                      ) : cell.getIsAggregated() ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        flexRender(
                          cell.column.columnDef.aggregatedCell ??
                            cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(grouping, null, 2)}</pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
