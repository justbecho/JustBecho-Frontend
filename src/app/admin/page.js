import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/dashboard')
}

export const metadata = {
  title: 'Admin Panel | JustBecho',
  description: 'JustBecho Admin Dashboard',
}

// Optional: If you want to add loading state
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

// Optional: You can also create a separate loading component
// Create this in src/app/admin/loading.js