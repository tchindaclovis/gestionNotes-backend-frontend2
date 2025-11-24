import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <h3 *ngIf="title" class="chart-title">{{ title }}</h3>
      
      <div class="bar-chart">
        <div *ngFor="let item of data" class="bar-item">
          <div class="bar-label">{{ item.label }}</div>
          <div class="bar-container">
            <div class="bar-fill" 
                 [style.width.%]="getPercentage(item.value)"
                 [style.background-color]="item.color || '#3b82f6'">
            </div>
            <span class="bar-value">{{ item.value }}/20</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
      border: 1px solid #e0e7ff;
    }

    .chart-title {
      margin: 0 0 20px 0;
      color: #1e40af;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .bar-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bar-label {
      min-width: 100px;
      font-size: 0.9rem;
      color: #64748b;
    }

    .bar-container {
      flex: 1;
      position: relative;
      height: 24px;
      background: #f1f5f9;
      border-radius: 12px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 12px;
      transition: width 0.8s ease;
      position: relative;
    }

    .bar-value {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.8rem;
      font-weight: 600;
      color: #1e40af;
    }
  `]
})
export class SimpleChartComponent implements OnInit {
  @Input() type: 'bar' | 'pie' | 'line' = 'bar';
  @Input() data: ChartData[] = [];
  @Input() title?: string;

  ngOnInit(): void {}

  getPercentage(value: number): number {
    const max = Math.max(...this.data.map(d => d.value));
    return (value / max) * 100;
  }
}