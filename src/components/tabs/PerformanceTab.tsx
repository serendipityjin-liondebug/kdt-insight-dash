import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterState, KDTProgram } from '@/types/kdt';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { AnnualCalendar } from '../performance/AnnualCalendar';
import { CourseCompletionStatus } from '../performance/CourseCompletionStatus';
import { QuarterlyCourseTabs } from '../performance/QuarterlyCourseTabs';

interface PerformanceTabProps {
  programs: KDTProgram[];
  filters: FilterState;
}

export function PerformanceTab({ programs, filters }: PerformanceTabProps) {
  // 분기별 매출 추이 데이터
  const revenueData = useMemo(() => {
    const quarterGroups = programs.reduce((acc, program) => {
      const key = program.분기키;
      if (!acc[key]) {
        acc[key] = { name: key, revenue: 0, programs: 0 };
      }
      acc[key].revenue += program.최소_매출 || 0;
      acc[key].programs += 1;
      return acc;
    }, {} as Record<string, { name: string; revenue: number; programs: number }>);

    return Object.values(quarterGroups)
      .sort((a, b) => {
        // 분기키를 년도와 분기로 파싱하여 시간순 정렬
        const parseQuarter = (quarterKey: string) => {
          const [year, quarter] = quarterKey.split(' ');
          const quarterNum = parseInt(quarter.replace('Q', ''));
          return { year: parseInt(year), quarter: quarterNum };
        };
        
        const aData = parseQuarter(a.name);
        const bData = parseQuarter(b.name);
        
        if (aData.year !== bData.year) {
          return aData.year - bData.year;
        }
        return aData.quarter - bData.quarter;
      })
      .map(item => ({
        ...item,
        revenue: Math.round(item.revenue / 100000000), // 억원 단위로 변환
      }));
  }, [programs]);

  // 성과 요약 계산
  const performanceSummary = useMemo(() => {
    const sortedData = revenueData.sort((a, b) => a.name.localeCompare(b.name));
    const firstQuarter = sortedData[0];
    const lastQuarter = sortedData[sortedData.length - 1];
    
    const growthRate = firstQuarter && lastQuarter && firstQuarter.revenue > 0 
      ? ((lastQuarter.revenue - firstQuarter.revenue) / firstQuarter.revenue) * 100
      : 0;

    return {
      growthRate: Math.round(growthRate * 10) / 10,
      initialRevenue: firstQuarter?.revenue || 0,
      currentRevenue: lastQuarter?.revenue || 0,
      totalRevenue: programs.reduce((sum, p) => sum + (p.최소_매출 || 0), 0),
    };
  }, [programs, revenueData]);

  // 과정구분별 매출 비중
  const categoryRevenue = useMemo(() => {
    const categoryData = programs.reduce((acc, program) => {
      const category = program.과정구분;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += program.최소_매출 || 0;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryData)
      .map(([name, value]) => ({ name, value: Math.round(value / 100000000) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // 상위 8개만
  }, [programs]);

  // 분기별 요약 테이블 데이터
  const quarterSummary = useMemo(() => {
    const quarterGroups = programs.reduce((acc, program) => {
      const key = program.분기키;
      if (!acc[key]) {
        acc[key] = {
          quarter: key,
          programs: [],
          revenue: 0,
        };
      }
      acc[key].programs.push(program);
      acc[key].revenue += program.최소_매출 || 0;
      return acc;
    }, {} as Record<string, { quarter: string; programs: KDTProgram[]; revenue: number }>);

    return Object.values(quarterGroups).map(item => {
      const completed = item.programs.filter(p => p.진행상태 === '완료');
      const inProgress = item.programs.filter(p => p.진행상태 === '진행중');
      
      const avgCompletionRate = completed.length > 0 
        ? completed.reduce((sum, p) => sum + p.수료율, 0) / completed.length 
        : 0;
      
      const avgEmploymentRate = completed.length > 0 
        ? completed.reduce((sum, p) => sum + (p.취업률 || 0), 0) / completed.length 
        : 0;

      return {
        quarter: item.quarter,
        revenue: item.revenue,
        completionRate: Math.round(avgCompletionRate * 10) / 10,
        employmentRate: Math.round(avgEmploymentRate * 10) / 10,
        completed: completed.length,
        inProgress: inProgress.length,
      };
    }).sort((a, b) => {
      // 분기키를 년도와 분기로 파싱하여 시간순 정렬
      const parseQuarter = (quarterKey: string) => {
        const [year, quarter] = quarterKey.split(' ');
        const quarterNum = parseInt(quarter.replace('Q', ''));
        return { year: parseInt(year), quarter: quarterNum };
      };
      
      const aData = parseQuarter(a.quarter);
      const bData = parseQuarter(b.quarter);
      
      if (aData.year !== bData.year) {
        return aData.year - bData.year;
      }
      return aData.quarter - bData.quarter;
    });
  }, [programs]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--danger))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="space-y-6">
      {/* 상단: 성과 요약 카드들 + 연간 일정 캘린더 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 성과 요약 카드들 */}
        <div className="xl:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-card-foreground">{performanceSummary.growthRate > 0 ? '+' : ''}{performanceSummary.growthRate}%</p>
                    <p className="text-xs text-muted-foreground">매출 성장률</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-card-foreground">{performanceSummary.initialRevenue}억</p>
                    <p className="text-xs text-muted-foreground">초기 매출</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Target className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-card-foreground">{performanceSummary.currentRevenue}억</p>
                    <p className="text-xs text-muted-foreground">현재 매출</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-card-foreground">₩{Math.round(performanceSummary.totalRevenue / 100000000)}억</p>
                    <p className="text-xs text-muted-foreground">총 매출</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 연간 일정 캘린더 */}
        <div className="xl:col-span-1">
          <AnnualCalendar programs={programs} />
        </div>
      </div>

      {/* 중간: 교육 과정 완료 현황 + 분기별 상세 현황 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CourseCompletionStatus programs={programs} />
        <div className="xl:col-span-1">
          <QuarterlyCourseTabs programs={programs} />
        </div>
      </div>

      {/* 매출 추이 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>분기별 매출 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="name" 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-muted-foreground"
                  tick={{ fontSize: 12 }}
                  label={{ value: '매출 (억원)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}억원`, '매출']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 과정구분별 매출 비중 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>과정구분별 매출 비중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}억`}
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}억원`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>과정구분별 매출 (막대 차트)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => `${value}억원`} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 분기별 요약 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>분기별 성과 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">분기</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">매출 합계</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">평균 수료율</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">평균 취업률</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">완료</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">진행중</th>
                </tr>
              </thead>
              <tbody>
                {quarterSummary.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-4 font-medium">{item.quarter}</td>
                    <td className="p-4 text-right">₩{item.revenue.toLocaleString()}</td>
                    <td className="p-4 text-right">{item.completionRate}%</td>
                    <td className="p-4 text-right">{item.employmentRate}%</td>
                    <td className="p-4 text-center">{item.completed}개</td>
                    <td className="p-4 text-center">{item.inProgress}개</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}