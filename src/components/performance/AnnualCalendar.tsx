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
  // 프리미엄 과정구분별 색상 매핑 (그라데이션 포함)
  const courseColors = useMemo(() => {
    const colorPairs = [
      { 
        main: 'hsl(var(--chart-1))', 
        light: 'hsl(var(--chart-1-light))',
        gradient: 'linear-gradient(135deg, hsl(var(--chart-1)), hsl(var(--chart-1-light)))'
      },
      { 
        main: 'hsl(var(--chart-2))', 
        light: 'hsl(var(--chart-2-light))',
        gradient: 'linear-gradient(135deg, hsl(var(--chart-2)), hsl(var(--chart-2-light)))'
      },
      { 
        main: 'hsl(var(--chart-3))', 
        light: 'hsl(var(--chart-3-light))',
        gradient: 'linear-gradient(135deg, hsl(var(--chart-3)), hsl(var(--chart-3-light)))'
      },
      { 
        main: 'hsl(var(--chart-4))', 
        light: 'hsl(var(--chart-4-light))',
        gradient: 'linear-gradient(135deg, hsl(var(--chart-4)), hsl(var(--chart-4-light)))'
      },
      { 
        main: 'hsl(var(--chart-5))', 
        light: 'hsl(var(--chart-5-light))',
        gradient: 'linear-gradient(135deg, hsl(var(--chart-5)), hsl(var(--chart-5-light)))'
      }
    ];
    
    const courseTypes = [...new Set(programs.map(p => p.과정구분))];
    const colorMap: Record<string, any> = {};
    
    courseTypes.forEach((type, index) => {
      colorMap[type] = colorPairs[index % colorPairs.length];
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
    <Card className="premium-card backdrop-blur-sm border border-border/50 shadow-[var(--premium-shadow-lg)] animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-card via-card to-muted/30 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {year}년 연간 과정 현황
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover:shadow-md transition-all duration-200 hover:scale-105">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold px-3 py-1 bg-muted/50 rounded-md border">{year}</span>
            <Button variant="outline" size="sm" className="hover:shadow-md transition-all duration-200 hover:scale-105">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* 프리미엄 테이블 헤더 */}
            <div className="grid grid-cols-[300px_repeat(12,1fr)_120px] gap-1 mb-3 bg-gradient-to-r from-muted/50 to-muted/30 p-2 rounded-lg border border-border/30">
              <div className="font-bold text-sm text-foreground p-2 flex items-center">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">과정명</span>
              </div>
              {months.map((month, index) => (
                <div key={month} className="font-semibold text-xs text-center text-muted-foreground p-2 flex items-center justify-center relative">
                  <span className="hover:text-foreground transition-colors duration-200">{month}</span>
                  {index < months.length - 1 && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-4 bg-border/40" />
                  )}
                </div>
              ))}
              <div className="font-bold text-sm text-center text-foreground p-2 flex items-center justify-center">
                <span className="bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">상태</span>
              </div>
            </div>

            {/* 프리미엄 프로그램별 타임라인 - 스크롤 가능한 영역 */}
            <ScrollArea className="h-[320px] pr-4 border border-border/30 rounded-lg bg-gradient-to-b from-card to-muted/20">
              <div className="space-y-2 p-2">
                {yearPrograms.map((program, programIndex) => (
                  <div key={`${program.과정코드}-${program.회차}`} className="grid grid-cols-[300px_repeat(12,1fr)_120px] gap-1 items-center hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 rounded-lg transition-all duration-300 hover:shadow-md p-1 group">
                    {/* 프리미엄 과정명 */}
                    <div className="p-3 text-sm">
                      <div className="font-semibold truncate mb-1 text-foreground group-hover:text-primary transition-colors duration-200" title={`${program.과정구분} ${program.회차}회차`}>
                        {program.과정구분} {program.회차}회차
                      </div>
                      <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded-sm">
                        {program.과정코드}
                      </div>
                    </div>

                    {/* 프리미엄 월별 타임라인 바 */}
                    {months.map((month, monthIndex) => {
                      const status = getMonthStatus(program, monthIndex);
                      const colorScheme = courseColors[program.과정구분];
                      
                      return (
                        <div key={month} className="p-1 h-14 flex items-center relative">
                          {status !== 'none' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="w-full h-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer relative flex items-center justify-center group timeline-bar"
                                  style={{ 
                                    background: colorScheme.gradient,
                                    opacity: program.진행상태 === '완료' ? 0.8 : 1,
                                    borderRadius: status === 'start' ? '8px 4px 4px 8px' : 
                                                status === 'end' ? '4px 8px 8px 4px' : '6px',
                                    boxShadow: 'var(--premium-shadow)',
                                    border: `1px solid ${colorScheme.light}50`
                                  }}
                                >
                                  {/* 프리미엄 월별 텍스트 오버레이 */}
                                  <span className="text-[10px] font-bold text-white drop-shadow-md tracking-wide">
                                    {month}
                                  </span>
                                  
                                  {/* 진행 상태 인디케이터 */}
                                  {status === 'start' && (
                                    <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                                  )}
                                  {status === 'end' && (
                                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                                  )}
                                  
                                  {/* 호버 글로우 효과 */}
                                  <div 
                                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                    style={{ background: colorScheme.light }}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="premium-tooltip border border-border/50 bg-card/95 backdrop-blur-sm shadow-xl">
                                <div className="text-xs space-y-1">
                                  <div className="font-semibold text-primary">{program.과정구분} {program.회차}회차</div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">개강:</span>
                                    <span>{new Date(program.개강).toLocaleDateString()}</span>
                                  </div>
                                  {program.종강 && (
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">종강:</span>
                                      <span>{new Date(program.종강).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">교육시간:</span>
                                    <span className="font-semibold text-accent">{program.교육시간}시간</span>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
                          {/* 타임라인 연결선 */}
                          {status !== 'none' && monthIndex < 11 && getMonthStatus(program, monthIndex + 1) !== 'none' && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-border/60 z-0" />
                          )}
                        </div>
                      );
                    })}

                    {/* 프리미엄 상태 */}
                    <div className="p-3 text-center">
                      <Badge 
                        variant={program.진행상태 === '완료' ? 'secondary' : 'default'}
                        className={`text-xs font-semibold px-3 py-1.5 shadow-sm transition-all duration-200 hover:scale-105 ${
                          program.진행상태 === '완료' 
                            ? 'bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground' 
                            : 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-[var(--premium-glow)]'
                        }`}
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
        
        {/* 프리미엄 범례 */}
        <div className="mt-6 pt-4 border-t border-border/50 bg-gradient-to-r from-muted/20 to-transparent rounded-lg p-4">
          <div className="text-sm font-bold mb-3 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            과정 구분
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(courseColors).map(([courseType, colorScheme]) => (
              <div key={courseType} className="flex items-center gap-3 group hover:scale-105 transition-transform duration-200">
                <div 
                  className="w-4 h-4 rounded-lg shadow-sm border border-white/20" 
                  style={{ background: colorScheme.gradient }}
                />
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {courseType}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}