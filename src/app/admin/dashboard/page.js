'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RecentTable from '../components/RecentTable'
import Chart from '../components/Chart'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totals: { users: 0, products: 0, orders: 0, verifiedSellers: 0 },
    products: { active: 0, sold: 0 },
    orders: { pending: 0, delivered: 0 },
    sales: { total: 0 },
    recent: { users: [], orders: [] }
  })
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchDashboardData()
    fetchChartData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://just-becho-backend.vercel.app/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        // Safe assignment with fallbacks
        setStats({
          totals: {
            users: data.stats?.totals?.users || 0,
            products: data.stats?.totals?.products || 0,
            orders: data.stats?.totals?.orders || 0,
            verifiedSellers: data.stats?.totals?.verifiedSellers || 0
          },
          products: {
            active: data.stats?.products?.active || 0,
            sold: data.stats?.products?.sold || 0
          },
          orders: {
            pending: data.stats?.orders?.pending || 0,
            delivered: data.stats?.orders?.delivered || 0
          },
          sales: {
            total: data.stats?.sales?.total || 0
          },
          recent: {
            users: Array.isArray(data.stats?.recent?.users) ? data.stats.recent.users : [],
            orders: Array.isArray(data.stats?.recent?.orders) ? data.stats.recent.orders : []
          }
        })
      } else {
        // If API returns error, keep default state
        console.error('Failed to fetch stats:', data.message)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://just-becho-backend.vercel.app/api/admin/dashboard/sales-report', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success && Array.isArray(data.report)) {
        setChartData(data.report)
      } else {
        setChartData([])
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setChartData([])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totals.users}
          icon={Users}
          change="+12%"
          trend="up"
          color="blue"
        />
        
        <StatsCard
          title="Total Products"
          value={stats.totals.products}
          icon={Package}
          change="+5%"
          trend="up"
          color="green"
        />
        
        <StatsCard
          title="Total Orders"
          value={stats.totals.orders}
          icon={ShoppingCart}
          change="+18%"
          trend="up"
          color="purple"
        />
        
        <StatsCard
          title="Total Sales"
          value={`₹${stats.sales.total.toLocaleString('en-IN')}`}
          icon={DollarSign}
          change="+24%"
          trend="up"
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <Chart data={chartData} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Products</span>
              <span className="font-semibold">{stats.products.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sold Products</span>
              <span className="font-semibold">{stats.products.sold}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-semibold">{stats.orders.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Delivered Orders</span>
              <span className="font-semibold">{stats.orders.delivered}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verified Sellers</span>
              <span className="font-semibold">{stats.totals.verifiedSellers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTable
          title="Recent Users"
          data={stats.recent.users}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'createdAt', label: 'Joined' }
          ]}
          emptyMessage="No recent users"
          viewAllLink="/admin/users"
          viewLink="/admin/users"
        />
        
        <RecentTable
          title="Recent Orders"
          data={stats.recent.orders}
          columns={[
            { key: '_id', label: 'Order ID', truncate: 8 },
            { key: 'totalAmount', label: 'Amount', format: (val) => `₹${val || 0}` },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Date' }
          ]}
          emptyMessage="No recent orders"
          viewAllLink="/admin/orders"
          viewLink="/admin/orders"
        />
      </div>
    </div>
  )
}