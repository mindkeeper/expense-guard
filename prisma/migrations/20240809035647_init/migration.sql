/*
  Warnings:

  - A unique constraint covering the columns `[account_name,user_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_name_user_id_key" ON "accounts"("account_name", "user_id");
