/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Loader, Users,CheckCircle } from "lucide-react";
import UsersIcon from "../../assets/Users.svg";
import OptionIcon from "../../assets/Option.svg";
import DatasetIcon from "../../assets/DatasetName.svg";
import DomainIcon from "../../assets/Domain.svg";
import SuccessMessage from "./SuccessMessage.jsx"

const SetupSummaryContent = ({
  businessDomain,
  uploadedFile,
  processingOption,
  onPrevious,
  onFinish,
  isProcessing,
  users,
  success
}) => {

  if (isProcessing) {
    return <SuccessMessage header={processingOption==="clean_only"?"Cleaning...":"Analyzing..."} lucide="analyzing"/>

  }

  if (success) {
    return <SuccessMessage header={processingOption==="clean_only"?"Dataset Cleaned Successfully!":"Dashboard Generated Successfully!"} 
    description={processingOption==="clean_only"?
      "Your data is now ready for use, head to Dashboards tab and select cleaned Datasets."
      :"Your data is now ready for use, head to Dashboards tab."} 
    lucide="completed"/>

  }

  // Helper function to get user initials
  const getUserInitials = (username) => {
    return username
      .split(" ")
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };
  
  // Helper function to get permission label
  const getPermissionLabel = (accessType) => {
    switch(accessType) {
      case "view": return "Can view";
      case "edit": return "Can edit";
      case "admin": return "Owner";
      default: return "Can view";
    }
  };

  // Determine if users section should be scrollable
  const hasScrollableUsers = users && users.length > 4;

  return (
    <div className="w-full max-w-full">
      <h2 className="text-xl md:text-2xl font-bold text-purple/500 mb-2">Dashboard Setup Summary</h2>
      <p className="text-xs md:text-sm text-orig/600 mb-4 md:mb-6">Review all your selections and configurations before finalizing your dashboard creation. This summary report consolidates your choices from each step so you can confirm that everything is set up exactly as you need.</p>
      
      <div className="text-bold mb-3 md:mb-4 flex flex-row items-center flex-wrap">
        <img src={DomainIcon} alt="Domain Icon" className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6" />
        <strong className="text-purple/500">Business Domain: </strong>  
        <span className="ml-1 md:ml-2 break-all">{businessDomain==="ecommerce"?"Ecommerce":"HR"}</span>
      </div>

      <div className="mb-3 md:mb-4 flex flex-row items-center flex-wrap">
        <img src={DatasetIcon} alt="Dataset Icon" className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6 flex-shrink-0" />
        <strong className="text-purple/500">Dataset:</strong> 
        <span className="ml-1 md:ml-2 break-all overflow-hidden text-ellipsis">{uploadedFile ? uploadedFile.name : "No dataset uploaded"}</span>
      </div>

      <div className="mb-3 md:mb-4 flex flex-row items-center flex-wrap">
        <img src={OptionIcon} alt="Processing Option Icon" className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6" />
        <strong className="text-purple/500">Processing Option:</strong>
        <span className="ml-1 md:ml-2">{processingOption==="clean_and_generate"?"Clean & Generate Dashboard":"Clean only"}</span>
      </div>

      {processingOption !== "clean_only" && (
        <div className="mb-5 md:mb-6">
          <div className="mb-2 md:mb-4 flex flex-row items-center">
            <img src={UsersIcon} alt="Users with Access Icon" className="mr-2 md:mr-3 w-5 md:w-6 h-5 md:h-6" />
            <strong className="text-purple/500">User Access:</strong>
          </div>
          
          {users && users.length > 0 ? (
            <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200 ml-2 md:ml-9 overflow-x-auto">
              <div className={`${hasScrollableUsers ? "max-h-80 overflow-y-auto pr-2" : ""}`}>
                {users.map((user) => (
                  <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 last:mb-0 gap-2 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-950 flex items-center justify-center text-white font-semibold text-xs md:text-base mr-2 md:mr-3 flex-shrink-0">
                        {user.profile_picture ? (
                          <img 
                            src={user.profile_picture} 
                            alt={user.username} 
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" 
                          />
                        ) : (
                          getUserInitials(user.username)
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate max-w-[200px] sm:max-w-none">{user.username}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="px-3 sm:px-4 md:px-6 py-1 md:py-2 rounded-md font-bold text-xs md:text-sm bg-purple-100 text-purple-800 border border-purple-800 self-start sm:self-center whitespace-nowrap">
                      {getPermissionLabel(user.access)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ml-2 md:ml-9 text-gray-500 text-sm">No users have been granted access</div>
          )}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <button
          onClick={onPrevious}
          className="bg-purple/500 text-white px-4 py-2 rounded-md hover:bg-purple-800 text-sm md:text-base w-full sm:w-auto"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button
          onClick={onFinish}
          className="bg-purple/500 text-white px-4 py-2 rounded-md hover:bg-purple-800 text-sm md:text-base w-full sm:w-auto"
        >
        Create
        </button>
      </div>
    </div>
  );
};

export default SetupSummaryContent;