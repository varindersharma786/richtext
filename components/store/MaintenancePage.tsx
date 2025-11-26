"use client";

import { Construction } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
          <Construction className="w-12 h-12 text-yellow-600 dark:text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Under Maintenance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We are currently performing scheduled maintenance to improve your
          experience. We'll be back shortly.
        </p>
      </div>
    </div>
  );
}
