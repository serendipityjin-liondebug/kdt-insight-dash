import React, { useState, useMemo } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { FilterBar } from './FilterBar';
import { OverviewTab } from './tabs/OverviewTab';
import { EducationTab } from './tabs/EducationTab';
import { BusinessTab } from './tabs/BusinessTab';
import { PerformanceTab } from './tabs/PerformanceTab';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Users, Settings } from 'lucide-react';
import { FilterState, KDTProgram } from '@/types/kdt';
import { kdtPrograms, filterPrograms } from '@/data/kdtData';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<FilterState>({});

  // 필터된 데이터
  const filteredPrograms = useMemo(() => {
    return filterPrograms(kdtPrograms, filters);
  }, [filters]);

  const renderTabContent = () => {
    const props = { programs: filteredPrograms, filters };
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...props} />;
      case 'education':
        return <EducationTab {...props} />;
      case 'business':
        return <BusinessTab {...props} />;
      case 'performance':
        return <PerformanceTab {...props} />;
      case 'courses':
        return <CoursesTab {...props} />;
      case 'students':
        return <StudentsTab {...props} />;
      case 'reports':
        return <ReportsTab {...props} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab {...props} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-bg">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">
                  {getTabTitle(activeTab)}
                </h1>
                <p className="text-muted-foreground mt-1">
                  KDT 프로그램 운영 현황을 한눈에 확인하세요
                </p>
              </div>
              
              {/* 우측 액션 버튼들 */}
              <div className="flex gap-3">
                {activeTab === 'reports' && (
                  <Button variant="outline" className="gap-2">
                    <FileDown className="w-4 h-4" />
                    데이터 내보내기
                  </Button>
                )}
              </div>
            </div>

            {/* 필터 바 */}
            {!['settings', 'reports'].includes(activeTab) && (
              <FilterBar filters={filters} onFilterChange={setFilters} />
            )}

            {/* 탭 컨텐츠 */}
            <div className="min-h-[500px]">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// 간단한 탭 컴포넌트들 (추후 별도 파일로 분리 가능)
function CoursesTab({ programs }: { programs: KDTProgram[]; filters: FilterState }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {programs.map((program) => (
        <Card key={`${program.과정코드}_${program.회차}`} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{program.과정구분}</h4>
                  <p className="text-sm text-muted-foreground">{program.과정코드}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">보기</Button>
                  <Button variant="ghost" size="sm">편집</Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">회차:</span>
                  <span>{program.회차}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">기간:</span>
                  <span>{program.개강 ? new Date(program.개강).toLocaleDateString('ko-KR') : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">정원:</span>
                  <span>{program.정원}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수료:</span>
                  <span>{program.수료 || 0}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수료율:</span>
                  <span className="font-medium">{program.수료율}%</span>
                </div>
                {program.취업률 !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">취업률:</span>
                    <span className="font-medium">{program.취업률}%</span>
                  </div>
                )}
                {program.HRD_만족도 !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">만족도:</span>
                    <span className="font-medium">{program.HRD_만족도}/5.0</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-border">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  다음 평가일: 2024-12-15
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StudentsTab({ programs }: { programs: KDTProgram[]; filters: FilterState }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">수강생 현황</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">과정구분</th>
                <th className="text-center p-3 font-medium text-muted-foreground">회차</th>
                <th className="text-center p-3 font-medium text-muted-foreground">정원</th>
                <th className="text-center p-3 font-medium text-muted-foreground">수료</th>
                <th className="text-center p-3 font-medium text-muted-foreground">취업</th>
                <th className="text-center p-3 font-medium text-muted-foreground">진행상태</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program, index) => (
                <tr key={index} className="border-b border-border">
                  <td className="p-3">{program.과정구분}</td>
                  <td className="p-3 text-center">{program.회차}</td>
                  <td className="p-3 text-center">{program.정원}</td>
                  <td className="p-3 text-center">{program.수료 || 0}</td>
                  <td className="p-3 text-center">{program.취창업 || 0}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      program.진행상태 === '진행중' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-success/10 text-success'
                    }`}>
                      {program.진행상태}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ReportsTab({ programs }: { programs: KDTProgram[]; filters: FilterState }) {
  const handleDownload = () => {
    // CSV 다운로드 로직 (실제로는 서버에서 처리하거나 클라이언트에서 CSV 생성)
    alert('현재 필터 조건의 데이터를 CSV로 다운로드합니다.');
  };

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <FileDown className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-4">리포트 다운로드</h3>
        <p className="text-muted-foreground mb-8">
          현재 설정된 필터 조건에 따른 데이터를 다양한 형식으로 다운로드할 수 있습니다.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <Button onClick={handleDownload} className="w-full gap-2">
            <FileDown className="w-4 h-4" />
            CSV 다운로드 ({programs.length}개 과정)
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <FileDown className="w-4 h-4" />
            Excel 다운로드
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <FileDown className="w-4 h-4" />
            PDF 리포트 생성
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            표시 설정
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">테마 설정</label>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">라이트 모드</Button>
                <Button variant="default" size="sm">다크 모드</Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">강조 색상</label>
              <div className="flex gap-2">
                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'].map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full ${color} ${index === 0 ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">숫자 표시 정밀도</label>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">정수</Button>
                <Button variant="default" size="sm">소수점 1자리</Button>
                <Button variant="outline" size="sm">소수점 2자리</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">데이터 설정</h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">업데이트 주기</label>
              <div className="space-y-2">
                {[
                  { label: '실시간', value: 'realtime' },
                  { label: '5분마다', value: '5min' },
                  { label: '1시간마다', value: '1hour' },
                  { label: '일일 업데이트', value: 'daily' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="update-frequency" 
                      value={option.value}
                      defaultChecked={option.value === '1hour'}
                      className="text-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                설정 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getTabTitle(tabId: string): string {
  const titles = {
    overview: '주요 지표',
    education: '교육운영현황',
    business: '사업운영현황',
    performance: '성과 분석',
    courses: '과정 관리',
    students: '수강생 관리',
    reports: '리포트',
    settings: '설정',
  };
  return titles[tabId as keyof typeof titles] || '대시보드';
}