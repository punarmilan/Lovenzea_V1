export default function PageContainer({ children }) {
    return (
        <div
            className="
                w-full
                min-h-[calc(100vh-80px)]
                bg-slate-50
                rounded-3xl
                p-4
                md:p-6
                lg:p-8
                space-y-6
            "
        >
            {children}
        </div>
    );
}