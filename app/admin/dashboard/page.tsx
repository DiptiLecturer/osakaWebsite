import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard <span className="text-red-600">Overview</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">Total Products</div>
          <div className="text-3xl font-bold text-red-600">13</div>
          <div className="text-xs text-gray-500 mt-2">All TV models</div>
        </Card>

        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">Gallery Photos</div>
          <div className="text-3xl font-bold text-red-600">8</div>
          <div className="text-xs text-gray-500 mt-2">Company images</div>
        </Card>

        <Card className="p-6">
          <div className="text-gray-600 text-sm mb-2">Messages</div>
          <div className="text-3xl font-bold text-red-600">0</div>
          <div className="text-xs text-gray-500 mt-2">Contact inquiries</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/dashboard/products">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer border-2 hover:border-red-600">
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove TV models</p>
          </Card>
        </Link>

        <Link href="/admin/dashboard/gallery">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer border-2 hover:border-red-600">
            <div className="text-4xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold mb-2">Manage Gallery</h3>
            <p className="text-gray-600 text-sm">Upload and organize photos</p>
          </Card>
        </Link>

        <Link href="/admin/dashboard/messages">
          <Card className="p-6 hover:shadow-lg transition cursor-pointer border-2 hover:border-red-600">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">View Messages</h3>
            <p className="text-gray-600 text-sm">Check contact form submissions</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}