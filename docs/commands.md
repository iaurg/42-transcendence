# Useful resources for using NestJS

This is a compilation of useful resources for using NestJS in the project.

Install the NestJS CLI:

```bash
# local install
npm i @nestjs/cli
# global install
npm i -g @nestjs/cli
```

You can run NestJS CLI commands with `npx nest` or `nest` if you have installed it globally.

## CRUD Commands

Check the [official documentation](https://docs.nestjs.com/recipes/crud-generator) for more information.

Generate a module: `nest g mo`
Generate a controller: `nest g co
Generate a service:`nest g s`

- You can skip spec files with the `--no-spec` flag.

## Prisma support

Check the [official documentation](https://docs.nestjs.com/recipes/prisma) for more information.

### Prisma migrate

The prisma migrate command executes the migrations in the migrations folder.

```bash
npx prisma migrate dev --name [migration-name]
```

### Prisma generate

The prisma generate command generates the Prisma Client.

```bash
npx prisma generate
```

### Prisma Studio

The prisma studio command opens the Prisma Studio to view and edit the data in your database.

```bash
npx prisma studio
```

Reset and seed the database:

```bash
npx prisma db push --force-reset && npx prisma db seed
```

## Websockets

Check the [official documentation](https://docs.nestjs.com/websockets/gateways) for more information.

## Authentication

Check the [official documentation](https://docs.nestjs.com/techniques/authentication) for more information.

## Setting up Roles

Check the [official documentation](https://docs.nestjs.com/security/authorization) for more information.

## Password encryption

Check the [official documentation](https://docs.nestjs.com/security/encryption-and-hashing) for more information.
