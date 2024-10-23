import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface SkeletonTableProps {
    
    rowCount: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rowCount }) => {
    const items: any = Array.from({ length: rowCount }, ( i) => i);

    const renderSkeleton = () => <Skeleton width="100%" height="1.5rem" />;
    
    const columns = [
        { field: 'code', width: '33%' },
        { field: 'name', width: '33%' },
        { field: 'category', width: '33%' },
    ];
    return (
        <div className="card">
            <DataTable value={items} className="p-datatable-striped" >
                {columns.map((column, index) => (
                    <Column key={index} field={column.field} style={{ width: column.width }} body={renderSkeleton} />
                ))}
            </DataTable>
        </div>
    );
};

export default SkeletonTable;