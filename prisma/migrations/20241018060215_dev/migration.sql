/*
  Warnings:

  - The `siteTheme` column on the `SiteSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SiteTheme" AS ENUM ('Light', 'Dark', 'System');

-- AlterTable
ALTER TABLE "SiteSettings" DROP COLUMN "siteTheme",
ADD COLUMN     "siteTheme" "SiteTheme" DEFAULT 'Light';
