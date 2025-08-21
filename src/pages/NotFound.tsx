import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-bg p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-danger/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-card-foreground">404</h1>
            <h2 className="text-xl font-semibold mb-2 text-card-foreground">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-6">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>
          
          <Button asChild className="gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              대시보드로 돌아가기
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
