export interface BaseJob<TPayload extends object = Record<string, never>> {
  id?: string;
  name: string;
  payload: TPayload;
}

export interface EnqueueOptions {
  delayMs?: number;
  jobId?: string;
}
