-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SearchMode" AS ENUM ('MARKET', 'CUSTOM_URL');

-- CreateEnum
CREATE TYPE "ListingProvider" AS ENUM ('REALTOR_CA', 'REALTOR_COM', 'ZILLOW');

-- CreateEnum
CREATE TYPE "EmailVerificationStatus" AS ENUM ('UNKNOWN', 'VERIFIED', 'RISKY', 'INVALID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Market" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "provider" "ListingProvider" NOT NULL,
    "startUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentFinderJob" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "mode" "SearchMode" NOT NULL,
    "provider" "ListingProvider" NOT NULL,
    "marketId" TEXT,
    "countryCode" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "customStartUrl" TEXT,
    "maxListings" INTEGER NOT NULL DEFAULT 10,
    "requestPayload" JSONB,
    "resultSummary" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentFinderJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLead" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "provider" "ListingProvider" NOT NULL,
    "providerListingId" TEXT,
    "listingUrl" TEXT,
    "listingAddress" TEXT,
    "listingPrice" TEXT,
    "rawListing" JSONB,
    "agentName" TEXT NOT NULL,
    "normalizedAgentName" TEXT NOT NULL,
    "brokerageName" TEXT,
    "normalizedBrokerageName" TEXT,
    "phone" TEXT,
    "phoneSource" TEXT,
    "agentWebsite" TEXT,
    "brokerageWebsite" TEXT,
    "email" TEXT,
    "emailSource" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationStatus" "EmailVerificationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "sourceSummary" JSONB,
    "enrichmentLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "Market_countryCode_regionCode_city_idx" ON "Market"("countryCode", "regionCode", "city");

-- CreateIndex
CREATE UNIQUE INDEX "Market_countryCode_regionCode_city_provider_key" ON "Market"("countryCode", "regionCode", "city", "provider");

-- CreateIndex
CREATE INDEX "AgentFinderJob_status_createdAt_idx" ON "AgentFinderJob"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AgentLead_jobId_rank_idx" ON "AgentLead"("jobId", "rank");

-- CreateIndex
CREATE INDEX "AgentLead_normalizedAgentName_normalizedBrokerageName_idx" ON "AgentLead"("normalizedAgentName", "normalizedBrokerageName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentFinderJob" ADD CONSTRAINT "AgentFinderJob_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLead" ADD CONSTRAINT "AgentLead_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "AgentFinderJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
