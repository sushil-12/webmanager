import {  useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import { useGetAllCategories } from '@/lib/react-query/queriesAndMutations';
import CategoryDataTable from '@/components/datatable/CategoryDatatable';
import Header from '@/components/ui/header';
import { Card } from 'primereact/card';
import { CategoryProvider } from './CategoryContext';
import { useParams } from 'react-router-dom';
import { useUserContext } from '@/context/AuthProvider';

const Category = () => {
  const { post_type, domain } = useParams();
  const {setCurrentDomain} = useUserContext();
  //@ts-ignore
  setCurrentDomain(domain)
  const { mutateAsync: getAllCategories, isPending: isLoading } = useGetAllCategories();
  const [categories, setCategories] = useState(null);
  const [key, setKey] = useState(0); // Add key state
  console.log(categories)
  useEffect(() => {
    console.log(post_type);

    async function fetchCategories() {
      if (post_type) {
        const categories = await getAllCategories(post_type);
        setCategories(categories.data.categories);
      }
    }

    fetchCategories();

    // Increment key when post_type changes
    setKey((prevKey) => prevKey + 1);
  }, [post_type]);

  return (
    <div key={key} className='common-container'> {/* Use key on the parent div */}
      <CategoryProvider>
        <Header title='Manage Categories' />
        <div className="flex p-0 ">
          <Card className="form_data " style={{ width: "34%" }}>
            <CategoryForm post_type={post_type} />
          </Card>
          <div className="data_table p-4" style={{ width: "66%" }}>
            <CategoryDataTable isCategoryLoading={isLoading} />  
          </div>
        </div>
      </CategoryProvider>
    </div>
  );
}

export default Category;
