import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KDTProgram } from '@/types/kdt';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getSchoolUnitPrice } from '@/data/unitPrices';

interface BusinessTabProps {
  programs: KDTProgram[];
}

export function BusinessTab({ programs }: BusinessTabProps) {
  // 매출 관련 KPI 계산
  const revenueKPI = useMemo(() => {
    // 2025년 프로그램 필터링
    const programs2025 = programs.filter(p => p.년도 === 2025);
    
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
  }, [programs]);

  // 월별 매출 데이터
  const monthlyRevenueData = useMemo(() => {
    const programs2025 = programs.filter(p => p.년도 === 2025);
    const monthlyData: { [key: string]: { expected: number; actual: number } } = {};
    
    programs2025.forEach(program => {
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
  }, [programs]);

  // 과정별 매출 현황
  const courseRevenueData = useMemo(() => {
    const programs2025 = programs.filter(p => p.년도 === 2025);
    const courseData: { [key: string]: { expected: number; actual: number; count: number } } = {};
    
    programs2025.forEach(program => {
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
  }, [programs]);

  return (
    <div className="space-y-6">
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
              월별 매출 현황 (2025년)
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

      {/* 월별 차이 분석 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            월별 예측 vs 실매출 차이 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {monthlyRevenueData.slice(0, 6).map((data, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-sm">{data.month}</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        예상: {data.expected}백만원
                      </p>
                      <p className="text-xs text-muted-foreground">
                        실제: {data.actual}백만원
                      </p>
                    </div>
                    <div className={`text-sm font-bold ${
                      data.difference >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {data.difference > 0 ? '+' : ''}{data.difference}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* 하반기 데이터 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {monthlyRevenueData.slice(6, 12).map((data, index) => (
              <Card key={index + 6} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-sm">{data.month}</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        예상: {data.expected}백만원
                      </p>
                      <p className="text-xs text-muted-foreground">
                        실제: {data.actual}백만원
                      </p>
                    </div>
                    <div className={`text-sm font-bold ${
                      data.difference >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {data.difference > 0 ? '+' : ''}{data.difference}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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