import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard as KPICardType } from '@/types/kdt';

interface KPICardProps extends KPICardType {
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  target, 
  unit, 
  trend, 
  status, 
  className = '' 
}: KPICardProps) {
  const formatValue = (val: number, unit: string) => {
    if (unit === '%') {
      return `${val.toFixed(1)}%`;
    }
    if (unit === '/5.0') {
      return `${val.toFixed(1)}/5.0`;
    }
    return `${val.toLocaleString()}${unit}`;
  };

  const formatTarget = (target: number, unit: string) => {
    if (unit === '%') {
      return `목표: ${target}%`;
    }
    if (unit === '/5.0') {
      return `목표: ${target}/5.0`;
    }
    return `목표: ${target.toLocaleString()}${unit}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    return <TrendingDown className="w-4 h-4 text-danger" />;
  };

  const getTrendText = () => {
    if (!trend) return '변화 없음';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow duration-200`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* 주요 값 */}
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {formatValue(value, unit)}
            </span>
          </div>
          
          {/* 목표 및 트렌드 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatTarget(target, unit)}
            </span>
            
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-muted-foreground'}>
                  {getTrendText()}
                </span>
              </div>
            )}
          </div>
          
          {/* 진행률 바 */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                status === 'success' ? 'bg-success' : 
                status === 'warning' ? 'bg-warning' : 
                'bg-danger'
              }`}
              style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}