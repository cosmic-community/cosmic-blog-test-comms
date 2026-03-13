import Link from 'next/link'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Newsletter section */}
        <div className="pb-8 mb-8 border-b border-gray-200">
          <div className="max-w-md">
            <NewsletterSignup compact />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label="Blog">
              📝
            </span>
            <span className="text-sm font-semibold text-gray-900">Cosmic Blog</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Categories
            </Link>
            {/* Changed: Added About link to footer navigation */}
            <Link
              href="/about"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              About
            </Link>
          </nav>
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Cosmic Blog. Powered by{' '}
            <a
              href="https://www.cosmicjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 transition-colors"
            >
              Cosmic
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}