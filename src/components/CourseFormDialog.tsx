import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { KDTProgram } from "@/types/kdt";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  과정구분: z.string().min(1, "필수 항목입니다"),
  과정코드: z.string().min(1, "필수 항목입니다"),
  회차: z.coerce.number().int().min(1, "1 이상이어야 합니다"),
  교육시간: z.coerce.number().int().min(1, "1 이상이어야 합니다"),
  개강: z.date({ required_error: "개강일을 선택하세요" }),
  종강: z.date().nullable().optional(),
  년도: z.coerce.number().int().min(2000),
  분기: z.enum(["1Q", "2Q", "3Q", "4Q"]),
  정원: z.coerce.number().int().min(1),
  // 선택 지표
  HRD_만족도: z.coerce.number().min(0).max(5).nullable().optional(),
  전체_지원: z.coerce.number().nullable().optional(),
  지원완료: z.coerce.number().nullable().optional(),
  HRD_전환률: z.coerce.number().min(0).max(100).nullable().optional(),
  HRD_확정: z.coerce.number().nullable().optional(),
  이탈: z.coerce.number().nullable().optional(),
  수료: z.coerce.number().nullable().optional(),
  근로자: z.coerce.number().nullable().optional(),
  산정_제외: z.coerce.number().nullable().optional(),
  제외_수료율: z.coerce.number().min(0).max(100).nullable().optional(),
  취창업: z.coerce.number().nullable().optional(),
  취업률: z.coerce.number().min(0).max(200).nullable().optional(),
  제외_취업률: z.coerce.number().min(0).max(200).nullable().optional(),
  최소_매출: z.coerce.number().nullable().optional(),
});

export type NewProgramInput = z.infer<typeof schema>;

interface CourseFormDialogProps {
  onCreate: (input: NewProgramInput) => void;
}

export default function CourseFormDialog({ onCreate }: CourseFormDialogProps) {
  const { toast } = useToast();
  const form = useForm<NewProgramInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      과정구분: "",
      과정코드: "",
      회차: 1,
      교육시간: 920,
      개강: undefined as unknown as Date,
      종강: null,
      년도: new Date().getFullYear(),
      분기: ((): "1Q" | "2Q" | "3Q" | "4Q" => {
        const q = Math.floor((new Date().getMonth()) / 3) + 1; return (q + "Q") as any;
      })(),
      정원: 60,
      HRD_만족도: null,
      전체_지원: null,
      지원완료: null,
      HRD_전환률: null,
      HRD_확정: null,
      이탈: null,
      수료: null,
      근로자: null,
      산정_제외: null,
      제외_수료율: null,
      취창업: null,
      취업률: null,
      제외_취업률: null,
      최소_매출: null,
    },
  });

  const onSubmit = (values: NewProgramInput) => {
    onCreate(values);
    toast({ title: "과정이 등록되었습니다", description: `${values.과정구분} (${values.과정코드})` });
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">과정 등록</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 과정 등록</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="과정구분"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>과정구분</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 프론트(웹)" {...field} />
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
                    <FormLabel>과정코드</FormLabel>
                    <FormControl>
                      <Input placeholder="예: KDT_B_FE_9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="회차"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회차</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
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
                    <FormLabel>교육시간</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="년도"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>년도</FormLabel>
                    <FormControl>
                      <Input type="number" min={2000} {...field} />
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
                    <FormLabel>분기</FormLabel>
                    <FormControl>
                      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                        {(["1Q","2Q","3Q","4Q"] as const).map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="개강"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>개강</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => d && field.onChange(d)}
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
                    <FormLabel>종강 (선택)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            type="button"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={(d) => field.onChange(d ?? null)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>미정인 경우 비워두세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="정원"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정원</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <details className="rounded-md border border-border p-4">
              <summary className="cursor-pointer text-sm font-medium">추가 지표 입력 (선택)</summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {([
                  { name: "HRD_만족도", placeholder: "예: 4.3 (0~5)" },
                  { name: "전체_지원", placeholder: "예: 300" },
                  { name: "지원완료", placeholder: "예: 80" },
                  { name: "HRD_전환률", placeholder: "예: 55 (단위 %)" },
                  { name: "HRD_확정", placeholder: "예: 40" },
                  { name: "이탈", placeholder: "예: 5" },
                  { name: "수료", placeholder: "예: 35" },
                  { name: "근로자", placeholder: "예: 2" },
                  { name: "산정_제외", placeholder: "예: 1" },
                  { name: "제외_수료율", placeholder: "예: 90 (단위 %)" },
                  { name: "취창업", placeholder: "예: 10" },
                  { name: "취업률", placeholder: "예: 45 (단위 %)" },
                  { name: "제외_취업률", placeholder: "예: 50 (단위 %)" },
                  { name: "최소_매출", placeholder: "예: 500000000" },
                ] as const).map((f) => (
                  <FormField
                    key={f.name}
                    control={form.control}
                    // @ts-expect-error - dynamic name keys
                    name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.name}</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder={f.placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </details>

            <div className="flex justify-end gap-2">
              <Button type="submit">등록</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
