import { getRepository } from 'typeorm';
import UserDataEntity from '../../database/entity/UserData';

export class UserNotFound extends Error {}

const deleteUserData: (id: number) => Promise<void> = async (id) => {
  const userDataRepository = getRepository(UserDataEntity);

  await userDataRepository.softDelete(id);
};

export default deleteUserData;
