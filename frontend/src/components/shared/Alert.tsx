
interface AlertProps {
    icon?: string; // Assuming the icon is a string representing the icon name
    message: string;
    type?: string;
    height?: string; // Optional height
    width?: string; // Optional width
}
const Alert: React.FC<AlertProps> = ({ type, icon = null, message = null, height, width, }) => {
    console.log(icon, message, height, width, type)
    let bgcolor;
    if (type == 'success') { bgcolor = 'success' };
    if (type == 'error') { bgcolor = 'error' };
    console.log(bgcolor)
    return (
        <>
            <div className={`toaster-alert w-[${width}] h-[${height} ${bgcolor == 'error' && 'bg-error'} ${bgcolor == 'success' && 'bg-success'} bg-opacity-[22%] border border-${bgcolor} p-2 rounded-md mt-3`} >
                <span className={`font-inter text-sm text-${bgcolor} font-bold`}>{message}</span>
            </div>
        </>
    );
}

export default Alert; // Export the component