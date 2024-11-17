import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';
import SkeletonTable from '../skeletons/SkeletonTable';
import { DataTable } from 'primereact/datatable';
import { Button } from '../ui/button';
import { Dialog } from 'primereact/dialog';
import CustomFieldForm from '@/plugin/post/_custom_form/CustomFieldForm';
import { useUserContext } from '@/context/AuthProvider';
import { useParams } from 'react-router-dom';
import SvgComponent from '@/utils/SvgComponent';
import { formatString } from '@/lib/utils';
import { getAllCustomFields } from '@/lib/appwrite/api';
import { useDeleteCustomFieldByID } from '@/lib/react-query/queriesAndMutations';
import { useToast } from '../ui/use-toast';
import { confirmDialog } from 'primereact/confirmdialog';

const CustomFieldDatatable = () => {
    const { domain } = useParams();
    const { toast } = useToast();
    const { setCurrentDomain } = useUserContext();
    // @ts-ignore
    setCurrentDomain(domain)
    const [visible, setVisible] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [selectedCustomField, setSelectedCustomField] = useState({});
    const [isCustomFieldLoading, setisCustomFieldLoading] = useState(false);
    const { mutateAsync: deletCustomFieldByID, isPending: isDeleting } = useDeleteCustomFieldByID();


    async function acceptDeleteCustomField(customFields_id: string) {
        const deleteWebsite = await deletCustomFieldByID(customFields_id);
        if (deleteWebsite?.status == 'success') {
            // Re-fetch the custom fields to update the table
            await fetchCustomFields();
            return toast({ variant: "default", description: deleteWebsite.data.message, duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" /> })
        }

    }
    const reject = () => {
        console.log("CACNELLEED");
    }
    const confirmDeleteWebsite = (custom_field_id: string) => {
        console.log(custom_field_id)
        event?.preventDefault();
        confirmDialog({
            header: 'Are you sure you want to delete field?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => acceptDeleteCustomField(custom_field_id),
            acceptLabel: 'Yes, remove it',
            rejectLabel: 'Cancel',
            reject: reject,
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
        });
    }

    async function fetchCustomFields() {
        // @ts-ignore
        setisCustomFieldLoading(true)
        const customFieldsResponse = await getAllCustomFields('all', "posts");
        setisCustomFieldLoading(false)
        console.log(customFieldsResponse?.data)
        setCustomFields(customFieldsResponse?.data?.customField)
    }

    useEffect(() => { fetchCustomFields() }, [visible])
    const titleTemplate = (rowData: any) => {
        return <h6 className='text-sm'>{!isCustomFieldLoading ? rowData.title : <Skeleton width='100' height='1.5rem' />}</h6>;
    };

    const postTypeTemplate = (rowData: any) => {
        return <p className='text-sm font-semibold cap'>{rowData.item_type === 'page' ? rowData.postTitle : rowData.post_type}</p>;
    };
    const itemTypeTemplate = (rowData: any) => {
        return <h6 className='text-sm font-semibold capitalize'>{formatString(rowData.item_type)} </h6>;
    };

    const handleEditData = async (custom_field_id: any) => {
        try {
            setSelectedCustomField(custom_field_id);
            setVisible(true)
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };
    const actionTemplate = (rowData: any) => {
        return (
            <div className='flex gap-3'>
                <button className="rounded-md border border-primary-500 text-primary-500 py-2 px-4" onClick={() => handleEditData(rowData)}>
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='edit' />
                        <span className='text-xs'> Edit</span>
                    </div>
                </button>
                <button className="border border-primary-500 rounded-md text-error  px-4" onClick={() => confirmDeleteWebsite(rowData._id)} >
                    <div className="flex items-center gap-2">
                        <SvgComponent className='' svgName='delete' />
                        <span className='text-xs'> {isDeleting ? 'Deleting' : 'Delete'}</span>
                    </div>
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="main-container w-full overflow-hidden ">
                <div className="w-full flex items-center justify-between h-[10vh] header-bar  min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
                    <div className="flex gap-[15px] justify-between w-full">
                        <h3 className="page-titles ">Manage Fields <small className='text-xs'>{domain && formatString(atob(domain))}</small></h3>
                        <Button className="shad-button_primary place-self-end" size="sm" onClick={() => { setVisible(true); setSelectedCustomField({}); }}>
                            <SvgComponent className='' svgName='plus-circle' /> Add new
                        </Button>
                    </div>

                </div>
                <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden">
                    <Dialog draggable={false} header="Add/Edit Custom Field" visible={visible} style={{ width: '70vw' }} onHide={() => setVisible(false)}>
                        <CustomFieldForm setVisible={setVisible} selectedCustomField={selectedCustomField} />

                    </Dialog>
                    {isCustomFieldLoading ? (<SkeletonTable rowCount={5} />) : (
                        <DataTable
                            metaKeySelection={false}
                            value={customFields}
                            tableStyle={{ minWidth: '40rem' }}
                            className="w-full p-8"
                        >
                            <Column expander field="label" header="Template" body={titleTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                            <Column expander field="item_type" header="Item Type" body={itemTypeTemplate} className=""><Skeleton width="100%" height="1.5rem" /></Column>
                            <Column expander field="post_type" header="Title" body={postTypeTemplate} className=""><Skeleton width="100%" height="1.5rem" /></Column>
                            <Column field="customFieldsId" header="Actions" body={actionTemplate} className=""><Skeleton width="100%" height="1.5rem" /> </Column>
                        </DataTable >)}

                </div>

            </div>
        </>
    );
};

export default CustomFieldDatatable;