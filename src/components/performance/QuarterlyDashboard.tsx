import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Award, Clock, Calendar } from 'lucide-react';
import { KDTProgram } from '@/types/kdt';
import { cn } from '@/lib/utils';
import { getSchoolUnitPrice } from '@/data/unitPrices';
import { calculateProgressRate, calculateDDay, getProgressColor, getDDayColor } from '@/utils/courseProgress';

interface QuarterlyDashboardProps {
  programs: KDTProgram[];
  year?: number;
}

interface QuarterData {
  quarter: string;
  year: number;
  programs: (KDTProgram & {
    unitPrice: number;
    currentRevenue: number;
    expectedRevenue: number;
    confirmedCount: number;
    progressRate: number;
    dday: string;
  })[];
  totalRevenue: number;
  expectedRevenue: number;
  totalCourses: number;
  averageRecruitmentRate: number;
  totalCapacity: number;
  totalConfirmed: number;
}

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  colorClass: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, colorClass }) => {
  const changeDisplay = change !== undefined ? Math.abs(change).toFixed(1) : null;
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold", colorClass)}>{value}</p>
            {changeDisplay !== null && (
              <div className="flex items-center gap-1 text-sm">
                {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
                {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
                {!isPositive && !isNegative && <Minus className="h-4 w-4 text-gray-500" />}
                <span className={cn(
                  "font-medium",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-gray-500"
                )}>
                  {changeDisplay}%
                </span>
                <span className="text-muted-foreground">전분기 대비</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-full", colorClass.replace('text-', 'bg-').replace('-600', '-100'))}>
            <Icon className={cn("h-8 w-8", colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function QuarterlyDashboard({ programs, year = 2025 }: QuarterlyDashboardProps) {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('1Q');
  const [selectedYear, setSelectedYear] = useState<number>(year);

  // 사용 가능한 연도와 분기 계산
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(programs.map(p => p.년도))).sort((a, b) => b - a);
    return years;
  }, [programs]);

  const availableQuarters = ['1Q', '2Q', '3Q', '4Q'];

  // 분기별 데이터 처리
  const quarterlyData = useMemo(() => {
    const quarters = ['1Q', '2Q', '3Q', '4Q'];

    return quarters.map(quarter => {
      const quarterPrograms = programs.filter(program => {
        return program.년도 === selectedYear && program.분기 === quarter;
      });

      // 각 과정별 상세 데이터 계산
      const detailedPrograms = quarterPrograms.map(program => {
        const unitPrice = getSchoolUnitPrice(program.과정코드);
        
        const confirmedCount = program.HRD_확정 || 0;
        const currentRevenue = unitPrice * confirmedCount;
        const expectedRevenue = unitPrice * program.정원;
        
        // 진행률 및 D-Day 계산
        const progressRate = program.진행상태 === '진행중' 
          ? calculateProgressRate(program.개강, program.종강)
          : 100;
        const dday = program.진행상태 === '진행중' 
          ? calculateDDay(program.종강)
          : '진행완료';

        return {
          ...program,
          unitPrice,
          confirmedCount,
          currentRevenue,
          expectedRevenue,
          progressRate,
          dday
        };
      });

      return {
        quarter,
        year: selectedYear,
        programs: detailedPrograms,
        totalRevenue: detailedPrograms.reduce((sum, p) => sum + p.currentRevenue, 0),
        expectedRevenue: detailedPrograms.reduce((sum, p) => sum + p.expectedRevenue, 0),
        totalCourses: quarterPrograms.length,
        averageRecruitmentRate: quarterPrograms.length > 0 
          ? quarterPrograms.reduce((sum, p) => sum + p.모객율, 0) / quarterPrograms.length 
          : 0,
        totalCapacity: quarterPrograms.reduce((sum, p) => sum + p.정원, 0),
        totalConfirmed: detailedPrograms.reduce((sum, p) => sum + p.confirmedCount, 0)
      };
    });
  }, [programs, selectedYear]);

  // 현재 선택된 분기 데이터
  const currentQuarterData = quarterlyData.find(q => q.quarter === selectedQuarter);

  // 전분기 데이터 (비교용)
  const previousQuarterData = useMemo(() => {
    const currentIndex = availableQuarters.indexOf(selectedQuarter);
    if (currentIndex > 0) {
      return quarterlyData[currentIndex - 1];
    } else {
      // 이전 연도의 4Q 데이터
      const prevYearPrograms = programs.filter(p => p.년도 === selectedYear - 1 && p.분기 === '4Q');
      if (prevYearPrograms.length > 0) {
        const detailedPrograms = prevYearPrograms.map(program => {
          const unitPrice = getSchoolUnitPrice(program.과정코드);
          const confirmedCount = program.HRD_확정 || 0;
          const currentRevenue = unitPrice * confirmedCount;
          const expectedRevenue = unitPrice * program.정원;
          const progressRate = 100; // 완료된 과정
          const dday = '진행완료';
          return { ...program, unitPrice, confirmedCount, currentRevenue, expectedRevenue, progressRate, dday };
        });
        
        return {
          quarter: '4Q',
          year: selectedYear - 1,
          programs: detailedPrograms,
          totalRevenue: detailedPrograms.reduce((sum, p) => sum + p.currentRevenue, 0),
          expectedRevenue: detailedPrograms.reduce((sum, p) => sum + p.expectedRevenue, 0),
          totalCourses: prevYearPrograms.length,
          averageRecruitmentRate: prevYearPrograms.length > 0 
            ? prevYearPrograms.reduce((sum, p) => sum + p.모객율, 0) / prevYearPrograms.length 
            : 0,
          totalCapacity: prevYearPrograms.reduce((sum, p) => sum + p.정원, 0),
          totalConfirmed: detailedPrograms.reduce((sum, p) => sum + p.confirmedCount, 0)
        };
      }
    }
    return null;
  }, [programs, selectedQuarter, selectedYear, quarterlyData, availableQuarters]);

  // 변화율 계산
  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // 금액 포맷팅
  const formatCurrency = (amount: number): string => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  };

  // 상태 뱃지 컴포넌트
  const StatusBadge = ({ status, progressRate }: { status: '진행중' | '완료'; progressRate?: number }) => (
    <Badge variant={status === '완료' ? 'default' : 'secondary'} className="text-xs">
      {status === '진행중' && progressRate !== undefined ? `${status} (${progressRate}%)` : status}
    </Badge>
  );

  // 진행률 프로그레스 바 컴포넌트
  const ProgressBar = ({ progressRate }: { progressRate: number }) => (
    <div className="flex items-center gap-2">
      <Progress value={progressRate} className="flex-1 h-2" />
      <span className="text-xs font-medium min-w-[40px]">{progressRate}%</span>
    </div>
  );

  // D-Day 컴포넌트
  const DDayDisplay = ({ dday }: { dday: string }) => (
    <span className={cn("text-xs font-semibold", getDDayColor(dday))}>
      {dday}
    </span>
  );

  if (!currentQuarterData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">데이터를 불러올 수 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 컨트롤 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold">분기별 교육과정 현황</CardTitle>
            <div className="flex gap-3">
              <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableQuarters.map(quarter => (
                    <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 과정 수"
          value={`${currentQuarterData.totalCourses}개`}
          change={previousQuarterData ? calculateChange(currentQuarterData.totalCourses, previousQuarterData.totalCourses) : undefined}
          icon={Award}
          colorClass="text-blue-600"
        />
        <KPICard
          title="전체 정원"
          value={`${currentQuarterData.totalCapacity.toLocaleString()}명`}
          change={previousQuarterData ? calculateChange(currentQuarterData.totalCapacity, previousQuarterData.totalCapacity) : undefined}
          icon={Users}
          colorClass="text-green-600"
        />
        <KPICard
          title="현재 매출"
          value={formatCurrency(currentQuarterData.totalRevenue)}
          change={previousQuarterData ? calculateChange(currentQuarterData.totalRevenue, previousQuarterData.totalRevenue) : undefined}
          icon={DollarSign}
          colorClass="text-emerald-600"
        />
        <KPICard
          title="기대 매출"
          value={formatCurrency(currentQuarterData.expectedRevenue)}
          change={previousQuarterData ? calculateChange(currentQuarterData.expectedRevenue, previousQuarterData.expectedRevenue) : undefined}
          icon={Target}
          colorClass="text-orange-600"
        />
      </div>

      {/* 메인 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedYear}년 {selectedQuarter} 교육과정 상세</CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuarterData.programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">해당 분기에 진행되는 과정이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">교육과정명</TableHead>
                    <TableHead className="text-center">기수</TableHead>
                    <TableHead className="text-center">상태</TableHead>
                    <TableHead className="text-center">모집인원</TableHead>
                    <TableHead className="text-center">확정인원</TableHead>
                    <TableHead className="text-center">모집률</TableHead>
                    <TableHead className="text-center">진행률/수료율</TableHead>
                    <TableHead className="text-center">D-Day/취업률</TableHead>
                    <TableHead className="text-right">1인 단가</TableHead>
                    <TableHead className="text-right">현재 매출</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentQuarterData.programs.map((program, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{program.과정구분}</TableCell>
                      <TableCell className="text-center">{program.회차}기</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge 
                          status={program.진행상태} 
                          progressRate={program.진행상태 === '진행중' ? program.progressRate : undefined}
                        />
                      </TableCell>
                      <TableCell className="text-center">{program.정원.toLocaleString()}명</TableCell>
                      <TableCell className="text-center">{program.confirmedCount.toLocaleString()}명</TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "font-medium",
                          program.모객율 >= 80 ? "text-green-600" :
                          program.모객율 >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {program.모객율.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {program.진행상태 === '진행중' ? (
                          <ProgressBar progressRate={program.progressRate} />
                        ) : (
                          <span className="text-green-600 font-medium">
                            {program.수료율.toFixed(1)}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {program.진행상태 === '진행중' ? (
                          <DDayDisplay dday={program.dday} />
                        ) : (
                          <span className="text-blue-600 font-medium">
                            {program.취업률 ? `${program.취업률.toFixed(1)}%` : '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ₩{program.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {formatCurrency(program.currentRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 분기별 요약 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>분기별 성과 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">평균 모집률</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentQuarterData.averageRecruitmentRate.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">총 확정 인원</p>
              <p className="text-2xl font-bold text-green-600">
                {currentQuarterData.totalConfirmed.toLocaleString()}명
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">매출 달성률</p>
              <p className="text-2xl font-bold text-orange-600">
                {currentQuarterData.expectedRevenue > 0 
                  ? ((currentQuarterData.totalRevenue / currentQuarterData.expectedRevenue) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}