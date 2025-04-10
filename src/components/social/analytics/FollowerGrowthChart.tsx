'use client';

import { useEffect, useRef } from 'react';
import { SocialPlatformType } from '@/models/social';

interface FollowerData {
  date: string;
  followers: {
    [key in SocialPlatformType]?: number;
  };
  total: number;
}

interface FollowerGrowthChartProps {
  data: FollowerData[];
}

export default function FollowerGrowthChart({ data }: FollowerGrowthChartProps) {
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
    const maxValue = Math.max(...data.map(d => d.total));
    
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
    
    // Get all platforms from data
    const platforms = new Set<SocialPlatformType>();
    data.forEach(d => {
      Object.keys(d.followers).forEach(platform => {
        platforms.add(platform as SocialPlatformType);
      });
    });
    
    // Define colors for each platform
    const platformColors: Record<SocialPlatformType, string> = {
      'Facebook': '#3b82f6',
      'Instagram': '#ec4899',
      'Twitter': '#0ea5e9',
      'LinkedIn': '#0369a1',
      'Pinterest': '#ef4444'
    };
    
    // Draw line for each platform
    Array.from(platforms).forEach(platform => {
      ctx.beginPath();
      
      let firstPoint = true;
      data.forEach((d, i) => {
        const followers = d.followers[platform] || 0;
        const x = padding + i * step;
        const y = height - padding - (followers / maxValue * chartHeight);
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = platformColors[platform] || '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Draw total followers line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.total / maxValue * chartHeight);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw legend
    const legendItems = [
      { label: 'Total', color: '#6366f1' },
      ...Array.from(platforms).map(platform => ({
        label: platform,
        color: platformColors[platform] || '#9ca3af'
      }))
    ];
    
    let legendX = padding;
    let legendY = 20;
    let itemsPerRow = 3;
    
    legendItems.forEach((item, index) => {
      if (index > 0 && index % itemsPerRow === 0) {
        legendX = padding;
        legendY += 20;
      }
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(legendX, legendY);
      ctx.lineTo(legendX + 20, legendY);
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.label === 'Total' ? 3 : 2;
      ctx.stroke();
      
      // Draw label
      ctx.textAlign = 'left';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(item.label, legendX + 25, legendY + 3);
      
      legendX += Math.floor(chartWidth / itemsPerRow);
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
          <p className="text-gray-500">No follower data available</p>
        </div>
      )}
    </div>
  );
}
