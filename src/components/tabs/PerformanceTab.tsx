import React from 'react';
import { KDTProgram } from '@/types/kdt';
import { AnnualCalendar } from '@/components/performance/AnnualCalendar';
import { CourseCompletionStatus } from '@/components/performance/CourseCompletionStatus';
import { QuarterlyDashboard } from '@/components/performance/QuarterlyDashboard';

interface PerformanceTabProps {
  programs: KDTProgram[];
}

export function PerformanceTab({ programs }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      {/* 연간 효율성 일정 */}
      <AnnualCalendar programs={programs} year={2025} />

      {/* 교육 과정 완료 현황 */}
      <CourseCompletionStatus programs={programs} />

      {/* 분기별 교육 과정 현황 */}
      <QuarterlyDashboard programs={programs} year={2025} />
    </div>
  );
}