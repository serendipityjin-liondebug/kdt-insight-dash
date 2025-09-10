import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { KDTProgram } from '@/types/kdt';

interface AnnualCalendarProps {
  programs: KDTProgram[];
  year?: number;
}

export function AnnualCalendar({ programs, year = 2025 }: AnnualCalendarProps) {
  // 과정구분별 색상 매핑 (더 세련된 색상으로)
  const courseColors = useMemo(() => {
    const colors = [
      'hsl(var(--chart-1))', // 파랑
      'hsl(var(--chart-2))', // 주황  
      'hsl(var(--chart-3))', // 초록
      'hsl(var(--chart-4))', // 보라
      'hsl(var(--chart-5))', // 빨강
    ];
    const courseTypes = [...new Set(programs.map(p => p.과정구분))];
    const colorMap: Record<string, string> = {};
    
    courseTypes.forEach((type, index) => {
      colorMap[type] = colors[index % colors.length];
    });
    
    return colorMap;
  }, [programs]);

  // 해당 연도의 프로그램들만 필터링
  const yearPrograms = useMemo(() => {
    return programs.filter(program => {
      const startDate = new Date(program.개강);
      const endDate = program.종강 ? new Date(program.종강) : null;
      return startDate.getFullYear() === year || (endDate && endDate.getFullYear() === year);
    });
  }, [programs, year]);

  // 각 프로그램에 대해 월별 진행 상태 계산
  const getMonthStatus = (program: KDTProgram, monthIndex: number) => {
    const startDate = new Date(program.개강);
    const endDate = program.종강 ? new Date(program.종강) : new Date(year, 11, 31);
    
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);
    
    // 해당 월에 프로그램이 진행되는지 확인
    if (startDate <= monthEnd && endDate >= monthStart) {
      // 시작월인 경우
      if (startDate.getMonth() === monthIndex && startDate.getFullYear() === year) {
        return 'start';
      }
      // 종료월인 경우  
      if (endDate.getMonth() === monthIndex && endDate.getFullYear() === year) {
        return 'end';
      }
      // 중간월인 경우
      return 'ongoing';
    }
    return 'none';
  };

  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

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
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[300px_repeat(12,1fr)_120px] gap-1 mb-2">
              <div className="font-semibold text-sm text-foreground p-2 border-b border-border">
                과정명
              </div>
              {months.map((month) => (
                <div key={month} className="font-semibold text-xs text-center text-foreground p-2 border-b border-border">
                  {month}
                </div>
              ))}
              <div className="font-semibold text-sm text-center text-foreground p-2 border-b border-border">
                상태
              </div>
            </div>

            {/* 프로그램별 타임라인 - 스크롤 가능한 영역 */}
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-1">
                {yearPrograms.map((program, programIndex) => (
                  <div key={`${program.과정코드}-${program.회차}`} className="grid grid-cols-[300px_repeat(12,1fr)_120px] gap-1 items-center hover:bg-muted/50 rounded">
                    {/* 과정명 */}
                    <div className="p-2 text-sm">
                      <div className="font-medium truncate" title={`${program.과정구분} ${program.회차}회차`}>
                        {program.과정구분} {program.회차}회차
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {program.과정코드}
                      </div>
                    </div>

                    {/* 월별 타임라인 바 */}
                    {months.map((month, monthIndex) => {
                      const status = getMonthStatus(program, monthIndex);
                      const color = courseColors[program.과정구분];
                      
                      return (
                        <div key={month} className="p-1 h-12 flex items-center">
                          {status !== 'none' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="w-full h-6 rounded transition-all duration-200 hover:opacity-80 cursor-pointer relative flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: color,
                                    opacity: program.진행상태 === '완료' ? 0.7 : 0.9,
                                    borderRadius: status === 'start' ? '6px 2px 2px 6px' : 
                                                status === 'end' ? '2px 6px 6px 2px' : '2px'
                                  }}
                                >
                                  {/* 월별 텍스트 오버레이 */}
                                  <span className="text-[10px] font-medium text-white drop-shadow-sm">
                                    {month}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs">
                                  <div className="font-medium">{program.과정구분} {program.회차}회차</div>
                                  <div>개강: {new Date(program.개강).toLocaleDateString()}</div>
                                  {program.종강 && (
                                    <div>종강: {new Date(program.종강).toLocaleDateString()}</div>
                                  )}
                                  <div>교육시간: {program.교육시간}시간</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      );
                    })}

                    {/* 상태 */}
                    <div className="p-2 text-center">
                      <Badge 
                        variant={program.진행상태 === '완료' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {program.진행상태}
                      </Badge>
                    </div>
                  </div>
                ))}
                {yearPrograms.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    해당 연도에 등록된 과정이 없습니다.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* 범례 */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-sm font-medium mb-2">과정 구분</div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(courseColors).map(([courseType, color]) => (
              <div key={courseType} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground">{courseType}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}