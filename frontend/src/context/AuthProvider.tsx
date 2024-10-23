import { IContextType, IUser } from "@/lib/types";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "@/lib/appwrite/api";
import { useGetWebsiteListingWithNoPagination } from "@/lib/react-query/queriesAndMutations";

export const INITIAL_USER: IUser = {
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  bio: '',
  profile_pic: '',
  role: '',
  permissions: [],
};

export const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  navItems: {},
  setNavItems: () => {},
  setUser: () => {},
  isAuthenticated: false,
  rerender: false,
  setRerender: () => {},
  setIsAuthenticated: () => {},
  setIsLoading: () => {},
  currentDomain: 'he_group',
  setCurrentDomain: async (newDomain: string) => { console.log(newDomain); },
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const savedDomain: string = localStorage.getItem('domain') || 'he_group';
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navItems, setNavItems] = useState<any>({});
  const [currentDomain, setCurrentDomain] = useState<string>(savedDomain);
  const [rerender, setRerender] = useState(false);

  const { mutateAsync: getWebsiteListingWithMenus } = useGetWebsiteListingWithNoPagination();

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const setCurrentDomainAsync = useCallback(async (newDomain: string) => {
    const domain = isBase64(newDomain) ? atob(newDomain) : newDomain;
    setCurrentDomain(domain);
    localStorage.setItem('domain', domain);
  }, []);

  const checkAuthUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentAccount = await getCurrentUser();
      const sidebar = await getWebsiteListingWithMenus();

      if (currentAccount) {
        const userData = currentAccount.data;
        setUser({
          id: userData._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          bio: userData.bio,
          temp_email: userData?.temp_email,
          profile_pic: userData.profile_pic,
          permissions: userData.permissions,
        });
        setIsAuthenticated(true);
        setNavItems(sidebar.data);
        localStorage.setItem("severty", btoa(userData.role));
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getWebsiteListingWithMenus]);

  useEffect(() => {
    const cookieFallback = localStorage.getItem("token");
    if (cookieFallback) {
      checkAuthUser();
    }
  }, [checkAuthUser, rerender]);

  const value = {
    user,
    setUser,
    isAuthenticated,
    rerender,
    setRerender,
    isLoading,
    currentDomain,
    setCurrentDomain: setCurrentDomainAsync,
    setIsAuthenticated,
    setIsLoading,
    navItems,
    setNavItems,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);
