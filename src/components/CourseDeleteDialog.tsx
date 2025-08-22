import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { KDTProgram } from '@/types/kdt';

interface CourseDeleteDialogProps {
  program: KDTProgram;
  onDelete: (programKey: string) => void;
  children: React.ReactNode;
}

export function CourseDeleteDialog({ program, onDelete, children }: CourseDeleteDialogProps) {
  const handleDelete = () => {
    const programKey = `${program.과정코드}_${program.회차}`;
    onDelete(programKey);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>과정을 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>다음 과정이 영구적으로 삭제됩니다:</p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{program.과정구분}</p>
              <p className="text-sm text-muted-foreground">
                {program.과정코드} · {program.회차}회차
              </p>
            </div>
            <p className="text-sm text-destructive">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}