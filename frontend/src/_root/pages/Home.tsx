import SoonTemplate from "@/components/shared/SoonTemplate";

const Dashboard = () => {


  return (
    <div className="main-container w-full overflow-hidden ">
      <div className="w-full flex items-center justify-between header-bar h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px]">
        <h3 className="page-titles">Dashboard</h3>
      </div>
      <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden px-5 py-6 ">
         <SoonTemplate />
      </div>
    </div>
  );
};
export default Dashboard;
