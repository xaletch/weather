-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION,
    "code" INTEGER,
    "wind_speed" DOUBLE PRECISION,
    "raw_data" JSONB,
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "error_message" TEXT,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "weather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_lat_lng_key" ON "cities"("name", "lat", "lng");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_city_id_key" ON "favorites"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "weather_city_id_key" ON "weather"("city_id");

-- CreateIndex
CREATE INDEX "weather_city_id_fetched_at_idx" ON "weather"("city_id", "fetched_at" DESC);

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather" ADD CONSTRAINT "weather_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
