export function NotLoggedIn(){
    return <>
    <div className="flex items-center justify-center h-screen">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-purple-800">Access Denied</h2>
                    <p className="text-gray-600 mt-2">You must be logged in to view this page.</p>
                    <p 
                      
                        className="mt-4 px-4 py-2 text-purple-700 rounded-lg font-bold"
                    >
                        Go to Login
                    </p>
                </div>
            </div>
    </>
}