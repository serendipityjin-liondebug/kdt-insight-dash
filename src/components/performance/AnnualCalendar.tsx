import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KDTProgram } from '@/types/kdt';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const monthlyCalendars = useMemo(() => {
    const months = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return months.map((month, monthIndex) => {
      const monthNumber = monthIndex + 1;
      const daysInMonth = new Date(year, monthNumber, 0).getDate();
      const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
      
      // 해당 월에 겹치는 프로그램들 찾기
      const monthPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        const endDate = program.종강 ? new Date(program.종강) : null;
        
        // 프로그램이 해당 월과 겹치는지 확인
        const programStartMonth = startDate.getMonth() + 1;
        const programStartYear = startDate.getFullYear();
        const programEndMonth = endDate ? endDate.getMonth() + 1 : 12;
        const programEndYear = endDate ? endDate.getFullYear() : year;
        
        return (
          (programStartYear === year && programStartMonth <= monthNumber && 
           programEndYear === year && programEndMonth >= monthNumber) ||
          (programStartYear === year && programStartMonth === monthNumber) ||
          (programEndYear === year && programEndMonth === monthNumber) ||
          (programStartYear < year && programEndYear > year) ||
          (programStartYear < year && programEndYear === year && programEndMonth >= monthNumber) ||
          (programStartYear === year && programStartMonth <= monthNumber && programEndYear > year)
        );
      });

      return {
        month,
        monthNumber,
        daysInMonth,
        firstDayOfWeek,
        programs: monthPrograms
      };
    });
  }, [programs, year]);

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{year}년 연간 효율성 일정</CardTitle>
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
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
            {monthlyCalendars.map((calendar) => (
              <div key={calendar.month} className="border border-border rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2 text-center">{calendar.month}</h4>
                
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div key={day} className="text-xs text-muted-foreground text-center py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* 달력 날짜 */}
                <div className="grid grid-cols-7 gap-1">
                  {/* 빈 칸 (첫 주 시작 전) */}
                  {Array.from({ length: calendar.firstDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} className="h-6" />
                  ))}
                  
                  {/* 실제 날짜들 */}
                  {Array.from({ length: calendar.daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const dayPrograms = calendar.programs.filter(program => {
                      const startDate = new Date(program.개강);
                      const endDate = program.종강 ? new Date(program.종강) : null;
                      const currentDate = new Date(year, calendar.monthNumber - 1, day);
                      
                      return currentDate >= startDate && (!endDate || currentDate <= endDate);
                    });
                    
                    return (
                      <div key={day} className="h-6 relative">
                        <div className="text-xs text-center leading-6 relative z-10">
                          {day}
                        </div>
                        
                        {/* 프로그램 색상 표시 */}
                        {dayPrograms.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute inset-0 rounded-sm opacity-60 cursor-pointer">
                                <div className="flex h-full">
                                  {dayPrograms.slice(0, 3).map((program, index) => (
                                    <div
                                      key={`${program.과정코드}-${program.회차}`}
                                      className={`flex-1 bg-${courseColors[program.과정구분]} ${
                                        program.진행상태 === '완료' ? 'opacity-50' : ''
                                      }`}
                                      style={{
                                        borderRadius: index === 0 ? '2px 0 0 2px' : 
                                                   index === dayPrograms.length - 1 ? '0 2px 2px 0' : '0'
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                {dayPrograms.map((program) => (
                                  <div key={`${program.과정코드}-${program.회차}`} className="text-xs">
                                    <div className="font-medium">{program.과정구분} {program.회차}기</div>
                                    <div className="text-muted-foreground">
                                      {program.개강.toLocaleDateString()} ~ {program.종강?.toLocaleDateString() || '진행중'}
                                    </div>
                                    <div className={`text-xs ${program.진행상태 === '완료' ? 'text-success' : 'text-primary'}`}>
                                      {program.진행상태}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* 범례 */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(courseColors).map(([courseType, colorClass]) => (
              <div key={courseType} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm bg-${colorClass}`} />
                <span className="text-xs text-muted-foreground">{courseType}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}