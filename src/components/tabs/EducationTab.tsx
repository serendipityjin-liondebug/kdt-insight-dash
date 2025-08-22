import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { KDTProgram } from '@/types/kdt';
import { Clock, Users, Award, TrendingUp, Calendar } from 'lucide-react';
import { calculateProgressRate, calculateDDay, getDDayColor, getProgressColor } from '@/utils/courseProgress';
import { getSchoolUnitPrice } from '@/data/unitPrices';

interface EducationTabProps {
  programs: KDTProgram[];
}

export function EducationTab({ programs }: EducationTabProps) {
  // 요약 KPI 계산
  const summaryKPI = useMemo(() => {
    const completed = programs.filter(p => p.진행상태 === '완료');
    const totalStudents = programs.reduce((sum, p) => sum + (p.수료 || 0), 0);
    const avgCompletionRate = completed.length > 0 ? 
      completed.reduce((sum, p) => sum + p.수료율, 0) / completed.length : 0;
    const avgEmploymentRate = completed.length > 0 ? 
      completed.reduce((sum, p) => sum + (p.취업률 || 0), 0) / completed.length : 0;

    return {
      totalPrograms: programs.length,
      totalStudents,
      avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
      avgEmploymentRate: Math.round(avgEmploymentRate * 10) / 10,
    };
  }, [programs]);

  // 프로그램 카드 데이터 준비
  const programCards = useMemo(() => {
    return programs.map(program => {
      const startDate = program.개강 ? new Date(program.개강).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }) : '-';
      
      const endDate = program.종강 ? new Date(program.종강).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }) : '진행중';

      // 진행률 및 D-Day 계산
      const progressRate = program.진행상태 === '진행중' && program.개강 && program.종강 
        ? calculateProgressRate(program.개강, program.종강)
        : 0;
      
      const dDay = program.진행상태 === '진행중' && program.종강 
        ? calculateDDay(program.종강)
        : '';

      // 인원 정보 (진행중: 확정인원, 완료: 수료인원)
      const studentText = program.진행상태 === '진행중' 
        ? `${program.HRD_확정 || 0}/${program.정원}` 
        : `${program.수료 || 0}/${program.정원}`;

      // 단가 정보
      const unitPrice = getSchoolUnitPrice(program.과정코드);

      return {
        ...program,
        periodText: `${startDate} ~ ${endDate}`,
        studentText,
        progressRate,
        dDay,
        unitPrice,
      };
    }).sort((a, b) => {
      // 진행중인 것을 먼저, 그 다음 최신순
      if (a.진행상태 !== b.진행상태) {
        return a.진행상태 === '진행중' ? -1 : 1;
      }
      return new Date(b.개강).getTime() - new Date(a.개강).getTime();
    });
  }, [programs]);

  return (
    <div className="space-y-6">
      {/* 상단 요약 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{summaryKPI.totalPrograms}</p>
                <p className="text-sm text-muted-foreground">전체 과정 수</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{summaryKPI.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">총 수강생 수</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{summaryKPI.avgCompletionRate}%</p>
                <p className="text-sm text-muted-foreground">평균 수료율</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{summaryKPI.avgEmploymentRate}%</p>
                <p className="text-sm text-muted-foreground">평균 취업률</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 과정 카드 리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programCards.map((program) => (
          <Card key={`${program.과정코드}_${program.회차}`} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold text-card-foreground">
                    {program.과정구분}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {program.과정코드} (회차: {program.회차})
                  </p>
                </div>
                <Badge 
                  variant={program.진행상태 === '진행중' ? 'default' : 'secondary'}
                  className={program.진행상태 === '진행중' ? 'bg-primary text-primary-foreground' : ''}
                >
                  {program.진행상태 === '진행중' && program.progressRate > 0 
                    ? `${program.진행상태} (${Math.round(program.progressRate)}%)`
                    : program.진행상태
                  }
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* 기간 및 인원 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{program.periodText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>
                      {program.진행상태 === '진행중' ? '확정인원' : '수료인원'}: {program.studentText}
                      {program.진행상태 === '진행중' && (
                        <span className="ml-2 text-primary font-medium">
                          (모집률: {Math.round(program.모객율)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  {program.진행상태 === '진행중' && program.dDay && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">
                        {program.dDay}
                      </span>
                    </div>
                  )}
                </div>

                {/* 성과 지표 바 */}
                <div className="space-y-3">
                  {program.진행상태 === '진행중' ? (
                    <>
                      {/* 진행중 과정: 진행률 표시 */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">과정 진행률</span>
                          <span className="font-medium">
                            {Math.round(program.progressRate)}%
                          </span>
                        </div>
                        <Progress 
                          value={program.progressRate} 
                          className="h-2"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 완료된 과정: 수료율 표시 */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">수료율</span>
                          <span className="font-medium">{program.수료율}%</span>
                        </div>
                        <Progress value={program.수료율} className="h-2" />
                      </div>

                      {/* 완료된 과정: 취업률 표시 */}
                      {program.취업률 !== null && program.취업률 >= 0 && program.취업률 <= 100 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">취업률</span>
                            <span className="font-medium">{program.취업률}%</span>
                          </div>
                          <Progress value={program.취업률} className="h-2" />
                        </div>
                      )}
                    </>
                  )}

                  {/* 만족도 (완료된 과정만) */}
                  {program.진행상태 === '완료' && program.HRD_만족도 !== null && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">만족도</span>
                        <span className="font-medium">{program.HRD_만족도}/5.0</span>
                      </div>
                      <Progress value={(program.HRD_만족도 / 5) * 100} className="h-2" />
                    </div>
                  )}
                </div>

                {/* 추가 정보 */}
                <div className="pt-2 border-t border-border space-y-1">
                  {program.unitPrice > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">과정 단가: </span>
                      <span className="font-medium">₩{program.unitPrice.toLocaleString()}</span>
                    </div>
                  )}
                  {program.최소_매출 !== null && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">최소 매출: </span>
                      <span className="font-medium">₩{program.최소_매출.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programCards.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>등록된 과정이 없습니다.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}