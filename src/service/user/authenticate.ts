import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';

const authenticateUser: (
  email: string,
  password: string,
) => Promise<UserEntity> = async (email, password) => {
  const userRepository = getRepository(UserEntity);

  const user = await userRepository.findOne({ email });

  if (!user) {
    return null;
  }

  if (!user.checkIfPasswordMatch(password)) {
    return null;
  }

  delete user.password;
  return user;
};

export default authenticateUser;
