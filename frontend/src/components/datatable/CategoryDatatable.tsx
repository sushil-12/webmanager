import { Tag } from 'primereact/tag';
import { CategoryKeyModel } from '@/lib/types';
import { Button } from '../ui/button';
import { Edit2, PlusCircleIcon } from 'lucide-react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { useCategory } from '@/plugin/post/category/CategoryContext';
import { useGetCategorybyID } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { Skeleton } from 'primereact/skeleton';
import SkeletonTable from '../skeletons/SkeletonTable';

interface CategoryDataTableScema {
    isCategoryLoading: boolean,
}
const CategoryDataTable: React.FC<CategoryDataTableScema> = ({ isCategoryLoading }) => {
    const { categories, selectedCategory, setSelectedCategory } = useCategory();
    const { mutateAsync: getCategoryById, isPending: isLoading } = useGetCategorybyID();
    console.log(isLoading);
    
    useEffect(() => { console.log(selectedCategory) }, [selectedCategory])
    const titleTemplate = (rowData: CategoryKeyModel) => {
        return <>{!isCategoryLoading ? rowData.label : <Skeleton width='100' height='1.5rem' />}</>;
    };

    const slugBodyTemplate = (rowData: CategoryKeyModel) => {
        return <Tag value={rowData.slug} className='px-4 py-2'></Tag>;
    };

    const handleEditData = async (category_id: any) => {
        try {
            const editData = await getCategoryById(category_id);
            setSelectedCategory(editData.data);
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    const header = <div className="text-xl font-bold flex justify-between">Category List <Button onClick={() => setSelectedCategory(null)} className='p-2 bg-primary-500 text-white gap-3'><PlusCircleIcon /> Add New</Button></div>;


    const actionTemplate = (rowData: CategoryKeyModel) => {
        return (
            <div className='flex'>
                <Button className="rounded-full bg-none p-1 text-dark shadow-sm hover:text-primary-500  " size="sm" onClick={() => handleEditData(rowData.key)} >
                    <Edit2 className='h-5' />
                </Button>
            </div>
        )
    }

    return (
        <div className="card bg-slate-100 shadow-lg rounded-md">
            {isCategoryLoading ? (<SkeletonTable rowCount={5} />) : (
                <TreeTable
                    metaKeySelection={false}
                    header={header}
                    value={categories}
                    loading={isCategoryLoading}
                    paginator={categories && categories.length > 2} rows={2} rowsPerPageOptions={[5, 10, 15, 20]}
                    tableStyle={{ minWidth: '40rem' }}
                    className="w-full p-8"
                >
                    <Column expander field="label" header="Title" body={titleTemplate} className=" font-semibold"><Skeleton width="100%" height="1.5rem" /></Column>
                    <Column field="slug" header="Slug" className="font-semibold" body={slugBodyTemplate}><Skeleton width="100%" height="1.5rem" /></Column>
                    <Column field="categoryId" header="Actions" body={actionTemplate} className=""><Skeleton width="100%" height="1.5rem" /> </Column>
                </TreeTable >)}
        </div>
    );
};

export default CategoryDataTable;
