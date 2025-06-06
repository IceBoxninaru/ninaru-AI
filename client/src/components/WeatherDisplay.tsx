import React from 'react';
import { WeatherKind } from '../../../shared/types/game.js';
import './WeatherDisplay.css';

interface WeatherDisplayProps {
  weather: WeatherKind;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const getWeatherIcon = (weather: WeatherKind) => {
    switch (weather) {
      case 'SUNNY':
        return '☀️';
      case 'RAINY':
        return '🌧️';
      case 'CLOUDY':
        return '☁️';
      case 'STORMY':
        return '⛈️';
      case 'WINDY':
        return '🌪️';
      default:
        return '❓';
    }
  };

  const getWeatherName = (weather: WeatherKind) => {
    switch (weather) {
      case 'SUNNY':
        return '晴れ';
      case 'RAINY':
        return '雨';
      case 'CLOUDY':
        return '曇り';
      case 'STORMY':
        return '嵐';
      case 'WINDY':
        return '強風';
      default:
        return '不明';
    }
  };

  return (
    <div className="weather-display">
      <span className="weather-icon">{getWeatherIcon(weather)}</span>
      <span className="weather-name">{getWeatherName(weather)}</span>
    </div>
  );
};

export default WeatherDisplay; 