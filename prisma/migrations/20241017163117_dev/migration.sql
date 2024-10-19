-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('Stay', 'Experience', 'Event', 'Activity', 'Restaurant', 'Hotel', 'Other');

-- CreateEnum
CREATE TYPE "VisibilityStatus" AS ENUM ('Active', 'Inactive', 'Redacted');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('One', 'Two', 'Three', 'Four', 'Five');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('Bedroom', 'Bathroom', 'LivingRoom', 'Kitchen', 'Studio', 'Other');

-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('Single', 'Double', 'Queen', 'King', 'Other');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired', 'Completed', 'UnderReview');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled', 'Expired', 'Completed', 'UnderReview');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('Listing', 'ListingApplication', 'User', 'ListingRoom', 'ListingRoomToListingReservation', 'ListingToListingReservation', 'ListingReservation', 'ListingReservationByUser', 'ListingReservationLog', 'ListingToAmenity', 'ListingApplicationToAmenity', 'ListingApplicationToLocation', 'ListingApplicationToCategory', 'ListingApplicationToRoom', 'ListingApplicationToBankDetails', 'ListingApplicationChangeLog', 'ListingApplicationApproval', 'Bank', 'BankDetails', 'UserSettings', 'UserBankDetails', 'VerificationToken', 'ResetPasswordToken', 'TwoFactorToken', 'TwoFactorConfirmation', 'Account', 'Ownership');

-- CreateEnum
CREATE TYPE "ImageOrientation" AS ENUM ('Landscape', 'Portrait', 'Square', 'Round');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'User',
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetPasswordToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResetPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorConfirmation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ListingCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingToCategory" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ListingToCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" TEXT,
    "lng" TEXT,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingToLocation" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "ListingToLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ownership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Ownership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "rating" "Rating" NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewToListing" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "ReviewToListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingRoom" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "size" TEXT,
    "capacity" INTEGER,
    "bedType" "BedType" DEFAULT 'Single',
    "roomType" "RoomType" DEFAULT 'Bedroom',
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingToRoom" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ListingToRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingToAmenity" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ListingToAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankId" TEXT NOT NULL,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetailsToListing" (
    "id" TEXT NOT NULL,
    "bankDetailsId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "BankDetailsToListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBankDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankDetailsId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "UserBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isEmailNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isSmsNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "twoFactorRecoveryCodes" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "isAddressVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBankDetailsVerified" BOOLEAN NOT NULL DEFAULT false,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Inactive',

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationToRoom" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationToRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationToAmenity" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationToAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationToLocation" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationToLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationToCategory" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationToCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationOwnership" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationToBankDetails" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "bankDetailsId" TEXT NOT NULL,

    CONSTRAINT "ListingApplicationToBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationChangeLog" (
    "id" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingApplicationChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingApplicationApproval" (
    "id" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL,
    "approvalDate" TIMESTAMP(3) NOT NULL,
    "approvalByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingApplicationApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingReservation" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numberOfGuests" INTEGER,
    "numberOfNights" INTEGER,
    "totalPrice" DECIMAL(65,30),
    "status" "ReservationStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingToListingReservation" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingReservationId" TEXT NOT NULL,

    CONSTRAINT "ListingToListingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingReservationByUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingReservationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingReservationByUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingRoomToListingReservation" (
    "id" TEXT NOT NULL,
    "listingRoomId" TEXT NOT NULL,
    "listingReservationId" TEXT NOT NULL,

    CONSTRAINT "ListingRoomToListingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingReservationLog" (
    "id" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listingReservationId" TEXT NOT NULL,

    CONSTRAINT "ListingReservationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ImageType",
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "resolution" TEXT,
    "dpi" INTEGER,
    "alt" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "orientation" "ImageOrientation",
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageToListing" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ImageToListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageToListingReservation" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "listingReservationId" TEXT NOT NULL,

    CONSTRAINT "ImageToListingReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageToListingRoom" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "listingRoomId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ImageToListingRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageToListingApplication" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "listingApplicationId" TEXT NOT NULL,
    "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "ImageToListingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_token_key" ON "ResetPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordToken_email_token_key" ON "ResetPasswordToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_token_key" ON "TwoFactorToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_email_token_key" ON "TwoFactorToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorConfirmation_userId_key" ON "TwoFactorConfirmation"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToCategory" ADD CONSTRAINT "ListingToCategory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToCategory" ADD CONSTRAINT "ListingToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ListingCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToLocation" ADD CONSTRAINT "ListingToLocation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToLocation" ADD CONSTRAINT "ListingToLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ownership" ADD CONSTRAINT "Ownership_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewToListing" ADD CONSTRAINT "ReviewToListing_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewToListing" ADD CONSTRAINT "ReviewToListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToRoom" ADD CONSTRAINT "ListingToRoom_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToRoom" ADD CONSTRAINT "ListingToRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ListingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToAmenity" ADD CONSTRAINT "ListingToAmenity_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToAmenity" ADD CONSTRAINT "ListingToAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetailsToListing" ADD CONSTRAINT "BankDetailsToListing_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetailsToListing" ADD CONSTRAINT "BankDetailsToListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBankDetails" ADD CONSTRAINT "UserBankDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBankDetails" ADD CONSTRAINT "UserBankDetails_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToRoom" ADD CONSTRAINT "ListingApplicationToRoom_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToRoom" ADD CONSTRAINT "ListingApplicationToRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ListingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToAmenity" ADD CONSTRAINT "ListingApplicationToAmenity_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToAmenity" ADD CONSTRAINT "ListingApplicationToAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToLocation" ADD CONSTRAINT "ListingApplicationToLocation_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToLocation" ADD CONSTRAINT "ListingApplicationToLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToCategory" ADD CONSTRAINT "ListingApplicationToCategory_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToCategory" ADD CONSTRAINT "ListingApplicationToCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ListingCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationOwnership" ADD CONSTRAINT "ListingApplicationOwnership_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationOwnership" ADD CONSTRAINT "ListingApplicationOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToBankDetails" ADD CONSTRAINT "ListingApplicationToBankDetails_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationToBankDetails" ADD CONSTRAINT "ListingApplicationToBankDetails_bankDetailsId_fkey" FOREIGN KEY ("bankDetailsId") REFERENCES "BankDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationChangeLog" ADD CONSTRAINT "ListingApplicationChangeLog_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationChangeLog" ADD CONSTRAINT "ListingApplicationChangeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationApproval" ADD CONSTRAINT "ListingApplicationApproval_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingApplicationApproval" ADD CONSTRAINT "ListingApplicationApproval_approvalByUserId_fkey" FOREIGN KEY ("approvalByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToListingReservation" ADD CONSTRAINT "ListingToListingReservation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingToListingReservation" ADD CONSTRAINT "ListingToListingReservation_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReservationByUser" ADD CONSTRAINT "ListingReservationByUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReservationByUser" ADD CONSTRAINT "ListingReservationByUser_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRoomToListingReservation" ADD CONSTRAINT "ListingRoomToListingReservation_listingRoomId_fkey" FOREIGN KEY ("listingRoomId") REFERENCES "ListingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRoomToListingReservation" ADD CONSTRAINT "ListingRoomToListingReservation_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReservationLog" ADD CONSTRAINT "ListingReservationLog_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListing" ADD CONSTRAINT "ImageToListing_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListing" ADD CONSTRAINT "ImageToListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingReservation" ADD CONSTRAINT "ImageToListingReservation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingReservation" ADD CONSTRAINT "ImageToListingReservation_listingReservationId_fkey" FOREIGN KEY ("listingReservationId") REFERENCES "ListingReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingRoom" ADD CONSTRAINT "ImageToListingRoom_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingRoom" ADD CONSTRAINT "ImageToListingRoom_listingRoomId_fkey" FOREIGN KEY ("listingRoomId") REFERENCES "ListingRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingApplication" ADD CONSTRAINT "ImageToListingApplication_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageToListingApplication" ADD CONSTRAINT "ImageToListingApplication_listingApplicationId_fkey" FOREIGN KEY ("listingApplicationId") REFERENCES "ListingApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
