import { Component } from '@angular/core';
import { Forecast } from './classes/forecast';
import { Temperature } from './classes/temperature';
import { ForecastNormal } from './classes/forecast-normal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  private forecastData: Array<Forecast>;
  public weeklyForecast: Array<ForecastNormal>;

  constructor() {
    this.forecastData = new Array<Forecast>();
    this.weeklyForecast = new Array<ForecastNormal>();
  }
  
  ngOnInit() {
    fetch('http://dataservice.accuweather.com/forecasts/v1/daily/5day/24892_PC?apikey=mosvmfydnSgShdqUzGcOSIVk34p2NGUB')
      .then(resp => resp.json())
      .then(data => {
        this.forecastData = [...data.DailyForecasts];
        
        this.forecastData.forEach((forecast: Forecast) => {
          let forecastNormal: ForecastNormal = new ForecastNormal();
          forecastNormal.WeekDay = (new Date(forecast.EpochDate * 1000)).toLocaleDateString();
          console.log(forecastNormal.WeekDay);

          let max: number = forecast.Temperature.Maximum.Value > 86 ? 86 : forecast.Temperature.Maximum.Value;
          let min: number = forecast.Temperature.Minimum.Value < 50 ? 50 : forecast.Temperature.Minimum.Value;

          let growingDegreeUnits = (max + min)/ 2 - 50;

          forecastNormal.GrowingUnits = growingDegreeUnits > 0 ? growingDegreeUnits : 0;
          console.log(forecastNormal.GrowingUnits);

          this.weeklyForecast.push(forecastNormal);
        });
      });
  }
}
