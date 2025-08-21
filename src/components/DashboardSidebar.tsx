import React from 'react';
import { 
  BarChart3, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  FolderOpen, 
  Users, 
  FileText, 
  Settings 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';

const menuItems = [
  { id: 'overview', label: '주요 지표', icon: BarChart3 },
  { id: 'education', label: '교육운영현황', icon: GraduationCap },
  { id: 'business', label: '사업운영현황', icon: TrendingUp },
  { id: 'performance', label: '성과 분석', icon: Award },
  { id: 'courses', label: '과정 관리', icon: FolderOpen },
  { id: 'students', label: '수강생 관리', icon: Users },
  { id: 'reports', label: '리포트', icon: FileText },
  { id: 'settings', label: '설정', icon: Settings },
];

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">KDT 인사이트</h2>
            <p className="text-sm text-muted-foreground">운영 대시보드</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`
                      w-full justify-start gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${activeTab === item.id 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-muted text-muted-foreground hover:text-card-foreground'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}