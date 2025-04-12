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
        <div className="leftsidebar">
            <ConfirmDialog />
            <div className="flex flex-col h-full">
                {/* Mobile Toggle Button */}
                <button 
                    data-drawer-target="sidebar-multi-level-sidebar" 
                    data-drawer-toggle="sidebar-multi-level-sidebar" 
                    aria-controls="sidebar-multi-level-sidebar" 
                    type="button" 
                    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon />
                </button>

                {/* Sidebar */}
                <aside 
                    id="sidebar-multi-level-sidebar" 
                    className="fixed border-r h-full top-0 left-0 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0" 
                    aria-label="Sidebar"
                >
                    <div className="cu-simple-bar-resizer-handle"></div>

                    <div className={`${user?.role === 'super_admin' || user?.role === 'admin' ? 'min-h-[73%] max-h-[73%]' : 'user_sidebar'} overflow-y-auto overflow-x-hidden`}>
                        {/* Sidebar Header */}
                        <div className="sidebar-header">
                            <Link to="/" className="flex items-center">
                                <img src="/assets/logo.svg" alt="Logo" className="w-7 h-7"/>
                                <h1 className="ml-2 text-sm font-semibold text-white">{import.meta.env.VITE_APP_NAME}</h1>
                            </Link>
                        </div>

                        {/* Sidebar Content */}
                        <div className="sidebar-content">
                            {websites && websites.length > 0 && websites.map((website: IWebsite, index: number) => (
                                <React.Fragment key={`website-${index}`}>
                                    <li className={`left-sidebar-link ${pathname.includes(btoa(createSlug(website?.business_name, '_'))) ? 'active' : ''} ${dropdownVisibility[website.id] ? 'bg-dark-2' : ''}`}>
                                        <button
                                            type="button"
                                            className="flex items-center justify-between w-full"
                                            onClick={() => toggleDropdown(website.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center">
                                                    {website?.icon ? (
                                                        <img className="leftsidebar_icons" src={website?.icon} alt={website.business_name} />
                                                    ) : (
                                                        // @ts-ignore
                                                        <SvgComponent className="leftsidebar_icons" svgName={website?.icon || 'websites'} />
                                                    )}
                                                </span>
                                                <span className="truncate max-w-[150px]">{formatString(website?.business_name)}</span>
                                            </div>
                                            <SvgComponent 
                                                className={`dropdown-arrow ${dropdownVisibility[website.id] ? 'rotated' : ''}`} 
                                                svgName="down-arrow" 
                                            />
                                        </button>
                                    </li>

                                    <ul className={`${dropdownVisibility[website.id] || pathname.includes(btoa(createSlug(website?.business_name, '_'))) ? 'block' : 'hidden'}`}>
                                        {website.menus && website.menus.map((link: IMenuItem) => (
                                            <React.Fragment key={`${link.label}-${link.id}`}>
                                                {link.category ? (
                                                    <li className="left-sidebar-web-link">
                                                        <button 
                                                            type="button" 
                                                            className="flex items-center justify-between w-full"
                                                            onClick={() => toggleCategoryDropdown(link.id)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {/* @ts-ignore */}
                                                                <SvgComponent className="leftsidebar_icons_website" svgName={link.imgURL || 'website_icon'} />
                                                                <span className="truncate max-w-[150px]">{link.label}</span>
                                                            </div>
                                                            <SvgComponent 
                                                                className={`dropdown-arrow ${categoryDropdownVisibility[link.id] ? 'rotated' : ''}`} 
                                                                svgName="down-arrow" 
                                                            />
                                                        </button>

                                                        <ul className={`${categoryDropdownVisibility[link.id] ? 'block' : 'hidden'} pl-4`}>
                                                            <li className="left-sidebar-web-link">
                                                                <NavLink 
                                                                    className="flex items-center gap-2" 
                                                                    to={`${btoa(createSlug(website.business_name, '_'))}/posts/${link?.route.replace(/\//g, '')}`}
                                                                >
                                                                    {/* @ts-ignore */}
                                                                    <SvgComponent className="leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                    <span className="truncate max-w-[150px]">{link.label}</span>
                                                                </NavLink>
                                                            </li>
                                                            <li className="left-sidebar-web-link">
                                                                <NavLink 
                                                                    className="flex items-center gap-2" 
                                                                    to={`${btoa(createSlug(website.business_name, '_'))}/category/posts/${link?.route.replace(/\//g, '')}`}
                                                                >
                                                                    {/* @ts-ignore */}
                                                                    <SvgComponent className="leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                                    <span>Manage category</span>
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                ) : (
                                                    <li className="left-sidebar-web-link">
                                                        <NavLink 
                                                            className="flex items-center gap-2" 
                                                            to={link?.type === 'custom_post' 
                                                                ? `${btoa(createSlug(website.business_name, '_'))}/posts/${link.route.replace(/\//g, '')}`
                                                                : `${btoa(createSlug(website.business_name, '_'))}/${link.route.replace(/\//g, '')}`
                                                            }
                                                        >
                                                            {/* @ts-ignore */}  
                                                            <SvgComponent className="leftsidebar_icons_website" svgName={link.imgURL || 'briefcase'} />
                                                            <span className="truncate max-w-[150px]">{link.label}</span>
                                                        </NavLink>
                                                    </li>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="sidebar-footer">
                        {(user?.role === 'super_admin' || user?.role === 'admin') && (
                            <>
                                <li className="left-sidebar-link">
                                    <NavLink className="flex items-center gap-2" to="/users">
                                        <SvgComponent className="leftsidebar_icons" svgName="personal" />
                                        <span>Users</span>
                                    </NavLink>
                                </li>
                                <li className="left-sidebar-link">
                                    <NavLink className="flex items-center gap-2" to="/websites">
                                        <SvgComponent className="leftsidebar_icons" svgName="setting_gray" />
                                        <span>Settings</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        
                        <div className="user-profile">
                            <div className="user-avatar">
                                {user?.profile_pic ? (
                                    <img src={user.profile_pic} alt={user.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <Avatar char={user?.username.charAt(0).toUpperCase()} size="extra-small" />
                                )}
                            </div>
                            <div className="user-info">
                                <p className="user-name">{trimString(user?.username?.trim(), 14)}</p>
                                <NavLink to={`/profile/${user.id}`} className="user-profile-link">
                                    My Profile
                                </NavLink>
                            </div>
                            <Button 
                                variant="ghost" 
                                className="shad-button_ghost p-0" 
                                onClick={logout}
                            >
                                <SvgComponent svgName="logout" />
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LeftSidebarWithWebsite;
