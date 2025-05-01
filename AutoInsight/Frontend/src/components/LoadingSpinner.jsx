/* eslint-disable react/prop-types */
export const LoadingSpinner = ({coordinates}) => {
    return (
        <>
            <div className="flex justify-center items-center ">
                <div className={`loader border-t-4 border-purple-900 rounded-full ${coordinates} animate-spin`}></div>
            </div>
        </>
    )
}