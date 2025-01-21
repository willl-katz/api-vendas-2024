import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateProducts1730939408169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria uma extensão para poder usar campos uuid com postgres
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    // Gera a tabela com seu referente nome e campos da tabela.
    // OBS: Caso queira colocar algum campo opcional, utiliza-se o "isNullable: true"
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10, // Define a quantidade de dígitos do valor
            scale: 2, // Define a quantidadee de casas decimais
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products')
  }
}
