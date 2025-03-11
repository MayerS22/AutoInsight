/* eslint-disable react/prop-types */
import { CheckCircle2Icon, Loader } from "lucide-react"
const SuccessMessage = ({ header, description = "", lucide }) => {
  return (<div className="flex justify-center flex-col items-center h-full">
    {lucide === "completed" ? <CheckCircle2Icon size={59} className="text-green-600 text-bold" /> : <Loader size={59} className="animate-spin text-purple-900 text-bold" />}

    {lucide === "completed" ?
      <>
        <p className="text-lg text-green-600 mt-2 font-bold"> {header}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </>
      :
        <p className="text-lg text-purple-900 mt-2 font-bold"> {header}</p>
  
    }
  </div>)
}
export default SuccessMessage;