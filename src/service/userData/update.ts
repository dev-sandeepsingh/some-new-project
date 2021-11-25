import { getRepository } from 'typeorm';
import UserDataEntity from '../../database/entity/UserData';
import catchAsync from '../../utils/catchAsync';

import logger from '../logger';

const update: (
  id: number,
  data: Partial<UserDataEntity>,
) => Promise<UserDataEntity> = async (id, data) =>
  catchAsync(
    async () => {
      const userDataRepository = getRepository(UserDataEntity);
      logger('debug', `service/userData/update: updating ${id} user data`);

      const record = await getRepository(UserDataEntity).findOneOrFail(id);
      const dataToSave = userDataRepository.merge(record, {
        ...data,
      });
      const updatedRecord = await userDataRepository.save(dataToSave);

      logger('debug', 'service/userData/update: user data updated');
      return updatedRecord;
    },
    (error) => {
      logger(
        'error',
        `/service/userData/update: Error ${error} when processing update for #${id}`,
        error.stack,
      );

      throw error;
    },
  )();

export default update;
