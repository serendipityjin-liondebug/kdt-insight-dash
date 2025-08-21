import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KDTProgram } from '@/types/kdt';

interface QuarterlyCoursesTabsProps {
  programs: KDTProgram[];
  year?: number;
}

export function QuarterlyCourseTabs({ programs, year = 2025 }: QuarterlyCoursesTabsProps) {
  const quarterlyData = useMemo(() => {
    const quarters = ['1분기', '2분기', '3분기', '4분기'];
    
    return quarters.map(quarter => {
      const quarterPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        return startDate.getFullYear() === year && program.분기 === quarter;
      });

      // 각 과정별 상세 데이터 계산
      const detailedPrograms = quarterPrograms.map(program => {
        const unitPrice = program.최소_매출 && program.정원 > 0 
          ? Math.round(program.최소_매출 / program.정원) 
          : 0;
        
        const confirmedCount = program.HRD_확정 || 0;
        const currentRevenue = unitPrice * confirmedCount;
        const expectedRevenue = unitPrice * program.정원;

        return {
          ...program,
          unitPrice,
          confirmedCount,
          currentRevenue,
          expectedRevenue
        };
      });

      // 분기별 요약 통계
      const summary = {
        totalCourses: quarterPrograms.length,
        totalRevenue: detailedPrograms.reduce((sum, p) => sum + p.currentRevenue, 0),
        expectedRevenue: detailedPrograms.reduce((sum, p) => sum + p.expectedRevenue, 0),
        averageRecruitmentRate: quarterPrograms.length > 0 
          ? quarterPrograms.reduce((sum, p) => sum + p.모객율, 0) / quarterPrograms.length 
          : 0
      };

      return {
        quarter,
        programs: detailedPrograms,
        summary
      };
    });
  }, [programs, year]);

  const formatCurrency = (amount: number) => {
    return (amount / 100000000).toFixed(1) + '억원';
  };

  const renderQuarterContent = (data: typeof quarterlyData[0]) => {
    if (data.programs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">해당 분기에 진행되는 과정이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* 분기별 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">{data.summary.totalCourses}</div>
            <div className="text-sm text-muted-foreground">총 과정 수</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-success">{formatCurrency(data.summary.totalRevenue)}</div>
            <div className="text-sm text-muted-foreground">현재 매출</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-warning">{formatCurrency(data.summary.expectedRevenue)}</div>
            <div className="text-sm text-muted-foreground">기대 매출</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-accent">{data.summary.averageRecruitmentRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">평균 모집률</div>
          </div>
        </div>

        {/* 과정별 상세 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">과정명</th>
                <th className="text-center p-3 font-medium text-muted-foreground">기수</th>
                <th className="text-center p-3 font-medium text-muted-foreground">모집인원</th>
                <th className="text-center p-3 font-medium text-muted-foreground">모집확정인원</th>
                <th className="text-right p-3 font-medium text-muted-foreground">1인 단가</th>
                <th className="text-right p-3 font-medium text-muted-foreground">현재 매출</th>
                <th className="text-right p-3 font-medium text-muted-foreground">기대 매출</th>
              </tr>
            </thead>
            <tbody>
              {data.programs.map((program, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-medium">{program.과정구분}</td>
                  <td className="p-3 text-center">{program.회차}기</td>
                  <td className="p-3 text-center">{program.정원}명</td>
                  <td className="p-3 text-center">{program.confirmedCount}명</td>
                  <td className="p-3 text-right">₩{program.unitPrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-medium text-success">
                    {formatCurrency(program.currentRevenue)}
                  </td>
                  <td className="p-3 text-right font-medium text-warning">
                    {formatCurrency(program.expectedRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{year}년 분기별 교육 과정 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1분기" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {quarterlyData.map((data) => (
              <TabsTrigger key={data.quarter} value={data.quarter}>
                {data.quarter}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {quarterlyData.map((data) => (
            <TabsContent key={data.quarter} value={data.quarter} className="mt-6">
              {renderQuarterContent(data)}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}