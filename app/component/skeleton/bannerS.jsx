"use client"

const BannerS = () => {
    return (
        <div className="border border-gray-200 rounded-md max-h-screen max-w-screen w-full mx-auto">
            <div className="animate-pulse flex">
                <div className="flex rounded-md justify-center items-center bg-slate-100 w-full md:h-[700px] h-[200px]">
                    Loading ..
                </div>
            </div>
        </div>
    )
}

export default BannerS