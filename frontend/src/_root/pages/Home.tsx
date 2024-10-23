import SvgComponent from "@/utils/SvgComponent";

const Home = () => {
  return (
    <div className="main-container w-full h-screen flex flex-col justify-center items-center">
      <div className="flex-grow flex flex-col justify-center items-center">
        <SvgComponent className="h-auto" svgName="main_logo" />
        <h2 className="mt-5 text-2xl font-semibold">Welcome to Balkan Org</h2>
      </div>
    </div>
  );
};

export default Home;
