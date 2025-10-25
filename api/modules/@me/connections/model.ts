export namespace ConnectionModel {
	export interface RemoveOptions {
		id: bigint;
		connection: string;
	}

	export interface ConnectOptions {
		id: bigint;
		provider: string;
	}
}
