/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {bindReporter} from './lib/bindReporter.js';
import {getFirstHiddenTime} from './lib/getFirstHiddenTime.js';
import {initMetric} from './lib/initMetric.js';
import {observe} from './lib/observe.js';
import {ReportHandler} from './types.js';


export const getFCP = (onReport: ReportHandler) => {
  const metric = initMetric('FCP');

  const po = observe('paint', (entry: PerformanceEntry) => {
    if (entry.name === 'first-contentful-paint') {
      // Only report if the page wasn't hidden prior to the first paint.
      if (entry.startTime < getFirstHiddenTime()) {
        metric.value = entry.startTime;
        metric.isFinal = true;
        metric.entries.push(entry);
        report();
      }
    }
  });

  const report = bindReporter(onReport, metric, po);
};
