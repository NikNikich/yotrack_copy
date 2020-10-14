export abstract class ConstructableDto<
  T = ConstructableDto<Record<string, unknown>>
> {
  constructor(dto?: Partial<T>) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
