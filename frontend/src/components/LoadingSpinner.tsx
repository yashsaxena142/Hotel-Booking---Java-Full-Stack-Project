const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-xl font-semibold text-indigo-900 dark:text-indigo-200">Discovering luxury stays...</p>
        <p className="text-indigo-600 dark:text-indigo-400">Loading the finest hotels for you</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;