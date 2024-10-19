-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Card', 'BankTransfer', 'Cash', 'Other');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded', 'Other');

-- CreateEnum
CREATE TYPE "SocialMediaType" AS ENUM ('Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Youtube', 'Tiktok', 'Whatsapp', 'Telegram');

-- CreateTable
CREATE TABLE "ListingBooking" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingRoomId" TEXT NOT NULL,
    "listingReservationId" TEXT NOT NULL,
    "bookingUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingBookingPayment" (
    "id" TEXT NOT NULL,
    "listingBookingId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentAmount" DECIMAL(65,30) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "paymentReference" TEXT,
    "paymentGateway" TEXT,
    "paymentResponse" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingBookingPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT,
    "siteDescription" TEXT,
    "siteTheme" TEXT,
    "siteDefaultCurrency" TEXT,
    "siteDefaultLanguage" TEXT,
    "siteDefaultTimezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsLogoToImage" (
    "id" TEXT NOT NULL,
    "siteSettingsId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettingsLogoToImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsSocialMedia" (
    "id" TEXT NOT NULL,
    "siteSettingsId" TEXT NOT NULL,
    "type" "SocialMediaType" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettingsSocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsContact" (
    "id" TEXT NOT NULL,
    "siteSettingsId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettingsContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsAbout" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteSettingsId" TEXT NOT NULL,

    CONSTRAINT "SiteSettingsAbout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsPrivacyPolicy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteSettingsId" TEXT NOT NULL,

    CONSTRAINT "SiteSettingsPrivacyPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsTermsAndConditions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteSettingsId" TEXT NOT NULL,

    CONSTRAINT "SiteSettingsTermsAndConditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettingsRefundPolicy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "siteSettingsId" TEXT NOT NULL,

    CONSTRAINT "SiteSettingsRefundPolicy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListingBooking" ADD CONSTRAINT "ListingBooking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBooking" ADD CONSTRAINT "ListingBooking_listingRoomId_fkey" FOREIGN KEY ("listingRoomId") REFERENCES "ListingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBooking" ADD CONSTRAINT "ListingBooking_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBooking" ADD CONSTRAINT "ListingBooking_bookingUserId_fkey" FOREIGN KEY ("bookingUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBookingPayment" ADD CONSTRAINT "ListingBookingPayment_listingBookingId_fkey" FOREIGN KEY ("listingBookingId") REFERENCES "ListingBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingBookingPayment" ADD CONSTRAINT "ListingBookingPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsLogoToImage" ADD CONSTRAINT "SiteSettingsLogoToImage_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsLogoToImage" ADD CONSTRAINT "SiteSettingsLogoToImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsSocialMedia" ADD CONSTRAINT "SiteSettingsSocialMedia_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsContact" ADD CONSTRAINT "SiteSettingsContact_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsAbout" ADD CONSTRAINT "SiteSettingsAbout_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsPrivacyPolicy" ADD CONSTRAINT "SiteSettingsPrivacyPolicy_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsTermsAndConditions" ADD CONSTRAINT "SiteSettingsTermsAndConditions_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteSettingsRefundPolicy" ADD CONSTRAINT "SiteSettingsRefundPolicy_siteSettingsId_fkey" FOREIGN KEY ("siteSettingsId") REFERENCES "SiteSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
