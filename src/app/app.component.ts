import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface WeatherInfo {
  coord: Coord
  currentTime?: any;
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string;
  url?: string;
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level: number
  grnd_level: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  weatherInfo!: WeatherInfo;

  constructor(private _http: HttpClient) {this.getLocation();}

  ngOnInit(): void {
    
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        if (position) {
          this.getOpenWeatherInfo(position.coords.latitude, position.coords.longitude).pipe(map((item: WeatherInfo)=> {
           item.weather[0].url =  `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
           item.currentTime = new Date(item.dt * 1000);
           return item;
          })).subscribe((resp: WeatherInfo) => {
            this.weatherInfo = resp;
            
          })
        }
      },(error: GeolocationPositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getOpenWeatherInfo(lat: number, lon: number): Observable<WeatherInfo> {
    return this._http.get<WeatherInfo>(`${environment.API_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.API_KEY}`)
  }

 
}
