import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPICard } from '@/components/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterState, KDTProgram } from '@/types/kdt';
import { calculateKPI } from '@/data/kdtData';

interface OverviewTabProps {
  programs: KDTProgram[];
  filters: FilterState;
}

export function OverviewTab({ programs, filters }: OverviewTabProps) {
  // KPI 계산
  const kpiData = useMemo(() => calculateKPI(programs), [programs]);
  
  // 분기별 추이 데이터 생성
  const trendData = useMemo(() => {
    const quarterGroups = programs.reduce((acc, program) => {
      const key = program.분기키;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(program);
      return acc;
    }, {} as Record<string, KDTProgram[]>);

    return Object.entries(quarterGroups)
      .map(([quarter, programs]) => {
        const completed = programs.filter(p => p.진행상태 === '완료');
        const withSatisfaction = programs.filter(p => p.HRD_만족도 !== null);
        
        return {
          name: quarter,
          모객율: programs.length > 0 ? 
            Math.round((programs.reduce((sum, p) => sum + p.모객율, 0) / programs.length) * 10) / 10 : 0,
          취업률: completed.length > 0 ? 
            Math.round((completed.reduce((sum, p) => sum + (p.취업률 || 0), 0) / completed.length) * 10) / 10 : 0,
          만족도: withSatisfaction.length > 0 ? 
            Math.round((withSatisfaction.reduce((sum, p) => sum + (p.HRD_만족도 || 0), 0) / withSatisfaction.length * 20) * 10) / 10 : 0, // 5점을 100점 스케일로 변환
          수료율: completed.length > 0 ? 
            Math.round((completed.reduce((sum, p) => sum + p.수료율, 0) / completed.length) * 10) / 10 : 0,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [programs]);

  // 전분기 대비 트렌드 계산 (단순화)
  const getTrend = (current: number, target: number) => {
    // 실제로는 전분기 데이터와 비교해야 하지만, 여기서는 목표 달성률 기준으로 간략화
    const achievement = (current / target) * 100;
    if (achievement >= 100) return 5.0; // 목표 달성시 5% 증가로 가정
    if (achievement >= 85) return 2.0; // 85% 이상시 2% 증가
    if (achievement >= 70) return -1.0; // 70% 이상시 1% 감소
    return -5.0; // 70% 미만시 5% 감소
  };

  const kpiCards = [
    {
      title: '평균 모객율',
      value: kpiData.평균_모객율,
      target: 85,
      unit: '%',
      trend: getTrend(kpiData.평균_모객율, 85),
      status: kpiData.평균_모객율 >= 85 ? 'success' as const : 'danger' as const,
    },
    {
      title: '평균 취업률',
      value: kpiData.평균_취업률,
      target: 75,
      unit: '%',
      trend: getTrend(kpiData.평균_취업률, 75),
      status: kpiData.평균_취업률 >= 75 ? 'success' as const : 'danger' as const,
    },
    {
      title: '평균 HRD 만족도',
      value: kpiData.평균_HRD_만족도,
      target: 4.3,
      unit: '/5.0',
      trend: getTrend(kpiData.평균_HRD_만족도, 4.3),
      status: kpiData.평균_HRD_만족도 >= 4.3 ? 'success' as const : 'danger' as const,
    },
    {
      title: '평균 수료율',
      value: kpiData.평균_수료율,
      target: 90,
      unit: '%',
      trend: getTrend(kpiData.평균_수료율, 90),
      status: kpiData.평균_수료율 >= 90 ? 'success' as const : 'danger' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* 분기별 성과 추이 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>분기별 성과 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="name" 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="모객율"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="모객율 (%)"
                />
                <Line
                  type="monotone"
                  dataKey="취업률"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="취업률 (%)"
                />
                <Line
                  type="monotone"
                  dataKey="만족도"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="만족도 (20점 환산)"
                />
                <Line
                  type="monotone"
                  dataKey="수료율"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="수료율 (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}