import Link from "next/link";
import React from "react";

interface ComponentCardProps {
  title?: string;
  children: React.ReactNode;
  urlButton?: string;
  titleButton?: string;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  urlButton,
  titleButton,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-800 dark:text-white">
              {title}
            </h1>
            {desc && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">{desc}</p>
            )}
          </div>

          {urlButton && titleButton && (
            <Link
              href={urlButton}
              className="bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 px-4 py-2 rounded-md text-white transition-colors duration-200"
            >
              {titleButton}
            </Link>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
