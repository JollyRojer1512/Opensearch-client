#### Example how to use

```typescript
import { OpenSearchClient } from "./opensearch/client";
import { Indicies } from "./opensearch/types";

async function openSearchCLientTest(): Promise<void> {
	const url = "https://path.to.opensearch/";
	if (!url) throw new Error("OpenSearch URL is not provided");

	const client = new OpenSearchClient({ nodes: url });
	const getResult = await client.get({ index: Indicies.locations, id: "1" }).catch((e) => console.log(e));
	const searchResult = await client.search({
		index: Indicies.indexName,
		body: {
			from: 0,
			size: 10,
			query: {
				multi_match: {
					query: "/москов/",
					fields: ["*"],
					fuzziness: "AUTO",
					analyzer: Analyzers.latin,
				},
			},
		},
	});
}

```


### Example of how to import as module
#### Recommend injecting as OpenSearchClient< undefined> in order to use type control. 
```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "./config";
import { Config } from "../components/config/config";

@Module({
	imports: [
		OpenSearchModule.forRootAsync({
			useFactory: async (config: Config) => ({
				nodes: config.openSearch.nodes,
				clientName: config.app.name,
			}),
			inject: [Config],
			imports: [ConfigModule],
		}),
	],
	controllers: [],
	providers: [],
	exports: [],
})
export class ServiceModule {}

```
