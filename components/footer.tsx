export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} RichText App. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-gray-300">Contact</a>
        </div>
      </div>
    </footer>
  )
}
