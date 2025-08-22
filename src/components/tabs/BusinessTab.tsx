import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KDTProgram } from '@/types/kdt';
import { TrendingUp, Target, CheckCircle, Building } from 'lucide-react';

interface BusinessTabProps {
  programs: KDTProgram[];
}

export function BusinessTab({ programs }: BusinessTabProps) {
  // 사업 운영 KPI 계산
  const businessKPI = useMemo(() => {
    const totalRevenue = programs.reduce((sum, p) => sum + (p.최소_매출 || 0), 0);
    const targetRevenue = totalRevenue * 1.2; // 목표를 120%로 가정
    const budgetExecution = (totalRevenue / targetRevenue) * 100;
    
    const completedPrograms = programs.filter(p => p.진행상태 === '완료').length;
    const progressRate = programs.length > 0 ? (completedPrograms / programs.length) * 100 : 0;
    
    // 목표 달성률 계산 (모객율85%, 취업률75%, 수료율90%, 만족도4.3)
    const achievedTargets = programs.reduce((count, program) => {
      let achieved = 0;
      if (program.모객율 >= 85) achieved++;
      if ((program.취업률 || 0) >= 75) achieved++;
      if (program.수료율 >= 90) achieved++;
      if ((program.HRD_만족도 || 0) >= 4.3) achieved++;
      return count + achieved;
    }, 0);
    const targetAchievementRate = programs.length > 0 ? (achievedTargets / (programs.length * 4)) * 100 : 0;
    
    const totalParticipants = programs.reduce((sum, p) => sum + (p.수료 || 0), 0);

    return {
      budgetExecution: Math.round(budgetExecution * 10) / 10,
      progressRate: Math.round(progressRate * 10) / 10,
      targetAchievementRate: Math.round(targetAchievementRate * 10) / 10,
      totalRevenue,
      totalParticipants,
    };
  }, [programs]);

  // 주요 프로젝트 현황 (모의 데이터)
  const majorProjects = useMemo(() => [
    {
      name: 'AI 웹개발 부트캠프',
      progress: 85,
      participants: programs.filter(p => p.과정구분 === 'AI웹' || p.과정구분 === 'AIW').reduce((sum, p) => sum + (p.수료 || 0), 0),
      status: '진행중'
    },
    {
      name: '프론트엔드 전문가 과정',
      progress: 92,
      participants: programs.filter(p => p.과정구분.includes('프론트')).reduce((sum, p) => sum + (p.수료 || 0), 0),
      status: '완료'
    },
    {
      name: '데이터분석 전문가 과정',
      progress: 78,
      participants: programs.filter(p => p.과정구분 === '데이터분석').reduce((sum, p) => sum + (p.수료 || 0), 0),
      status: '진행중'
    },
    {
      name: '모바일 앱개발 통합과정',
      progress: 65,
      participants: programs.filter(p => p.과정구분 === '안드로이드' || p.과정구분 === 'iOS').reduce((sum, p) => sum + (p.수료 || 0), 0),
      status: '진행중'
    }
  ], [programs]);

  return (
    <div className="space-y-6">
      {/* 상단 KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-card-foreground">{businessKPI.budgetExecution}%</p>
                <p className="text-sm text-muted-foreground">예산 집행률</p>
                <Progress value={businessKPI.budgetExecution} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-card-foreground">{businessKPI.progressRate}%</p>
                <p className="text-sm text-muted-foreground">사업 진행률</p>
                <Progress value={businessKPI.progressRate} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Target className="w-6 h-6 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-card-foreground">{businessKPI.targetAchievementRate}%</p>
                <p className="text-sm text-muted-foreground">목표 달성률</p>
                <Progress value={businessKPI.targetAchievementRate} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Building className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-card-foreground">85%</p>
                <p className="text-sm text-muted-foreground">협력기업 참여도</p>
                <Progress value={85} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 예산 및 매출 현황 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>매출 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">총 매출</span>
                <span className="text-2xl font-bold text-primary">
                  ₩{businessKPI.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">참여 인원</span>
                <span className="text-2xl font-bold text-success">
                  {businessKPI.totalParticipants.toLocaleString()}명
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>목표 달성 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: '모객율 85% 이상', achieved: programs.filter(p => p.모객율 >= 85).length, total: programs.length },
                { label: '취업률 75% 이상', achieved: programs.filter(p => (p.취업률 || 0) >= 75).length, total: programs.filter(p => p.진행상태 === '완료').length },
                { label: '수료율 90% 이상', achieved: programs.filter(p => p.수료율 >= 90).length, total: programs.length },
                { label: '만족도 4.3 이상', achieved: programs.filter(p => (p.HRD_만족도 || 0) >= 4.3).length, total: programs.filter(p => p.HRD_만족도 !== null).length },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.achieved}/{item.total}</span>
                  </div>
                  <Progress 
                    value={item.total > 0 ? (item.achieved / item.total) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주요 프로젝트 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>주요 프로젝트 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {majorProjects.map((project, index) => (
              <Card key={index} className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-card-foreground">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">참여 인원: {project.participants}명</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === '완료' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">진행률</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}