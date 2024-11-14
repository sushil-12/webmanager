import NavDatatable from "@/components/datatable/NavDatatable";
import { useUserContext } from "@/context/AuthProvider";
import { useEffect, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Setting = () => {
  const [navItemProps, setnavItemProps] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [render, setRerender] = useState(true);
  const { setRerender: setAppRender, rerender, navItems } = useUserContext();
  const getNavItems = async () => {
    setnavItemProps(navItems);
  };
  console.log(selectedItem, setRerender)

  useEffect(() => {
    getNavItems();
    setAppRender((prev: boolean) => !prev);
    console.log(rerender)
  }, [render])
  return (
    <div className="main-container w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between h-[10vh] bg-primary-500 min-h-[10vh] max-h-[10vh] justify pl-5 pr-[44px]">
        <h3 className="page-titles">Settings</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto px-5 ">

        <Tabs defaultValue="sidebar" className="w-full">
          <TabsList className="grid w-full grid-cols-6 text-black">
            <TabsTrigger value="sidebar" className="bg-primary-500 text-white text-sm font-medium">Manage Sidebar</TabsTrigger>
          </TabsList>
          <TabsContent value="sidebar">
            <div className="page-innersubtitles">
              <div className="flex  border-primary-500 gap-8" >
                <div className="items w-full">
                  <NavDatatable navItemProps={navItemProps} setSelectedItem={setSelectedItem} render={render} />
                </div>
                {/* <div className="form w-1/2">
                  <NavItemForm item={selectedItem} setRerender={setRerender}  />
                </div> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>



      </div>
    </div>
  );
};

export default Setting;
