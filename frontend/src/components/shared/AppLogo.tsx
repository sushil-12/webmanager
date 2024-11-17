
const AppLogo = () => {
  return (
    <>
      <img src="/assets/content.svg" alt="web-manager-logo" className="w-10 h-10" />
      <h1 className="font-inter text-xl font-bold text-md ml-2 text-white">{import.meta.env.VITE_APP_NAME}</h1> {/* Text */}
    </>
  );
}

export default AppLogo; // Export the component