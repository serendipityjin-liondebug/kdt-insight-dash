import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KDTProgram, FilterState } from '@/types/kdt';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getSchoolUnitPrice } from '@/data/unitPrices';
import { FilterBar } from '@/components/FilterBar';
import { filterPrograms } from '@/data/kdtData';

interface BusinessTabProps {
  programs: KDTProgram[];
}

export function BusinessTab({ programs }: BusinessTabProps) {
  // 필터 상태 관리
  const [filters, setFilters] = useState<FilterState>({});

  // 필터링된 프로그램 데이터
  const filteredPrograms = useMemo(() => {
    return filterPrograms(programs, filters);
  }, [programs, filters]);

  // 매출 관련 KPI 계산
  const revenueKPI = useMemo(() => {
    // 2025년 프로그램 필터링
    const programs2025 = filteredPrograms.filter(p => p.년도 === 2025);
    
    // 예상 매출 계산: 수료율 * 정원 * 교육시간 * 18150
    const expectedRevenue = programs2025.reduce((sum, p) => {
      const rate = p.수료율 / 100;
      const revenue = rate * p.정원 * p.교육시간 * 18150;
      return sum + revenue;
    }, 0);
    
    // 실 매출 계산: 실제 수료생 기준
    const actualRevenue = programs2025.reduce((sum, p) => {
      const actualStudents = p.수료 || 0;
      const revenue = actualStudents * p.교육시간 * 18150;
      return sum + revenue;
    }, 0);
    
    // 예상 vs 실 매출 차이
    const revenueDifference = expectedRevenue > 0 ? ((actualRevenue - expectedRevenue) / expectedRevenue) * 100 : 0;
    
    return {
      expectedRevenue: Math.round(expectedRevenue),
      actualRevenue: Math.round(actualRevenue),
      revenueDifference: Math.round(revenueDifference * 10) / 10,
      totalPrograms: programs2025.length,
      completedPrograms: programs2025.filter(p => p.진행상태 === '완료').length
    };
  }, [filteredPrograms]);

  // 월별 매출 데이터
  const monthlyRevenueData = useMemo(() => {
    const targetYear = filters.년도 || 2025;
    const programsFiltered = filteredPrograms.filter(p => p.년도 === targetYear);
    const monthlyData: { [key: string]: { expected: number; actual: number } } = {};
    
    programsFiltered.forEach(program => {
      const month = program.개강.getMonth() + 1;
      const monthKey = `${month}월`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { expected: 0, actual: 0 };
      }
      
      // 예상 매출
      const expectedRevenue = (program.수료율 / 100) * program.정원 * program.교육시간 * 18150;
      monthlyData[monthKey].expected += expectedRevenue;
      
      // 실 매출
      const actualStudents = program.수료 || 0;
      const actualRevenue = actualStudents * program.교육시간 * 18150;
      monthlyData[monthKey].actual += actualRevenue;
    });
    
    // 1-12월 데이터로 변환
    return Array.from({ length: 12 }, (_, i) => {
      const month = `${i + 1}월`;
      return {
        month,
        expected: Math.round((monthlyData[month]?.expected || 0) / 1000000), // 백만원 단위
        actual: Math.round((monthlyData[month]?.actual || 0) / 1000000),
        difference: monthlyData[month] 
          ? Math.round(((monthlyData[month].actual - monthlyData[month].expected) / monthlyData[month].expected) * 100 * 10) / 10
          : 0
      };
    });
  }, [filteredPrograms, filters.년도]);

  // 과정별 매출 현황
  const courseRevenueData = useMemo(() => {
    const targetYear = filters.년도 || 2025;
    const programsFiltered = filteredPrograms.filter(p => p.년도 === targetYear);
    const courseData: { [key: string]: { expected: number; actual: number; count: number } } = {};
    
    programsFiltered.forEach(program => {
      const course = program.과정구분;
      if (!courseData[course]) {
        courseData[course] = { expected: 0, actual: 0, count: 0 };
      }
      
      const expectedRevenue = (program.수료율 / 100) * program.정원 * program.교육시간 * 18150;
      const actualRevenue = (program.수료 || 0) * program.교육시간 * 18150;
      
      courseData[course].expected += expectedRevenue;
      courseData[course].actual += actualRevenue;
      courseData[course].count++;
    });
    
    return Object.entries(courseData)
      .map(([course, data]) => ({
        course: course.length > 8 ? course.substring(0, 8) + '...' : course,
        expected: Math.round(data.expected / 1000000), // 백만원 단위
        actual: Math.round(data.actual / 1000000),
        programs: data.count
      }))
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 8); // 상위 8개 과정
  }, [filteredPrograms, filters.년도]);

  return (
    <div className="space-y-6">
      {/* 필터 바 */}
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters} 
        programs={programs}
      />
      
      {/* 메인 매출 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-primary">
                  ₩{(revenueKPI.expectedRevenue / 100000000).toFixed(1)}억
                </p>
                <p className="text-sm text-muted-foreground">2025년 예상 매출</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-success">
                  ₩{(revenueKPI.actualRevenue / 100000000).toFixed(1)}억
                </p>
                <p className="text-sm text-muted-foreground">2025년 실 매출</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${revenueKPI.revenueDifference >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {revenueKPI.revenueDifference >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-success" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-destructive" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-2xl font-bold ${revenueKPI.revenueDifference >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {revenueKPI.revenueDifference > 0 ? '+' : ''}{revenueKPI.revenueDifference}%
                </p>
                <p className="text-sm text-muted-foreground">예상 vs 실 매출 차이</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 매출 그래프 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              월별 매출 현황 ({filters.년도 || 2025}년)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}백만원`, 
                    name === 'expected' ? '예상 매출' : '실 매출'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="expected" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="예상 매출"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="실 매출"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              과정별 매출 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}백만원`, 
                    name === 'expected' ? '예상 매출' : '실 매출'
                  ]}
                />
                <Bar dataKey="expected" fill="hsl(var(--primary))" opacity={0.6} name="예상 매출" />
                <Bar dataKey="actual" fill="hsl(var(--success))" name="실 매출" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 월별 차이 분석 - 고급 디자인 */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            월별 예측 vs 실매출 차이 분석
            <div className="ml-auto text-sm text-muted-foreground">
              {filters.년도 || 2025}년
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* 상반기 (1-6월) */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">상반기 (1-6월)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyRevenueData.slice(0, 6).map((data, index) => {
                const performanceLevel = data.difference >= 20 ? 'excellent' : 
                                       data.difference >= 5 ? 'good' : 
                                       data.difference >= -5 ? 'neutral' : 'poor';
                
                const gradientClass = {
                  excellent: 'bg-gradient-to-br from-success/20 to-success/5',
                  good: 'bg-gradient-to-br from-primary/20 to-primary/5',
                  neutral: 'bg-gradient-to-br from-muted/40 to-muted/10',
                  poor: 'bg-gradient-to-br from-destructive/20 to-destructive/5'
                }[performanceLevel];

                const iconClass = {
                  excellent: 'text-success bg-success/10',
                  good: 'text-primary bg-primary/10',
                  neutral: 'text-muted-foreground bg-muted/20',
                  poor: 'text-destructive bg-destructive/10'
                }[performanceLevel];

                const progressValue = Math.min(Math.abs(data.difference), 100);
                
                return (
                  <Card key={index} className={`${gradientClass} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* 월 헤더 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass}`}>
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                            <h4 className="font-bold text-sm">{data.month}</h4>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            data.difference >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          }`}>
                            {data.difference >= 0 ? '목표달성' : '목표미달'}
                          </div>
                        </div>

                        {/* 매출 데이터 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">예상매출</span>
                            <span className="font-medium">{data.expected}백만원</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">실제매출</span>
                            <span className="font-medium text-primary">{data.actual}백만원</span>
                          </div>
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>달성률</span>
                            <span className="font-bold">{data.expected > 0 ? Math.round((data.actual / data.expected) * 100) : 0}%</span>
                          </div>
                          <Progress 
                            value={data.expected > 0 ? Math.min((data.actual / data.expected) * 100, 100) : 0} 
                            className="h-2" 
                          />
                        </div>

                        {/* 차이 표시 */}
                        <div className="text-center">
                          <div className={`text-lg font-bold flex items-center justify-center gap-1 ${
                            data.difference >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {data.difference >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {data.difference > 0 ? '+' : ''}{data.difference}%
                          </div>
                          <p className="text-xs text-muted-foreground">예상 대비</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          
          {/* 하반기 (7-12월) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">하반기 (7-12월)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyRevenueData.slice(6, 12).map((data, index) => {
                const performanceLevel = data.difference >= 20 ? 'excellent' : 
                                       data.difference >= 5 ? 'good' : 
                                       data.difference >= -5 ? 'neutral' : 'poor';
                
                const gradientClass = {
                  excellent: 'bg-gradient-to-br from-success/20 to-success/5',
                  good: 'bg-gradient-to-br from-primary/20 to-primary/5',
                  neutral: 'bg-gradient-to-br from-muted/40 to-muted/10',
                  poor: 'bg-gradient-to-br from-destructive/20 to-destructive/5'
                }[performanceLevel];

                const iconClass = {
                  excellent: 'text-success bg-success/10',
                  good: 'text-primary bg-primary/10',
                  neutral: 'text-muted-foreground bg-muted/20',
                  poor: 'text-destructive bg-destructive/10'
                }[performanceLevel];
                
                return (
                  <Card key={index + 6} className={`${gradientClass} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* 월 헤더 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconClass}`}>
                              <span className="text-xs font-bold">{index + 7}</span>
                            </div>
                            <h4 className="font-bold text-sm">{data.month}</h4>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            data.difference >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          }`}>
                            {data.difference >= 0 ? '목표달성' : '목표미달'}
                          </div>
                        </div>

                        {/* 매출 데이터 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">예상매출</span>
                            <span className="font-medium">{data.expected}백만원</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">실제매출</span>
                            <span className="font-medium text-primary">{data.actual}백만원</span>
                          </div>
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>달성률</span>
                            <span className="font-bold">{data.expected > 0 ? Math.round((data.actual / data.expected) * 100) : 0}%</span>
                          </div>
                          <Progress 
                            value={data.expected > 0 ? Math.min((data.actual / data.expected) * 100, 100) : 0} 
                            className="h-2" 
                          />
                        </div>

                        {/* 차이 표시 */}
                        <div className="text-center">
                          <div className={`text-lg font-bold flex items-center justify-center gap-1 ${
                            data.difference >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {data.difference >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {data.difference > 0 ? '+' : ''}{data.difference}%
                          </div>
                          <p className="text-xs text-muted-foreground">예상 대비</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 월별 성과 요약 히트맵 */}
          <div className="mt-8 p-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg">
            <h4 className="font-semibold mb-4 text-center">연간 성과 히트맵</h4>
            <div className="grid grid-cols-12 gap-1">
              {monthlyRevenueData.map((data, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded text-xs flex items-center justify-center font-bold transition-all hover:scale-110 ${
                    data.difference >= 20 ? 'bg-success text-white' :
                    data.difference >= 5 ? 'bg-primary text-white' :
                    data.difference >= -5 ? 'bg-muted text-foreground' :
                    'bg-destructive text-white'
                  }`}
                  title={`${data.month}: ${data.difference > 0 ? '+' : ''}${data.difference}%`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-destructive"></div>
                <span>-5% 미만</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-muted"></div>
                <span>-5% ~ +5%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary"></div>
                <span>+5% ~ +20%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-success"></div>
                <span>+20% 이상</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 매출 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">전체 과정 수</p>
              <p className="text-3xl font-bold text-primary">{revenueKPI.totalPrograms}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">완료 과정 수</p>
              <p className="text-3xl font-bold text-success">{revenueKPI.completedPrograms}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">완료율</p>
              <p className="text-3xl font-bold text-accent">
                {revenueKPI.totalPrograms > 0 
                  ? Math.round((revenueKPI.completedPrograms / revenueKPI.totalPrograms) * 100)
                  : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}