import { Skeleton } from "primereact/skeleton";

const ProfilePageSkeleton = () => {
    return (
        <div className=" w-full">
            <div className="main-content px-2 w-[400px] h-[400px]">
                <div className="mb-[40px]">
                    <div className="flex items-center gap-8">
                        <div className="">
                            <Skeleton width="110px" height="110px" className="rounded-full"></Skeleton>
                        </div>
                        <div className="img_description flex flex-col ">
                            <Skeleton width="270px" height="104px"></Skeleton>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="">
                        <form
                            className="space-y-1 flex flex-col gap-3 w-full"
                        >
                            <div className="text mb-4 flex flex-col gap-3">
                                <div className="flex gap-4">
                                    <Skeleton width="370px" height="40px"></Skeleton>
                                    <Skeleton width="110px" height="40px"></Skeleton>
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton width="370px" height="40px"></Skeleton>
                                    <Skeleton width="110px" height="40px"></Skeleton>
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton width="370px" height="40px"></Skeleton>
                                    <Skeleton width="110px" height="40px"></Skeleton>
                                </div>

                            </div>

                            <div className="flex gap-8 ">
                                <Skeleton width="140px" height="34px"></Skeleton>
                                <Skeleton width="150px" height="34px"></Skeleton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePageSkeleton;