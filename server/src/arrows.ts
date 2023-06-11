import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getArrows = async (unseen: boolean = true) => {
  await prisma.$connect()
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
  await prisma.$connect()
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
  await prisma.$connect()
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