'use client'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  searchPlaceholder?: string
  searchColumn?: string
  pageSize?: number
}

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = 'Buscar...',
  searchColumn,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, globalFilter },
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="space-y-3 font-[Space_Grotesk,sans-serif]">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full max-w-sm px-4 py-2 min-h-[44px] bg-[#111] text-white border-2 border-black focus:border-[#1acb5b] outline-none text-sm placeholder:text-gray-500"
        />
      </div>

      {/* ─── MOBILE: Cards ─────────────────────────── */}
      <div className="block md:hidden space-y-3">
        {table.getRowModel().rows.length === 0 ? (
          <div className="border-2 border-black bg-[#111] p-6 text-center text-gray-400 text-sm">
            Sin resultados.
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="border-2 border-black bg-[#111] p-4 space-y-2"
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="flex justify-between gap-2 text-sm">
                  <span className="font-bold text-[#1acb5b] uppercase text-xs tracking-wide shrink-0">
                    {String(cell.column.columnDef.header ?? cell.column.id)}
                  </span>
                  <span className="text-white text-right">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ─── TABLET+: Table ─────────────────────────── */}
      <div className="hidden md:block overflow-x-auto border-2 border-black">
        <table className="w-full text-sm">
          <thead className="bg-black text-[#1acb5b]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b-2 border-[#1acb5b]">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left font-black uppercase tracking-widest text-xs whitespace-nowrap',
                      header.column.getCanSort() && 'cursor-pointer hover:text-white select-none',
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-gray-500">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp size={12} />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown size={12} />
                          ) : (
                            <ChevronsUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  Sin resultados.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-b border-gray-800 transition-colors',
                    i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0f0f0f]',
                    'hover:bg-[#1acb5b11]',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-white align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-gray-400">
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()} · {table.getFilteredRowModel().rows.length} resultados
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 min-h-[44px] border-2 border-black bg-[#111] text-white font-bold uppercase disabled:opacity-40 hover:bg-[#1acb5b] hover:text-black transition-colors"
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 min-h-[44px] border-2 border-black bg-[#111] text-white font-bold uppercase disabled:opacity-40 hover:bg-[#1acb5b] hover:text-black transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  )
}
