import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button"
import { Message } from "@/components/ui/message";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllUserListing } from "@/lib/react-query/queriesAndMutations";
import { IUser } from "@/lib/types";
import SvgComponent from "@/utils/SvgComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function UsersList() {
    const { toast } = useToast();
    const [searchInput, setSearchInput] = useState('');
    const [users, setUsers] = useState<IUser[]>([]);
    const { mutateAsync: getUsersListing, isPending: isLoading } = useGetAllUserListing();
    const navigate = useNavigate();
    const debouncedSearchInput = useDebounce(searchInput, 500);
    const [loadMore, setLoadMore] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: import.meta.env.VITE_USER_PAGINATION,
        totalPages: 1,
        totalItems: 0,
    });

    const fetchData = async (resetPage = false) => {
        try {
            const currentPage = resetPage ? 1 : pagination.page;
            const userListingdata = await getUsersListing({ 
                page: currentPage, 
                limit: pagination.limit, 
                search: debouncedSearchInput 
            });

            if (userListingdata?.data?.userData) {
                if (loadMore) {
                    setUsers(prevUsers => [...prevUsers, ...userListingdata.data.userData]);
                    setLoadMore(false);
                } else {
                    setUsers(userListingdata.data.userData);
                }
            }

            if (userListingdata?.data?.pagination) {
                setPagination(prev => ({
                    ...prev,
                    ...userListingdata.data.pagination,
                    page: currentPage
                }));
            }
        } catch (error) {
            toast({ 
                variant: "destructive", 
                description: "Something went wrong", 
                duration: import.meta.env.VITE_TOAST_DURATION, 
                icon: <SvgComponent className="" svgName="close_toaster" /> 
            });
        }
    };

    // Reset page when search changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchData(true);
    }, [debouncedSearchInput]);

    // Fetch data when page changes
    useEffect(() => {
        if (pagination.page > 1) {
            fetchData();
        }
    }, [pagination.page]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleLoadMore = () => {
        if (pagination.page < pagination.totalPages) {
            setLoadMore(true);
            setPagination(prev => ({
                ...prev,
                page: prev.page + 1
            }));
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header Section */}
            <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
                <h1 className="text-lg font-medium text-gray-900">Users</h1>
                <Button 
                    className="shad-button_primary h-8 px-3 text-sm" 
                    size="sm" 
                    onClick={() => navigate('/add-edit-user')}
                >
                    <SvgComponent className="w-3.5 mr-1.5" svgName='plus-circle' /> 
                    Add User
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                {/* Search Bar */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <input
                            onChange={handleInputChange}
                            value={searchInput}
                            className="w-full h-8 pl-9 pr-3 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            type="text"
                            placeholder="Search users..."
                        />
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    </div>
                </div>

                {/* Users Grid */}
                <div className="space-y-4">
                    {isLoading && pagination.page === 1 ? (
                        <Loader type="list-loader" />
                    ) : (
                        <>
                            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {users.length > 0 ? (
                                    users.map((item, index) => (
                                        <UserCard item={item} index={index} key={index} />
                                    ))
                                ) : (
                                    <Message
                                        style={{
                                            borderWidth: '0 0 0 3px',
                                            color: '#435ebe'
                                        }}
                                        color="green"
                                        className="border-primary w-full justify-content-start text-left displayMessage block text-sm"
                                        text={'No users found'}
                                    />
                                )}
                            </ul>

                            {/* Load More Button */}
                            {pagination.totalItems > users.length && (
                                <div className="flex justify-center pt-3">
                                    <button
                                        className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-50"
                                        onClick={handleLoadMore}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader /> : 'Load more'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

