-- CreateTable
CREATE TABLE "quotations" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_purchase_orders" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "local_purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "totalUnpaidSuppliers" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dueCredit" DOUBLE PRECISION,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_sales" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "credit_amount" DOUBLE PRECISION NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "fully_paid" DOUBLE PRECISION NOT NULL,
    "customer_name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "phone_number" TEXT NOT NULL,
    "order_remarks" TEXT,
    "national_id" TEXT,
    "confirm_delete" BOOLEAN,
    "cash_paid" DOUBLE PRECISION,
    "mpesa_paid" DOUBLE PRECISION,
    "bank_paid" DOUBLE PRECISION,
    "mpesa_confirmation_code" TEXT,
    "bank_confirmation_code" TEXT,
    "balance" DOUBLE PRECISION,
    "complementary_of" TEXT,
    "complimentary_amount" DOUBLE PRECISION,
    "voucher_code" TEXT,
    "voucher_amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotations_referenceNumber_key" ON "quotations"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "local_purchase_orders_referenceNumber_key" ON "local_purchase_orders"("referenceNumber");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_purchase_orders" ADD CONSTRAINT "local_purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
