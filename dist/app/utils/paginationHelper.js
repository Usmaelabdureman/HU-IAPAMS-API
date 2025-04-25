"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaginationWithDefault = exports.calculatePagination = exports.paginationFields = void 0;
exports.paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};
exports.calculatePagination = calculatePagination;
const calculatePaginationWithDefault = (options) => {
    const { page, limit, skip, sortBy, sortOrder } = (0, exports.calculatePagination)(options);
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
};
exports.calculatePaginationWithDefault = calculatePaginationWithDefault;
