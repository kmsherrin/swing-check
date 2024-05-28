import { runMigration } from "@/drizzleMigrationRunner";

export async function GET(request: Request) {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
    await runMigration();
    return new Response("Migration complete");
  } else {
    return new Response("Not allowed", { status: 403 });
  }
}
