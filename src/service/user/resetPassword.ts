import { getRepository, MoreThan } from 'typeorm';
import UserEntity from '../../database/entity/User';
import ResetPasswordTokenEntity from '../../database/entity/ResetPasswordToken';

export class UserNotFound extends Error {}

const resetPassword: (
  password: string,
  token: string,
) => Promise<void> = async (password, token) => {
  const resetPasswordTokenRepository = getRepository(ResetPasswordTokenEntity);
  const resetPasswordToken = await resetPasswordTokenRepository.findOne({
    where: {
      token,
      expires: MoreThan(new Date()),
    },
    relations: ['user'],
  });

  if (!resetPasswordToken) {
    throw new UserNotFound();
  }
  const { id } = resetPasswordToken.user;

  const userRepository = getRepository(UserEntity);
  const item = await userRepository.findOne({ id });
  const dataToSave = userRepository.merge(item, {
    password,
  });
  await Promise.all([
    userRepository.save(dataToSave),
    resetPasswordTokenRepository.delete({ id: resetPasswordToken.id }),
  ]);
};

export default resetPassword;
