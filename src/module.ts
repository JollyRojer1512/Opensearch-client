import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";
import { OpenSearchClient, OpenSearchClientParams } from "./opensearch/client";
import { Indicies } from "./opensearch/types";
import { buildInjectionToken } from "./utils/helpers";
import { clientMapSymbol } from "./utils/symbols";

type ClientMap = Map<string | symbol | undefined, OpenSearchClient<Indicies>>;

interface Options extends Pick<ModuleMetadata, "imports"> {
  clientName?: string | symbol;
  useFactory: (
    ...args: any[]
  ) =>
    | OpenSearchClientParams<Indicies>
    | Promise<OpenSearchClientParams<Indicies>>;
  inject?: any[];
}

@Global()
@Module({
  providers: [
    {
      provide: clientMapSymbol,
      useValue: new Map<
        string | symbol | undefined,
        OpenSearchClient<Indicies>
      >(),
    },
  ],
})
export class OpenSearchModule {
  static forRoot(
    options:
      | OpenSearchClientParams<Indicies>
      | OpenSearchClientParams<Indicies>[]
  ): DynamicModule {
    const providers = OpenSearchModule.buildProviders(options);
    return {
      module: OpenSearchModule,
      exports: providers,
      providers,
    };
  }

  static forRootAsync(options: Options): DynamicModule {
    const providers = OpenSearchModule.buildAsyncProviders(options);
    return {
      module: OpenSearchModule,
      imports: Array.isArray(options) ? undefined : options.imports,
      exports: providers,
      providers,
    };
  }

  private static buildProviders(
    options:
      | OpenSearchClientParams<Indicies>
      | OpenSearchClientParams<Indicies>[]
  ): Provider[] {
    if (!Array.isArray(options)) {
      return OpenSearchModule.buildProviders([options]);
    }

    return options.map((option) => ({
      provide: option.clientName
        ? buildInjectionToken(option.clientName)
        : OpenSearchClient,
      inject: [clientMapSymbol],
      useFactory: (clientMap: ClientMap) => {
        const client = new OpenSearchClient(option);
        clientMap.set(option.clientName, client);
        return client;
      },
    }));
  }

  private static buildAsyncProviders(options: Options | Options[]): Provider[] {
    if (!Array.isArray(options)) {
      return OpenSearchModule.buildAsyncProviders([options]);
    }

    return options.map((option) => ({
      provide: option.clientName
        ? buildInjectionToken(option.clientName)
        : OpenSearchClient,
      inject: [clientMapSymbol, ...(option.inject || [])],
      useFactory: async (clientMap: ClientMap, ...args: any[]) => {
        const clientOptions = await option.useFactory(...args);
        const client = new OpenSearchClient({ ...clientOptions });
        clientMap.set(option.clientName, client);
        return client;
      },
    }));
  }
}
