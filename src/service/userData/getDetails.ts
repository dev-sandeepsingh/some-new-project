import { getRepository } from 'typeorm';
import UserDataEntity from '../../database/entity/UserData';

const getDetails: (
  id: string,
) => Promise<UserDataEntity> = async (id) => {
  const userDataRepository = getRepository(UserDataEntity);

  const userData = await userDataRepository.findOne({
    where: {
      id,
    },
  });
  if (!userData) {
    return null;
  }

  return userData;
};

export default getDetails;
