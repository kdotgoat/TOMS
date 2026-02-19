-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('PENDING', 'DELIVERED');

-- CreateEnum
CREATE TYPE "public"."PaymentMode" AS ENUM ('MPESA', 'CASH', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "public"."Orders" (
    "id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "additional_notes" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery" "public"."DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "updated_by_id" TEXT,
    "type" "public"."OrderType" NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClothingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "ClothingType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItems" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "clothing_type_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubOrderItems" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "clothing_type_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "measurements" JSONB NOT NULL,

    CONSTRAINT "SubOrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "mode" "public"."PaymentMode" NOT NULL,
    "reference" TEXT,
    "updated_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlacklistedToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "BlacklistedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "id" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STAFF',
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" TEXT,
    "last_name" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClothingType_name_key" ON "public"."ClothingType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phone_number_key" ON "public"."Staff"("phone_number");

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "Orders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."Staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "Orders_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "OrderItems_clothing_type_id_fkey" FOREIGN KEY ("clothing_type_id") REFERENCES "public"."ClothingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItems" ADD CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubOrderItems" ADD CONSTRAINT "SubOrderItems_clothing_type_id_fkey" FOREIGN KEY ("clothing_type_id") REFERENCES "public"."ClothingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubOrderItems" ADD CONSTRAINT "SubOrderItems_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "public"."OrderItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payments" ADD CONSTRAINT "Payments_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
