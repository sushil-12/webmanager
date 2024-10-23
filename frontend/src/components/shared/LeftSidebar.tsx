import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { IMenuItem, IWebsite } from "@/lib/types";
import { MenuIcon } from "lucide-react";
import { useUserContext } from "@/context/AuthProvider";
import * as React from "react";
import { createSlug, formatString, trimString } from "@/lib/utils";
import SvgComponent from "@/utils/SvgComponent";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Avatar from "./Avatar";

interface DropdownVisibilityState {
    [key: string]: boolean;
}

interface CategoryDropdownVisibilityState {
    [key: string]: boolean;
}

const LeftSidebarWithWebsite = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { user, navItems, setIsLoading } = useUserContext();
    const [dropdownVisibility, setDropdownVisibility] = useState<DropdownVisibilityState>({});
    const [categoryDropdownVisibility, setCategoryDropdownVisibility] = useState<CategoryDropdownVisibilityState>({});
    const [websites, setWebsites] = useState<IWebsite[]>([]);

    const toggleDropdown = (websiteId: string) => {
        setDropdownVisibility(prevState => {
            const updatedVisibility = {
                ...prevState,
                [websiteId]: !prevState[websiteId]
            };
            Object.keys(updatedVisibility).forEach(id => {
                if (id !== websiteId) {
                    updatedVisibility[id] = false;
                }
            });

            return updatedVisibility;
        });
    };

    const toggleCategoryDropdown = (categoryId: string) => {
        setCategoryDropdownVisibility(prevState => {
            const updatedVisibility = {
                ...prevState,
                [categoryId]: !prevState[categoryId]
            };
            return updatedVisibility;
        });
    };

    const logout = async () => {
        confirmDialog({
            header: 'Are you sure you want to sign out of application?',
            headerClassName: 'font-inter text-[2rem]',
            acceptClassName: 'accept_button text-left',
            rejectClassName: 'reject_button',
            className: 'border bg-light-1 shadow-lg p-0 confirm_dialogue',
            accept: async () => {
                // Perform logout action if user confirms
                try {
                    setIsLoading(true);
                    localStorage.removeItem('token');
                    setIsLoading(false);
                    navigate('/login')
                } catch (error) {
                    console.error('Logout error:', error);
                    setIsLoading(false);
                }
            },
            acceptLabel: 'Yes, Log me out',
            rejectLabel: 'Cancel',
            closeIcon: <SvgComponent className="" svgName="close" />,
            draggable: false,
            reject: () => { return },
        });
    };

    useEffect(() => {
        setWebsites(navItems.websites)
    }, [navItems, user]); // Include renderSidebar in the dependency array

    return (
        <div className="leftsidebar overflow-hidden">
            <ConfirmDialog />
            <div className="flex flex-col">
                <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon />
                </button>
                <aside id="sidebar-multi-level-sidebar" className="fixed border-r h-full  top-0 left-0 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="cu-simple-bar-resizer-handle ng-tns-c2398600540-13"></div>

                    <div className={` bg-light-1 dark:bg-gray-800  ${user?.role === 'super_admin' || user?.role === 'admin'  ? 'min-h-[73%] max-h-[73%]' : 'user_sidebar'} overflow-y-auto overflow-x-hidden`} key={user?.role}>
                        <div className="flex gap-3 items-center justify-center px-16 py-6">
                            <Link to="/" className="m-0 items-center flex text-sm font-medium">
                                <SvgComponent className="" svgName="logo-sidebar" />
                                <h1 className="font-inter text-md  ml-2">{import.meta.env.VITE_APP_NAME}</h1>
                            </Link>
                        </div>
                        {websites && websites.length > 0 && websites.map((website: IWebsite, index: number) => (
                            <React.Fragment key={`website-${index}`}>
                                <li className={`${pathname.includes(btoa(createSlug(website?.business_name, '_'))) ? 'pointer-events-none' : 's'} left-sidebar-link border-b bg-white hover:bg-gray-100 ${dropdownVisibility[website.id] ? 'bg-secondary-gray' : ''}`} key={`left-sidebar-link-${index}`}>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between w-full"
                                        aria-controls={`${createSlug(website?.business_name)}-dropdown`}
                                        data-collapse-toggle={`${createSlug(website?.business_name)}-dropdown`}
                                        onClick={() => toggleDropdown(website.id)}
                                    >
                                        <div className="flex gap-[9px] items-center">{/* @ts-ignore*/}
                                            <span className="pl-6 pr-1 rounded-full">{website?.icon ? <img className="leftsidebar_icons max-h-6 min-h-6 max-w-6 min-w-6" src={website?.icon} /> : <SvgComponent className="leftsidebar_icons rounded-full" svgName={website?.icon || 'websites'} />}</span>
                                            <span className="flex-1 text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px] leading-6">{formatString(website?.business_name)}</span>
                                        </div>
                                        <span className={`transform transition-transform`}>
                                            <SvgComponent className={`${pathname.includes(btoa(createSlug(website?.business_name, '_'))) ? 'pointer-events-none' : 's'} ${createSlug(website?.business_name)}-dropdown-arrow submenu me-14 min-h-[9px] ${dropdownVisibility[website.id] ? 'rotated' : ''}`} svgName="down-arrow" />
                                        </span>
                                    </button>
                                </li>

                                <ul
                                    id={`${createSlug(website?.business_name)}-dropdown`}
                                    className={`${dropdownVisibility[website.id] ||
                                        pathname.includes(btoa(createSlug(website?.business_name, '_'))) ? 'block' : 'hidden'
                                        }`}
                                >
                                    {website.menus && website.menus.map((link: IMenuItem) => {
                                        const isWebActive = false;
                                        return (
                                            <React.Fragment key={`${link.label}-${link.id}`}>
                                                {link.category ? (
                                                    <li className="left-sidebar-web-link hover:bg-gray-100 bg-secondary-light" key={link.label}>
                                                        <button type="button" className=" left-sidebar-web-link justify-between flex items-center w-full  links pl-0" aria-controls={`${link.label}-dropdown`} data-collapse-toggle={`${link?.label}-dropdown`} onClick={() => toggleCategoryDropdown(link.id)}>
                                                            <div className="flex gap-[6px] items-center">{/* @ts-ignore */}
                                                                <SvgComponent className=" leftsidebar_icons_website group-hover:invert-white pl-6 pr-1" svgName={link.imgURL || 'website_icon'} />
                                                                <span className="flex-1 text-left rtl:text-right whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px] " style={{ padding: "2px 0px" }}>{(link.label)}</span>
                                                            </div>
                                                            <SvgComponent className={`dropdown-arrow me-20 ${categoryDropdownVisibility[link.id] ? 'rotated' : ''}`} svgName="down-arrow" />

                                                        </button>

                                                        <ul id={`${link?.label}-dropdown`} className={`${categoryDropdownVisibility[link.id] ? 'block' : 'hidden'} pl-4`}>
                                                            <li className={`left-sidebar-web-link ${isWebActive ? 'bg-primary-500 text-white ' : ''}`}>
                                                                <div className="links">
                                                                    <NavLink className="flex items-center" to={`${btoa(createSlug(website.business_name, '_'))}/posts/${link?.route.replace(/\//g, '')}`}>
                                                                        <div className="flex gap-[6px] items-center">{/* @ts-ignore */}
                                                                            <SvgComponent className=" leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                            <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[150px]" title={link?.label}>{link.label}</span>
                                                                        </div>
                                                                    </NavLink>
                                                                </div>
                                                            </li>
                                                            <li className={`left-sidebar-web-link ${isWebActive ? '' : ''}`}>
                                                                <div className="links">
                                                                    <NavLink className="flex items-center " to={`${btoa(createSlug(website.business_name, '_'))}/category/posts/${link?.route.replace(/\//g, '')}`}>
                                                                        <div className="flex gap-[6px] items-center">{/* @ts-ignore */}
                                                                            <SvgComponent className=" leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                            <span>Manage category</span>
                                                                        </div>

                                                                    </NavLink>
                                                                </div>
                                                            </li>

                                                        </ul>
                                                    </li>
                                                ) : (
                                                    <li key={link.label} className={`left-sidebar-web-link ${isWebActive ? 'bg-light-blue text-primary-500 border-b-primary-500' : ''}`}>
                                                        <div className="links">
                                                            {link?.type == 'custom_post' ? (<NavLink className="flex gap-4 items-center" to={`${btoa(createSlug(website.business_name, '_'))}/posts/${link.route.replace(/\//g, '')}`}>
                                                                <div className=" flex gap-[6px] items-center">{/* @ts-ignore */}
                                                                    <SvgComponent className=" leftsidebar_icons_website group-hover:invert-primary-500 text-primary-500" svgName={link.imgURL || 'briefcase'} />
                                                                    <span>{link.label}</span>
                                                                </div>
                                                            </NavLink>) : (
                                                                <NavLink className="flex gap-4 items-center" to={`${btoa(createSlug(website.business_name, '_'))}/${link.route.replace(/\//g, '')}`}>
                                                                    <div className=" flex gap-[6px] items-center">{/* @ts-ignore */}
                                                                        <SvgComponent className=" leftsidebar_icons_website group-hover:invert-primary-500 text-primary-500" svgName={link.imgURL || 'briefcase'} />
                                                                        <span>{link.label}</span>
                                                                    </div>
                                                                </NavLink>
                                                            )}

                                                        </div>
                                                    </li>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </ul>
                            </React.Fragment>
                        ))}
                    </div>

                    <div className=" w-full absolute bottom-0 bg-white">
                        <ul className="relative">
                            {(user?.role === 'super_admin' || user?.role === 'admin') && (
                                <>
                                    <li className={`left-sidebar-link border-b hover:bg-gray-100 ${pathname.endsWith('users') ? ' bg-light-blue border-b-main-bg-900' : ''}`}>
                                        <div className="link-container" >
                                            <NavLink className="flex items-center rounded-lg dark:text-main-bg pl-6 dark:hover:bg-gray-700 group" to={'/users'}>

                                                <div className="flex gap-[8px] items-center ">{/* @ts-ignore */}
                                                    <SvgComponent className="leftsidebar_icons" svgName={'personal'} />
                                                    <span className="text-secondary-link">Users</span>
                                                </div>

                                            </NavLink>
                                        </div>
                                    </li>
                                    <li className={`left-sidebar-link border-b hover:bg-gray-100 ${pathname.endsWith('websites') ? ' bg-light-blue border border-b-main-bg-900' : ''} `}>
                                        <div className="link-container" >
                                            <NavLink className="flex items-center rounded-lg dark:text-main-bg pl-6 dark:hover:bg-gray-700 group" to={'/websites'}>
                                                <div className="flex gap-[8px] items-center ">{/* @ts-ignore */}
                                                    <SvgComponent className=" leftsidebar_icons" svgName={'setting_gray'} />
                                                    <span className="text-secondary-link">Settings</span>
                                                </div>

                                            </NavLink>
                                        </div>
                                    </li>
                                </>
                            )
                            }
                            <div className={(pathname.includes('profile') ? 'flex m-0 gap-[15px] bg-light-gray items-center min-h-[68px] max-h-[68px] p-4 relative' : 'flex m-0 gap-[15px] bg-light-gray items-center min-h-[68px] max-h-[68px] p-4 relative')} >
                                <div className="image_box h-9 w-[208px] flex justify-between">
                                    <div className="flex items-center">
                                        <div className="img_container mr-2">
                                            {user?.profile_pic == '' || user?.profile_pic === undefined ? (<Avatar char={user?.username.charAt(0).toUpperCase()} size="extra-small" />) : <img alt={user.firstName} src={`${user?.profile_pic}`} className="rounded-full  self-center min-w-9" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-md font-inter font-medium text-secondary-link">
                                                {trimString(user?.username?.trim(), 14)}
                                            </p>
                                            <NavLink to={`/profile/${user.id}`} className="text-xs underline font-normal text-secondary-link">
                                                My Profile
                                            </NavLink>
                                        </div>
                                    </div>


                                </div>
                                <div className="logout_buttom">
                                    <Button variant="ghost" title="Logout" className="shad-button_ghost px-0 py-0" onClick={() => { logout(); }}>
                                        <SvgComponent className={``} svgName="logout" />
                                    </Button>
                                </div>
                            </div>
                        </ul>


                    </div>

                </aside>
            </div>

        </div>
    );
};

export default LeftSidebarWithWebsite;
