export type TAllPermissionQUery = {
  permissionName?: string;
  permissionKey?: string;
  permissionGroup?: string;
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
};
