import pino from 'pino'
import type { Options as OtelOptions } from 'pino-opentelemetry-transport'

import config, { isDev, isTest } from './config.mjs'

const transport = pino.transport({
  targets: [
    {
      target: 'pino-opentelemetry-transport',
      options: {
        loggerName: config.OTEL_SERVICE_NAME,
        serviceVersion: config.OTEL_SERVICE_VERSION,
        logRecordProcessorOptions: [{ recordProcessorType: 'batch' }],
      },
    } as pino.TransportTargetOptions<OtelOptions>,
    {
      target: isDev ? 'pino-pretty' : 'pino/file',
    },
  ],
})

export default pino({ base: undefined, enabled: !isTest }, transport)
