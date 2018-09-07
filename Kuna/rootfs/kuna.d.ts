import { Request } from 'express';

export interface TokenRequest {
  token: string;
}

export interface Result {
  id: string;
  serial_number: string;
}

export interface ResultsRequest {
  results: Result[];
}

export interface CamerasRequest {
  id: string;
  serial_number: string;
  status: number;
  name: string;
  timezone: string;
  bulb_on: string;
  alarm_on: string;
  led_mask: string;
  sensitivity: string;
  volume: string;
  notifications_enabled: string;
  motion_timeout: string;
  recording_active: string;
  brightness: string
}

export interface ImageRequest {
  image: string;
}