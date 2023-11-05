export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-gray-200 rounded-full animate-spin"></div>
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    </div>
  );
}
