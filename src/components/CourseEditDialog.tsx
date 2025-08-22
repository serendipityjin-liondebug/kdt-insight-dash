import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KDTProgram } from '@/types/kdt';
import { cn } from '@/lib/utils';

const schema = z.object({
  과정구분: z.string().min(1, '과정구분을 입력해주세요'),
  과정코드: z.string().min(1, '과정코드를 입력해주세요'),
  회차: z.number().min(1, '회차를 입력해주세요'),
  교육시간: z.number().min(1, '교육시간을 입력해주세요'),
  개강: z.date({ required_error: '개강일을 선택해주세요' }),
  종강: z.date().nullable(),
  년도: z.number().min(2020).max(2030),
  분기: z.string().min(1, '분기를 입력해주세요'),
  정원: z.number().min(1, '정원을 입력해주세요'),
  
  // Optional fields
  HRD_만족도: z.number().min(0).max(5).nullable(),
  전체_지원: z.number().min(0).nullable(),
  지원완료: z.number().min(0).nullable(),
  HRD_전환률: z.number().min(0).max(100).nullable(),
  HRD_확정: z.number().min(0).nullable(),
  이탈: z.number().min(0).nullable(),
  수료: z.number().min(0).nullable(),
  근로자: z.number().min(0).nullable(),
  산정_제외: z.number().min(0).nullable(),
  제외_수료율: z.number().min(0).max(100).nullable(),
  취창업: z.number().min(0).nullable(),
  취업률: z.number().min(0).max(100).nullable(),
  제외_취업률: z.number().min(0).max(100).nullable(),
  최소_매출: z.number().min(0).nullable(),
});

export type EditProgramInput = z.infer<typeof schema>;

interface CourseEditDialogProps {
  program: KDTProgram;
  onEdit: (programKey: string, input: EditProgramInput) => void;
  children: React.ReactNode;
}

export function CourseEditDialog({ program, onEdit, children }: CourseEditDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<EditProgramInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      과정구분: program.과정구분,
      과정코드: program.과정코드,
      회차: program.회차,
      교육시간: program.교육시간,
      개강: program.개강 instanceof Date ? program.개강 : new Date(program.개강),
      종강: program.종강 ? (program.종강 instanceof Date ? program.종강 : new Date(program.종강)) : null,
      년도: program.년도,
      분기: program.분기,
      정원: program.정원,
      HRD_만족도: program.HRD_만족도,
      전체_지원: program.전체_지원,
      지원완료: program.지원완료,
      HRD_전환률: program.HRD_전환률,
      HRD_확정: program.HRD_확정,
      이탈: program.이탈,
      수료: program.수료,
      근로자: program.근로자,
      산정_제외: program.산정_제외,
      제외_수료율: program.제외_수료율,
      취창업: program.취창업,
      취업률: program.취업률,
      제외_취업률: program.제외_취업률,
      최소_매출: program.최소_매출,
    },
  });

  const onSubmit = (values: EditProgramInput) => {
    const programKey = `${program.과정코드}_${program.회차}`;
    onEdit(programKey, values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            과정 수정
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="과정구분"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>과정구분 *</FormLabel>
                    <FormControl>
                      <Input placeholder="과정명을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="과정코드"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>과정코드 *</FormLabel>
                    <FormControl>
                      <Input placeholder="과정코드를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="회차"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회차 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="교육시간"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>교육시간 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="640" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="정원"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정원 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="20" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 날짜 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="개강"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>개강일 *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ko })
                            ) : (
                              <span>날짜 선택</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="종강"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>종강일</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ko })
                            ) : (
                              <span>날짜 선택</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="년도"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>년도 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="분기"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>분기 *</FormLabel>
                    <FormControl>
                      <Input placeholder="1분기" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 성과 데이터 */}
            <div className="space-y-4">
              <h4 className="font-medium">성과 지표 (선택사항)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="HRD_만족도"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HRD 만족도</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="5"
                          placeholder="4.5"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="전체_지원"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전체 지원</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="HRD_확정"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HRD 확정</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="20"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="수료"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>수료</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="18"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="취업률"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>취업률 (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="85.5"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="취창업"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>취창업</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="15"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button type="submit">
                수정 완료
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}