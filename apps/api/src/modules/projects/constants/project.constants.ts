export const PROJECT_AUDIT_EVENTS = {
  projectArchived: 'PROJECT_ARCHIVED',
  projectCreated: 'PROJECT_CREATED',
  projectServiceAssigned: 'PROJECT_SERVICE_ASSIGNED',
  projectServiceRemoved: 'PROJECT_SERVICE_REMOVED',
  projectStatusChanged: 'PROJECT_STATUS_CHANGED',
  projectUpdated: 'PROJECT_UPDATED',
  workOrderAssigned: 'WORK_ORDER_ASSIGNED',
  workOrderCancelled: 'WORK_ORDER_CANCELLED',
  workOrderCompleted: 'WORK_ORDER_COMPLETED',
  workOrderCreated: 'WORK_ORDER_CREATED',
  workOrderStatusChanged: 'WORK_ORDER_STATUS_CHANGED',
  workOrderUpdated: 'WORK_ORDER_UPDATED',
} as const;
export const PROJECT_STATUS_TRANSITIONS: Record<string, string[]> = {
  ACTIVE: ['ON_HOLD', 'COMPLETED', 'CANCELLED'],
  DRAFT: ['ACTIVE'],
  ON_HOLD: ['ACTIVE'],
};
export const WORK_ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  BLOCKED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED', 'BLOCKED'],
  OPEN: ['ASSIGNED', 'CANCELLED'],
};
