'use client';

import { useEffect, useRef } from 'react';

interface EngagementData {
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

interface EngagementChartProps {
  data: EngagementData[];
}

export default function EngagementChart({ data }: EngagementChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    // This is a placeholder for chart rendering
    // In a real implementation, you would use a charting library like Chart.js or Recharts
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
    
    // Set dimensions
    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Find max value for scaling
    const maxValue = Math.max(
      ...data.map(d => Math.max(d.likes, d.comments, d.shares))
    );
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw x-axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px sans-serif';
    
    const step = chartWidth / (data.length - 1);
    data.forEach((d, i) => {
      const x = padding + i * step;
      ctx.fillText(d.date, x, height - padding + 15);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = Math.round(maxValue * i / 5);
      ctx.fillText(value.toString(), padding - 5, y + 3);
      
      // Draw grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    
    // Draw likes line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.likes / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw comments line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.comments / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw shares line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.shares / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw legend
    const legendItems = [
      { label: 'Likes', color: '#3b82f6' },
      { label: 'Comments', color: '#10b981' },
      { label: 'Shares', color: '#f59e0b' }
    ];
    
    let legendX = padding;
    legendItems.forEach(item => {
      // Draw line
      ctx.beginPath();
      ctx.moveTo(legendX, 20);
      ctx.lineTo(legendX + 20, 20);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'left';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(item.label, legendX + 25, 23);
      
      legendX += 100;
    });
    
  }, [data]);
  
  return (
    <div className="w-full h-80 relative">
      <canvas 
        ref={chartRef} 
        className="w-full h-full"
        width={800}
        height={400}
      />
      
      {/* Fallback for when canvas is not supported or data is empty */}
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">No engagement data available</p>
        </div>
      )}
    </div>
  );
}
