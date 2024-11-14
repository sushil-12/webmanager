import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import { useGetAllPosts } from '@/lib/react-query/queriesAndMutations';
import SvgComponent from '@/utils/SvgComponent';
import PostDataTable from '@/components/datatable/PostDataTable';
import Loader from '@/components/shared/Loader';

const PostComponent = () => {
  const { post_type, domain } = useParams();
  const { setCurrentDomain, currentDomain } = useUserContext();
  // @ts-ignore
  setCurrentDomain(domain);
  const defaultPostType = post_type || 'default';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [posts, setPosts] = useState([]);
  const [render, setRerender] = useState(true);
  const [filter, setFilter] = useState('All');
  const [publishedCount, setpublishedCount] = useState(0);
  const [draftCount, setdraftCount] = useState(0);
  const [totalCount, settotalCount] = useState(0);
  const [canEdit, setCanEdit] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [changeFilterCount, setChangeFilterCount] = useState(false);
  const [deletedPostFilter, setDeletedPostFilter] = useState('All');
  const [isLoadingMore, setIsLoadingMore]= useState(false);
  // @ts-ignore
  const handleFilterChange = (filterValue) => {
    setFilter(filterValue);
  };
  const initialPaginationState = {
    page: 1,
    limit: import.meta.env.VITE_POST_PAGINATION,
    skip: 0,
    totalPages: 1,
    totalItems: 0,
  };
  
  const [pagination, setPagination] = useState(initialPaginationState);
  
  const resetPagination = () => {
    setPagination(initialPaginationState);
  };

  useEffect(()=>{
   if(posts.length > 0){
    console.log(deletedPostFilter, "DELETED POST FILTER");
    settotalCount(totalCount - 1)
    console.log(filter);
    if(filter !== 'All'){
      console.log(filter);
      filter === 'draft'  || deletedPostFilter === 'draft'? setdraftCount(draftCount - 1)  : setpublishedCount(publishedCount- 1)
    }
    else{
      deletedPostFilter === 'draft'? setdraftCount(draftCount - 1)  : setpublishedCount(publishedCount- 1)
    }
   }
  }, [changeFilterCount])
   
  const { mutateAsync: getAllPosts, isPending: isLoading } = useGetAllPosts();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postResponse = await getAllPosts({
          page: pagination.page,
          limit: pagination.limit,
          post_type: defaultPostType,
          search: searchInput,
          filter: filter,
        });
        console.log(postResponse?.data?.can_edit, "CAN EDIT")
         
         if(loadMore){// @ts-ignore
          setPosts((prevPosts) => [...prevPosts,...postResponse?.data?.posts ]);
          setLoadMore(false);
         }else{
          setPosts(postResponse?.data?.posts);
         }
        
        setpublishedCount(postResponse?.data?.published_posts)
        setCanEdit(postResponse?.data?.can_edit)
        setdraftCount(postResponse?.data?.draft_posts)
        settotalCount(postResponse?.data?.totalCount)
        setPagination(postResponse?.data?.pagination || {});
      } catch (error) {
        toast({ variant: "destructive", title: "Unable to fetch Posts", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
      }
    };

    // Set a timer to delay fetching posts
    const timer = setTimeout(fetchPosts, 500);
    console.log(render);

    // Cleanup the timer on each key stroke
    return () => clearTimeout(timer);
  }, [getAllPosts, setPosts, searchInput, filter, post_type, render, pagination.page]);
  // @ts-ignore
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    // @ts-ignore
    // Trigger search when user explicitly clicks search button
    fetchPosts();
  };
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    if (pagination.page < pagination.totalPages) {
      setLoadMore(true);
      setPagination((prevPagination) => ({
        ...prevPagination,
        page: prevPagination.page + 1,
      }));
      setIsLoadingMore(false);
    }
  };
  return (
    <div className="main-container w-full overflow-hidden">
      <div className="w-full flex items-center justify-between h-[10vh]  min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <div className="flex gap-[15px]">
          <h3 className="page-titles capitalize">{defaultPostType + 's'}</h3>
          {canEdit && (
            <Button className="shad-button_primary place-self-end" size="sm" onClick={() => navigate(`/${btoa(currentDomain)}/post/${defaultPostType}`)}>
              <SvgComponent className='' svgName='plus-circle' /> Add {defaultPostType}
            </Button>
          )}

        </div>
        <div className="flex justify-start items-center py-7 relative">
          <input
            onChange={handleInputChange}
            value={searchInput}
            className="leading-none text-left text-gray-600 px-4 py-3 border rounded border-gray-300 outline-none w-[239px] h-10 text-[14px] font-medium hover:rounded-[50px]"
            type="text"
            placeholder="Search"
          />
          <button className="absolute right-3 z-10 cursor-pointer" onClick={handleSearch}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z" fill="#4F5B67" />
            </svg>
          </button>
        </div>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden pl-5 px-[31px] py-5">
        <div className="flex mb-4 mt-[-2px]">
          <button className={`mr-2 ${filter === 'All' && 'font-bold pointer-events-none'}`} onClick={() => {handleFilterChange('All'); resetPagination();}}>All {`(${totalCount})`}</button>
          <button className={`mr-2 ${filter === 'draft' && 'font-bold pointer-events-none'}`} onClick={() => {handleFilterChange('draft'); resetPagination()} }>Drafts{`(${draftCount})`}</button>
          <button className={`mr-2 ${filter === 'published' && 'font-bold pointer-events-none'}`} onClick={() => {handleFilterChange('published'); resetPagination()}}>Published{`(${publishedCount})`}</button>
        </div>
        <PostDataTable posts={posts} post_type={defaultPostType} isPostLoading={isLoading && pagination.page == 1 } setRerender={setRerender} render={render} canEdit={canEdit} setPosts= {setPosts} setChangeFilterCount= {setChangeFilterCount} setDeletedPostFilter = {setDeletedPostFilter} />
        <div className="card text-center mb-14 mt-8">
          {pagination.totalItems > posts.length && searchInput == '' && (
            <button
              className="load-more-button"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading || isLoadingMore ? <Loader /> : 'Load more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComponent;
