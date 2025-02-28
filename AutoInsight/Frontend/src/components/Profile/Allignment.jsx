/* eslint-disable react/prop-types */
export const Allignment = ({children}) => {
    return (
        <>
            <div className="flex flex-col min-h-screen items-center pt-16 mt-[50px] px-4">
                {children}
            </div>
        </>
    )
}