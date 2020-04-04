import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStores1586019097770 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "store",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
        },
        {
          name: "name",
          type: "varchar",
        },
        {
          name: "description",
          type: "varchar",
        },
        {
          name: "postcode",
          type: "varchar"
        }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("store");
  }

}
