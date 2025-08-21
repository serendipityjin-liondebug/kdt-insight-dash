import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { KDTProgram } from '@/types/kdt';

interface CourseCompletionStatusProps {
  programs: KDTProgram[];
}

type PeriodType = 'thisYear' | 'nextYear' | 'all';

export function CourseCompletionStatus({ programs }: CourseCompletionStatusProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('thisYear');

  const completionData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // 올해 하반기 완료 과정 (7월~12월)
    const thisYearSecondHalf = programs.filter(program => {
      if (!program.종강) return false;
      const endDate = new Date(program.종강);
      return (
        endDate.getFullYear() === currentYear &&
        endDate.getMonth() + 1 >= 7
      );
    });

    // 내년 상반기 완료 과정 (1월~6월)
    const nextYearFirstHalf = programs.filter(program => {
      if (!program.종강) return false;
      const endDate = new Date(program.종강);
      return (
        endDate.getFullYear() === currentYear + 1 &&
        endDate.getMonth() + 1 <= 6
      );
    });

    // 전체 교육 과정 완료 일정
    const allCourses = programs.filter(program => program.종강);

    return {
      thisYear: thisYearSecondHalf,
      nextYear: nextYearFirstHalf,
      all: allCourses,
    };
  }, [programs]);

  const getCurrentPeriodData = () => {
    switch (selectedPeriod) {
      case 'thisYear':
        return completionData.thisYear;
      case 'nextYear':
        return completionData.nextYear;
      case 'all':
        return completionData.all;
      default:
        return [];
    }
  };

  const currentData = getCurrentPeriodData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>교육 과정 완료 현황</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedPeriod === 'thisYear' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('thisYear')}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            올해 하반기 완료 ({completionData.thisYear.length})
          </Button>
          <Button
            variant={selectedPeriod === 'nextYear' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('nextYear')}
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
            내년 상반기 완료 ({completionData.nextYear.length})
          </Button>
          <Button
            variant={selectedPeriod === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('all')}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            전체 완료 일정 ({completionData.all.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {currentData.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              해당 기간에 완료되는 과정이 없습니다.
            </div>
          ) : (
            currentData
              .sort((a, b) => {
                if (!a.종강 || !b.종강) return 0;
                return new Date(a.종강).getTime() - new Date(b.종강).getTime();
              })
              .map((program, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-card-foreground">
                        {program.과정구분} {program.회차}기
                      </h4>
                      <Badge variant={program.진행상태 === '완료' ? 'default' : 'secondary'} className="text-xs">
                        {program.진행상태}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      과정코드: {program.과정코드}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      수료율: {program.수료율}% | 취업률: {program.취업률 || 0}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-card-foreground">
                      {program.종강 
                        ? new Date(program.종강).toLocaleDateString('ko-KR')
                        : '미정'
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">완료 예정</div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}