import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { useNavigate } from 'react-router-dom';

import { ConfirmDialog,  } from 'primereact/confirmdialog';
import SvgComponent from '@/utils/SvgComponent';

interface PluginDataTable {
    plugins: any;
    domain: string,
}

const PluginDataTable: React.FC<PluginDataTable> = ({ plugins, domain }) => {

    const navigate = useNavigate();

    const titleTemplate = (rowData: any) => {
        return (
            <>
                <h6 className='text-sm'>
                    {rowData.title}
                </h6>
            </>
        );
    };
    const descTemplate = (rowData: any) => {
        return (
            <>
                <h6 className='text-sm'>
                    {rowData?.description}
                </h6>
            </>
        );
    };
    const actionTemplate = (rowData:any) => {
        return (
            <>
                <button className="bg-primary-500 rounded-md text-white py-2 px-4" onClick={() => navigate(`/${domain}/${rowData?.route}`)}>
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='settings' />
                       <span className='text-xs'> Settings</span>
                    </div>
                </button>
            </>
        );
    };



    return (
        <div className="rounded-md">
            <ConfirmDialog />
            <>
                <DataTable
                    value={plugins}
                    paginator={plugins.length > 10} rows={10} rowsPerPageOptions={[5, 10, 15, 20]}
                    tableStyle={{ minWidth: '60rem' }}
                    frozenRow={true}
                    tableClassName='table-fixed rounded '
                    // @ts-ignore
                    rowClassName={`odd:bg-light-gray cursor-pointer`}
                    pt={{
                        headerRow: { className: 'hidden' }
                    }}
                    header={false}
                    className="w-full post_data_table table-fixed"
                >

                    <Column expander={true} field="title" header="Title" body={titleTemplate} className="text-sm font-medium"></Column>
                    <Column expander={true} field="categories" header="Description" body={descTemplate} className="text-left text-sm font-medium"></Column>
                    <Column expander={true} field="id" header="Actions" body={actionTemplate} className="text-right"></Column>
                </DataTable>
            </>
        </div >
    );
};

export default PluginDataTable;
