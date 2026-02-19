import bcrypt from "bcrypt";
import { prisma } from "../src/utils/prisma.js";

const measurementConfig = {
  trouser: [
    "Fly", "Hips", "Knee Length", "Knee Round",
    "Bottom", "Length", "Waist", "Thighs",
  ],
  shirt: ["Shoulder", "Chest", "Waist", "Hips", "Sleeves", "Length"],
  coat: ["Shoulder", "Chest", "Waist", "Hips", "Sleeves", "Length"],
  dress: [
    "Shoulder", "Burst", "Bodies", "Breast", "Waist", "Hips", "Sleeves",
    "Length", "Ampex", "Empire", "Knee Round", "Knee Length", "Hip Line",
  ],
  skirt: ["Waist", "Hips", "Length"],
};

const staffData = [
  { firstName: "Admin", lastName: "User", phoneNumber: "0712345678", role: "ADMIN" },
  { firstName: "John", lastName: "Doe", phoneNumber: "0722222222", role: "STAFF" },
  { firstName: "Mary", lastName: "Jane", phoneNumber: "0733333333", role: "STAFF" },
  { firstName: "Peter", lastName: "Smith", phoneNumber: "0744444444", role: "STAFF" },
  { firstName: "Grace", lastName: "Brown", phoneNumber: "0755555555", role: "STAFF" },
];


async function main() {
  console.log("Seeding database...");


  await prisma.payments.deleteMany();
  await prisma.subOrderItems.deleteMany();
  await prisma.orderItems.deleteMany();
  await prisma.orders.deleteMany();

 
  for (const staff of staffData) {
    const assignedPassword = "1234567890";
    const hashedPassword = await bcrypt.hash(assignedPassword, 10);

    await prisma.staff.upsert({
      where: { phone_number: staff.phoneNumber },
      update: {},
      create: {
        first_name: staff.firstName,
        last_name: staff.lastName,
        phone_number: staff.phoneNumber,
        password: hashedPassword,
        role: staff.role,
      },
    });
  }

  console.log("Staff seeded");

  const staffList = await prisma.staff.findMany();

  
  const clothingTypes = [
    { name: "Dress", measurements: measurementConfig.dress },
    { name: "Skirt", measurements: measurementConfig.skirt },
    { name: "Trouser", measurements: measurementConfig.trouser },
    { name: "Coat", measurements: measurementConfig.coat },
    { name: "Shirt", measurements: measurementConfig.shirt },
  ];

  for (const cloth of clothingTypes) {
    await prisma.clothingType.upsert({
      where: { name: cloth.name },
      update: {},
      create: cloth, 
    });
  }

  console.log("Clothing types seeded");

  const clothingTypeList = await prisma.clothingType.findMany();

  
  const clothingMap = {};
  clothingTypeList.forEach((c) => {
    clothingMap[c.name] = c.id;
  });

  
  const ordersToCreate = [];

  
  staffList.forEach((staff) => {
    ordersToCreate.push({ staffId: staff.id });
  });

  
  while (ordersToCreate.length < 20) {
    const randomStaff =
      staffList[Math.floor(Math.random() * staffList.length)];
    ordersToCreate.push({ staffId: randomStaff.id });
  }

  for (let i = 0; i < ordersToCreate.length; i++) {
    const staffId = ordersToCreate[i].staffId;
    const customerPhone = `07${Math.floor(
      10000000 + Math.random() * 89999999
    )}`;
    const customerName = `Customer ${i + 1}`;

    await prisma.orders.create({
      data: {
        name: customerName,
        phone_number: customerPhone,
        type: Math.random() > 0.5 ? "GROUP" : "INDIVIDUAL",
        due_date: new Date("2025-09-25"),
        created_by_id: staffId,

        order_items: {
          create: [
            {
              clothing_type_id: clothingMap["Skirt"],
              price: 1200,
              measurements: { Waist: 20, Hips: 23, Length: 21 },

              sub_order_items: {
                create: [
                  {
                    clothing_type_id: clothingMap["Trouser"],
                    price: 1500,
                    measurements: {
                      Fly: 21,
                      Hips: 23,
                      "Knee Length": 12,
                      "Knee Round": 14,
                      Bottom: 25,
                      Length: 42,
                      Waist: 32,
                      Thighs: 15,
                    },
                  },
                  {
                    clothing_type_id: clothingMap["Shirt"],
                    price: 800,
                    measurements: {
                      Shoulder: 32,
                      Chest: 35,
                      Waist: 42,
                      Hips: 21,
                      Sleeves: 17,
                      Length: 20,
                    },
                  },
                ],
              },
            },
            {
              clothing_type_id: clothingMap["Coat"],
              price: 2400,
              measurements: {
                Shoulder: 32,
                Chest: 35,
                Waist: 42,
                Hips: 21,
                Sleeves: 17,
                Length: 20,
              },
            },
          ],
        },

        payments: {
          create: [
            {
              amount: 2000 + Math.floor(Math.random() * 1000),
              mode: ["MPESA", "CASH", "BANK_TRANSFER"][
                Math.floor(Math.random() * 3)
              ],
              reference: `REF${Math.floor(
                100000 + Math.random() * 900000
              )}`,
              updated_by_id: staffId,
            },
          ],
        },
      },
    });
  }

  console.log("Orders seeded");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });
