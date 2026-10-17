export default function ProfileCardSkeleton() {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 animate-pulse">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 bg-gray-300 rounded-full dark:bg-gray-700" />
          <div className="space-y-2 w-full xl:w-auto">
            <div className="h-4 bg-gray-300 rounded w-48 dark:bg-gray-700" />
            <div className="flex gap-3">
              <div className="h-3 bg-gray-300 rounded w-40 dark:bg-gray-700" />
              <div className="h-3 bg-gray-300 rounded w-24 dark:bg-gray-700" />
            </div>
          </div>
        </div>
        <div className="h-10 bg-gray-300 rounded-full w-32 dark:bg-gray-700" />
      </div>
    </div>
  );
}
