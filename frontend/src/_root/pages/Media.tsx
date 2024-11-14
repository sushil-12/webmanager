import { useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';
import { useGetAllMediaFiles } from '@/lib/react-query/queriesAndMutations';
import MediaGrid from '@/components/shared/MediaGrid';
import { useMedia } from '@/context/MediaProvider';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthProvider';
import MediaGridSkeletonDemo from '@/components/skeletons/MediaGridSkeletonDemo';
import { useParams } from 'react-router-dom';
import SvgComponent from '@/utils/SvgComponent';
import Loader from '@/components/shared/Loader';

// Custom hook for debouncing
//@ts-ignore
function useDebounce(value, delay) {
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

export default function Media() {
  const { domain } = useParams();
  const { media: contextMedia, setMedia } = useMedia();
  const [paginate, setPaginate] = useState(false);
  const [localMedia, setLocalMedia] = useState(contextMedia);
  const { toast } = useToast();
  const { currentDomain, setCurrentDomain } = useUserContext();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 500); // Adjust delay as needed
  const [loadMore, setLoadMore] = useState(false);
  const [canEdit, setCanEdit] = useState(false)
  console.log(currentDomain); //@ts-ignore
  setCurrentDomain(domain);

  const initialPaginationState = {
    page: 1,
    limit: parseInt(import.meta.env.VITE_MEDIA_PAGINATION, 10) || 10,
    skip: 0,
    totalPages: 1,
    totalItems: 0,
  };
  
  const [pagination, setPagination] = useState(initialPaginationState);
  

  const { mutateAsync: getAllMedia, isPending: isLoading } = useGetAllMediaFiles();

  useEffect(() => {
    setLocalMedia(contextMedia);
  }, [contextMedia]);

  useEffect(() => {
    console.log(debouncedSearchInput, "USEFFETC CATLE")
    fetchData();
    console.log(debouncedSearchInput)
  }, [debouncedSearchInput, paginate, pagination.page]); // Listen to debounced search input and page changes

  const fetchData = async () => {
    try {
      const mediaResponse = await getAllMedia({ page: pagination.page, limit: pagination.limit, search: debouncedSearchInput });
      if(loadMore){
        setMedia((prevMedia) => {
          // @ts-ignore
           return  [...prevMedia, ...mediaResponse?.data?.mediadata];
       });
      }else{
        setMedia(mediaResponse?.data?.mediadata);
      }
      setLoadMore(false);
      setCanEdit(mediaResponse?.data?.can_edit)
      setPagination(mediaResponse?.data?.pagination || {});
    } catch (error) {
      toast({ variant: "destructive", description: "Something went wrong", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
    }
  };

  //@ts-ignore
  const onPageChange = (event) => {
    setPaginate(!paginate);
    setPagination({ ...pagination, page: event.page + 1 });
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.totalPages) {
      setLoadMore(true);
      setPagination((prevPagination) => ({
        ...prevPagination,
        page: prevPagination.page + 1,
      }));
    }
  };

  return (
    <div className="main-container w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between header-bar h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <h3 className="page-titles">Media</h3>
        <div className="flex justify-start items-center py-7 relative">
          <input
            // @ts-ignore
            onChange={() => {setSearchInput(event?.target.value);}}
            value={searchInput}
            className="leading-none text-left text-gray-600 px-4 py-3 border rounded border-gray-300 outline-none w-[239px] h-10 text-[14px] font-medium hover:rounded-[50px] "
            type="text"
            placeholder="Search"
          />
          <svg className="absolute right-3 z-10 cursor-pointer" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z" fill="#4F5B67" />
          </svg>
        </div>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden px-5">
        {isLoading && pagination.page == 1 ? (
          <div className="w-full mx-auto mt-[24px]"><MediaGridSkeletonDemo /></div>
        ) : (
          localMedia.length > 0 ? (
            <div className="w-full">
              <ImageUploader setPaginate={setPaginate} />
              <>
                <div className="mx-auto w-full mt-[24px]">
                  <h2 className="sr-only">Media</h2>
                  <MediaGrid media={localMedia} isLoading={isLoading} setPaginate={setPaginate} canEdit={canEdit} />
                </div>
                <div className="card text-center mb-14">
                  {pagination.totalItems > localMedia.length && (
                    <button
                      className="load-more-button"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                    >
                        {isLoading ? <Loader /> : 'Load more'}
                    </button>
                  )}
                </div>
              </>
            </div>
          ) : (
            <>
              <ImageUploader setPaginate={setPaginate} />
              <div className="text-center p-5">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No Media Exist</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new Media using dropbox above.</p>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
