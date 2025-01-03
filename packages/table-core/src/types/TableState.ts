import type { TableState_ColumnFiltering } from '../features/column-filtering/columnFilteringFeature.types'
import type { TableState_ColumnGrouping } from '../features/column-grouping/columnGroupingFeature.types'
import type { TableState_ColumnOrdering } from '../features/column-ordering/columnOrderingFeature.types'
import type { TableState_ColumnPinning } from '../features/column-pinning/columnPinningFeature.types'
import type { TableState_ColumnResizing } from '../features/column-resizing/columnResizingFeature.types'
import type { TableState_ColumnSizing } from '../features/column-sizing/columnSizingFeature.types'
import type { TableState_ColumnVisibility } from '../features/column-visibility/columnVisibilityFeature.types'
import type { TableState_GlobalFiltering } from '../features/global-filtering/globalFilteringFeature.types'
import type { TableState_RowExpanding } from '../features/row-expanding/rowExpandingFeature.types'
import type { TableState_RowPagination } from '../features/row-pagination/rowPaginationFeature.types'
import type { TableState_RowPinning } from '../features/row-pinning/rowPinningFeature.types'
import type { TableState_RowSelection } from '../features/row-selection/rowSelectionFeature.types'
import type { TableState_RowSorting } from '../features/row-sorting/rowSortingFeature.types'
import type { ExtractFeatureTypes, TableFeatures } from './TableFeatures'

/**
 * Use this interface as a target for declaration merging to add your own state properties.
 * Note: This will affect the types of all tables in your project.
 */
export interface TableState_Plugins<TFeatures extends TableFeatures> {}

export type TableState<TFeatures extends TableFeatures> = ExtractFeatureTypes<
  TFeatures,
  'TableState'
> &
  TableState_Plugins<TFeatures>

export type TableState_All = Partial<
  TableState_ColumnFiltering &
    TableState_ColumnGrouping &
    TableState_ColumnOrdering &
    TableState_ColumnPinning &
    TableState_ColumnResizing &
    TableState_ColumnSizing &
    TableState_ColumnVisibility &
    TableState_GlobalFiltering &
    TableState_RowExpanding &
    TableState_RowPagination &
    TableState_RowPinning &
    TableState_RowSelection &
    TableState_RowSorting
>
