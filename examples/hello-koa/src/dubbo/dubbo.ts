/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Dubbo, setting, zk} from 'apache-dubbo-js';
import * as service from './service';

/**
 * setting dubbo invoke params, such version, group etc.
 */
const dubboSetting = setting
  .match(
    [
      'org.apache.dubbo.demo.DemoProvider',
      'org.apache.dubbo.demo.ErrorProvider',
    ],
    {
      version: '1.0.0',
    },
  )
  .match('org.apache.dubbo.demo.BasicTypeProvider', {version: '2.0.0'});

/**
 * create dubbo instance, it create proxyService
 */
const dubbo = new Dubbo<typeof service>({
  application: {name: 'dubbo-node-consumer'},
  service,
  dubboSetting,
  register: zk({
    url: 'localhost:2181,localhost:2182,localhost:2183',
  }),
});

/**
 * apache-dubbo-js middleware Extension mechanism the same as koa middleware
 */
dubbo.use(async (ctx, next) => {
  await next();
  console.log('-providerAttachments-->', ctx.providerAttachments);
});

/**
 * subscribe apache-dubbo-js inner message
 */
dubbo.subscribe({
  onTrace(msg) {
    console.log(msg);
  },
});

export default dubbo;
