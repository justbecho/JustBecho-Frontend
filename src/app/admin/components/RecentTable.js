'use client'

import Link from 'next/link'

const RecentTable = ({ title, data, columns, emptyMessage, viewAllLink, viewLink }) => {
  const formatValue = (item, column) => {
    // Check if item or column.key exists
    if (!item || typeof item[column.key] === 'undefined' || item[column.key] === null) {
      return '-'
    }
    
    const value = item[column.key]
    
    if (column.format) return column.format(value)
    
    if (column.key === 'createdAt' || column.key === 'updatedAt') {
      try {
        return new Date(value).toLocaleDateString()
      } catch (e) {
        return '-'
      }
    }
    
    if (column.truncate && typeof value === 'string') {
      return value.length > column.truncate 
        ? value.substring(0, column.truncate) + '...'
        : value
    }
    
    return value
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
      
      {!data || data.length === 0 ? (
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
                    {item?._id && viewLink ? (
                      <Link
                        href={`${viewLink}/${item._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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