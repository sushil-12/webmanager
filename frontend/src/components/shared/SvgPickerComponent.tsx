import  { useState } from 'react';
import Icons from '../../../../backend/src/constants/svg_codes.json';
import { Dialog } from 'primereact/dialog';
import UploadSvgForm from '@/settings/UploadSvgForm';
import SvgComponent from '@/utils/SvgComponent';

// @ts-ignore
const SvgPickerComponent = ({ setSvgName, setSvgPicker, form_type = 'normal', updateFieldAtIndex, currentIndexItem }) => {
    const [activeCard, setActiveCard] = useState('');
    console.log(activeCard);
    
    const [visible, setVisible] = useState(false);

    const headerTemplate = () => {
        return (
            <div className="flex items-center justify-between">
                <h1 className='page-innertitles'>Add New Svg</h1>
                <button onClick={() => setVisible(false)}><SvgComponent className='cursor-pointer'  svgName='close'/></button>
            </div>
        );
    };
    // @ts-ignore
    const handleDoubleClick = (svgName) => {
        if (form_type === 'repeater' && updateFieldAtIndex) {
            updateFieldAtIndex(setSvgName, svgName, currentIndexItem );
            setSvgPicker(false);
        }
        else{
            setSvgName(svgName);
            setActiveCard(svgName);
            setSvgPicker(false);       
         }
    };

    return (
        <div className="w-full h-full rounded-lg sm:p-6 dark:bg-gray-800 dark:border-gray-700">
            {/* <Button className='shad-button_primary absolute top-5 right-16 float-right mb-2' onClick={() => setVisible(true)}>+ Add new</Button> */}
            <div className="w-full grid grid-cols-6 sm:grid-cols-5 gap-4 text-center relative">
                <Dialog draggable={false} visible={visible} onHide={() => setVisible(false)} style={{ width: '30vw' }} header={headerTemplate} closable={false} > <UploadSvgForm setVisible={setVisible} /> </Dialog>
                {Object.entries(Icons).map(([svgName, svgContent]) => (
                    <div className="block min-w-[128px] max-w-[128px] min-h-24 max-h-24 h-24 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700  cursor-pointer col-12 md:col-2 mx-auto flex-col justify-center" key={svgName} onClick={() => handleDoubleClick(svgName)}>
                        <div dangerouslySetInnerHTML={{ __html: svgContent }} className='flex justify-center text-center mb-3 max-h-4 svg_logos  text-color-secondary w-full h-fit ' />
                        <div>{svgName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SvgPickerComponent;