'use client'

import { useEffect, useRef } from 'react'

const Chart = ({ data, type = 'line', height = 300 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!data || !canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw simple chart
    if (type === 'line' && data.salesData) {
      drawLineChart(ctx, width, height, data.salesData)
    }
  }, [data, type])

  const drawLineChart = (ctx, width, height, salesData) => {
    if (!salesData || salesData.length === 0) return

    const maxValue = Math.max(...salesData.map(d => d.totalSales))
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const pointSpacing = chartWidth / (salesData.length - 1)

    // Draw axes
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = '#f3f4f6'
    ctx.lineWidth = 0.5
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw data points and line
    ctx.strokeStyle = '#3b82f6'
    ctx.fillStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    salesData.forEach((point, index) => {
      const x = padding + index * pointSpacing
      const y = height - padding - (point.totalSales / maxValue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillRect(x - 3, y - 3, 6, 6)
    })

    ctx.stroke()

    // Draw labels
    ctx.fillStyle = '#6b7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    salesData.forEach((point, index) => {
      const x = padding + index * pointSpacing
      const date = `${point._id.day}/${point._id.month}`
      ctx.fillText(date, x, height - padding + 10)
    })

    // Draw value labels
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    for (let i = 0; i <= gridLines; i++) {
      const value = Math.round((maxValue / gridLines) * (gridLines - i))
      const y = padding + (chartHeight / gridLines) * i
      ctx.fillText(`₹${value.toLocaleString()}`, padding - 5, y)
    }
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full"
      />
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No chart data available</p>
        </div>
      )}
    </div>
  )
}

export default Chart