import React, { useState } from 'react';
import { Icon } from './Icons';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';
import { Menu, MenuItem } from './Menu';

const cn = (...classes: (string | number | bigint | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- DataTableCell ---
export interface DataTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}
export const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(({ children, className, numeric = false, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'h-[52px] px-4 body-medium text-on-surface',
      numeric ? 'text-right' : 'text-left',
      className
    )}
    {...props}
  >
    {children}
  </td>
));
DataTableCell.displayName = 'DataTableCell';

// --- DataTableRow ---
export interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}
export const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(({ children, className, selected = false, ...props }, ref) => (
  <tr
    ref={ref}
    aria-selected={selected}
    className={cn(
      'transition-colors border-b border-outline-variant',
      selected ? 'bg-primary-container/30' : 'hover:bg-on-surface/8',
      className
    )}
    {...props}
  >
    {children}
  </tr>
));
DataTableRow.displayName = 'DataTableRow';

// --- DataTableHeaderCell ---
export interface DataTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
  sortDirection?: 'asc' | 'desc';
  onSortClick?: () => void;
}
export const DataTableHeaderCell = React.forwardRef<HTMLTableCellElement, DataTableHeaderCellProps>(({ children, className, numeric = false, sortDirection, onSortClick, ...props }, ref) => {
  const sortIcon = sortDirection === 'asc' ? 'arrow_upward' : sortDirection === 'desc' ? 'arrow_downward' : null;

  const content = (
    <div className={cn('flex items-center gap-1', numeric ? 'justify-end' : 'justify-start')}>
      {children}
      {sortIcon && <Icon className="text-[18px]">{sortIcon}</Icon>}
    </div>
  );

  return (
    <th
      ref={ref}
      aria-sort={sortDirection ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn(
        'h-[56px] px-4 label-large text-on-surface-variant',
        numeric ? 'text-right' : 'text-left',
        onSortClick && 'cursor-pointer hover:text-on-surface',
        className
      )}
      onClick={onSortClick}
      {...props}
    >
      {content}
    </th>
  );
});
DataTableHeaderCell.displayName = 'DataTableHeaderCell';

// --- DataTableSelectAllCell ---
export interface DataTableSelectAllCellProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}
export const DataTableSelectAllCell: React.FC<DataTableSelectAllCellProps> = ({ checked, indeterminate, onChange, className }) => (
    <th className={cn("h-[56px] w-[72px] p-4", className)}>
        <Checkbox checked={checked} indeterminate={indeterminate} onChange={onChange} aria-label="Select all rows" />
    </th>
);
DataTableSelectAllCell.displayName = 'DataTableSelectAllCell';

// --- DataTableRowSelectorCell ---
export interface DataTableRowSelectorCellProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}
export const DataTableRowSelectorCell: React.FC<DataTableRowSelectorCellProps> = ({ checked, onChange, className }) => (
    <DataTableCell className={cn("w-[72px] p-4", className)}>
        <Checkbox checked={checked} onChange={onChange} aria-label="Select row" />
    </DataTableCell>
);
DataTableRowSelectorCell.displayName = 'DataTableRowSelectorCell';


// --- DataTable ---
export const DataTable = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('w-full border border-outline-variant rounded-[4px] overflow-hidden', className)} {...props}>
    <div className="overflow-x-auto scroll-thin">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  </div>
));
DataTable.displayName = 'DataTable';


// --- DataTablePagination ---
export interface DataTablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}
export const DataTablePagination = React.forwardRef<HTMLDivElement, DataTablePaginationProps>(({
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
  className,
  ...props
}, ref) => {
  const startRow = totalRows > 0 ? page * rowsPerPage + 1 : 0;
  const endRow = Math.min((page + 1) * rowsPerPage, totalRows);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleRowsPerPageSelect = (rows: number) => {
    onRowsPerPageChange(rows);
    onPageChange(0); // Reset to first page
    setMenuAnchor(null);
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'h-[52px] flex items-center justify-end px-4 gap-x-8 text-on-surface-variant body-medium border-t border-outline-variant',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-x-2">
        <span>Rows per page:</span>
        <div className="relative">
          <button onClick={(e) => setMenuAnchor(e.currentTarget)} className="flex items-center gap-1 p-2 rounded-md hover:bg-on-surface/8">
            <span>{rowsPerPage}</span>
            <Icon className="text-[20px]">arrow_drop_down</Icon>
          </button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            {rowsPerPageOptions.map(option => (
                <MenuItem key={option} headline={String(option)} onClick={() => handleRowsPerPageSelect(option)} />
            ))}
          </Menu>
        </div>
      </div>
      <span>{startRow}–{endRow} of {totalRows}</span>
      <div className="flex items-center">
        <IconButton onClick={() => onPageChange(page - 1)} disabled={page === 0} aria-label="Previous page">
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} aria-label="Next page">
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
    </div>
  );
});
DataTablePagination.displayName = 'DataTablePagination';
