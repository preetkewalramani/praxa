export interface BaseEntity<TId extends string = string> {
  id: TId;
}

export interface AuditableEntity extends BaseEntity {
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export interface SoftDeleteEntity extends AuditableEntity {
  deletedAt?: Date;
  deletedBy?: string;
}

export interface TenantAwareEntity extends BaseEntity {
  tenantId: string;
}
