export default function ProfileInformationSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between animate-pulse">
      <div className="w-full">
        <div className="h-6 bg-gray-300 rounded w-40 mb-6 dark:bg-gray-700" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="mb-2 h-3 bg-gray-300 rounded w-32 dark:bg-gray-600" />
              <div className="h-4 bg-gray-400 rounded w-full dark:bg-gray-700" />
            </div>
          ))}

          {/* Latar Belakang (col-span-2) */}
          <div className="col-span-2">
            <div className="mb-2 h-3 bg-gray-300 rounded w-32 dark:bg-gray-600" />
            <div className="h-4 bg-gray-400 rounded w-full dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="h-10 w-32 bg-gray-300 rounded-full dark:bg-gray-700" />
    </div>
  );
}
