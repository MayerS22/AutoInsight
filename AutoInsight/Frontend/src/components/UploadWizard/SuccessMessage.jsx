/* eslint-disable react/prop-types */
import { CheckCircle2Icon, Loader } from "lucide-react"
import { useSelector } from "react-redux";
const SuccessMessage = ({ header, description = "", lucide }) => {
  const theme = useSelector((state) => state.theme.mode);
  return (<div className="flex justify-center flex-col items-center h-full">
    {lucide === "completed" ? <CheckCircle2Icon size={59} className="text-green-600 text-bold" /> : <Loader size={59} className="animate-spin text-purple-900 text-bold" />}

    {lucide === "completed" ?
      <>
        <p className={`text-lg ${theme === "light" ? "text-green-600" : "text-green-300"} mt-2 font-bold`}> {header}</p>
        <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-300"}`}>{description}</p>
      </>
      :
        <p className={`text-lg ${theme === "light" ? "text-purple-900" : "text-purple-200"} mt-2 font-bold`}> {header}</p>
  
    }
  </div>)
}
export default SuccessMessage;