-- AlterTable
ALTER TABLE "credit_sales" ALTER COLUMN "order_id" DROP NOT NULL,
ALTER COLUMN "order_date" DROP NOT NULL,
ALTER COLUMN "payment_date" DROP NOT NULL,
ALTER COLUMN "amount_paid" DROP NOT NULL,
ALTER COLUMN "fully_paid" DROP NOT NULL,
ALTER COLUMN "shift_id" DROP NOT NULL,
ALTER COLUMN "phone_number" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Refund" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "refundItems" JSONB NOT NULL,
    "totalRefund" DOUBLE PRECISION NOT NULL,
    "refundPaymentMethod" TEXT NOT NULL,
    "refundedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
