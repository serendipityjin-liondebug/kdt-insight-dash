import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KDTProgram } from '@/types/kdt';

interface CourseCompletionStatusProps {
  programs: KDTProgram[];
}

export function CourseCompletionStatus({ programs }: CourseCompletionStatusProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const completionData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 올해 하반기 완료 과정 (7-12월)
    const thisYearSecondHalf = programs.filter(program => {
      if (!program.종강) return false;
      const endDate = new Date(program.종강);
      return endDate.getFullYear() === currentYear && endDate.getMonth() >= 6;
    });

    // 내년 상반기 완료 과정 (1-6월)
    const nextYearFirstHalf = programs.filter(program => {
      if (!program.종강) return false;
      const endDate = new Date(program.종강);
      return endDate.getFullYear() === currentYear + 1 && endDate.getMonth() < 6;
    });

    // 전체 교육 과정 완료 일정
    const allCompleted = programs.filter(program => program.종강).sort((a, b) => {
      if (!a.종강 || !b.종강) return 0;
      return new Date(b.종강).getTime() - new Date(a.종강).getTime();
    });

    return {
      thisYearSecondHalf,
      nextYearFirstHalf,
      allCompleted
    };
  }, [programs]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderProgramList = (programs: KDTProgram[]) => (
    <div className="space-y-2 mt-3">
      {programs.map((program, index) => (
        <div key={index} className="flex justify-between items-center p-2 rounded border border-border">
          <div>
            <div className="font-medium text-sm">{program.과정구분} ({program.회차}기)</div>
            <div className="text-xs text-muted-foreground">
              {program.종강 ? new Date(program.종강).toLocaleDateString() : '미정'} 완료 예정
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {program.수료율.toFixed(1)}% 수료율
          </div>
        </div>
      ))}
      {programs.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          해당 기간에 완료 예정인 과정이 없습니다.
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>교육 과정 완료 현황</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 올해 하반기 완료 과정 */}
        <div className="border border-border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection('thisYear')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">올해 하반기 완료 과정</span>
              <span className="text-sm text-muted-foreground">
                ({completionData.thisYearSecondHalf.length}개)
              </span>
            </div>
            {expandedSection === 'thisYear' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSection === 'thisYear' && (
            <div className="px-4 pb-4">
              {renderProgramList(completionData.thisYearSecondHalf)}
            </div>
          )}
        </div>

        {/* 내년 상반기 완료 과정 */}
        <div className="border border-border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection('nextYear')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">내년 상반기 완료 과정</span>
              <span className="text-sm text-muted-foreground">
                ({completionData.nextYearFirstHalf.length}개)
              </span>
            </div>
            {expandedSection === 'nextYear' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSection === 'nextYear' && (
            <div className="px-4 pb-4">
              {renderProgramList(completionData.nextYearFirstHalf)}
            </div>
          )}
        </div>

        {/* 전체 교육 과정 완료 일정 */}
        <div className="border border-border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleSection('all')}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">전체 교육 과정 완료 일정</span>
              <span className="text-sm text-muted-foreground">
                ({completionData.allCompleted.length}개)
              </span>
            </div>
            {expandedSection === 'all' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          {expandedSection === 'all' && (
            <div className="px-4 pb-4">
              {renderProgramList(completionData.allCompleted)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}