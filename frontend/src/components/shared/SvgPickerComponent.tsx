import { useState } from "react";
import * as HeroIcons from "@heroicons/react/24/solid"; // Import all Heroicons solid
import { Dialog } from "primereact/dialog";

/**
 * Converts kebab-case icon names to PascalCase to match Heroicons naming convention
 * @param iconName - The kebab-case icon name (e.g., 'academic-cap').
 * @returns The PascalCase icon name (e.g., 'AcademicCapIcon').
 */

// Heroicon Picker Component
const SvgPickerComponent = ({
    setSvgName,
    setSvgPicker,
    form_type = "normal",
    updateFieldAtIndex,
    currentIndexItem,
}: {
    setSvgName: (name: string) => void;
    setSvgPicker: (state: boolean) => void;
    form_type?: string;
    updateFieldAtIndex?: (setter: (name: string) => void, name: string, index: number) => void;
    currentIndexItem?: number;
}) => {
    const [activeCard, setActiveCard] = useState<string>("");
    const [visible, setVisible] = useState(false);

    const headerTemplate = () => (
        <div className="flex items-center justify-between">
            <h1 className="page-innertitles">Add New Icon</h1>
            <button onClick={() => setVisible(false)}>Close</button>
        </div>
    );

    // Handle selecting an icon
    const handleDoubleClick = (iconName: string) => {
        if (form_type === "repeater" && updateFieldAtIndex) {
            updateFieldAtIndex(setSvgName, iconName, currentIndexItem!);
            setSvgPicker(false);
        } else {
            setSvgName(iconName);
            setActiveCard(iconName);
            setSvgPicker(false);
        }
    };

    return (
        <div className="w-full h-full rounded-lg sm:p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full grid grid-cols-6 sm:grid-cols-5 gap-4 text-center relative">
                <Dialog
                    draggable={false}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    style={{ width: "30vw" }}
                    header={headerTemplate}
                    closable={false}
                >
                    <div>Custom Form for Uploading New Icons</div>
                </Dialog>

                {Object.keys(HeroIcons).map((iconName) => {
                    const IconComponent = HeroIcons[iconName as keyof typeof HeroIcons];
                    return (
                        <div
                            key={iconName}
                            className={` min-w-[128px] p-6  border rounded-lg shadow cursor-pointer flex flex-col items-center justify-center ${activeCard === iconName ? "bg-gray-200" : "hover:bg-gray-100"
                                }`}
                            onClick={() => handleDoubleClick(iconName)}
                        >
                            {IconComponent && (
                                <IconComponent className="h-4 w-4 text-gray-500 mb-3" />
                            )}
                            <div className="text-xs text-gray-600 max-w-[128px] break-words">{iconName}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SvgPickerComponent;
