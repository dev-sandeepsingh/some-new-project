import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';

export class UserNotFound extends Error {}

const deleteUser: (id: number) => Promise<void> = async (id) => {
  const userRepository = getRepository(UserEntity);

  const item = await userRepository.findOne({
    id,
  });

  if (!item) {
    throw new UserNotFound();
  }

  await userRepository.softDelete(id);
};

export default deleteUser;
