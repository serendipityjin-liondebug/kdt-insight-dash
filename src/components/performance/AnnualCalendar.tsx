import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KDTProgram } from '@/types/kdt';

interface AnnualCalendarProps {
  programs: KDTProgram[];
  year?: number;
}

export function AnnualCalendar({ programs, year = 2025 }: AnnualCalendarProps) {
  const monthlyData = useMemo(() => {
    const months = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];

    return months.map((month, index) => {
      const monthNumber = index + 1;
      
      const inProgress = programs.filter(program => {
        const startDate = new Date(program.개강);
        const endDate = program.종강 ? new Date(program.종강) : null;
        const isInCurrentYear = startDate.getFullYear() === year || (endDate && endDate.getFullYear() === year);
        
        if (!isInCurrentYear) return false;
        
        const startMonth = startDate.getMonth() + 1;
        const endMonth = endDate ? endDate.getMonth() + 1 : 12;
        
        return monthNumber >= startMonth && monthNumber <= endMonth;
      }).length;

      const scheduled = programs.filter(program => {
        const startDate = new Date(program.개강);
        return startDate.getFullYear() === year && startDate.getMonth() + 1 === monthNumber;
      }).length;

      return {
        month,
        inProgress,
        scheduled,
        monthNumber
      };
    });
  }, [programs, year]);

  return (
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
        <div className="grid grid-cols-6 gap-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <h4 className="font-medium text-sm mb-2">{data.month}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">진행중</span>
                  <span className="font-medium text-primary">{data.inProgress}개</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">개강예정</span>
                  <span className="font-medium text-success">{data.scheduled}개</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}