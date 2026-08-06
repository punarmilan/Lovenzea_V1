import Headers from "../components/Headers";
import SecondNav from "../components/SecondNav";
export default function MyShadiLayout({ children }) {
    return (
        <>
            <Headers />
            <div className="pt-16 h-screen w-full bg-theme-bg relative overflow-hidden">
                {/* No overlay - maximum visibility */}
                <div className="max-w-[1600px] mx-auto relative z-10 h-full">
                    <div className="flex gap-4 lg:gap-5 px-0 sm:px-4 lg:px-6 py-0 sm:py-4 h-full pb-16 md:pb-4">

                        {/* Left Sidebar */}
                        <div className="hidden md:block flex-shrink-0 z-10 w-full max-w-[250px] h-[calc(100vh-6rem)] overflow-y-auto pr-1 scrollbar-hide">
                            <SecondNav />
                        </div>

                        {/* Main Content */}
                        <main className="flex-1 min-w-0 overflow-y-auto h-full md:h-[calc(100vh-6rem)] pr-1 scrollbar-hide">
                            <div className="w-full min-h-full pb-20 md:pb-0">
                                {children}
                            </div>
                        </main>

                    </div>
                </div>
            </div>
            
            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <SecondNav />
            </div>
        </>
    );
}