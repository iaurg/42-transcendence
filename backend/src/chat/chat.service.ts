import { Injectable } from '@nestjs/common';
import {
  Chat,
  ChatMember,
  Message,
  chatMemberRole,
  chatMemberStatus,
  chatType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

import * as argon2 from 'argon2';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(
    userLogin: string,
    chatId: number,
    content: string,
  ): Promise<Message> {
    const userId = await this.prisma.user.findUnique({
      where: {
        login: userLogin,
      },
    });

    const createdMessage = await this.prisma.message.create({
      data: {
        content,
        chat: {
          connect: {
            id: chatId,
          },
        },
        user: {
          connect: {
            login: userLogin,
          },
        },
        userId: userId.id,
      },
    });

    return createdMessage;
  }

  async getMemberFromChat(
    chatId: number,
    userLogin: string,
  ): Promise<ChatMember> {
    try {
      const member = await this.prisma.chatMember.findUnique({
        where: {
          chatId_userLogin: {
            chatId,
            userLogin,
          },
        },
      });

      return member;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async createMember(
    chatId: number,
    login: string,
    role: chatMemberRole = 'MEMBER',
  ) {
    const createdMember = await this.prisma.chatMember.create({
      data: {
        role,
        chat: {
          connect: {
            id: chatId,
          },
        },
        user: {
          connect: {
            login,
          },
        },
      },
    });

    return createdMember;
  }

  async createMembers(
    chatId: number,
    guestList: string[],
    role: chatMemberRole = 'MEMBER',
  ) {
    const createdMembers = await this.prisma.chatMember.createMany({
      data: guestList.map((guest) => ({
        chatId,
        userLogin: guest,
        role,
      })),
    });

    return createdMembers;
  }

  async listMembersByChatId(chatId: number): Promise<ChatMember[]> {
    const members = await this.prisma.chatMember.findMany({
      where: {
        chatId,
      },
    });

    if (members.length === 0) {
      return null;
    }

    return members;
  }

  async createChat(
    login: string,
    chatName: string,
    type: chatType = 'PUBLIC',
    password?: string,
  ): Promise<Chat> {
    if (password) {
      password = await argon2.hash(password);
    }

    const createdChat = await this.prisma.chat.create({
      data: {
        name: chatName,
        chatType: type,
        password,
        owner: login,
        users: {
          create: {
            userLogin: login,
            role: chatMemberRole.OWNER,
          },
        },
      },
      include: {
        users: true,
      },
    });

    return createdChat;
  }

  async createPrivateChat(user: string, guestList: string[]): Promise<Chat> {
    const chatName = `${user} with ${guestList.join(', ')}`;

    const createdChat = await this.prisma.chat.create({
      data: {
        name: chatName,
        chatType: 'PRIVATE',
        owner: user,
        users: {
          create: [
            { userLogin: user, role: chatMemberRole.ADMIN },
            ...guestList.map((guest) => ({
              userLogin: guest,
              role: chatMemberRole.MEMBER,
            })),
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return createdChat;
  }

  async addUsersToChat(
    chatId: number,
    guestList: string[],
    role: chatMemberRole = 'MEMBER',
  ): Promise<Chat> {
    try {
      // First check if any of the users already exist in the chat
      const existingUsers = await this.prisma.chatMember.findMany({
        where: {
          chatId,
          userLogin: {
            in: guestList,
          },
        },
      });
      if (existingUsers.length > 0) {
        console.log(`Some users already exist in chat ${chatId}`);
        guestList = guestList.filter((guest) => {
          return !existingUsers.some((existingUser) => {
            return existingUser.userLogin === guest;
          });
        }, []);
      }
      if (guestList.length === 0) {
        console.log(
          `No new users to add to chat ${chatId}, returning default chat`,
        );
        return await this.getChatById(chatId);
      }
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            create: guestList.map((guest) => ({
              userLogin: guest,
              role,
            })),
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      console.log(`Returning default chat`);
      return await this.getChatById(chatId);
    }
  }

  async deleteChat(id: number): Promise<Chat> {
    try {
      // Delete chat messages
      await this.prisma.message.deleteMany({
        where: {
          chatId: id,
        },
      });
      // Delete chat members
      await this.prisma.chatMember.deleteMany({
        where: {
          chatId: id,
        },
      });
      // Delete chat
      const deletedChat = await this.prisma.chat.delete({
        where: {
          id,
        },
      });
      return deletedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getChatById(id: number): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
      },
    });

    return chat;
  }

  async getUsersByChatId(chatId: number): Promise<ChatMember[]> {
    const users = await this.prisma.chat
      .findUnique({
        where: {
          id: chatId,
        },
      })
      .users();

    return users;
  }

  async listChats(): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany();

    return chats;
  }

  async listChatsById(chatId: number): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        id: chatId,
      },
    });

    return chats;
  }

  async listChatsByType(chatType: chatType): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        chatType,
      },
    });

    return chats;
  }

  async listChatsByUserLogin(login: string): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            userLogin: login,
          },
        },
      },
    });

    return chats;
  }

  async findChat(chatId: number): Promise<Chat> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    return chat;
  }

  async listMessagesByChatId(chatId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
    });

    return messages;
  }

  async userExistsInChat(login: string, chatId: number): Promise<boolean> {
    const user = await this.prisma.chatMember.findUnique({
      where: {
        chatId_userLogin: {
          chatId,
          userLogin: login,
        },
      },
    });

    return !!user;
  }

  async addUserToChat(login: string, chatId: number): Promise<Chat> {
    try {
      if (await this.userExistsInChat(login, chatId)) {
        return null;
      }
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            create: {
              userLogin: login,
            },
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getNumberOfUsersByChatId(chatId: number): Promise<number> {
    const numberOfUsers = await this.prisma.chatMember.count({
      where: {
        chatId,
      },
    });

    return numberOfUsers;
  }

  async removeUserFromChat(login: string, chatId: number) {
    const deletedMember = await this.prisma.chatMember.delete({
      where: {
        chatId_userLogin: {
          chatId,
          userLogin: login,
        },
      },
    });

    return deletedMember;
  }

  async getMessageById(id: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });

    return message;
  }

  async getMessagesByChatId(chatId: number): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        chatId,
      },
    });

    return messages;
  }

  async deleteMessage(id: string): Promise<Message> {
    const deletedMessage = await this.prisma.message.delete({
      where: {
        id,
      },
    });

    return deletedMessage;
  }

  async giveAdmin(chatId: number, guestList: string[]): Promise<Chat> {
    try {
      // First make sure that every member in the guest list is actually a member of the chat
      const existingUsers = await this.prisma.chatMember.findMany({
        where: {
          chatId,
          userLogin: {
            in: guestList,
          },
        },
      });
      if (
        existingUsers.some(
          (existingUser) => existingUser.role === chatMemberRole.OWNER,
        )
      ) {
        console.log(`Some users in the guest list are chat owners`);
        return null;
      }
      if (existingUsers.length !== guestList.length) {
        console.log(
          `Some users in the guest list are not members of chat ${chatId}`,
        );
        return null;
      }
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            updateMany: guestList.map((guest) => ({
              where: {
                userLogin: guest,
              },
              data: {
                role: chatMemberRole.ADMIN,
              },
            })),
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async banUserFromChat(chatId: number, member: string): Promise<Chat> {
    try {
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            updateMany: [
              {
                where: {
                  userLogin: member,
                },
                data: {
                  status: chatMemberStatus.BANNED,
                },
              },
            ],
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async giveOwner(chatId: number, userLogin: string): Promise<Chat> {
    try {
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          owner: userLogin,
          users: {
            updateMany: [
              {
                where: {
                  userLogin,
                },
                data: {
                  role: chatMemberRole.OWNER,
                },
              },
            ],
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async muteUserFromChat(chatId: number, member: string): Promise<Chat> {
    try {
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            updateMany: [
              {
                where: {
                  userLogin: member,
                },
                data: {
                  status: chatMemberStatus.MUTED,
                },
              },
            ],
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async unmuteUserFromChat(chatId: number, member: string): Promise<Chat> {
    try {
      const updatedChat = await this.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            updateMany: [
              {
                where: {
                  userLogin: member,
                },
                data: {
                  status: chatMemberStatus.ACTIVE,
                },
              },
            ],
          },
        },
      });

      return updatedChat;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async verifyChatPassword(chatId: number, password: string): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      return false;
    }

    if (!chat.password) {
      return true;
    }

    const isPasswordValid = await argon2.verify(chat.password, password);

    return isPasswordValid;
  }
}
