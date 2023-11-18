import { Chat, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

/* Schemas

enum UserStatus {
  ONLINE
  OFFLINE
  AWAY
  BUSY
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
  DECLINED
  BLOCKED
}

model User {
  id           String         @id @default(uuid())
  login        String         @unique
  displayName  String
  email        String
  avatar       String?
  status       UserStatus     @default(ONLINE)
  victory      Int            @default(0)
  refreshToken String?
  mfaEnabled   Boolean        @default(false)
  mfaSecret    String?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  chats        ChatMember[]
  messages     Message[]
  winner       MatchHistory[] @relation(name: "winner")
  loser        MatchHistory[] @relation(name: "loser")
  friends      Friendship[]   @relation(name: "user")
  friendOf     Friendship[]   @relation(name: "friend")
}

model Friendship {
  id        Int              @id @default(autoincrement())
  createdAt DateTime         @default(now())
  user      User             @relation(fields: [userId], references: [id], name: "user")
  userId    String
  friend    User             @relation(fields: [friendId], references: [id], name: "friend")
  friendId  String
  status    FriendshipStatus @default(PENDING)

  @@unique([userId, friendId], name: "userId_friendId")
}

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
    avatar: "",
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
      login: true,
    },
  });

  const getRandomUserLogin = () => {
    return createdUsers[Math.floor(Math.random() * 49) + 1].login;
  };


  // create 3 chats with 3 members each
  const chats: any = Array.from({ length: 3 }).map(() => ({
    name: faker.hacker.adjective(),
    chatType: 'PUBLIC',
    owner: createdUsers[0].login,
  }));

  await prisma.chat.createMany({
    data: chats,
  });

  const createdChats = await prisma.chat.findMany({
    select: {
      id: true,
    },
  });


  // create 50 match history
  const getRandomUserId = () => {
    return createdUsers[Math.floor(Math.random() * 50)].id;
  };

  // Add 3 members to each chat
  const chatMembers: any = Array.from({ length: 9 }).map(() => ({
    chatId: createdChats[Math.floor(Math.random() * 3)].id,
    userLogin: getRandomUserLogin(),
    role: 'MEMBER',
  }));


  await prisma.chatMember.createMany({
    data: chatMembers,
  });

  // Add the chat owner to each chat
  const chatOwners: any = Array.from({ length: 3 }).map((_, index) => ({
    chatId: createdChats[index].id,
    userLogin: createdUsers[0].login,
    role: 'OWNER',
  }));

  await prisma.chatMember.createMany({
    data: chatOwners,
  });

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
