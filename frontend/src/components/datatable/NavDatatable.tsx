import { Edit3Icon } from 'lucide-react';
import { useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import * as React from 'react';
import { INavLink } from '@/lib/types';
import { formatString } from '@/lib/utils';
import { Accordion, AccordionTab } from 'primereact/accordion';
import NavItemForm from '@/settings/NavItemForm';
import SvgComponent from '@/utils/SvgComponent';
import { saveDatatoSidebar } from '@/lib/appwrite/api';
import { useToast } from '../ui/use-toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useUserContext } from '@/context/AuthProvider';
import Loader from '../shared/Loader';
import { status } from '@/constants/message';

interface NavDatatableprops {
    navItemProps: any;
    setSelectedItem: any;
    render: boolean;
}

const NavDatatable: React.FC<NavDatatableprops> = ({ navItemProps }) => {

    const { navItems, setRerender: reRender } = useUserContext();
    const domainSidebarLinks = navItems;
    const [selectedItem, setSelectedItem] = useState(null);
    const [render, setRerender] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeDomain, setActiveDomain] = useState('the_logician');
    const websitekeys = navItemProps.websites && Object.keys(navItemProps.websites);
    const { toast } = useToast();

    const reject = () => {
        console.log("CACNELLEED");
    }
    console.table(navItemProps);
    React.useEffect(() => { console.log(render) }, [render]);// @ts-ignore
    const confirmDelete = (itemId, type, submenuKey = '') => {
        console.log(itemId, type, submenuKey)
        confirmDialog({
            message: 'Are you sure you want to delete?',
            header: 'Delete Confirmation',
            acceptClassName: 'pl-4 outline-none p-2 text-sm',
            rejectClassName: 'pl-4 outline-none p-2 text-sm text-white',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: () => handleDelete(itemId, type, submenuKey),
            reject: reject,
            draggable: false,
        });
    }

    // @ts-ignore
    async function handleDelete(itemId, type, submenuKey = '') {
        setDeleting(true)
        if (type === "comman") {
            let currentCommonSchema = domainSidebarLinks.comman;
            console.log(currentCommonSchema, itemId);// @ts-ignore
            let updatedCommonSchema = currentCommonSchema.filter(item => item.id !== itemId)
            domainSidebarLinks.comman = updatedCommonSchema
            console.log(updatedCommonSchema)
        }
        else if (type === 'comman-subcategory') {
            let currentCommonSchema = domainSidebarLinks.comman;// @ts-ignore
            let filterSchema = currentCommonSchema.filter(item => item.id === submenuKey);
            let subcategory = filterSchema[0].subcategory; // @ts-ignore
            filterSchema[0].subcategory = subcategory.filter(item => item.id !== itemId)
            // @ts-ignore
            const index = currentCommonSchema.findIndex(item => item.id === submenuKey);
            console.log(filterSchema);
            if (index !== -1) {// @ts-ignore
                currentCommonSchema[index] = filterSchema[0];
            }

        }
        else if (type === "websites") {
            let currentWebsiteSchema = domainSidebarLinks.websites;
            Object.keys(currentWebsiteSchema).forEach(key => {// @ts-ignore
                let website = currentWebsiteSchema[key];
                if (Array.isArray(website)) {
                    let updatedItems = website.filter(item => item.id !== itemId);// @ts-ignore
                    website = currentWebsiteSchema[key] = updatedItems;
                }
            });
            // let updatedWebsiteSchema = currentWebsiteSchema.filter(item => item.id !== itemId)
            domainSidebarLinks.websites = currentWebsiteSchema

        }
        const createOrEditNavItemResponse = await saveDatatoSidebar(domainSidebarLinks);
        reRender((prev: boolean) => !prev);

        if (createOrEditNavItemResponse?.code === status.created || createOrEditNavItemResponse?.code === status.updated) {
            setDeleting(false);
            const message = createOrEditNavItemResponse?.code === status.created ? 'Successfully deleted' : 'Successfully deleted';
            setSelectedItem(null);
            return toast({ variant: 'default', description: message , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="check_toaster" />});
        } else {
            setDeleting(false);
            return toast({ variant: 'default', description: 'Something went wrong' , duration: import.meta.env.VITE_TOAST_DURATION, icon: <SvgComponent className="" svgName="close_toaster" />});
        }

    };

    return (
        <div className="card">
            <ConfirmDialog />
            <TabView>
                <TabPanel header="Common" className='text-sm p-0' >
                    {deleting && (<div className="flex h-[400px] w-full items-center justify-center"><Loader /></div>)}
                    {!deleting && (
                        <div className="h-full overflow-y-auto bg-light-1 dark:bg-gray-800 flex gap-4">
                            <ol className="overflow-y-auto w-3/4">
                                {navItemProps.comman?.map((link: INavLink) => {
                                    return (
                                        <React.Fragment key={link.label}>
                                            {link?.subcategory.length > 0 ? (
                                                <li key={link.label} className="flex-col   border-y border-dashed mb-2   me-4 pe-4">
                                                    <button type="button" className="flex  items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 w-full ">
                                                        {/* @ts-ignore */}
                                                        <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[10px]">{link?.label}</span>
                                                        <div className="flex gap-4 items-center"> {/* @ts-ignore */}
                                                            <Edit3Icon className='cursor-pointer h-4' onClick={() => { setSelectedItem(link); console.log("CLicked", selectedItem, setSelectedItem); }} />
                                                            <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>
                                                        </div>

                                                    </button>
                                                    <ul id={`${link?.label}-dropdown`} className={`flex flex-col gap-4 items-center rounded-lg dark:text-main-bg   w-full pe-5 py-2  `}>

                                                        {link.subcategory.map((subcategoryLink: INavLink) => ( // Changed variable name to avoid conflict
                                                            <li key={subcategoryLink.label} className="list-disc w-full hover:bg-gray-100">
                                                                <div className="links flex justify-between w-full">
                                                                    <div className="flex gap-4 items-center  pl-14 pr-1 " >
                                                                        {/* @ts-ignore */}
                                                                        <SvgComponent svgName={subcategoryLink?.imgURL} className='group-hover:invert-white ' />
                                                                        {subcategoryLink.label}
                                                                    </div>
                                                                    <button onClick={() => { confirmDelete(subcategoryLink?.id, "comman-subcategory", link?.id) }}><SvgComponent className='' svgName='delete' /></button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ) : (
                                                <li key={link.label} className={`  border-y border-dashed mb-2    hover:bg-gray-100 me-4 pe-4 `}>
                                                    <div className="link-container w-full flex items-center justify-between me-5 " >
                                                        <div className="flex items-center rounded-lg dark:text-main-bg  dark:hover:bg-gray-700 group"> {/* @ts-ignore */}
                                                            <SvgComponent svgName={link?.imgURL} className='pl-6 pr-1' />
                                                            <span className="ms-3  my-[10px]">{link.label}</span>
                                                        </div>
                                                        <div className="flex gap-4 items-center"> {/* @ts-ignore */}
                                                            <Edit3Icon className='cursor-pointer h-4' onClick={() => { setSelectedItem(link); console.log("CLicked"); }} />
                                                            <button onClick={() => { confirmDelete(link?.id, "comman") }}><SvgComponent className='' svgName='delete' /></button>
                                                        </div>

                                                    </div>
                                                </li>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </ol>
                            <div className="w-1/2">
                                <NavItemForm item={selectedItem} setRerender={setRerender} setSelectedItem={setSelectedItem} activeTab="comman" />
                            </div>
                        </div>
                    )}
                </TabPanel>
                <TabPanel header="Websites" className='text-sm p-0' >
                    {deleting && (<div className="flex h-[400px] w-full items-center justify-center"><Loader /></div>)}
                    {!deleting && (
                        <div className="card flex gap-4  "> {/* @ts-ignore */}
                            <Accordion activeIndex={activeIndex} className='w-1/2' onTabChange={(e) => { setActiveIndex(e.index); setActiveDomain(websitekeys[e.index]) }}>
                                {
                                    Object.entries(navItemProps.websites || {}).map(([submenuKey, submenuItems]) => (
                                        <AccordionTab header={formatString(submenuKey)} key={submenuKey}  >
                                            <ul id={`-dropdown`} className='block'>
                                                {/* @ts-ignore */}
                                                {submenuItems.map((link: INavLink) => {
                                                    {/* @ts-ignore */ }
                                                    const isWebActive = false; // Assuming pathname is defined somewhere
                                                    return (
                                                        <React.Fragment key={link.label}>
                                                            {link.subcategory ? (
                                                                <li className="left-sidebar-web-link hover:bg-gray-100 ">
                                                                    <button type="button" className="flex items-center w-full" > {/* @ts-ignore */}
                                                                        <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white pl-6 pr-1' />
                                                                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap my-[22px]">{formatString(link.label)}</span>
                                                                    </button>

                                                                    {/* <ul id={`${link.label}-dropdown`} className={`${dropdownVisibility[link.label] ? 'block' : 'hidden'}`}>
                                                                    {link.subcategory?.map((subcategoryLink: INavLink) => (
                                                                        <li key={subcategoryLink.label} className="leftsidebar-link group">
                                                                            <div className="links">
                                                                                <NavLink className="flex gap-4 items-center p-4" to={subcategoryLink.route}>
                                                                                    <img src={subcategoryLink.imgURL} alt={subcategoryLink.label} className="group-hover:invert-white" />
                                                                                    {subcategoryLink.label}
                                                                                </NavLink>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul> */}
                                                                </li>
                                                            ) : (
                                                                <li key={link.label} className={`leftsidebar-link`}>
                                                                    <div className="links">
                                                                        <div className="flex gap-4 items-center p-4 justify-between " >
                                                                            <div className='flex items-center gap-4'>
                                                                                {/* @ts-ignore */}
                                                                                <SvgComponent svgName={link?.imgURL} className='group-hover:invert-white pl-6 pr-1' />
                                                                                {link.label}
                                                                            </div>
                                                                            <div className="flex gap-4 items-center"> {/* @ts-ignore */}
                                                                                <Edit3Icon className='cursor-pointer h-4 ' onClick={() => { setSelectedItem(link); console.log("CLicked"); }} />
                                                                                <button onClick={() => { confirmDelete(link?.id, "websites") }}><SvgComponent className='' svgName='delete' /></button>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </ul>

                                        </AccordionTab>
                                    ))
                                }
                            </Accordion>
                            <div className="w-1/2">
                                <NavItemForm item={selectedItem} setRerender={setRerender} activeTab="website" activeDomain={activeDomain} setSelectedItem={setSelectedItem} />
                            </div>
                        </div>
                    )}
                </TabPanel>
            </TabView>
        </div>
    )
};

export default NavDatatable;
