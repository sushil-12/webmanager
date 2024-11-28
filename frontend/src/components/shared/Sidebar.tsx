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
  Cog6ToothIcon,
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

export function SidebarWithLogo() {
  const [open, setOpen] = React.useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user, navItems, setIsLoading } = useUserContext();
  const [websites, setWebsites] = useState<IWebsite[]>([]);

  const logout = async () => {
    confirmDialog({
      header: "Are you sure you want to sign out of application?",
      headerClassName: "font-inter text-[2rem]",
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
    <Card placeholder={""} className="h-screen w-full p-4 shadow-xl min-w-[300px] ">
      <ConfirmDialog />
      <div
        className="mb-2 flex items-center gap-2 p-2 cursor-pointer"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        <img src="/logo.png" alt="brand" className="h-8 w-8" />
        <Typography placeholder={""} variant="h5" color="blue-gray">
          Content Locker
        </Typography>
      </div>

      <List placeholder={""} className="overflow-auto">
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
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === id ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem
                placeholder={""}
                className={`p-0 hover:bg-primary-500 hover:text-white ${
                  isActive(baseRoute) ? "bg-primary-500 text-white" : ""
                }`}
                selected={open === id}
              >
                <AccordionHeader
                  placeholder={""}
                  onClick={() => handleOpen(id)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix placeholder={icon} className="mr-4">
                    {getHeroIcon("GlobeAsiaAustraliaIcon")}
                  </ListItemPrefix>
                  <Typography
                    placeholder={""}
                    color="blue-gray"
                    className="mr-auto font-normal"
                  >
                    {business_name}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1 rounded-md border-b-1">
                <List placeholder={""} className="p-0 ml-4 text-sm  ">
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
                        className={`hover:text-primary-500 ${
                          isActive(finalRoute) ? " text-blue-600" : ""
                        }`}
                      >
                        <ListItemPrefix placeholder={""}>
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

        <hr className="my-2 border-blue-gray-50" />

        {(user?.role == "admin" || user?.role == "super_admin") && (
          <ListItem
            placeholder={""}
            onClick={() => navigate("/users")}
            className={`hover:bg-primary-500 hover:text-white ${
              isActive("/users") ? "bg-primary-500 text-white" : ""
            }`}
          >
            <ListItemPrefix placeholder={""}>
              <UsersIcon className="h-5 w-5" />
            </ListItemPrefix>
            Users
          </ListItem>
        )}

        <ListItem
          placeholder={""}
          onClick={() => navigate(`/profile/${user?.id}`)}
          className={`hover:bg-primary-500 hover:text-white ${
            isActive(`/profile/${user?.id}`) ? "bg-primary-500 text-white" : ""
          }`}
        >
          <ListItemPrefix placeholder={""}>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>

        <ListItem
          placeholder={""}
          onClick={() => navigate("/websites")}
          className={`hover:bg-primary-500 hover:text-white ${
            isActive("/websites") ? "bg-primary-500 text-white" : ""
          }`}
        >
          <ListItemPrefix placeholder={""}>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>

        <ListItem
          placeholder={""}
          onClick={() => logout()}
          className="hover:bg-red-100 text-red-500"
        >
          <ListItemPrefix placeholder={""}>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
