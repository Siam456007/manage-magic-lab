
import { Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  clearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  tagFilter,
  setTagFilter,
  dateRange,
  setDateRange,
  clearFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tasks..."
          className="pl-8 w-full md:w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Filters dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
            <DropdownMenuRadioItem value="all">All Statuses</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="todo">To-Do</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={tagFilter} onValueChange={setTagFilter}>
            <DropdownMenuRadioItem value="all">All Tags</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="designing">Designing</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="meeting">Meeting</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="research">Research</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="development">Development</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="planning">Planning</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={clearFilters}>Clear Filters</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Date range filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Date Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange as any}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterBar;
