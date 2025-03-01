/* eslint-disable react/prop-types */
import { XCircle, Upload, AlertCircle } from 'lucide-react';

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
          Browse File
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

export default UploadDatasetContent;
