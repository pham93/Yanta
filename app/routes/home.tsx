import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { db } from "~/db/db.server";
import { workspaces } from "~/db/schema";
import { actionResponse } from "~/utils/actionResponse";
import { tryCatch } from "~/utils/tryCatch";

export function headers() {
  return {
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
}

export async function loader() {
  const { result } = await tryCatch(
    db.select().from(workspaces).where(eq(workspaces.userId, "John Doe"))
  );
  return actionResponse({ data: result });
}
export default function Home() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <>
      {data?.map((e) => (
        <Link key={e.id} to={`/${e.id}/gg`}>
          {e.name}
        </Link>
      ))}
    </>
  );
}
