import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KDTProgram } from '@/types/kdt';

interface QuarterlyCourseTabsProps {
  programs: KDTProgram[];
}

interface QuarterData {
  quarter: string;
  programs: KDTProgram[];
  totalRevenue: number;
  averageCapacityRate: number;
  totalCourses: number;
  expectedRevenue: number;
}

export function QuarterlyCourseTabs({ programs }: QuarterlyCourseTabsProps) {
  const quarterlyData = useMemo(() => {
    const quarters = ['1분기', '2분기', '3분기', '4분기'];
    const currentYear = new Date().getFullYear();
    
    const data: Record<string, QuarterData> = {};
    
    quarters.forEach(quarter => {
      const quarterPrograms = programs.filter(program => {
        const quarterMap: Record<string, string> = {
          '1분기': 'Q1',
          '2분기': 'Q2', 
          '3분기': 'Q3',
          '4분기': 'Q4'
        };
        return program.분기키 === `${currentYear} ${quarterMap[quarter]}`;
      });

      const totalRevenue = quarterPrograms.reduce((sum, p) => sum + (p.최소_매출 || 0), 0);
      const averageCapacityRate = quarterPrograms.length > 0 
        ? quarterPrograms.reduce((sum, p) => sum + p.모객율, 0) / quarterPrograms.length
        : 0;
      
      // 기대매출 = 정원 * 1인단가 (최소매출을 정원으로 나눈 값을 1인단가로 가정)
      const expectedRevenue = quarterPrograms.reduce((sum, p) => {
        const unitPrice = p.최소_매출 && p.정원 > 0 ? (p.최소_매출 / p.정원) : 0;
        return sum + (unitPrice * p.정원);
      }, 0);

      data[quarter] = {
        quarter,
        programs: quarterPrograms,
        totalRevenue,
        averageCapacityRate: Math.round(averageCapacityRate * 10) / 10,
        totalCourses: quarterPrograms.length,
        expectedRevenue,
      };
    });
    
    return data;
  }, [programs]);

  const formatCurrency = (amount: number) => {
    return `₩${Math.round(amount / 100000000)}억`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>분기별 상세 과정 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1분기" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(quarterlyData).map(quarter => (
              <TabsTrigger key={quarter} value={quarter} className="text-sm">
                {quarter}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(quarterlyData).map(([quarter, data]) => (
            <TabsContent key={quarter} value={quarter} className="space-y-4">
              {/* 분기 요약 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{data.totalCourses}</div>
                  <div className="text-sm text-muted-foreground">총 과정 수</div>
                </div>
                <div className="bg-card/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-success">{formatCurrency(data.totalRevenue)}</div>
                  <div className="text-sm text-muted-foreground">현재 매출</div>
                </div>
                <div className="bg-card/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-warning">{formatCurrency(data.expectedRevenue)}</div>
                  <div className="text-sm text-muted-foreground">기대 매출</div>
                </div>
                <div className="bg-card/50 p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-accent">{data.averageCapacityRate}%</div>
                  <div className="text-sm text-muted-foreground">평균 모집률</div>
                </div>
              </div>

              {/* 과정 목록 */}
              {data.programs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  해당 분기에 진행되는 과정이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 font-medium text-muted-foreground">과정명</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">기수</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">모집인원</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">모집확정</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">1인 단가</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">현재 매출</th>
                        <th className="text-right p-3 font-medium text-muted-foreground">기대 매출</th>
                        <th className="text-center p-3 font-medium text-muted-foreground">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.programs.map((program, index) => {
                        const unitPrice = program.최소_매출 && program.정원 > 0 
                          ? program.최소_매출 / program.정원 
                          : 0;
                        const expectedRevenue = unitPrice * program.정원;
                        const confirmedCount = Math.round(program.정원 * (program.모객율 / 100));
                        
                        return (
                          <tr key={index} className="border-b border-border hover:bg-muted/50">
                            <td className="p-3">
                              <div className="font-medium">{program.과정구분}</div>
                              <div className="text-sm text-muted-foreground">{program.과정코드}</div>
                            </td>
                            <td className="p-3 text-center">{program.회차}기</td>
                            <td className="p-3 text-center">{program.정원}명</td>
                            <td className="p-3 text-center">
                              <span className={confirmedCount >= program.정원 ? 'text-success' : 'text-warning'}>
                                {confirmedCount}명
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              ₩{Math.round(unitPrice).toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-medium">
                              ₩{Math.round(program.최소_매출 || 0).toLocaleString()}
                            </td>
                            <td className="p-3 text-right text-muted-foreground">
                              ₩{Math.round(expectedRevenue).toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={program.진행상태 === '완료' ? 'default' : 'secondary'}>
                                {program.진행상태}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}