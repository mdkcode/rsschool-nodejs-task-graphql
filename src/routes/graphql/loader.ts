import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createUserLoaders(prisma: PrismaClient) {
  return {
    userLoader: new DataLoader(async (userIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: userIds as string[] },
        },
      });
      const grouped = userIds.map((userId) =>
        posts.filter((post) => post.authorId === userId),
      );
      return grouped;
    }),

    memberTypeLoader: new DataLoader(async (memberTypeIds: readonly string[]) => {
      const types = await prisma.memberType.findMany({
        where: { id: { in: memberTypeIds as string[] } },
      });
      return memberTypeIds.map((id) => types.find((mt) => mt.id === id));
    }),

    profileLoader: new DataLoader<string, any>(async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });
      const map = new Map(profiles.map((p) => [p.userId, p]));
      return userIds.map((id) => map.get(id) ?? null);
    }),

    userSubscribedToLoader: new DataLoader(async (userIds: readonly string[]) => {
      const subs = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: userIds as string[] } },
        include: { author: true },
      });
      return userIds.map((id) => subs.filter((entry) => entry.subscriberId === id));
    }),

    subscribedToUser: new DataLoader(async (userIds: readonly string[]) => {
      const subs = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: userIds as string[] } },
        include: { subscriber: true },
      });
      return userIds.map((id) => subs.filter((entry) => entry.authorId === id));
    }),
  };
}
