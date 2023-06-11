import { PrismaClient } from '@prisma/client'


export const getArrows = async (unseen: boolean = true) => {
  const prisma = new PrismaClient()
  const arrows = await prisma.note.findMany({
    where: {
      seenAt: unseen ? null : { not: null }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  await prisma.$disconnect()
  return arrows;
}

export const getArrow = async (id: string) => {
  const prisma = new PrismaClient()
  const arrow = await prisma.note.findUnique({
    where: {
      id: id
    }
  });
  await prisma.$disconnect()
  return arrow;
}

export const markArrowAsSeen = async (id: string) => {
  // mark the arrow as seen
  const prisma = new PrismaClient()
  const updatedArrow = await prisma.note.update({
    where: {
      id: id
    },
    data: {
      seenAt: new Date()
    }
  });
  await prisma.$disconnect()
  return updatedArrow;
}