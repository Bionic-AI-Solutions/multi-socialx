import {
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';
import { Connection } from '@temporalio/client';

const CONNECT_ATTEMPTS = 60;
const CONNECT_DELAY_MS = 10000;

@Injectable()
export class TemporalRegister implements OnModuleInit {
  constructor(private _client: TemporalService) {}

  async onModuleInit(): Promise<void> {
    if (process.env.TEMPORAL_TLS === 'true') {
      return;
    }
    const connection = this._client?.client?.getRawClient()
      ?.connection as Connection;

    // On a cold start Temporal can take several minutes to accept connections
    // (it waits on its own Elasticsearch). Retry instead of throwing, otherwise
    // the whole backend never gets to app.listen().
    const { customAttributes } = await this.connectWithRetry(() =>
      connection.operatorService.listSearchAttributes({
        namespace: process.env.TEMPORAL_NAMESPACE || 'default',
      })
    );

    const neededAttribute = ['organizationId', 'postId'];
    const missingAttributes = neededAttribute.filter(
      (attr) => !customAttributes[attr]
    );

    if (missingAttributes.length > 0) {
      await connection.operatorService.addSearchAttributes({
        namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        searchAttributes: missingAttributes.reduce((all, current) => {
          // @ts-ignore
          all[current] = 1;
          return all;
        }, {}),
      });
    }
  }

  private async connectWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 1; ; attempt++) {
      try {
        return await operation();
      } catch (err) {
        if (attempt >= CONNECT_ATTEMPTS) {
          throw err;
        }

        Logger.warn(
          `Temporal is not reachable yet (attempt ${attempt}/${CONNECT_ATTEMPTS}), retrying in ${CONNECT_DELAY_MS}ms`,
          'TemporalRegister'
        );

        await new Promise((resolve) => setTimeout(resolve, CONNECT_DELAY_MS));
      }
    }
  }
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [TemporalRegister],
  get exports() {
    return this.providers;
  },
})
export class TemporalRegisterMissingSearchAttributesModule {}
