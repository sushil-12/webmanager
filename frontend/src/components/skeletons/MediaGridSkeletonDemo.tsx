import { Skeleton } from 'primereact/skeleton';

export default function MediaGridSkeletonDemo() {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
            {Array.from({ length: 16 }, (_, index) => (

                <div className="card" key={index}>
                    <div className="border-round border-1 surface-border p-4 surface-card">
                        <Skeleton width="100%" height="150px"></Skeleton>
                        <div className="flex place-content-between-end mt-3 justify-between">
                            <div className="flex flex-col">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div>))
            }
        </div>
    );
}
