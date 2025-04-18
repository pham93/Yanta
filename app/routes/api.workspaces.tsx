import { ActionFunctionArgs } from "@remix-run/node";
import { db } from "~/db/db.server";
import { workspaceInsertSchema, workspaces } from "~/db/schema";
import { validate } from "~/utils/validate";

export async function action({ request }: ActionFunctionArgs) {
  const payload = await validate(request, workspaceInsertSchema);

  switch (request.method) {
    case "PUT": {
      await db.update(workspaces).set({ ...payload });
    }
  }
}
