import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetWebsiteListing } from "@/lib/react-query/queriesAndMutations";
import SvgComponent from "@/utils/SvgComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WebsiteCard from "./WebsiteCard";
import { Message } from "@/components/ui/message";
import { useUserContext } from "@/context/AuthProvider";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const [searchInput, setSearchInput] = useState("");
  const [websites, setwebsites] = useState([]);
  const { mutateAsync: getWebsiteListing, isPending: isLoading } = useGetWebsiteListing();
  const navigate = useNavigate();
  const debouncedSearchInput = useDebounce(searchInput, 500);
  const { user } = useUserContext();

  const [pagination, setPagination] = useState({
    page: 1,
    limit: import.meta.env.VITE_MEDIA_PAGINATION,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchData = async () => {
    try {
      const userListingdata = await getWebsiteListing({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchInput,
      });
      setwebsites(userListingdata?.data?.websites);
      setPagination(userListingdata?.data?.pagination || {});
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
        duration: import.meta.env.VITE_TOAST_DURATION,
        icon: <SvgComponent className="" svgName="close_toaster" />,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearchInput]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <Input
              type="text"
              placeholder="Search websites..."
              value={searchInput}
              onChange={handleInputChange}
              className="pl-10 bg-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <Button
            onClick={() => navigate("/website/new")}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white"
            size="sm"
          >
            <SvgComponent svgName="plus-circle" />
            Add website
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader type="list-loader" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {websites && websites.length > 0 ? (
              websites.map((item: any, index: number) => (
                <WebsiteCard key={index} item={item} index={index} />
              ))
            ) : (
              <div className="col-span-full">
                <Message
                  style={{
                    borderWidth: "0 0 0 6px",
                    color: "#435ebe",
                  }}
                  color="green"
                  className="border-primary w-full justify-content-start text-left displayMessage block"
                  text={"No websites found"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
