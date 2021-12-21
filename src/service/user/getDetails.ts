import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';

const getDetails: (id: string) => Promise<UserEntity> = async (id) => {
  const userRepository = getRepository(UserEntity);
  const user = await userRepository.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    return null;
  }

  return user;
};

export default getDetails;
