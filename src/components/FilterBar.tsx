import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { FilterState } from '@/types/kdt';
import { kdtPrograms } from '@/data/kdtData';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  // 고유 값 추출
  const uniqueYears = [...new Set(kdtPrograms.map(p => p.년도))].sort((a, b) => b - a);
  const uniqueQuarters = [...new Set(kdtPrograms.map(p => p.분기))];
  const uniqueCategories = [...new Set(kdtPrograms.map(p => p.과정구분))].sort();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters };
    
    if (value === 'all') {
      delete newFilters[key];
    } else {
      if (key === '년도') {
        newFilters[key] = parseInt(value);
      } else {
        newFilters[key] = value as any;
      }
    }
    
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-card-foreground whitespace-nowrap">
            년도:
          </label>
          <Select
            value={filters.년도?.toString() || 'all'}
            onValueChange={(value) => handleFilterChange('년도', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-card-foreground whitespace-nowrap">
            분기:
          </label>
          <Select
            value={filters.분기 || 'all'}
            onValueChange={(value) => handleFilterChange('분기', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {uniqueQuarters.map(quarter => (
                <SelectItem key={quarter} value={quarter}>
                  {quarter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-card-foreground whitespace-nowrap">
            과정구분:
          </label>
          <Select
            value={filters.과정구분 || 'all'}
            onValueChange={(value) => handleFilterChange('과정구분', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-card-foreground whitespace-nowrap">
            진행상태:
          </label>
          <Select
            value={filters.진행상태 || 'all'}
            onValueChange={(value) => handleFilterChange('진행상태', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="진행중">진행중</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}