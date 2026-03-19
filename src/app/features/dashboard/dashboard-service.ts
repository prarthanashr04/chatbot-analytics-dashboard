import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface KpiItem {
  title: string;
  value: number;
  change: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface TableRow {
  name: string;
  date: Date;
  category: string;
  amount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  getKpis(range: 'week' | 'month' | 'year'): Observable<KpiItem[]> {
    let base = 100;
    if (range === 'week') base = 50;
    if (range === 'year') base = 500;
    const data: KpiItem[] = [
      { title: 'Users', value: base * 10, change: this.randomChange() },
      { title: 'Revenue', value: base * 20, change: this.randomChange() },
      { title: 'Conversion', value: base * 5, change: this.randomChange() }
    ];
    return of(data);
  }

  getMonthlyLineData(): Observable<ChartData> {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = labels.map(() => this.randomNumber(50, 200));
    return of({ labels, data });
  }

  getWeeklyBarData(): Observable<ChartData> {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: number[] = [];
    for (let i = 0; i < labels.length; i++) {
      data.push(this.randomNumber(10, 100));
    }
    return of({ labels, data });

  }

  getDevicePieData(): Observable<ChartData> {
    const labels = ['Mobile', 'Desktop', 'Tablet'];
    const data = [
      this.randomNumber(20, 60),
      this.randomNumber(20, 60),
      this.randomNumber(5, 30)
    ];
    return of({ labels, data });
  }

  getTableData(): Observable<TableRow[]> {
    const categories = ['Sales', 'Marketing', 'Tech'];
    const statuses = ['Completed', 'Pending', 'Failed'];
    const rows: TableRow[] = [];
    for (let i = 1; i <= 35; i++) {
      const d = new Date();
      d.setDate(d.getDate() - this.randomNumber(0, 60));
      rows.push({
        name: 'User ' + i,
        date: d,
        category: categories[this.randomNumber(0, categories.length - 1)],
        amount: this.randomNumber(100, 5000),
        status: statuses[this.randomNumber(0, statuses.length - 1)]
      });
    }
    return of(rows);
  }

  private randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomChange(): number {
    return this.randomNumber(-10, 10);
  }
}