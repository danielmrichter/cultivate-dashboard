-- Database Name: 'cultivate'
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"access_level" int NOT NULL,
	"email" varchar(255) NOT NULL,
	"cell_phone" varchar NOT NULL,
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
	"temperature_time" timestamptz NOT NULL,
	"temperature" numeric NOT NULL,
	"piler_id" int NOT NULL,
	"beetbox_id" varchar(255) NOT NULL,
	"coordinates" varchar NOT NULL,
	"ticket_id" int NOT NULL,
	"updated_at" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "sites" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"site" varchar NOT NULL,
	"location" varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "pilers" (
	"id" serial NOT NULL UNIQUE,
	"site_id" int NOT NULL,
	"name" varchar NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "alerts" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"is_active" boolean NOT NULL DEFAULT true,
	"beet_data_id" int NOT NULL,
	"piler_id" int NOT NULL,
	"updated_at" timestamptz DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "users_sites" (
	"id" serial PRIMARY KEY NOT NULL UNIQUE,
	"users_id" int NOT NULL,
	"sites_id" int NOT NULL
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "beet_data"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "alerts"
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

ALTER TABLE "tickets" ADD CONSTRAINT "tickets_fk2" FOREIGN KEY ("grower_id") REFERENCES "growers"("id");

ALTER TABLE "beet_data" ADD CONSTRAINT "beet_data_fk3" FOREIGN KEY ("piler_id") REFERENCES "pilers"("id");

ALTER TABLE "beet_data" ADD CONSTRAINT "beet_data_fk6" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id");

ALTER TABLE "pilers" ADD CONSTRAINT "pilers_fk1" FOREIGN KEY ("site_id") REFERENCES "sites"("id");
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_fk2" FOREIGN KEY ("beet_data_id") REFERENCES "beet_data"("id");

ALTER TABLE "alerts" ADD CONSTRAINT "alerts_fk3" FOREIGN KEY ("piler_id") REFERENCES "pilers"("id");
ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_fk1" FOREIGN KEY ("users_id") REFERENCES "user"("id");

ALTER TABLE "users_sites" ADD CONSTRAINT "users_sites_fk2" FOREIGN KEY ("sites_id") REFERENCES "sites"("id");


-- Dummy Data for testing purposes
INSERT INTO "growers" ("name", "field", "email", "phone") VALUES
('John Smith', 'Sunny Acres', 'john.smith@example.com', '5555551234'),
('Jane Doe', 'Green Valley', 'jane.doe@example.com', '5555555678'),
('Emily Johnson', 'Red Barn Farm', 'emily.j@example.com', '5555558765'),
('Michael Brown', 'Harvest Moon Farm', 'michael.brown@example.com', '5555554321'),
('Sarah Wilson', 'Golden Fields', 'sarah.wilson@example.com', '5555551122'),
('David Miller', 'Happy Farm', 'david.miller@example.com', '5555553344'),
('Laura Garcia', 'Clover Hill', 'laura.garcia@example.com', '5555555566'),
('Chris Davis', 'Blue Sky Farms', 'chris.davis@example.com', '5555557788'),
('Jessica Martinez', 'Evergreen Pastures', 'jessica.m@example.com', '5555559900'),
('James Rodriguez', 'Maple Leaf Farm', 'james.rodriguez@example.com', '5555552233'),
('Patricia Lee', 'Sunset Grove', 'patricia.lee@example.com', '5555554455'),
('Robert Walker', 'Whispering Pines', 'robert.w@example.com', '5555556677'),
('Linda Hall', 'Moonlight Farm', 'linda.hall@example.com', '5555558899'),
('William Young', 'Starlight Fields', 'william.y@example.com', '5555551010'),
('Barbara Hernandez', 'Breezy Meadows', 'barbara.h@example.com', '5555552020'),
('Joseph King', 'Orchard Hill', 'joseph.king@example.com', '5555553030'),
('Susan Wright', 'Pine Valley', 'susan.wright@example.com', '5555554040'),
('Charles Lopez', 'Field of Dreams', 'charles.l@example.com', '5555555050'),
('Angela Hill', 'Riverbend Farm', 'angela.hill@example.com', '5555566060'),
('Matthew Scott', 'Cedar Grove', 'matthew.scott@example.com', '5555557070'),
('Dorothy Green', 'Forest Edge', 'dorothy.green@example.com', '5555558080'),
('Steven Adams', 'Twin Oaks Farm', 'steven.a@example.com', '5555559090'),
('Sarah Baker', 'Hilltop Haven', 'sarah.baker@example.com', '5555551111'),
('Kevin Nelson', 'Country Lane', 'kevin.nelson@example.com', '5555552222'),
('Nancy Carter', 'Silver Creek', 'nancy.carter@example.com', '5555553333'),
('Thomas Mitchell', 'Prairie View', 'thomas.mitchell@example.com', '5555554444'),
('Karen Perez', 'Riverside Farm', 'karen.perez@example.com', '5555555555'),
('Daniel Roberts', 'Wildflower Farm', 'daniel.r@example.com', '5555556666'),
('Lisa Turner', 'Fieldstone Farm', 'lisa.turner@example.com', '5555557777'),
('Mark Phillips', 'Sunnyhill Farm', 'mark.phillips@example.com', '5555558888'),
('Jennifer Campbell', 'Horizon Farms', 'jennifer.campbell@example.com', '5555559999'),
('Paul Parker', 'Aspen Ridge', 'paul.parker@example.com', '5555551230'),
('Betty Edwards', 'Oakwood Farm', 'betty.edwards@example.com', '5555554560');


INSERT INTO "sites" ("site", "location") VALUES 
('Factory', '123 Industrial Way, Springfield, IL'),
('Tyler', '456 Maple St, Austin, TX'),
('Warehouse A', '789 Commerce Blvd, New York, NY'),
('Office HQ', '321 Corporate Dr, Seattle, WA'),
('Distribution Center', '654 Warehouse Rd, Chicago, IL'),
('Research Lab', '987 Innovation Ln, San Francisco, CA'),
('Showroom', '135 Display Ave, Miami, FL'),
('Plant B', '246 Factory Rd, Atlanta, GA'),
('Service Center', '357 Support St, Denver, CO'),
('Branch C', '864 Branch St, Boston, MA');

INSERT INTO "pilers" ("site_id", "name") VALUES 
(1, 'Factory 1'),
(1, 'Factory 2'),
(1, 'Factory 3'),
(2, 'Tyler 1'),
(2, 'Tyler 2'),
(3, 'Warehouse A 1'),
(3, 'Warehouse A 2'),
(3, 'Warehouse A 3'),
(3, 'Warehouse A 4'),
(4, 'Office HQ 1'),
(4, 'Office HQ 2'),
(5, 'Distribution Center 1'),
(5, 'Distribution Center 2'),
(5, 'Distribution Center 3'),
(5, 'Distribution Center 4'),
(5, 'Distribution Center 5'),
(6, 'Research Lab 1'),
(7, 'Showroom 1'),
(7, 'Showroom 2'),
(8, 'Plant B 1'),
(8, 'Plant B 2'),
(9, 'Service Center 1'),
(9, 'Service Center 2'),
(9, 'Service Center 3'),
(10, 'Branch C 1');

INSERT INTO "tickets" ("ticket_number", "grower_id", "truck") VALUES
(30005, 5, 1024),
(30006, 12, 1050),
(30007, 8, 1098),
(30008, 15, 1102),
(30009, 1, 1065),
(30010, 3, 1043),
(30011, 20, 1081),
(30012, 10, 1077),
(30013, 18, 1045),
(30014, 9, 1039),
(30015, 25, 1089),
(30016, 22, 1073),
(30017, 11, 1107),
(30018, 30, 1090),
(30019, 17, 1046),
(30020, 6, 1084),
(30021, 14, 1029),
(30022, 4, 1072),
(30023, 33, 1095),
(30024, 16, 1044),
(30025, 2, 1069),
(30026, 27, 1087),
(30027, 21, 1037),
(30028, 19, 1099),
(30029, 13, 1057),
(30030, 31, 1061),
(30031, 29, 1031),
(30032, 26, 1105),
(30033, 7, 1022),
(30034, 24, 1070),
(30035, 32, 1088),
(30036, 23, 1103),
(30037, 28, 1035),
(30038, 1, 1028),
(30039, 9, 1042),
(30040, 11, 1064),
(30041, 5, 1076),
(30042, 12, 1085),
(30043, 3, 1106),
(30044, 15, 1097);