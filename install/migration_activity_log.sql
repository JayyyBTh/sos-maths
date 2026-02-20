CREATE SEQUENCE activity_log_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1;
CREATE TABLE "public"."activity_log" (
    "id"         bigint DEFAULT nextval('activity_log_id_seq') NOT NULL,
    "event_type" character varying(32)  NOT NULL,
    "user_id"    integer                NULL,
    "details"    character varying(256) NULL,
    "created_at" bigint                 NOT NULL,
    CONSTRAINT "activity_log_id_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "activity_log_event_type" ON "public"."activity_log" USING btree ("event_type");
CREATE INDEX "activity_log_created_at" ON "public"."activity_log" USING btree ("created_at");
