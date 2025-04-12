import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import { useGetAllPosts } from '@/lib/react-query/queriesAndMutations';
import SvgComponent from '@/utils/SvgComponent';
import { useNavigate, useParams } from 'react-router-dom';
import PostDataTable from '@/components/datatable/PostDataTable';
import Loader from '@/components/shared/Loader';
import { Search } from 'lucide-react';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const PageComponent = () => {
    const post_type = 'page';
    const { domain } = useParams();
    const { setCurrentDomain, currentDomain } = useUserContext(); // @ts-ignore
    setCurrentDomain(domain);
    const defaultPostType = post_type;
    const [render, setRerender] = useState(true);
    const [posts, setPosts] = useState([]);
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput, 500);
    const [filter, setFilter] = useState('All');
    const [publishedCount, setPublishedCount] = useState(0);
    const [draftCount, setDraftCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [canEdit, setCanEdit] = useState(false);
    const [loadMore, setLoadMore] = useState(false);
    const [changeFilterCount, setChangeFilterCount] = useState(false);
    const [deletedPostFilter, setDeletedPostFilter] = useState('All');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
   console.log(changeFilterCount, deletedPostFilter, filter, publishedCount, draftCount, totalCount, canEdit)
    const initialPaginationState = {
        page: 1,
        limit: import.meta.env.VITE_POST_PAGINATION,
        skip: 0,
        totalPages: 1,
        totalItems: 0,
    };
    
    const [pagination, setPagination] = useState(initialPaginationState);
    
    const { mutateAsync: getAllPosts, isPending: isLoading } = useGetAllPosts();

    const fetchPosts = async (resetPage = false) => {
        try {
            const currentPage = resetPage ? 1 : pagination.page;
            const postResponse = await getAllPosts({
                page: currentPage,
                limit: pagination.limit,
                post_type: defaultPostType,
                search: debouncedSearchInput,
                filter: filter,
            });

            if (postResponse?.data?.posts) {
                if (loadMore) {  // @ts-ignore
                    setPosts(prevPosts => [...prevPosts, ...postResponse.data.posts]);
                    setLoadMore(false);
                } else {
                    setPosts(postResponse.data.posts);
                }
            }

            setCanEdit(postResponse?.data?.can_edit);
            setPublishedCount(postResponse?.data?.published_posts);
            setDraftCount(postResponse?.data?.draft_posts);
            setTotalCount(postResponse?.data?.totalCount);
            
            if (postResponse?.data?.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...postResponse.data.pagination,
                    page: currentPage
                }));
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Fetch Failed',
                description: 'Something went wrong',
                duration: import.meta.env.VITE_TOAST_DURATION,
                icon: <SvgComponent className="" svgName="close_toaster" />,
            });
        }
    };

    // Reset page when search or filter changes, but maintain load more state
    useEffect(() => {
        if (!loadMore) {
            setPagination(prev => ({ ...prev, page: 1 }));
            fetchPosts(true);
        }
    }, [debouncedSearchInput, filter]);

    // Fetch data when page changes
    useEffect(() => {
        if (pagination.page > 1) {
            fetchPosts();
        }
    }, [pagination.page]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleFilterChange = (filterValue: string) => {
        setFilter(filterValue);
        setPagination(initialPaginationState);
    };

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages) {
            setIsLoadingMore(true);
            setLoadMore(true);
            setPagination(prev => ({
                ...prev,
                page: prev.page + 1
            }));
            setIsLoadingMore(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Section */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium text-gray-900">Pages</h1>
                    {canEdit && (
                        <Button 
                            className="shad-button_primary h-8 px-3 text-sm" 
                            size="sm" 
                            onClick={() => navigate(`/${btoa(currentDomain)}/post/${post_type}`)}
                        >
                            <SvgComponent className="w-3.5 mr-1.5" svgName='plus-circle' /> 
                            Add Page
                        </Button>
                    )}
                </div>
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                    <input
                        onChange={handleInputChange}
                        value={searchInput}
                        className="w-full h-8 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        type="text"
                        placeholder="Search pages..."
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-4 px-5 py-3 bg-white border-b border-gray-200">
                <button 
                    className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                        filter === 'All' 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('All')}
                >
                    All ({totalCount})
                </button>
                <button 
                    className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                        filter === 'draft' 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('draft')}
                >
                    Drafts ({draftCount})
                </button>
                <button 
                    className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                        filter === 'published' 
                            ? 'bg-primary-50 text-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => handleFilterChange('published')}
                >
                    Published ({publishedCount})
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                <PostDataTable 
                    posts={posts} 
                    post_type={defaultPostType} 
                    setPosts={setPosts} 
                    isPostLoading={isLoading && pagination.page === 1} 
                    setRerender={setRerender} 
                    render={render} 
                    canEdit={canEdit} 
                    setChangeFilterCount={setChangeFilterCount} 
                    setDeletedPostFilter={setDeletedPostFilter} 
                />

                {/* Load More Button */}
                {pagination.totalItems > posts.length && (
                    <div className="flex justify-center pt-6">
                        <button
                            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleLoadMore}
                            disabled={isLoading || isLoadingMore}
                        >
                            {isLoadingMore ? <Loader /> : 'Load more'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageComponent;
