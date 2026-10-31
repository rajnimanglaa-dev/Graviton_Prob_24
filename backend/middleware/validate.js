export function validate(schema, target = 'body') {
  return (request, response, next) => {
    const result = schema.safeParse(request[target]);
    if (!result.success) return next(result.error);
    request[target] = result.data;
    return next();
  };
}
