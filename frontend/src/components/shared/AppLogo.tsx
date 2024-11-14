
const AppLogo = () => {
  return (
    <>
      <img src="/assets/content.png" alt="web-manager-logo" className="w-8 h-8" />
      <h1 className="font-inter text-xl font-semibold text-md ml-2 text-primary-500">{import.meta.env.VITE_APP_NAME}</h1> {/* Text */}
    </>
  );
}

export default AppLogo; // Export the component