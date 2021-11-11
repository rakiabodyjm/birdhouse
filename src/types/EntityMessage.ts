class EntityMessage<T> {
  message: string
  entity: T
}

export function createEntityMessage<T>(
  entity: T,
  message: string,
): EntityMessage<T> {
  return {
    message: message,
    entity: entity,
  }
}

export default EntityMessage
