import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

/* User Schema
model User {
  id           String     @id @default(uuid())
  login        String     @unique
  displayName  String
  email        String
  avatar       String?
  status       UserStatus @default(ONLINE)
  victory      Int        @default(0)
  friends      Friend[]   @relation("Friendship")
  refreshToken String?
  mfaEnabled   Boolean    @default(false)
  mfaSecret    String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  chats       ChatMember[]
  messages    Message[]
}
*/

async function main() {
  // create 50 users using faker
  const users = Array.from({ length: 50 }).map(() => ({
    login: faker.internet.userName(),
    displayName: faker.person.firstName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    victory: Math.floor(Math.random() * 100),
    mfaEnabled: false,
    mfaSecret: 'secret',
  }));

  await prisma.user.createMany({
    data: users,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
