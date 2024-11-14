import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { useGetWebsiteListing } from "@/lib/react-query/queriesAndMutations";
import SvgComponent from "@/utils/SvgComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebsiteCard from "./WebsiteCard";
import { Message } from "@/components/ui/message";

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
export default function Website() {
    const { toast } = useToast();
    const [searchInput, setSearchInput] = useState('');
    const [websites, setwebsites] = useState([]);
    const { mutateAsync: getWebsiteListing, isPending: isLoading } = useGetWebsiteListing();
    const navigate = useNavigate();
    const debouncedSearchInput = useDebounce(searchInput, 500); // Adjust delay as needed

    const [pagination, setPagination] = useState({
        page: 1,
        limit: import.meta.env.VITE_MEDIA_PAGINATION,
        totalPages: 1,
        totalItems: 0,
    });
    const fetchData = async () => {
        try {
            const userListingdata = await getWebsiteListing({ page: pagination.page, limit: pagination.limit, search: debouncedSearchInput });
            console.log(userListingdata)
            setwebsites(userListingdata?.data?.websites);
            setPagination(userListingdata?.data?.pagination || {});
        } catch (error) {
            toast({ variant: "destructive", description: "Something went wrong", duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" /> });
        }
    };
    useEffect(() => {
        fetchData();
    }, [debouncedSearchInput]);
    // @ts-ignore
    const handleInputChange = (event) => {// @ts-ignore
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {// @ts-ignore
        fetchData();
    };
    return (

        <div className="main-container w-full overflow-hidden ">
            <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[44px] bg-primary-500">
                <h3 className="page-titles">Settings</h3>
            </div>
            <div className="user-container px-5">
                <div className="w-full flex justify-between pt-6 pb-3 ">
                    <div className="flex justify-start items-center relative overflow-hidden">
                        <input
                            onChange={handleInputChange}
                            value={searchInput}
                            className="leading-none text-left text-gray-600 px-4 py-3 border rounded border-gray-300 outline-none w-[239px] h-10 text-[14px] font-medium"
                            type="text"
                            placeholder="Search"
                        />
                        <button className="absolute right-3 z-10 cursor-pointer" onClick={handleSearch}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.33333 7.33333H7.80667L7.62 7.15333C8.27333 6.39333 8.66667 5.40667 8.66667 4.33333C8.66667 1.94 6.72667 0 4.33333 0C1.94 0 0 1.94 0 4.33333C0 6.72667 1.94 8.66667 4.33333 8.66667C5.40667 8.66667 6.39333 8.27333 7.15333 7.62L7.33333 7.80667V8.33333L10.6667 11.66L11.66 10.6667L8.33333 7.33333ZM4.33333 7.33333C2.67333 7.33333 1.33333 5.99333 1.33333 4.33333C1.33333 2.67333 2.67333 1.33333 4.33333 1.33333C5.99333 1.33333 7.33333 2.67333 7.33333 4.33333C7.33333 5.99333 5.99333 7.33333 4.33333 7.33333Z" fill="#4F5B67" />
                            </svg>
                        </button>

                    </div>
                    <Button className="shad-button_primary place-self-end h-10" size="sm" onClick={() => { navigate('/website/new') }}>
                        <SvgComponent className='' svgName='plus-circle' /> Add website
                    </Button>
                </div>
                <div className="card_container w-full">
                    {isLoading ? (
                        <Loader type="list-loader" />
                    ) : (

                        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-2">
                            {websites && websites.length > 0 ? (
                                websites.map((item: any, index: number) => {
                                    return (
                                        <WebsiteCard item={item} index={index} key={index} />
                                    );
                                })
                            ) : (
                                <Message
                                    style={{
                                        borderWidth: '0 0 0 6px',
                                        color: '#0B3954'
                                    }}
                                    color="green"
                                    className="border-primary w-full justify-content-start text-left displayMessage block"
                                    text={'No Websites are there !'}
                                />

                            )}
                        </ul>
                    )}

                </div>
            </div>

        </div >

    )
}
