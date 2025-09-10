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
  // 과정구분별 색상 매핑 - 더 다양하고 시각적으로 구분되는 색상
  const courseColors = useMemo(() => {
    const colorPalette = [
      '#3B82F6', // 파랑 (AI)
      '#F59E0B', // 주황 (클라우드)  
      '#10B981', // 초록 (데이터 테크)
      '#8B5CF6', // 보라 (프론트)
      '#EF4444', // 빨강 (디자인)
      '#6366F1', // 인디고 (자바)
      '#EC4899', // 핑크 (파이썬)
      '#14B8A6', // 틸 (그로스마케팅)
      '#F97316', // 오렌지 (블록체인)
      '#84CC16', // 라임 (iOS)
      '#A855F7', // 보라 (프론트)
    ];
    
    const courseTypes = [...new Set(programs.map(p => p.과정구분))].sort();
    const colorMap: Record<string, string> = {};
    
    courseTypes.forEach((type, index) => {
      colorMap[type] = colorPalette[index % colorPalette.length];
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

  // 각 프로그램의 활성 월 계산
  const getActiveMonths = (program: KDTProgram) => {
    const startDate = new Date(program.개강);
    const endDate = program.종강 ? new Date(program.종강) : new Date(year, 11, 31);
    const activeMonths: number[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      
      if (startDate <= monthEnd && endDate >= monthStart) {
        activeMonths.push(month);
      }
    }
    
    return activeMonths;
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
          <div className="min-w-[1000px] bg-background">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[280px_repeat(12,1fr)_80px] gap-px mb-4">
              <div className="font-semibold text-sm text-foreground p-3 bg-muted/30 rounded-tl-lg">
                과정명
              </div>
              {months.map((month, index) => (
                <div key={month} className="font-semibold text-xs text-center text-foreground p-3 bg-muted/30">
                  {month}
                </div>
              ))}
              <div className="font-semibold text-xs text-center text-foreground p-3 bg-muted/30 rounded-tr-lg">
                상태
              </div>
            </div>

            {/* 프로그램별 간트차트 */}
            <div className="space-y-px bg-muted/20 p-px rounded-lg">
              {yearPrograms.map((program, programIndex) => {
                const activeMonths = getActiveMonths(program);
                const color = courseColors[program.과정구분];
                
                return (
                  <div key={`${program.과정코드}-${program.회차}`} 
                       className="grid grid-cols-[280px_repeat(12,1fr)_80px] gap-px bg-background hover:bg-muted/30 transition-colors duration-200">
                    
                    {/* 과정명 */}
                    <div className="p-3 flex items-center bg-background">
                      <div className="flex items-center gap-3 w-full">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate" title={`${program.과정구분} ${program.회차}회차`}>
                            {program.과정구분} {program.회차}회차
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {program.과정코드}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 월별 타임라인 */}
                    {months.map((month, monthIndex) => {
                      const isActive = activeMonths.includes(monthIndex);
                      
                      return (
                        <div key={month} className="p-2 h-16 flex items-center justify-center bg-background">
                          {isActive ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="w-8 h-6 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer shadow-sm"
                                  style={{ 
                                    backgroundColor: color,
                                    opacity: program.진행상태 === '완료' ? 0.8 : 1
                                  }}
                                >
                                  <span className="text-[9px] font-bold text-white">
                                    {monthIndex + 1}
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
                                  <div>정원: {program.정원}명</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="w-8 h-6" />
                          )}
                        </div>
                      );
                    })}

                    {/* 상태 */}
                    <div className="p-3 flex items-center justify-center bg-background">
                      <Button 
                        size="sm" 
                        variant={program.진행상태 === '완료' ? 'secondary' : 'default'}
                        className="h-6 px-2 text-xs rounded-full"
                        disabled
                      >
                        {program.진행상태}
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {yearPrograms.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-background rounded-lg">
                  해당 연도에 등록된 과정이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 범례 - 더 시각적이고 컬러풀한 디자인 */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-sm font-medium mb-4 text-foreground">과정 구분</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(courseColors).map(([courseType, color]) => (
              <div key={courseType} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div 
                  className="w-4 h-4 rounded-full shadow-sm border-2 border-background" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-foreground truncate">{courseType}</span>
              </div>
            ))}
          </div>
          
          {/* 통계 요약 */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-foreground">{yearPrograms.length}</div>
              <div className="text-xs text-muted-foreground">총 과정</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {yearPrograms.filter(p => p.진행상태 === '진행중').length}
              </div>
              <div className="text-xs text-muted-foreground">진행중</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {yearPrograms.filter(p => p.진행상태 === '완료').length}
              </div>
              <div className="text-xs text-muted-foreground">완료</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {Math.round(yearPrograms.reduce((sum, p) => sum + p.수료율, 0) / yearPrograms.length || 0)}%
              </div>
              <div className="text-xs text-muted-foreground">평균 수료율</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}