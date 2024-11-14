import PluginDataTable from '@/components/datatable/PluginDataTable';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthProvider';
import { formatString } from '@/lib/utils';
import SvgComponent from '@/utils/SvgComponent';
import {  useParams } from 'react-router-dom'

const PluginComponent = () => {
    const { domain } = useParams();
    const { setCurrentDomain } = useUserContext();


    const plugins = [
        { id: '1', title: 'Manage Custom Fields', route: 'manage-custom-fields', description: 'Manage all Custom Fields', version: '2.4.3' },
        { id: '2', title: 'Manage Seo Schema', route: 'manage-seo-schema', description: 'Manage all Seo Schemas', version: '2.4.3' }
    ]

    {/* @ts-ignore */ }
    setCurrentDomain(domain)
    return (

        <div className="main-container w-full overflow-hidden ">
            <div className="w-full flex items-center justify-between h-[10vh] min-h-[10vh] max-h-[10vh] justify pl-5 pr-[31px] bg-primary-500">
                <div className="flex gap-[15px]"> {/* @ts-ignore */}
                    <h3 className="page-titles capitalize">{(formatString(atob(domain)))} Plugins</h3>
                    <Button className="shad-button_primary place-self-end" size="sm" >
                        <SvgComponent className='' svgName='plus-circle' /> Add Plugins
                    </Button>
                </div>

                <div className="flex justify-start items-center py-7 relative">
                    <span className='max-w-[157px] py-3 px-4 bg-light-blue text-primary-500 text-sm rounded-md'>
                        {plugins.length} Plugins used
                    </span>
                </div>
            </div>
            <div className="h-[90vh] min-h-[90vh] max-h-[90vh] overflow-y-auto overflow-x-hidden px-5 py-5"> {/* @ts-ignore */}
                <PluginDataTable plugins={plugins} domain={domain} />
            </div>
        </div>
    )
}

export default PluginComponent
