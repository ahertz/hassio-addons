/**
  * @author Chris
  * @file HASSIO addon to pull status information from Kuna cameras.
*/

import { Result, ResultsRequest, CamerasRequest, TokenRequest } from './kuna';

import * as winston from 'winston';
import * as async from 'async';
import * as jsonfile from 'jsonfile';
import * as path from 'path';
import Axios from 'axios';
import { Response, Request, NextFunction, json } from 'express';
import { v4 } from 'uuid';

const CONFIG_DIR = process.env.CONFIG_DIR || './data',
STATE_FILE = path.join(CONFIG_DIR, 'state.json'),
OPTIONS_FILE = path.join(CONFIG_DIR, 'options.json'),
CURRENT_VERSION: string = jsonfile.readFileSync(path.join('package.json')).version,
baseUrl = 'https://server.kunasystems.com/api/v1',
config = jsonfile.readFileSync(OPTIONS_FILE) as {
  kuna_email: string;
  kuna_password: string;
  refresh_seconds: number;
  api_password: string;
},
state = loadSavedState({
  saved_token: null as string | null,
  results: [] as { id: string, serial_number: string }[],
  cameras: [] as CamerasRequest[],
  history: {},
  token: v4(),
  CURRENT_VERSION
});

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  timestamp: () => {
    const
    date = new Date(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds(),
    hourFormatted = hour % 12 || 12,
    minuteFormatted = minute < 10 ? '0' + minute : minute,
    morning = hour < 12 ? 'am' : 'pm';
    return `${month}/${day} ${hourFormatted}:${minuteFormatted}:${second} ${morning}`;
  }
});

function loadSavedState<T>(defaults: T): T {
  try {
    const savedState = jsonfile.readFileSync(STATE_FILE);
    if (savedState.CURRENT_VERSION !== CURRENT_VERSION) {
      return defaults;
    }
    return savedState;
    } catch (ex) {
    winston.info('No previous state found - setting to defaults.');
    return defaults;
  }
}

async function refreshToken() {
  const headers = {
    headers: {
      Authorization: 'Token '
    }
  };
  const authResponse = await Axios.post<TokenRequest>(`${baseUrl}/account/auth/`, {
    grant_type: 'password',
    email: config.kuna_email,
    password: config.kuna_password
  }, headers);
  winston.info('login = ' + config.kuna_email + ' ' + config.kuna_password);
  if (authResponse.data.token) {
    state.saved_token = 'Token ' + authResponse.data.token;
    } else {
    throw Error('No API token was returned.');
  }
  headers.headers = {
    Authorization: state.saved_token
  };
  const resultsResponse = await Axios.get<ResultsRequest>(`${baseUrl}/user/cameras/`, headers);
  if (Array.isArray(resultsResponse.data.results)) {
    state.results = [];
    resultsResponse.data.results.forEach(cam => {
      state.results.push({
        id: cam.id,
        serial_number: cam.serial_number
      });
      
    });
    } else {
    winston.warn('No Kuna cameras were returned by the request.');
  }
}

function formatInfo(input: CamerasRequest) {
  if (!input) {
    return null;
  }
  return {
    state: input.bulb_on,
    attributes: {
      id: parseInt(input.id, 0),
      serial_number: input.serial_number,
      friendly_name: input.name,
      name: input.name,
      timezone: input.timezone,
      bulb_on: input.bulb_on,
      alarm_on: input.alarm_on,
      led_mask: input.led_mask,
      sensitivity: parseInt(input.sensitivity, 0),
      volume: parseInt(input.volume, 0),
      notifications_enabled: input.notifications_enabled,
      motion_timeout: parseInt(input.motion_timeout, 0),
      recording_active: input.recording_active,
      brightness: parseInt(input.brightness, 0),
    },
  };
  throw Error('Invalid process_type');
}

async function refreshState() {
  
  try {
    state.cameras = await getData();
    const data = state.cameras.map(x => formatInfo(x));
    state.history = data;
    jsonfile.writeFileSync(STATE_FILE, state, {
      spaces: 2
    });
    data.forEach(msg => {
      if (!msg) {
        return;
      }
      winston.info('Update received for sensor ' + msg.attributes.friendly_name + '(' + msg.attributes.serial_number + ')');
      const conf = {
        headers: {
            'x-ha-access': process.env.HASSIO_TOKEN,
            'content-type': 'application/json'
        }
      };
      Axios.post('http://hassio/homeassistant/api/states/sensor.' + msg.attributes.name, msg, conf).catch(err => winston.error(err));
    });
    
    } catch (err) {
    winston.error(err);
  }
}

async function getData() {
  if (!state.saved_token) {
    await refreshToken();
  }
  
  return new Promise<CamerasRequest[]>((accept, reject) => {
    const headers = {
      headers: {
        Authorization: state.saved_token || 'un-auth-request'
      }
    };
    const details: CamerasRequest[] = [];
    async.forEach(state.results, (cam, callback) => {
      Axios.get<CamerasRequest>(`${baseUrl}/cameras/${cam.serial_number}/`, headers)
      .then(camerasResponse => {
        details.push(camerasResponse.data);
        callback();
      })
      .catch(err => {
        if (err.status === 401) {
          state.saved_token = null;
        }
        callback(err);
      });
      }, (err) => {
      if (err) {
        reject(err);
        
        } else {
        accept(details);
        
      }
    });
  });
}

async.series([
  function init(next) {
    refreshToken().then(() => {
      winston.info('Kuna API token refreshed.');
      next();
      
      }).catch(err => {
      winston.error('Error obtaining an updated API token from Kuna.');
      next(err);
      
    });
  },
  function configurePolling(next) {
    const interval = 1;
    if (config.refresh_seconds >= 15) {
      const interval = 1000 * config.refresh_seconds;
    } else {
      const interval = 1000 * 15;
    }
    winston.info(`Polling interval set at ${config.refresh_seconds} seconds`);
    
    setInterval(refreshState, interval);
    refreshState().then(x => {
      state.cameras.forEach((camera, i, arr) => {
        winston.info(`Camera ${i + 1} of ${arr.length}: ${camera.serial_number}`);
      });
      
      state.cameras.forEach((result, i, arr) => {
        const camerasData = formatInfo(result);
        winston.info(`Camera ${i + 1} of ${arr.length}\n ID: ${result.serial_number}; Data: ${JSON.stringify(camerasData, null, 4)} `);
        
      });
    });
    
    process.nextTick(next);
  }
  ], (error) => {
  if (error) {
    return winston.error(<any>error);
  }
});