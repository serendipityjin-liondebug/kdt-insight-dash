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

        {/* 히트맵 시각화 */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">과정 활동 히트맵</h3>
              <p className="text-sm text-muted-foreground">월별 과정 집중도 및 활동량 시각화</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 월별 과정 수량 히트맵 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">월별 진행 과정 수</h4>
              <div className="grid grid-cols-12 gap-1">
                {months.map((month, monthIndex) => {
                  const activeCourses = yearPrograms.filter(program => 
                    getMonthStatus(program, monthIndex) !== 'none'
                  ).length;
                  
                  const maxCourses = Math.max(...months.map((_, idx) =>
                    yearPrograms.filter(p => getMonthStatus(p, idx) !== 'none').length
                  ));
                  
                  const intensity = maxCourses > 0 ? activeCourses / maxCourses : 0;
                  const opacityLevel = intensity === 0 ? 0.1 : 0.2 + (intensity * 0.8);
                  
                  return (
                    <Tooltip key={month}>
                      <TooltipTrigger asChild>
                        <div className="aspect-square">
                          <div 
                            className="w-full h-full rounded border border-border/50 flex items-center justify-center text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                            style={{ 
                              backgroundColor: `hsl(var(--primary))`,
                              opacity: opacityLevel,
                              color: intensity > 0.5 ? 'white' : 'hsl(var(--foreground))'
                            }}
                          >
                            {activeCourses}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium">{month}</div>
                          <div>진행 과정: {activeCourses}개</div>
                          <div>활동도: {(intensity * 100).toFixed(1)}%</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>적음</span>
                <div className="flex items-center gap-1">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, idx) => (
                    <div 
                      key={idx}
                      className="w-3 h-3 rounded-sm border border-border/50"
                      style={{ 
                        backgroundColor: `hsl(var(--primary))`,
                        opacity: 0.2 + (opacity * 0.8)
                      }}
                    />
                  ))}
                </div>
                <span>많음</span>
              </div>
            </div>

            {/* 월별 교육시간 히트맵 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">월별 총 교육시간</h4>
              <div className="grid grid-cols-12 gap-1">
                {months.map((month, monthIndex) => {
                  const totalHours = yearPrograms
                    .filter(program => getMonthStatus(program, monthIndex) !== 'none')
                    .reduce((sum, program) => sum + (program.교육시간 || 0), 0);
                  
                  const maxHours = Math.max(...months.map((_, idx) =>
                    yearPrograms
                      .filter(p => getMonthStatus(p, idx) !== 'none')
                      .reduce((sum, p) => sum + (p.교육시간 || 0), 0)
                  ));
                  
                  const intensity = maxHours > 0 ? totalHours / maxHours : 0;
                  const opacityLevel = intensity === 0 ? 0.1 : 0.2 + (intensity * 0.8);
                  
                  return (
                    <Tooltip key={month}>
                      <TooltipTrigger asChild>
                        <div className="aspect-square">
                          <div 
                            className="w-full h-full rounded border border-border/50 flex items-center justify-center text-[10px] font-medium transition-all duration-200 hover:scale-105 cursor-pointer"
                            style={{ 
                              backgroundColor: `hsl(var(--chart-2))`,
                              opacity: opacityLevel,
                              color: intensity > 0.5 ? 'white' : 'hsl(var(--foreground))'
                            }}
                          >
                            {totalHours > 0 ? `${totalHours}h` : '0'}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div className="font-medium">{month}</div>
                          <div>총 교육시간: {totalHours}시간</div>
                          <div>집중도: {(intensity * 100).toFixed(1)}%</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>적음</span>
                <div className="flex items-center gap-1">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, idx) => (
                    <div 
                      key={idx}
                      className="w-3 h-3 rounded-sm border border-border/50"
                      style={{ 
                        backgroundColor: `hsl(var(--chart-2))`,
                        opacity: 0.2 + (opacity * 0.8)
                      }}
                    />
                  ))}
                </div>
                <span>많음</span>
              </div>
            </div>
          </div>

          {/* 과정별 월별 히트맵 */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium">과정별 월별 활동 현황</h4>
            <div className="space-y-2">
              {Object.entries(courseColors).map(([courseType, color]) => {
                const courseTypePrograms = yearPrograms.filter(p => p.과정구분 === courseType);
                
                return (
                  <div key={courseType} className="flex items-center gap-3">
                    <div className="w-24 text-xs font-medium text-right flex-shrink-0">
                      {courseType}
                    </div>
                    <div className="flex gap-1 flex-1">
                      {months.map((month, monthIndex) => {
                        const activeCount = courseTypePrograms.filter(program => 
                          getMonthStatus(program, monthIndex) !== 'none'
                        ).length;
                        
                        const maxForType = Math.max(...months.map((_, idx) =>
                          courseTypePrograms.filter(p => getMonthStatus(p, idx) !== 'none').length
                        ));
                        
                        const intensity = maxForType > 0 ? activeCount / maxForType : 0;
                        
                        return (
                          <Tooltip key={month}>
                            <TooltipTrigger asChild>
                              <div 
                                className="w-6 h-6 rounded border border-border/30 flex items-center justify-center text-[10px] font-medium transition-all duration-200 hover:scale-110 cursor-pointer"
                                style={{ 
                                  backgroundColor: color,
                                  opacity: intensity === 0 ? 0.1 : 0.3 + (intensity * 0.7),
                                  color: intensity > 0.5 ? 'white' : 'hsl(var(--foreground))'
                                }}
                              >
                                {activeCount > 0 ? activeCount : ''}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <div className="font-medium">{courseType} - {month}</div>
                                <div>진행 과정: {activeCount}개</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}