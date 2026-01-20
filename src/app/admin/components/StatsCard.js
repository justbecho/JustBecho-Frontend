'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ title, value, icon: Icon, change, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  }

  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600'
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendIcon className={`h-4 w-4 mr-1 ${trendColor}`} />
              <span className={`text-sm ${trendColor}`}>
                {change} from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard