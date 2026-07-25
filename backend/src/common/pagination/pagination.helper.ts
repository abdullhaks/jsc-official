export class PaginationHelper {
  static getPaginationParams(page: number = 1, limit: number = 9) {
    const skip = (page - 1) * limit;
    return { skip, limit };
  }

  static buildPaginatedResponse(items: any[], total: number, page: number, limit: number) {
    const hasMore = page * limit < total;
    return {
      items,
      total,
      hasMore,
    };
  }
}
