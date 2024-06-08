export type AttendanceHistoryType = {
  LocationNameC: string;

  ClockTimeD: string;

  Remarks?: string;
}

export type PaginatedItems = {
  currentPage: number;

  totalItems: number;

  totalPages: number;

  pageSize: number;

  nextPage: number | null;

  previousPage: number | null;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  items: AttendanceHistoryType[];
}