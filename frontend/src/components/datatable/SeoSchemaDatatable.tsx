import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';
import SkeletonTable from '../skeletons/SkeletonTable';
import { DataTable } from 'primereact/datatable';
import { Button } from '../ui/button';
import { Dialog } from 'primereact/dialog';
import { useUserContext } from '@/context/AuthProvider';
import { useParams } from 'react-router-dom';
import SvgComponent from '@/utils/SvgComponent';
import { formatOption, formatString } from '@/lib/utils';
import { useListSeoFilePaths } from '@/lib/react-query/queriesAndMutations';

const SeoSchemaDatatable = () => {
    const { domain } = useParams();
    const { currentDomain, setCurrentDomain } = useUserContext();
    // @ts-ignore
    setCurrentDomain(domain)
    const [seoFilePath, setSeoFilePath] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const { mutateAsync: getSeoFilePath, isPending: isFilePathLoading } = useListSeoFilePaths();

    async function fetchCustomFields() {
        const seoFilePath = await getSeoFilePath();
        setSeoFilePath(seoFilePath.data.files);
    }

    useEffect(() => { fetchCustomFields(); }, []);

    const titleTemplate = (rowData: any) => {
        return <h6 className='text-sm'>{!isFilePathLoading ? formatOption(rowData) : <Skeleton width='100' height='1.5rem' />}</h6>;
    };

    const handleEditData = (custom_field_id: any) => {
        setAlertMessage(`
            <div>
                <p><strong>Edit Schema:</strong></p>
                <p>Go to the backend folder:</p>
                <p><i class="pi pi-folder-open"></i> <strong>${currentDomain}</strong> <i class="pi pi-file"></i> <strong>${custom_field_id}</strong></p>
            </div>
        `);
        setAlertVisible(true);
    };

    const handleDeleteData = (custom_field_id: any) => {
        setAlertMessage(`
            <div>
                <p><strong>Delete Schema:</strong></p>
                <p>To delete, go to the backend folder:</p>
                <p><i class="pi pi-folder-open"></i> <strong>${currentDomain}</strong> <i class="pi pi-file"></i> <strong>${custom_field_id}</strong> and remove the file.</p>
            </div>
        `);
        setAlertVisible(true);
    };

    const handleAddNew = () => {
        setAlertMessage(`
            <div>
                <p><strong>Add New Schema:</strong></p>
                <p>To create a new file, navigate to the backend folder:</p>
                <p><i class="pi pi-folder-open"></i> <strong>${currentDomain}</strong></p>
                <p>Then create a new file: <i class="pi pi-file"></i> <strong>new-file.js</strong></p>
            </div>
        `);
        setAlertVisible(true);
    };


    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex gap-3'>
                <button className="rounded-md border border-primary-500 text-primary-500 py-2 px-4" onClick={() => handleEditData(rowData)}>
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='edit' />
                        <span className='text-xs'>Edit</span>
                    </div>
                </button>
                <button className="border border-primary-500 rounded-md text-error  px-4" onClick={() => handleDeleteData(rowData)}>
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='delete' />
                        <span className='text-xs'>Delete</span>
                    </div>
                </button>
            </div>
        );
    };
    const headerTemplate = () => {
        return (
            <div className={`flex items-center justify-between mb-6`}>
                <h1 className='page-innertitles'> Manage Seo Schema</h1>
                <button onClick={() => { setAlertVisible(false); }}><SvgComponent className="cursor-pointer float-right" svgName="close" /></button>
            </div>
        );
    };
    return (
        <>
            <div className="main-container w-full overflow-hidden">
                <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] pl-5 pr-[31px]">
                    <div className="flex gap-[15px] justify-between w-full">
                        <h3 className="page-titles">Manage Seo Schema <small className='text-xs'>{domain && formatString(atob(domain))}</small></h3>
                        <Button className="shad-button_primary place-self-end" size="sm" onClick={handleAddNew}>
                            <SvgComponent className='' svgName='plus-circle' /> Add new
                        </Button>
                    </div>
                </div>

                <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden">

                    {isFilePathLoading ? (<SkeletonTable rowCount={5} />) : (
                        <DataTable
                            metaKeySelection={false}
                            value={seoFilePath}
                            tableStyle={{ minWidth: '40rem' }}
                            className="w-full p-8"
                        >
                            <Column expander field="label" header="Title" body={titleTemplate} className="font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                            <Column expander field="post_type" header="Post Type" body={"Seo Schema"} className="font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                            <Column field="customFieldsId" header="Actions" body={actionTemplate} className=""><Skeleton width="100%" height="1.5rem" /></Column>
                        </DataTable>
                    )}
                </div>

                {/* Alert Modal */}
                <Dialog visible={alertVisible} onHide={() => setAlertVisible(false)} draggable={false} className="form-dialogs min-w-[450px]" header={headerTemplate} closable={false} >
                    <div dangerouslySetInnerHTML={{ __html: alertMessage }} />
                </Dialog>
            </div>
        </>
    );
};

export default SeoSchemaDatatable;