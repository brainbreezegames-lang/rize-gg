"use client";

import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  emptyMessage = "No data",
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-[var(--radius-md)] border border-border-default",
        className
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-default">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-text-secondary",
                  col.sortable && "cursor-pointer select-none hover:text-text-primary"
                )}
                style={col.width ? { width: col.width } : undefined}
                onClick={col.sortable ? () => onSort?.(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-text-tertiary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row, i)}
                className={cn(
                  "border-b border-border-subtle last:border-b-0",
                  "hover:bg-bg-surface-hover transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-text-primary"
                  >
                    {col.render
                      ? col.render(row, i)
                      : (row[col.key] as ReactNode) ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
