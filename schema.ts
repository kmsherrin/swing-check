import { relations, sql } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  jsonb,
  index,
  uuid,
  unique,
  numeric,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const users = pgTable(
  "user",
  {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  },
  (table) => {
    return {
      emailIndex: index("email_index").on(table.email),
    };
  }
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const videoUpload = pgTable(
  "video_upload",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    guestUserId: uuid("guestUserId"),
    userId: text("userId").references(() => users.id, {
      onDelete: "no action",
    }),
    videoPath: text("videoPath").notNull(),
    userEnteredVideoName: text("userEnteredVideoName"),
    originalVideoName: text("originalVideoName").notNull(),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => {
    return {
      userIdVideoIdx: index("user_id_video_index").on(table.userId),
    };
  }
);

export const videoFrames = pgTable(
  "video_frames",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    videoId: uuid("videoId")
      .notNull()
      .references(() => videoUpload.id, { onDelete: "cascade" }),
    framePaths: jsonb("framePaths").notNull().default([]),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => {
    return {
      videoFramesIdIdx: index("video_id_frames_index").on(table.videoId),
    };
  }
);

export const analysisOutput = pgTable(
  "analysis_output",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    videoId: uuid("videoId")
      .notNull()
      .references(() => videoUpload.id, { onDelete: "cascade" }),
    output: jsonb("output").notNull().default({}),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("createdAt", { mode: "date", withTimezone: true })
      .notNull()
      .default(sql`now()`),
    modifiedAt: timestamp("modifiedAt", { mode: "date", withTimezone: true }),
  },
  (table) => {
    return {
      videoAnalysissIdIdx: index("video_id_analysis_index").on(table.videoId),
    };
  }
);

export const userMetadata = pgTable(
  "user_metadata",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    credits: numeric("credits").notNull().default("0"),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => {
    return {
      userIdMetadataIdx: index("user_id_metadata_index").on(table.userId),
    };
  }
);
