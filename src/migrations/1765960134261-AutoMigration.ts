import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765960134261 implements MigrationInterface {
    name = 'AutoMigration1765960134261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" integer, "updatedBy" integer, "deletedBy" integer, "email" character varying(100) NOT NULL, "passwordHash" character varying(255) NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(15), "age" integer, "isActive" boolean NOT NULL DEFAULT true, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "actorId" integer, "actorEmail" character varying(100), "action" character varying(50) NOT NULL, "entity" character varying(50) NOT NULL, "entityId" character varying(50), "before" jsonb, "after" jsonb, "method" character varying(10), "path" character varying(255), "query" jsonb, "body" jsonb, "ip" character varying(64), "userAgent" character varying(255), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
