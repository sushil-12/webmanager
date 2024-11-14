import SoonTemplate from "@/components/shared/SoonTemplate";
import { useParams } from "react-router-dom";

const DefaultComponent = () => {
    const { default: defaultValue } = useParams(); // Changed variable name to avoid confusion with 'default' keyword
    return (
        <div className="main-container w-full">
            <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[44px] header-bar">
                <h3 className="page-titles">{defaultValue ? defaultValue.toLocaleUpperCase() : 'Default Component'}</h3> {/* Changed 'default && default' to 'defaultValue ? defaultValue' */}
            </div>
            <div className="flex flex-row justify-center items-center h-[90vh] min-h-[90vh] max-h-[90vh]">
                <SoonTemplate />
            </div>
        </div>
    );
};

export default DefaultComponent;
