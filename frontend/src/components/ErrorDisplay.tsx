interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-xl">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">😕</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;