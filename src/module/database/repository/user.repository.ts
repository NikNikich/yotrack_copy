import { EntityRepository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  async findByYoutrackIdOrCreateNew(
    fullName: string,
    youtrackId: string,
  ): Promise<UserEntity> {
    let user = await this.findOne({ where: { youtrackId } });
    if (!user) {
      user = new UserEntity({
        fullName,
        youtrackId,
      });
    }
    return user;
  }

  async getIdFoundedByYoutrackIdOrCreated(
    fullName: string,
    youtrackId: string,
  ): Promise<number> {
    let user = await this.findOne({ where: { youtrackId } });
    if (!user) {
      user = await this.save(
        new UserEntity({
          fullName,
          youtrackId,
        }),
      );
    }
    return user.id;
  }

  async;
}
