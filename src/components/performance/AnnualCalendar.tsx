import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KDTProgram } from '@/types/kdt';

interface AnnualCalendarProps {
  programs: KDTProgram[];
  year?: number;
}

export function AnnualCalendar({ programs, year = 2025 }: AnnualCalendarProps) {
  // 과정구분별 색상 매핑
  const courseColors = useMemo(() => {
    const colors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];
    const courseTypes = [...new Set(programs.map(p => p.과정구분))];
    const colorMap: Record<string, string> = {};
    
    courseTypes.forEach((type, index) => {
      colorMap[type] = colors[index % colors.length];
    });
    
    return colorMap;
  }, [programs]);

  // 월별 요약 데이터 생성
  const monthlySummaries = useMemo(() => {
    const months = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return months.map((month, monthIndex) => {
      const monthNumber = monthIndex + 1;
      
      // 해당 월에 시작되는 프로그램들
      const startingPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        return startDate.getFullYear() === year && startDate.getMonth() + 1 === monthNumber;
      });
      
      // 해당 월에 진행 중인 프로그램들 (시작일과 상관없이)
      const ongoingPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        const endDate = program.종강 ? new Date(program.종강) : null;
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        
        return (startDate <= monthEnd && (!endDate || endDate >= monthStart));
      });

      // 해당 월에 완료되는 프로그램들
      const completingPrograms = programs.filter(program => {
        const endDate = program.종강 ? new Date(program.종강) : null;
        return endDate && endDate.getFullYear() === year && endDate.getMonth() + 1 === monthNumber;
      });

      return {
        month,
        monthNumber,
        startingCount: startingPrograms.length,
        ongoingCount: ongoingPrograms.length,
        completingCount: completingPrograms.length,
        startingPrograms,
        ongoingPrograms,
        completingPrograms
      };
    });
  }, [programs, year]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{year}년 연간 과정 현황</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium">{year}</span>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthlySummaries.map((summary) => (
            <Card key={summary.month} className="border border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-base">{summary.month}</h4>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                
                {/* 과정 수 요약 */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">신규 시작</span>
                    <Badge variant="secondary" className="text-xs">
                      {summary.startingCount}개
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">진행 중</span>
                    <Badge variant="outline" className="text-xs">
                      {summary.ongoingCount}개
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">완료 예정</span>
                    <Badge variant="secondary" className="text-xs">
                      {summary.completingCount}개
                    </Badge>
                  </div>
                </div>

                {/* 과정구분별 색상 바 */}
                {summary.ongoingPrograms.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground mb-1">진행 과정</div>
                    <div className="flex gap-1 mb-2">
                      {[...new Set(summary.ongoingPrograms.map(p => p.과정구분))].map((courseType) => (
                        <div
                          key={courseType}
                          className={`flex-1 h-2 rounded-sm bg-${courseColors[courseType]}`}
                          title={courseType}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {summary.ongoingPrograms.slice(0, 2).map(p => p.과정구분).join(', ')}
                      {summary.ongoingPrograms.length > 2 && ` 외 ${summary.ongoingPrograms.length - 2}개`}
                    </div>
                  </div>
                )}

                {summary.ongoingPrograms.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    진행 중인 과정 없음
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* 범례 */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-sm font-medium mb-2">과정 구분</div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(courseColors).map(([courseType, colorClass]) => (
              <div key={courseType} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm bg-${colorClass}`} />
                <span className="text-xs text-muted-foreground">{courseType}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}