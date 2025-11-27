import { Wrench, Clock } from "lucide-react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
          <Wrench className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">
            We'll Be Right Back
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our site is currently under maintenance
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
            We're making some improvements to serve you better. We'll be back
            online shortly.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Expected downtime: Less than 1 hour</span>
          </div>
        </div>

        {/* Contact */}
        <div className="pt-8 border-t border-gray-200 dark:border-neutral-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need urgent assistance?{" "}
            <a
              href="mailto:support@richtext.com"
              className="text-gray-900 dark:text-white hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Admin Login Link (visible to all) */}
        <div className="pt-4">
          <Link
            href="/login"
            className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}
