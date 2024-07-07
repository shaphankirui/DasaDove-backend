-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "photoURL" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dfsd8beyu/image/upload/v1720257318/defaultUser_f7bvpx.webp',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Admin',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';
