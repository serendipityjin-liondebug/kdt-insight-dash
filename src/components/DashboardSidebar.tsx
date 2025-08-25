import React from 'react';
import { 
  BarChart3, 
  GraduationCap, 
  TrendingUp, 
  Award, 
  FolderOpen, 
  Settings,
  User,
  LogOut
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  { id: 'overview', label: '대시보드', icon: BarChart3 },
  { id: 'education', label: '교육과정 관리', icon: GraduationCap },
  { id: 'business', label: '사업 분석', icon: TrendingUp },
  { id: 'performance', label: '성과 분석', icon: Award },
  { id: 'courses', label: '과정 관리', icon: FolderOpen },
  { id: 'settings', label: '설정', icon: Settings },
];

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border shadow-2xl">
      {/* Header - Branding Section */}
      <SidebarHeader className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sidebar-primary to-purple-500 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-sidebar-foreground tracking-tight">KDT LAB</h2>
            <p className="text-sm text-sidebar-foreground/60 font-medium">Analytics Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      {/* Navigation Menu */}
      <SidebarContent className="p-4 flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`
                      w-full justify-start gap-4 px-4 py-4 rounded-2xl transition-all duration-300
                      relative overflow-hidden group
                      ${activeTab === item.id 
                        ? 'bg-gradient-to-r from-sidebar-primary to-purple-500 text-white shadow-lg scale-[1.02]' 
                        : 'hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground hover:scale-[1.01]'
                      }
                    `}
                  >
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${
                      activeTab === item.id ? 'scale-110' : 'group-hover:scale-105'
                    }`} />
                    <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - User Profile Section */}
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="bg-sidebar-accent rounded-2xl p-4 transition-all duration-300 hover:bg-sidebar-accent/80">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10 ring-2 ring-sidebar-primary/20">
              <AvatarImage src="" alt="사용자" />
              <AvatarFallback className="bg-gradient-to-br from-sidebar-primary to-purple-500 text-white font-bold">
                관리자
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold text-sidebar-foreground">관리자</p>
              <p className="text-xs text-sidebar-foreground/60">Administrator</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sidebar-border/50 hover:bg-sidebar-border transition-colors text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <User className="w-3 h-3" />
              프로필
            </button>
            <button className="flex items-center justify-center px-3 py-2 rounded-xl bg-sidebar-border/50 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sidebar-foreground/70">
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}