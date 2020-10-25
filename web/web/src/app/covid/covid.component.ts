import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from '../services/api.service'
import {HttpErrorResponse} from "@angular/common/http";
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css']
})
export class CovidComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  selectedDashboard: string;
  selectedCategory: string;
  selectedRegion: string;
  selectedState: string;
  selectedCounty: string

  dashboardOptions: Array<string> = ["COVID-19 Statistics", "Politics of COVID"]
  categoryOptions: Array<string> = ["Cases", "Deaths"]
  regionOptions: Array<string> = ["All", "Midwest", "Northeast", "West", "South"]
  stateOptions: Array<string> = [""]
  countyOptions: Array<string> = [""]

  covidData: MatTableDataSource<any>;
  uriList: string[] = ['covid-since-first', 'cases', 'all']

  chartType: string = 'line';
  chartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
          ticks: {
          },
        scaleLabel: {
          display: true
        }
        }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(label) {
            return label.toLocaleString();
          }
        },
        scaleLabel: {
          display: true
        }
      }]
    }
  }
  chartLabels: Array<any>;
  chartColors: Array<any>;
  chartData: Array<any>;

  loading: boolean = false;
  dataSuccess: boolean = false;
  dataError: boolean = false;
  errorMessage: string;

  selectedIndex: number = 0;
  selectedxAxisChip: string;
  selectedyAxisChip: string;
  selectedRegionChip: string;

  categories = [
    'Cases',
    'Deaths'
  ]

  xAxisChips = [
    {name: 'Days Since First Case'},
    {name: 'Date'},
  ]

  yAxisChips = [
    {name: 'Total ' + this.categories[this.selectedIndex]},
    {name: 'New ' + this.categories[this.selectedIndex]}
  ]

  regionChips = [
    {name: 'All'},
    {name: 'Midwest'},
    {name: 'Northeast'},
    {name: 'South'},
    {name: 'West'},
  ]

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.selectedDashboard = this.dashboardOptions[0]
    this.selectedCategory = this.categoryOptions[0]
    this.selectedRegion = this.regionOptions[0]
    this.selectedState = this.stateOptions[0]
    this.selectedCounty = this.countyOptions[0]

    this.selectedxAxisChip = this.xAxisChips[0].name
    this.selectedyAxisChip = this.yAxisChips[0].name
    this.selectedRegionChip = this.regionChips[0].name
    this.covidData = new MatTableDataSource;
    this.getData().then()
  }

  async getData(): Promise<void> {
    this.loading = true;
    this.dataSuccess = false;
    this.dataError = false;
    let uri = '/' + this.uriList.join('/');
    this.apiService.getData(uri).subscribe(
      data => {
        this.covidData.data = data;
      },
      error => {
        this.errorMessage = this.httpError(error)
        this.loading = false;
        this.dataError = true;
      },
      () => {
        this.loading = false;
        this.dataSuccess = true;
        this.getChart().then();
      }
    )
  }

  async getChart(): Promise<void> {
    let filters = ['Clinton won', 'Trump won'];
    this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.selectedxAxisChip
    this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.selectedyAxisChip
    this.chartLabels = this.getChartLabels(
      this.covidData.data,
      this.selectedxAxisChip,
      'State Winner',
      filters[0]
    );
    this.chartData = this.getChartData(
      this.covidData.data,
      this.selectedyAxisChip,
      'State Winner',
      filters
    );
    this.chartColors = [
      {
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 2,
      },
      {
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 2,
      },
    ];
  }

  getChartLabels(data: any, dataField: string, filterField: string, filter: string): any[] {
    let labels = [];
    data.forEach(row => {
      if (row[filterField] == filter) {
        labels.push(row[dataField]);
      }
    });
    return labels;
  }

  getChartData(data: any, dataField: string, filterField: string, filters: string[]): any[] {
    let datasets = [];
    let tempData = [];
    filters.forEach(filter => {
      tempData = [];
      data.forEach(row => {
        if (row[filterField] == filter) {
          tempData.push(row[dataField]);
        }
      });
      datasets.push({data: tempData, label: filter});
    });
    return datasets;
  }

  async categoryTabChange(index: number): Promise<void> {
    this.selectedIndex = index;
    this.xAxisChips = [
      {name: 'Days Since First Case'},
      {name: 'Date'},
    ]
    this.yAxisChips = [
      {name: 'Total ' + this.categories[this.selectedIndex]},
      {name: 'New ' + this.categories[this.selectedIndex]}
    ]
    this.selectedxAxisChip = this.xAxisChips[0].name;
    this.selectedyAxisChip = this.yAxisChips[0].name;
    this.selectedRegionChip = this.regionChips[0].name;
    this.uriList[0] = 'covid-since-first';
    this.uriList[1] = this.categories[this.selectedIndex].toLowerCase();
    this.getData().then();
  }

  async xAxisChipChange(chip): Promise<void> {
    this.selectedxAxisChip = chip.name;
    if (chip.name == 'Date') {
      this.uriList[0] = 'covid-since-date';
    } else {
      this.uriList[0] = 'covid-since-first';
    }
    this.getData().then();
  }

  async yAxisChipChange(chip): Promise<void> {
    this.selectedyAxisChip = chip.name;
    this.getChart().then();
  }

  async regionChipChange(chip): Promise<void> {
    this.selectedRegionChip = chip.name;
    this.uriList[2] = this.selectedRegionChip.toLowerCase();
    this.getData().then();
  }

  httpError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    } else {
      return error.message;
    }
  }

}
