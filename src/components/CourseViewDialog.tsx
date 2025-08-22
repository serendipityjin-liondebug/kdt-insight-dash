import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, Calendar, Users, Award, TrendingUp, BookOpen } from 'lucide-react';
import { KDTProgram } from '@/types/kdt';

interface CourseViewDialogProps {
  program: KDTProgram;
  children: React.ReactNode;
}

export function CourseViewDialog({ program, children }: CourseViewDialogProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const formatPercent = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return `${num}%`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            과정 상세 정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              기본 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">과정명</span>
                  <p className="font-medium">{program.과정구분}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">과정코드</span>
                  <p className="font-medium">{program.과정코드}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">회차</span>
                  <p className="font-medium">{program.회차}회차</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">교육시간</span>
                  <p className="font-medium">{formatNumber(program.교육시간)}시간</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">개강일</span>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(program.개강)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">종강일</span>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(program.종강)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">년도/분기</span>
                  <p className="font-medium">{program.년도}년 {program.분기}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">진행상태</span>
                  <Badge variant={program.진행상태 === '완료' ? 'default' : 'secondary'}>
                    {program.진행상태}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 인원 현황 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              인원 현황
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{formatNumber(program.정원)}</p>
                <p className="text-sm text-muted-foreground">정원</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{formatNumber(program.전체_지원)}</p>
                <p className="text-sm text-muted-foreground">전체 지원</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{formatNumber(program.HRD_확정)}</p>
                <p className="text-sm text-muted-foreground">HRD 확정</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{formatNumber(program.수료)}</p>
                <p className="text-sm text-muted-foreground">수료</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 성과 지표 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              성과 지표
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">모집률</span>
                  <Badge variant="outline">{formatPercent(program.모객율)}</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">수료율</span>
                  <Badge variant="outline">{formatPercent(program.수료율)}</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">취업률</span>
                  <Badge variant="outline">{formatPercent(program.취업률)}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          {(program.HRD_만족도 || program.근로자 || program.취창업) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  추가 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {program.HRD_만족도 && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">HRD 만족도</span>
                      <p className="text-xl font-bold text-yellow-600">{program.HRD_만족도}/5.0</p>
                    </div>
                  )}
                  {program.근로자 && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">근로자</span>
                      <p className="text-xl font-bold">{formatNumber(program.근로자)}명</p>
                    </div>
                  )}
                  {program.취창업 && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <span className="text-sm text-muted-foreground">취창업</span>
                      <p className="text-xl font-bold">{formatNumber(program.취창업)}명</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}