export abstract class ConstructableDto<
  T = ConstructableDto<Record<string, unknown>>
> {
  constructor(dto?: T) {
    if (dto) {
      Object.assign(this, dto);
    }
  }
}
