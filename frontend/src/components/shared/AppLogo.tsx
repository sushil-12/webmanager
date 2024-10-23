import SvgComponent from "@/utils/SvgComponent";

const AppLogo = () => {
  return (
    <>
      <SvgComponent className="h-auto" svgName="logo" /> 
      <h1 className="text-white font-inter text-md ml-2">{import.meta.env.VITE_APP_NAME}</h1> {/* Text */}
    </>
  );
}

export default AppLogo; // Export the component