import {Component, OnInit, ViewChild} from "@angular/core";
import {MatTableDataSource} from "@angular/material/table";
import {ApiService} from "../services/api.service"
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: "app-covid",
  templateUrl: "./covid.component.html",
  styleUrls: ["./covid.component.css"]
})
export class CovidComponent implements OnInit {

  selectedDashboard: string;
  selectedCategory: string;
  selectedTimeline: string;
  selectedRegion: string;
  selectedState: string;
  selectedCounty: string;
  selectedDataType: string;

  stateInfoDict: any;

  dashboardOptions: Array<string> = ["COVID-19 Statistics", "Politics of COVID"];
  timelineOptions: Array<string> = ["Days Since First Case", "Date"]
  categoryOptions: Array<string> = ["Cases", "Deaths"];
  datatypeOptions: Array<string> = ["Total", "New"]
  regionOptions: Array<string>;
  stateOptions: Array<string>;
  countyOptions: Array<string>;

  newLabel: string;
  averageLabel: string;
  totalLabel: string;
  newInCategory: number;
  averageInCategory: number;
  totalInCategory: number;

  covidData: MatTableDataSource<any>;
  uri: string = "covid-since-first";

  chartType: string = "line";
  chartOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {},
        scaleLabel: {
          display: true
        }
        }],
      yAxes: []
    }
  }
  chartTitle: string;
  chartLabels: Array<any>;
  chartColors: Array<any>;
  chartData: Array<any>;

  loading: boolean = false;
  dataSuccess: boolean = false;
  dataError: boolean = false;
  errorMessage: string;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.selectedDashboard = this.dashboardOptions[0]

    this.covidData = new MatTableDataSource;
    this.getStateInfoDict().then();
  }

  async getStateInfoDict(): Promise<void> {
    this.apiService.getData("state-info").subscribe(
      data => {
        this.stateInfoDict = data;
      },
        error => {},
      () => {
        this.regionOptions = ["All"].concat(Object.keys(this.stateInfoDict));
        this.covidSetup();
      }
    )
  }

  async covidSetup(): Promise<void> {
    this.stateOptions = ["Choose region to select state"]
    this.countyOptions = ["Choose state to select county"]
    this.selectedCategory = this.categoryOptions[0]
    this.selectedRegion = this.regionOptions[0]
    this.selectedState = this.stateOptions[0]
    this.selectedCounty = this.countyOptions[0]
    this.getCovidData().then();
  }

  async politicalSetup(): Promise<void> {
    this.selectedTimeline = this.timelineOptions[0]
    this.selectedCategory = this.categoryOptions[0]
    this.selectedDataType = this.datatypeOptions[0]
    this.selectedRegion = this.regionOptions[0]
    this.getPoliticalData().then()
  }

  async dashboardChange(i: number): Promise<void> {
    this.selectedDashboard = this.dashboardOptions[i]
    if (i == 0) {
      this.covidSetup().then();
    } else {
      this.politicalSetup().then();
    }
  }

  async selectedCategoryChange(value: string): Promise<void> {
    this.selectedCategory = value;
  }

  async selectedTimelineChange(value: string): Promise<void> {
    if (value == "Date") {
      this.selectedTimeline = this.timelineOptions[1];
      this.uri = "covid-since-date";
    } else {
      this.selectedTimeline = this.timelineOptions[0];
      this.uri = "covid-since-first";
    }
  }

  async selectedRegionChange(value: string): Promise<void> {
    if (value == "All") {
      this.stateOptions = ["Choose region to select state"];
      this.selectedState = this.stateOptions[0];
    } else {
      this.stateOptions = ["All"].concat(Object.keys(this.stateInfoDict[value]));
      this.selectedState = this.stateOptions[0];
    }
    this.selectedStateChange("All").then();
  }

  async selectedStateChange(value: string): Promise<void> {
    if (value == "All") {
      this.countyOptions = ["Choose state to select county"];
      this.selectedCounty = this.countyOptions[0];
    } else {
      this.countyOptions = ["All"].concat(this.stateInfoDict[this.selectedRegion][value]);
      this.selectedCounty = this.countyOptions[0];
    }
  }

  async selectedDataTypeChange(value: string): Promise<void> {
    this.selectedDataType = value;
  }

  async getData(): Promise<void> {
    if (this.selectedDashboard == this.dashboardOptions[0]) {
      this.getCovidData().then();
    } else {
      this.getPoliticalData().then();
    }
  }

  async getCovidData(): Promise<void> {
    this.loading = true;
    this.dataSuccess = false;
    this.dataError = false;
    this.newLabel = "New " + this.selectedCategory
    this.averageLabel = "6-Day Rolling Average New " + this.selectedCategory
    this.totalLabel = "Total " + this.selectedCategory
    let requestBody = {
      "category": this.selectedCategory,
      "region": this.selectedRegion,
      "state": this.selectedState,
      "county": this.selectedCounty
    }
    this.apiService.postData("covid-all", requestBody).subscribe(
      data => {
        this.covidData.data = data
        let last_index = data["New " + this.selectedCategory].length - 1
        this.newInCategory = data[this.newLabel][last_index]
        this.averageInCategory = data[this.averageLabel][last_index]
        this.totalInCategory = data[this.totalLabel][last_index]
      },
      error => {
        this.errorMessage = this.httpError(error)
        this.loading = false;
        this.dataError = true;
      },
      () => {
        this.loading = false;
        this.dataSuccess = true;
        this.getCovidChart().then();
      }
    )
  }

  async getPoliticalData(): Promise<void> {
    this.loading = true;
    this.dataSuccess = false;
    this.dataError = false;
    let requestBody = {
      "category": this.selectedCategory,
      "region": this.selectedRegion
    }
    this.apiService.postData(this.uri, requestBody).subscribe(
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
        this.getPoliticalChart().then();
      }
    )
  }

  async getCovidChart(): Promise<void> {
    this.chartOptions.scales.xAxes[0].scaleLabel.labelString = "Date"
    this.chartOptions.scales.yAxes = [{
      id: "left",
      type: "linear",
      position: "left",
      ticks: {
        beginAtZero: true,
        callback: function(label) {
          return label.toLocaleString();
        }
      },
      scaleLabel: {
        display: true,
        labelString: "Total " + this.selectedCategory
      }
    },
    {
      id: "right",
      type: "linear",
      position: "right",
      ticks: {
        beginAtZero: true,
        callback: function(label) {
          return label.toLocaleString();
        }
      },
      scaleLabel: {
        display: true,
        labelString: "6-Day Rolling Average New " + this.selectedCategory
      }
    }]
    if (this.selectedRegion != "All") {
      if (this.selectedState != "All") {
        if (this.selectedCounty != "All") {
          this.chartTitle = "COVID-19 " + this.selectedCategory + " in " + this.selectedCounty + ", " + this.selectedState;
        } else {
          this.chartTitle = "COVID-19 " + this.selectedCategory + " in " + this.selectedState;
        }
      } else {
        this.chartTitle = "COVID-19 " + this.selectedCategory + " in the " + this.selectedRegion;
      }
    } else {
      this.chartTitle = "COVID-19 " + this.selectedCategory + " in the U.S.";
    }

    this.chartLabels = this.covidData.data["Date"];
    const ctgry = this.selectedCategory;
    this.chartData = [
      {
        data: this.covidData.data["Total " + ctgry],
        label: "Total " + ctgry, yAxisID: "left"
      },
      {
        data: this.covidData.data["6-Day Rolling Average New " + ctgry],
        label: "6-Day Rolling Average New " + ctgry, yAxisID: "right"
      },
    ]
    this.chartColors = [
      {
        borderColor: "rgba(102, 255, 102, 1)",
        borderWidth: 2,
      },
      {
        borderColor: "rgba(102, 102, 255, 1)",
        borderWidth: 2,
      }
    ];
  }


  async getPoliticalChart(): Promise<void> {
    let filters = ["Clinton won", "Trump won"];
    this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.selectedTimeline;
    this.chartOptions.scales.yAxes = [{
      id: "left",
      type: "linear",
      position: "left",
      ticks: {
        beginAtZero: true,
        callback: function(label) {
          return label.toLocaleString();
        }
      },
      scaleLabel: {
        display: true,
        labelString: this.selectedDataType + this.selectedCategory
      }
    }]
    if (this.selectedRegion != "All") {
      this.chartTitle = this.selectedDataType + " " + this.selectedCategory + " in the " + this.selectedRegion;
    } else {
      this.chartTitle = this.selectedDataType + " " + this.selectedCategory + " in the U.S."
    }
    this.chartLabels = this.getPoliticalChartLabels(
      this.covidData.data,
      this.selectedTimeline,
      "State Winner",
      filters[0]
    );
    this.chartData = this.getPoliticalChartData(
      this.covidData.data,
      this.selectedDataType + " " + this.selectedCategory,
      "State Winner",
      filters
    );
    this.chartColors = [
      {
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 2,
      },
      {
        borderColor: "rgba(255, 0, 0, 1)",
        borderWidth: 2,
      },
    ];
  }

  getPoliticalChartLabels(data: any, dataField: string, filterField: string, filter: string): any[] {
    let labels = [];
    data.forEach(row => {
      if (row[filterField] == filter) {
        labels.push(row[dataField]);
      }
    });
    return labels;
  }

  getPoliticalChartData(data: any, dataField: string, filterField: string, filters: string[]): any[] {
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

  async resetOptions(): Promise<void> {
    this.stateOptions = ["Choose region to select state"]
    this.countyOptions = ["Choose state to select county"]
    this.selectedCategory = this.categoryOptions[0]
    this.selectedTimeline = this.timelineOptions[0]
    this.selectedRegion = this.regionOptions[0]
    this.selectedState = this.stateOptions[0]
    this.selectedCounty = this.countyOptions[0]
  }

  httpError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    } else {
      return error.message;
    }
  }

}
