/* eslint-disable react/prop-types */
import  { useState } from 'react';
import { XCircle, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DashboardSetupFlow = ({onClose}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessDomain, setBusinessDomain] = useState('ecommerce');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingOption, setProcessingOption] = useState('clean_only');
  const [downloadAfterCreating, setDownloadAfterCreating] = useState(true);
  const [showError, setShowError] = useState(false);

  const handleNext = () => {
    if (currentStep === 2 && !uploadedFile) {
      setShowError(true);
      return;
    }
    
    setShowError(false);
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setShowError(false);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowError(false);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 60) {
          clearInterval(interval);
        }
      }, 300);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setShowError(false);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 60) {
          clearInterval(interval);
        }
      }, 300);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDomainChange = (domain) => {
    setBusinessDomain(domain);
  };

  const handleProcessingOptionChange = (option) => {
    setProcessingOption(option);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const steps = [
    { number: 1, title: 'Choose Business Domain' },
    { number: 2, title: 'Upload Dataset' },
    { number: 3, title: 'Customize Your Processing' },
    { number: 4, title: 'Grant Access to Users' }
  ];

  return (
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-4 md:p-8">
        <button onClick={()=>onClose(false)} className="absolute top-4 right-4 text-purple-800">
          <XCircle size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Step indicator - only rendered once */}
          <div className="flex md:flex-col md:space-y-4 space-x-4 md:space-x-0 w-full md:w-64 mb-6 md:mb-0 md:mr-8 overflow-x-auto md:overflow-visible">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center whitespace-nowrap">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${step.number < currentStep ? 'bg-green-500 text-white' : 
                      step.number === currentStep ? 'bg-purple-700 text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {step.number < currentStep ? (
                    <CheckCircle size={16} />
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`${step.number === currentStep ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Content area - changes based on current step */}
          <div className="flex-1">
            {currentStep === 1 && (
              <BusinessDomainContent 
                businessDomain={businessDomain} 
                onDomainChange={handleDomainChange} 
                onNext={handleNext} 
              />
            )}

            {currentStep === 2 && (
              <UploadDatasetContent 
                uploadedFile={uploadedFile} 
                uploadProgress={uploadProgress}
                showError={showError}
                onFileUpload={handleFileUpload}
                onFileDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onRemoveFile={handleRemoveFile}
                onNext={handleNext} 
                onPrevious={handlePrevious} 
              />
            )}

            {currentStep === 3 && (
              <CustomizeProcessingContent 
                processingOption={processingOption} 
                downloadAfterCreating={downloadAfterCreating}
                onProcessingOptionChange={handleProcessingOptionChange} 
                onDownloadToggle={() => setDownloadAfterCreating(!downloadAfterCreating)}
                onNext={handleNext} 
                onPrevious={handlePrevious} 
              />
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-medium text-purple-700 mb-2">Grant Access to Users</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Specify which users or teams should have access to this dashboard.
                </p>
                <div className="flex justify-between">
                  <button 
                    onClick={handlePrevious}
                    className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
                  >
                    <span className="mr-1">←</span> Previous
                  </button>
                  <button 
                    className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
                  >
                    Finish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

const BusinessDomainContent = ({ businessDomain, onDomainChange, onNext }) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Choose Business Domain</h2>
      <p className="text-sm text-gray-600 mb-6">
        Begin your dashboard creation by choosing the business domain that best represents your organization.
        This selection helps tailor your dashboard to industry-specific metrics and insights.
      </p>

      <div className="space-y-2 mb-8">
        <label className="flex items-center space-x-2">
          <input 
            type="radio" 
            name="domain" 
            value="ecommerce"
            checked={businessDomain === 'ecommerce'}
            onChange={() => onDomainChange('ecommerce')}
            className="text-purple-700"
          />
          <span>Ecommerce</span>
        </label>
        <label className="flex items-center space-x-2">
          <input 
            type="radio" 
            name="domain" 
            value="hr"
            checked={businessDomain === 'hr'}
            onChange={() => onDomainChange('hr')}
            className="text-purple-700"
          />
          <span>HR</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Next
        </button>
      </div>
    </>
  );
};

const UploadDatasetContent = ({ 
  uploadedFile, 
  uploadProgress, 
  showError,
  onFileUpload, 
  onFileDrop,
  onDragOver,
  onRemoveFile,
  onNext, 
  onPrevious 
}) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Upload Dataset</h2>
      <p className="text-sm text-gray-600 mb-6">
        Securely upload your data file to start building your dashboard. Our platform supports multiple file formats
        (CSV, Excel, JSON, etc.). Preview your data to ensure accuracy before moving forward.
      </p>
      
      <div 
        className={`border-2 border-dashed ${showError ? 'border-red-500' : 'border-gray-300'} 
          rounded-lg p-4 md:p-8 flex flex-col items-center justify-center mb-4`}
        onDrop={onFileDrop}
        onDragOver={onDragOver}
      >
        <Upload className={`${showError ? 'text-red-500' : 'text-gray-400'} mb-4`} size={32} />
        <p className="text-base md:text-lg text-center mb-2">Choose a file or drag & drop it here</p>
        <p className="text-xs md:text-sm text-gray-500 mb-4">CSV, excel, and JSON supported up to 500MB</p>
        <button 
          onClick={() => document.getElementById('file-upload').click()}
          className={`${showError ? 'bg-red-500' : 'bg-purple-700'} text-white px-4 py-2 rounded-md hover:opacity-90`}
        >
          Browse Filez
        </button>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          onChange={onFileUpload}
          accept=".csv,.xls,.xlsx,.json"
        />
      </div>

      {showError && (
        <div className="flex items-center mb-4 text-red-500 text-sm">
          <AlertCircle size={16} className="mr-2" />
          <span>Please upload a dataset file to continue</span>
        </div>
      )}

      {uploadedFile && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-12 bg-purple-200 rounded mr-3"></div>
              <div>
                <p className="font-medium text-sm md:text-base">{uploadedFile.name || "Walmart Sales"}</p>
                <p className="text-xs md:text-sm text-gray-500">
                  {Math.round(uploadedFile.size / 1024)} KB of {Math.ceil(uploadedFile.size / 1024 / 1024)} MB • Uploading...
                </p>
              </div>
            </div>
            <button 
              className="text-gray-500"
              onClick={onRemoveFile}
            >
              <XCircle size={20} />
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-purple-600 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button 
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={onNext}
          className={`${!uploadedFile ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'} 
            text-white px-6 py-2 rounded-md`}
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

const CustomizeProcessingContent = ({ 
  processingOption, 
  downloadAfterCreating,
  onProcessingOptionChange, 
  onDownloadToggle,
  onNext, 
  onPrevious 
}) => {
  return (
    <>
      <h2 className="text-2xl font-medium text-purple-700 mb-2">Customize Your Processing</h2>
      <p className="text-sm text-gray-600 mb-6">
        In this step, choose the intent of data processing. Opt to simply clean your dataset for manual review later,
        or clean and auto-generate a dashboard loaded with key insights to kickstart your analysis.
      </p>

      <div className="space-y-6 mb-8">
        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_only"
            checked={processingOption === 'clean_only'}
            onChange={() => onProcessingOptionChange('clean_only')}
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean Only</p>
            <p className="text-sm text-purple-600">
              Choose this option if you prefer to focus solely on preparing your data. Our cleaning process will address
              inconsistencies, handle missing values, and standardize your data, ensuring a robust foundation for any 
              future analysis or manual dashboard creation.
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-2">
          <input 
            type="radio" 
            name="processing" 
            value="clean_and_generate"
            checked={processingOption === 'clean_and_generate'}
            onChange={() => onProcessingOptionChange('clean_and_generate')}
            className="mt-1 text-purple-700"
          />
          <div>
            <p className="font-medium">Clean & Generate Dashboard</p>
            <p className="text-sm text-purple-600">
              Choose this option to not only clean your dataset but also to automatically generate a fully dashboard.
              This option provides immediate visual insights by transforming your data into actionable analytics,
              perfect for users looking to jump straight into data exploration.
            </p>
          </div>
        </label>
      </div>

      <div className="mb-8">
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={downloadAfterCreating}
            onChange={onDownloadToggle}
            className="text-purple-700"
          />
          <span>Download after creating</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button 
          onClick={onPrevious}
          className="border border-purple-700 text-purple-700 px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-1">←</span> Previous
        </button>
        <button 
          onClick={onNext}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800"
        >
          Next <span className="ml-1">→</span>
        </button>
      </div>
    </>
  );
};

export default DashboardSetupFlow;