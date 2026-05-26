export interface DomainEventMetadata {
  correlationId?: string;
  occurredAt: Date;
}

export abstract class BaseDomainEvent<TPayload extends object = Record<string, never>> {
  readonly metadata: DomainEventMetadata;

  protected constructor(
    readonly eventName: string,
    readonly payload: TPayload,
    metadata?: Partial<DomainEventMetadata>,
  ) {
    this.metadata = {
      correlationId: metadata?.correlationId,
      occurredAt: metadata?.occurredAt ?? new Date(),
    };
  }
}
