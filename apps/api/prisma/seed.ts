import { PrismaClient, Unit } from "@prisma/client";

const prisma = new PrismaClient();

const workTypes = [
  { name: "Кладка перегородок", unit: Unit.M2 },
  { name: "Монтаж опалубки", unit: Unit.M2 },
  { name: "Бетонирование", unit: Unit.M3 },
  { name: "Монтаж арматуры", unit: Unit.TON },
  { name: "Штукатурные работы", unit: Unit.M2 },
  { name: "Установка дверей", unit: Unit.PCS },
  { name: "Прокладка кабеля", unit: Unit.M },
  { name: "Покраска стен", unit: Unit.M2 },
];

async function main() {
  for (const workType of workTypes) {
    await prisma.workType.upsert({
      where: { name: workType.name },
      update: { unit: workType.unit },
      create: workType,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
