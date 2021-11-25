import { getRepository } from 'typeorm';
import UserDataEntity from '../../database/entity/UserData';
import catchAsync from '../../utils/catchAsync';
import isUniqueViolationError from '../../utils/isUniqueViolationError';
import logger from '../logger';

const create: (data: Partial<UserDataEntity>) => Promise<UserDataEntity> =
  async (data) =>
    catchAsync(
      async () => {
        const userDataRepository = getRepository(UserDataEntity);

        const newUserData = await userDataRepository.save({
          name: data.name,
          email: data.email,
        });

        return newUserData;
      },
      (error) => {
        logger(
          isUniqueViolationError(error) ? 'warning' : 'error',
          `/service/userData/create: Error ${error} when processing {email: ${data.email}`,
          error.stack,
        );

        throw error;
      },
    )();

export default create;
