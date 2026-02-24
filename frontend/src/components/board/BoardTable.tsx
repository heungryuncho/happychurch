import { format } from 'date-fns';

export interface Column<T> {
    key: keyof T | 'actions';
    label: string;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

interface BoardTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    basePath: string;
}

export default function BoardTable<T extends { id: number; created_at: string }>({
    data,
    columns,
    onRowClick,
}: BoardTableProps<T>) {

    return (
        <div className="overflow-x-auto glass-card rounded-2xl">
            <table className="min-w-full divide-y divide-gray-100/80">
                <thead>
                    <tr className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                        {columns.map((col, index) => (
                            <th
                                key={String(col.key) + index}
                                scope="col"
                                className={`px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.width || ''}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-16 text-center text-gray-400">
                                <div className="space-y-2">
                                    <p className="text-lg">📭</p>
                                    <p className="text-sm font-medium">등록된 게시글이 없습니다.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-[var(--primary)]/[0.03] transition-all duration-200 cursor-pointer group"
                                onClick={() => onRowClick && onRowClick(item)}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={String(col.key) + colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {col.render ? col.render(item) : (
                                            col.key === 'created_at'
                                                ? <span className="text-gray-400">{format(new Date(item.created_at), 'yyyy-MM-dd')}</span>
                                                : col.key === 'title'
                                                    ? <span className="font-medium group-hover:text-[var(--primary)] transition-colors duration-200">{String(item[col.key as keyof T] || '')}</span>
                                                    : <span className="text-gray-500">{String(item[col.key as keyof T] || '')}</span>
                                        )}
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
