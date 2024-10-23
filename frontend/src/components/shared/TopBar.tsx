import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthProvider";
import SvgComponent from "@/utils/SvgComponent";

const TopBar = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { mutate: signOut, isSuccess } = useSignOutAccount();
    useEffect(() => {
        if (isSuccess) {
            navigate(0);
        }
    }, [isSuccess])
    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.png" alt="Logo" width={250} height={100} />
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
                    <SvgComponent className="h-auto" svgName="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMuVZPUguhjwOPqFgeplotL_MmSDTV2Y-dJh72EC8yTQ&s'} alt="" width={50} height={50} className="h-8 w-8 rounded-full" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default TopBar
