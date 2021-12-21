import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';
import catchAsync from '../../utils/catchAsync';

import logger from '../logger';

const update: (
  id: number,
  data: Partial<UserEntity>,
) => Promise<UserEntity> = async (id, data) =>
    catchAsync(
      async () => {
        const userRepository = getRepository(UserEntity);
        logger('debug', `service/user/update: updating ${id} user data`);

        const item = await userRepository.findOne({
          id,
        });

        if (!item) {
          return null;
        }
        const dataToSave = userRepository.merge(item, {
          ...data,
        });
        const updatedRecord = await userRepository.save(dataToSave);

        logger('debug', 'service/user/update: user data updated');
        return updatedRecord;
      },
      (error) => {
        logger(
          'error',
          `/service/user/update: Error ${error} when processing update for #${id}`,
          error.stack,
        );

        throw error;
      },
    )();

export default update;
