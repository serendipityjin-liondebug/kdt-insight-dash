import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { KDTProgram } from '@/types/kdt';

interface AnnualCalendarProps {
  programs: KDTProgram[];
}

interface MonthData {
  month: number;
  monthName: string;
  inProgressCourses: number;
  completedCourses: number;
  startingCourses: number;
}

export function AnnualCalendar({ programs }: AnnualCalendarProps) {
  const [currentYear, setCurrentYear] = useState(2025);

  const monthlyData = useMemo(() => {
    const months: MonthData[] = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(currentYear, month - 1).toLocaleDateString('ko-KR', { month: 'long' });
      
      // 해당 월에 진행 중인 과정들
      const monthPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        const endDate = program.종강 ? new Date(program.종강) : null;
        const monthStart = new Date(currentYear, month - 1, 1);
        const monthEnd = new Date(currentYear, month, 0);
        
        return (
          startDate <= monthEnd && 
          (!endDate || endDate >= monthStart) &&
          startDate.getFullYear() === currentYear
        );
      });

      // 해당 월에 시작하는 과정들
      const startingPrograms = programs.filter(program => {
        const startDate = new Date(program.개강);
        return startDate.getFullYear() === currentYear && startDate.getMonth() + 1 === month;
      });

      // 해당 월에 완료되는 과정들
      const completingPrograms = programs.filter(program => {
        if (!program.종강) return false;
        const endDate = new Date(program.종강);
        return endDate.getFullYear() === currentYear && endDate.getMonth() + 1 === month;
      });

      months.push({
        month,
        monthName,
        inProgressCourses: monthPrograms.length,
        completedCourses: completingPrograms.length,
        startingCourses: startingPrograms.length,
      });
    }
    
    return months;
  }, [programs, currentYear]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>연간 과정 운영 일정</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentYear(prev => prev - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[80px] text-center">
              {currentYear}년
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentYear(prev => prev + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthlyData.map((month) => (
            <div
              key={month.month}
              className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">
                {month.monthName}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">진행중</span>
                  <span className="text-sm font-medium text-primary">
                    {month.inProgressCourses}개
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">신규시작</span>
                  <span className="text-sm font-medium text-success">
                    {month.startingCourses}개
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">완료예정</span>
                  <span className="text-sm font-medium text-warning">
                    {month.completedCourses}개
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}