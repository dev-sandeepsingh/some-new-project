import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/naming-convention,import/prefer-default-export
export class addResetPasswordToken1642162622340 implements MigrationInterface {
  name = 'addResetPasswordToken1642162622340';

  // eslint-disable-next-line class-methods-use-this
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "reset_password_token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "token" character varying NOT NULL, "expires" TIMESTAMP NOT NULL, "email" character varying, CONSTRAINT "UQ_609174ec22ebfd1b8dd71f867a3" UNIQUE ("token"), CONSTRAINT "REL_61235cac4d620544c6d935cd17" UNIQUE ("email"), CONSTRAINT "PK_c6f6eb8f5c88ac0233eceb8d385" PRIMARY KEY ("id"))',
    );
    await queryRunner.query(
      'ALTER TABLE "reset_password_token" ADD CONSTRAINT "FK_61235cac4d620544c6d935cd177" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "reset_password_token" DROP CONSTRAINT "FK_61235cac4d620544c6d935cd177"',
    );
    await queryRunner.query('DROP TABLE "reset_password_token"');
  }
}
