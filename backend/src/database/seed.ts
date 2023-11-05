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

MatchHistory Schema
model MatchHistory {
  id Int @id @default(autoincrement())

  winner       User   @relation(fields: [winnerId], references: [id], name: "winner")
  winnerId     String 
  winnerPoints Int

  loser       User   @relation(fields: [loserId], references: [id], name: "loser")
  loserId     String 
  loserPoints Int

  createdAt DateTime @default(now())
}
*/

async function main() {
  // create 50 users using faker
  const users: any = Array.from({ length: 50 }).map(() => ({
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

  const createdUsers = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  // create 50 match history
  const getRandomUserId = () => {
    return createdUsers[Math.floor(Math.random() * 50)].id;
  };

  const matchHistory = Array.from({ length: 50 }).map(() => ({
    winnerId: getRandomUserId(),
    winnerPoints: Math.floor(Math.random() * 5) + 5,
    loserId: getRandomUserId(),
    loserPoints: Math.floor(Math.random() * 5),
  }));

  await prisma.matchHistory.createMany({
    data: matchHistory,
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