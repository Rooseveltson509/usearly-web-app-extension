function isApiError(err: unknown): err is ApiError {
    return typeof err === 'object' && err !== null && 'error' in err;
}
