import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';
import catchAsync from '../../utils/catchAsync';
import isUniqueViolationError from '../../utils/isUniqueViolationError';
import logger from '../logger';

const create: (data: Partial<UserEntity>) => Promise<UserEntity> = async (
  data,
) =>
  catchAsync(
    async () => {
      const userRepository = getRepository(UserEntity);

      const newUser = await userRepository.create({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      return userRepository.save(newUser);
    },
    (error) => {
      logger(
        isUniqueViolationError(error) ? 'warning' : 'error',
        `/service/user/create: Error ${error} when processing {email: ${data.email}`,
        error.stack,
      );

      throw error;
    },
  )();

export default create;
