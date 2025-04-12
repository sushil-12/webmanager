import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthProvider";
import { IWebsite } from "@/lib/types";
import SvgComponent from "@/utils/SvgComponent";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { createSlug } from "@/lib/utils";
import { getHeroIcon } from "@/lib/HeroIcon";
import { Globe2Icon } from "lucide-react";

export function SidebarWithLogo() {
  const [open, setOpen] = React.useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, navItems, setIsLoading } = useUserContext();
  const [websites, setWebsites] = useState<IWebsite[]>([]);

  const logout = async () => {
    confirmDialog({
      header: "Are you sure you want to sign out?",
      headerClassName: "font-inter text-xl",
      acceptClassName: "accept_button text-left",
      rejectClassName: "reject_button",
      className: "border bg-light-1 shadow-lg p-0 confirm_dialogue",
      accept: async () => {
        try {
          setIsLoading(true);
          localStorage.removeItem("token");
          setIsLoading(false);
          navigate("/login");
        } catch (error) {
          console.error("Logout error:", error);
          setIsLoading(false);
        }
      },
      acceptLabel: "Yes, Log me out",
      rejectLabel: "Cancel",
      closeIcon: <SvgComponent className="" svgName="close" />,
      draggable: false,
      reject: () => {
        return;
      },
    });
  };

  const handleOpen = (id: string) => {
    setOpen(open === id ? "" : id);
  };

  useEffect(() => {
    setWebsites(navItems.websites || []);
  }, [navItems, user]);

  const isActive = (url: string) => pathname.includes(url);

  return (
    <Card placeholder={""} className="h-screen w-full max-w-[280px] p-3 shadow-sm border-r bg-white">
      <ConfirmDialog />
      <div
        className="mb-4 flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-all"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <img src="/logo.png" alt="brand" className="h-7 w-7" />
        <Typography placeholder={""} className="font-semibold text-gray-800 text-lg">
          Content Locker
        </Typography>
      </div>

      <List placeholder={""} className="overflow-auto space-y-1">
        {websites.map(({ id, business_name, icon, menus }) => {
          const baseRoute = btoa(createSlug(business_name, "_"));
          return (
            <Accordion
              placeholder={""}
              key={id}
              open={open === id || isActive(baseRoute)}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-3.5 w-3.5 transition-transform ${
                    open === id ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem
                placeholder={""}
                className={`p-0 rounded-lg transition-all ${
                  isActive(baseRoute) 
                    ? "bg-primary-500 text-white hover:bg-primary-600" 
                    : "hover:bg-gray-50"
                }`}
                selected={open === id}
              >
                <AccordionHeader
                  placeholder={""}
                  onClick={() => handleOpen(id)}
                  className="border-b-0 p-2.5 rounded-lg"
                >
                  <ListItemPrefix placeholder={icon} className="mr-3">
                    {getHeroIcon("GlobeAsiaAustraliaIcon")}
                  </ListItemPrefix>
                  <Typography
                    placeholder={""}
                    className={`mr-auto font-medium text-sm ${
                      isActive(baseRoute) ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {business_name}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List placeholder={""} className="p-0 ml-4 space-y-1">
                  {menus?.map((item, index) => {
                    const additionalRoute =
                      item.type === "custom_post" ? "/posts" : "";
                    const finalRoute = `${baseRoute}${additionalRoute}/${item.route.replace(
                      /\//g,
                      ""
                    )}`;

                    return (
                      <ListItem
                        placeholder={""}
                        key={`${index}-${item.id}`}
                        onClick={() => navigate(finalRoute)}
                        className={`py-2 px-3 rounded-lg text-sm transition-all ${
                          isActive(finalRoute) 
                            ? "text-primary-500 bg-primary-50" 
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <ListItemPrefix placeholder={""} className="mr-3">
                          {getHeroIcon(item?.imgURL)}
                        </ListItemPrefix>
                        {item.label}
                      </ListItem>
                    );
                  })}
                </List>
              </AccordionBody>
            </Accordion>
          );
        })}

        <hr className="my-3 border-gray-100" />

        {(user?.role == "admin" || user?.role == "super_admin") && (
          <ListItem
            placeholder={""}
            onClick={() => navigate("/users")}
            className={`py-2.5 rounded-lg transition-all text-sm ${
              isActive("/users") 
                ? "bg-primary-500 text-white hover:bg-primary-600" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <ListItemPrefix placeholder={""} className="mr-3">
              <UsersIcon className="h-4 w-4" />
            </ListItemPrefix>
            Users
          </ListItem>
        )}

        <ListItem
          placeholder={""}
          onClick={() => navigate(`/profile/${user?.id}`)}
          className={`py-2.5 rounded-lg transition-all text-sm ${
            isActive(`/profile/${user?.id}`) 
              ? "bg-primary-500 text-white hover:bg-primary-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ListItemPrefix placeholder={""} className="mr-3">
            <UserCircleIcon className="h-4 w-4" />
          </ListItemPrefix>
          Profile
        </ListItem>

        <ListItem
          placeholder={""}
          onClick={() => navigate("/websites")}
          className={`py-2.5 rounded-lg transition-all text-sm ${
            isActive("/websites") 
              ? "bg-primary-500 text-white hover:bg-primary-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ListItemPrefix placeholder={""} className="mr-3">
            <Globe2Icon className="h-4 w-4" />
          </ListItemPrefix>
          Websites
        </ListItem>

        <ListItem
          placeholder={""}
          onClick={() => logout()}
          className="py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all mt-2"
        >
          <ListItemPrefix placeholder={""} className="mr-3">
            <PowerIcon className="h-4 w-4" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
