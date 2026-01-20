'use client'

import Link from 'next/link'

const RecentTable = ({ title, data, columns, emptyMessage, viewAllLink }) => {
  const formatValue = (item, column) => {
    if (!item[column.key]) return '-'
    
    if (column.format) return column.format(item[column.key])
    
    if (column.key === 'createdAt' || column.key === 'updatedAt') {
      return new Date(item[column.key]).toLocaleDateString()
    }
    
    if (column.truncate) {
      return typeof item[column.key] === 'string' 
        ? item[column.key].substring(0, column.truncate) + '...'
        : item[column.key]
    }
    
    return item[column.key]
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all →
            </Link>
          )}
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 5).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(item, column)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/users/${item._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RecentTable