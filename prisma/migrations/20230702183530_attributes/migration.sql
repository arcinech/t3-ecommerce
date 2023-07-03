/*
  Warnings:

  - You are about to drop the column `description` on the `AttributeValue` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `AttributeValue` table. All the data in the column will be lost.
  - Added the required column `value` to the `AttributeValue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductStock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductStock" ("createdAt", "id", "productId", "quantity", "updatedAt") SELECT "createdAt", "id", "productId", "quantity", "updatedAt" FROM "ProductStock";
DROP TABLE "ProductStock";
ALTER TABLE "new_ProductStock" RENAME TO "ProductStock";
CREATE UNIQUE INDEX "ProductStock_productId_key" ON "ProductStock"("productId");
CREATE TABLE "new_AttributeValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    CONSTRAINT "AttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AttributeValue" ("attributeId", "id") SELECT "attributeId", "id" FROM "AttributeValue";
DROP TABLE "AttributeValue";
ALTER TABLE "new_AttributeValue" RENAME TO "AttributeValue";
CREATE TABLE "new_Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "productTypeId" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("createdAt", "description", "id", "image", "name", "price", "productTypeId", "updatedAt") SELECT "createdAt", "description", "id", "image", "name", "price", "productTypeId", "updatedAt" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("id", "status", "userId") SELECT "id", "status", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
