import React from 'react';
import Icons from '../../../backend/src/constants/svg_codes.json';

interface SvgComponentProps {
    className?: string;
    svgName: keyof typeof Icons; // Use keyof typeof to specify the keys of Icons
}

const SvgComponent: React.FC<SvgComponentProps> = ({ className, svgName }) => {
    return (
        svgName && Icons[svgName] && (
            <div className={className || ''} dangerouslySetInnerHTML={{ __html: Icons[svgName] }} />
        )
    ) as JSX.Element; // Type assertion to specify the return type as JSX.Element
}

export default SvgComponent;