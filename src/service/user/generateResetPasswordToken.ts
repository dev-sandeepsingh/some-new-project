import { getRepository } from 'typeorm';
import UserEntity from '../../database/entity/User';
import ResetPasswordTokenEntity from '../../database/entity/ResetPasswordToken';

export class UserNotFound extends Error {}

const generateResetPasswordToken: (email: string) => Promise<any> = async (
  email,
) => {
  const userRepository = getRepository(UserEntity);

  const user = await userRepository.findOne({
    email,
  });

  if (!user) {
    throw new UserNotFound();
  }

  const resetPasswordTokenRepository = getRepository(ResetPasswordTokenEntity);
  await resetPasswordTokenRepository.delete({ email });

  const resetPasswordToken = await resetPasswordTokenRepository.create({
    email,
  });
  const { token } = await resetPasswordTokenRepository.save(resetPasswordToken);

  return { token, user };
};

export default generateResetPasswordToken;
