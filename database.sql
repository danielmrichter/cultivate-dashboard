-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"access_level" int NOT NULL,
	"email" varchar(255) NOT NULL,
	"cell_phone" int NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "tickets" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"ticket_number" int NOT NULL,
	"grower_id" int NOT NULL,
	"truck" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "growers" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"name" varchar(255) NOT NULL,
	"field" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "beet_data" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"temperature_time" timestamp with time zone NOT NULL,
	"temperature" int NOT NULL,
	"piler_id" int NOT NULL,
	"beetbox_id" varchar(255) NOT NULL,
	"coordinates" POINT NOT NULL,
	"ticket_id" int NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "sites" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"site" int NOT NULL,
	"location" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "pilers" (
	"id" serial NOT NULL UNIQUE,
	"site_id" int NOT NULL,
	"name" varchar NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "alerts" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"is_active" boolean NOT NULL,
	"beet_data_id" int NOT NULL,
	"site_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "users_sites" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"users_id" int NOT NULL,
	"sites_id" int NOT NULL
);


ALTER TABLE "tickets" ADD CONSTRAINT "tickets_fk2" FOREIGN KEY ("grower_id") REFERENCES "growers"("id");

ALTER TABLE "beet_data" ADD CONSTRAINT "beet_data_fk3" FOREIGN KEY ("piler_id") REFERENCES "pilers"("id");

ALTER TABLE "beet_data" ADD CONSTRAINT "beet_data_fk6" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");

ALTER TABLE "pilers" ADD CONSTRAINT "pilers_fk1" FOREIGN KEY ("site_id") REFERENCES "sites"("id");
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_fk2" FOREIGN KEY ("beet_data_id") REFERENCES "beet_data"("id");

ALTER TABLE "alerts" ADD CONSTRAINT "alerts_fk3" FOREIGN KEY ("site_id") REFERENCES "sites"("id");
ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_fk1" FOREIGN KEY ("users_id") REFERENCES "user"("id");

ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_fk2" FOREIGN KEY ("sites_id") REFERENCES "sites"("id");