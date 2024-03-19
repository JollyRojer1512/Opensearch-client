import { Client } from "@opensearch-project/opensearch";
import {
  CreateParams,
  GetParams,
  Indicies,
  OpenSearchCreateResponse,
  OpenSearchGetResponse,
  OpenSearchSearchResponse,
  OpenSearchUpdateResponse,
  SearchParams,
  UpdateParams,
} from "./types";
import { IndexNotProvided } from "../errors/main";
import { OpenSearchErrorHandler } from "./error";
import {
  OpenSearchGetResponseEntity,
  OpenSearchSearchResponseEntity,
} from "../entities";
import { Inject } from "@nestjs/common";
import { configOptionsSymbol } from "../utils/symbols";

export interface OpenSearchClientParams<
  Index extends Indicies | undefined = undefined
> {
  nodes: string | string[];
  index?: Index;
  clientName?: string | symbol;
}

export class OpenSearchClient<Index extends Indicies | undefined = undefined> {
  private readonly client: Client;
  private readonly index?: Index;
  private readonly errorHandler: OpenSearchErrorHandler;
  constructor(
    @Inject(configOptionsSymbol) params: OpenSearchClientParams<Index>
  ) {
    this.client = new Client({
      nodes: params.nodes,
      name: params.clientName,
    });
    this.index = params.index;
    this.errorHandler = new OpenSearchErrorHandler();
  }

  async search<MethodIndex extends Indicies | undefined = Index>(
    params: SearchParams<MethodIndex>
  ): Promise<OpenSearchSearchResponseEntity<MethodIndex>> {
    const index = params.index ?? this.index;
    if (!index) throw new IndexNotProvided();

    try {
      const result = await this.client.search<
        OpenSearchSearchResponse<MethodIndex>
      >({
        index,
        body: params.body,
      });
      return new OpenSearchSearchResponseEntity(result.body);
    } catch (e: unknown) {
      throw this.errorHandler.format(e);
    }
  }

  async get<MethodIndex extends Indicies | undefined = Index>(
    params: GetParams<MethodIndex>
  ): Promise<OpenSearchGetResponseEntity<MethodIndex>> {
    const index = params.index ?? this.index;
    if (!index) throw new IndexNotProvided();

    try {
      const result = await this.client.get<OpenSearchGetResponse<MethodIndex>>({
        index,
        id: params.id,
      });
      return new OpenSearchGetResponseEntity(result.body);
    } catch (e: unknown) {
      throw this.errorHandler.format(e);
    }
  }
  async create<MethodIndex extends Indicies | undefined = Index>(
    params: CreateParams<MethodIndex>
  ): Promise<{ success: boolean }> {
    const index = params.index ?? this.index;
    if (!index) throw new IndexNotProvided();

    try {
      const result = await this.client.create<OpenSearchCreateResponse>({
        ...params,
        index,
      });
      return { success: result.body.result === "created" };
    } catch (e: unknown) {
      throw this.errorHandler.format(e);
    }
  }
  async update<MethodIndex extends Indicies | undefined = Index>(
    params: UpdateParams<MethodIndex>
  ): Promise<{ success: boolean }> {
    const index = params.index ?? this.index;
    if (!index) throw new IndexNotProvided();

    try {
      const result = await this.client.update<OpenSearchUpdateResponse>({
        index,
        id: params.id,
        body: { doc: params.body },
        refresh: params.refresh ?? true,
      });
      return { success: result.body.result === "updated" };
    } catch (e: unknown) {
      throw this.errorHandler.format(e);
    }
  }
}
