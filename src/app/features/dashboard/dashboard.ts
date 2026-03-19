import { Component, OnInit } from '@angular/core';
import { DashboardService, KpiItem, TableRow } from './dashboard-service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  kpiList: KpiItem[] = [];

  lineData: any;
  barData: any;
  pieData: any;

  selectedRange: 'week' | 'month' | 'year' = 'month';

  allRows: TableRow[] = [];
  visibleRows: TableRow[] = [];

  searchValue: string = '';

  currentPage = 1;
  pageSize = 10;

  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  constructor(private dashService: DashboardService) { }
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dashService.getTableData().subscribe(data => {
      this.allRows = data;
      this.visibleRows = [...data];
    });

    this.dashService.getKpis(this.selectedRange).subscribe(res => {
      this.kpiList = res;
    });

    this.dashService.getMonthlyLineData().subscribe(res => {
      this.lineData = {
        labels: res.labels,
        datasets: [{ data: res.data, label: 'Users Trend' }]
      };
    });

    this.dashService.getWeeklyBarData().subscribe(res => {
      this.barData = {
        labels: res.labels,
        datasets: [{ data: res.data, label: 'Weekly Activity' }]
      };
    });

    this.dashService.getDevicePieData().subscribe(res => {
      this.pieData = {
        labels: res.labels,
        datasets: [{ data: res.data }]
      };
    });
  }

  onRangeChange(evt: any) {
    const newRange = evt?.target?.value;
    console.log('range changed ->', newRange);
    this.selectedRange = newRange;
    this.getData();
  }

  onSearch(input: string) {
    this.searchValue = (input || '').toLowerCase();
    this.visibleRows = this.allRows.filter(row => {
      return (
        row.name.toLowerCase().includes(this.searchValue) ||
        row.category.toLowerCase().includes(this.searchValue) ||
        row.status.toLowerCase().includes(this.searchValue)
      );
    });
    this.currentPage = 1;
  }

  sort(field: string) {
    if (this.sortKey === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = field;
      this.sortOrder = 'asc';
    }
    this.visibleRows.sort((a, b) => {
      let val1 = (a as any)[field];
      let val2 = (b as any)[field];

      if (val1 == null) val1 = '';
      if (val2 == null) val2 = '';

      if (val1 < val2) return this.sortOrder === 'asc' ? -1 : 1;
      if (val1 > val2) return this.sortOrder === 'asc' ? 1 : -1;

      return 0;
    });

  }

  get paginatedRows() {
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    return this.visibleRows.slice(startIdx, endIdx);
  }

  totalPages() {
    const total = this.visibleRows.length;
    return Math.ceil(total / this.pageSize);
  }

  exportCSV() {
    const headerRow = ['Name', 'Date', 'Category', 'Amount', 'Status'];
    const dataRows = this.visibleRows.map(row => {
      return [
        row.name,
        row.date.toISOString(),
        row.category,
        row.amount,
        row.status
      ];
    });
    let csv = headerRow.join(',') + '\n';
    dataRows.forEach(r => {
      csv += r.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'analytics-data.csv';
    a.click();
  }
}
