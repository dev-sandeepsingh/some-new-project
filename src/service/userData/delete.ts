import { getRepository } from 'typeorm';
import UserDataEntity from '../../database/entity/UserData';

export class UserNotFound extends Error {}

const deleteUserData: (id: number) => Promise<void> = async (id) => {
  const userDataRepository = getRepository(UserDataEntity);

  const item = await userDataRepository.findOne({
    id,
  });

  if (!item) {
    throw new UserNotFound();
  }

  await userDataRepository.softDelete(id);
};

export default deleteUserData;
