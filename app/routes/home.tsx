import { ActionFunctionArgs } from "@remix-run/node";
import { Await, Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { ChevronDown, Clock2, Folder, Plus, Smile } from "lucide-react";
import { FormEventHandler, PropsWithChildren, Suspense } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import DynamicIcon from "~/components/ui/dynamic-icon";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { db } from "~/db/db.server";
import { workspaces } from "~/db/schema";
import { Workspace, workspaceInsertSchema } from "~/schemas/workspace.schema";
import { createWorkspace } from "~/services/workspace.service";
import { actionResponse } from "~/utils/actionResponse";
import { validate } from "~/utils/validate";

export function headers() {
  return {
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
}

export async function loader() {
  const data$ = db
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, "John Doe"))
    .then((e) => e);
  return actionResponse({ data: data$ as Promise<Workspace[]> });
}

export async function action({ request }: ActionFunctionArgs) {
  const workspace = await validate(request, workspaceInsertSchema);
  await createWorkspace(workspace);
  return true;
}

function WorkspaceCard({
  workspace,
  ...props
}: React.ComponentProps<typeof Card> & { workspace: Workspace }) {
  return (
    <Card className="aspect-square relative" {...props}>
      <CardHeader>
        <CardTitle className="cursor-pointer">
          <Link to={`/${workspace.id}`} prefetch="intent">
            {workspace.name}
          </Link>
        </CardTitle>
        <CardDescription>{workspace.createdBy} </CardDescription>
      </CardHeader>
      <CardFooter>
        <CardDescription>{workspace.createdAt.toString()}</CardDescription>
      </CardFooter>
    </Card>
  );
}

function AskSection() {
  return (
    <section>
      <div className="bg-background border rounded-md w-full h-90 p-4 ">
        <Input
          className="ring-0 border-none bg-secondary focus-visible:ring-0 mb-10"
          placeholder="Ask something"
        />
        <section className="flex justify-between">
          <div className="flex">
            <Button variant={"secondary"} size="sm" className="rounded-r-none">
              Ask
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"secondary"}
                  size="sm"
                  className="rounded-l-none w-3"
                >
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Hello world</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <DropdownMenu>Ask</DropdownMenu>
          </div>
        </section>
      </div>
    </section>
  );
}

function AddWorkspaceDialog({ children }: PropsWithChildren) {
  const submit = useSubmit();
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("userId", "John Doe");
    formData.append("createdBy", "John Doe");

    submit(formData, {
      method: "POST",
      action: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Workspace</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <form onSubmit={handleSubmit} method="post" action="/home">
            <Input name="name" placeholder="Workspace name" />
            <DialogFooter className="mt-4">
              <Button type="submit" variant={"ghost"}>
                Go
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function WorkspacesSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, idx) => (
        <CarouselItem key={idx} className="basis-1/4">
          <Skeleton className="aspect-square animate-pulse"></Skeleton>
        </CarouselItem>
      ))}
    </>
  );
}

export default function Home() {
  const { data: data$ } = useLoaderData<typeof loader>();

  return (
    <div className="w-[80%] m-auto h-full flex flex-col gap-2 pt-8">
      <h1 className="self-center py-8 font-bold text-2xl">
        Hello, John Doe
        <Smile className="inline ml-4" />
      </h1>
      <AskSection />
      <span className="text-sm text-muted-foreground pl-2 flex justify-start items-center">
        <Folder className="inline mr-2 h-4 w-4 text-sm my-2" />
        Workspaces
        <AddWorkspaceDialog>
          <Button className="ml-2 h-6" variant={"secondary"} size={"sm"}>
            Add
            <Plus className="w-2 h-2 text-xs" />
          </Button>
        </AddWorkspaceDialog>
      </span>
      <Carousel opts={{ loop: true, align: "start" }}>
        <CarouselContent className="-ml-4 flex">
          <Suspense fallback={<WorkspacesSkeleton />}>
            <Await resolve={data$}>
              {(data) =>
                data &&
                data.map((workspace, idx) => (
                  <CarouselItem className="basis-1/4" key={idx}>
                    <WorkspaceCard workspace={workspace} />
                  </CarouselItem>
                ))
              }
            </Await>
          </Suspense>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <span className="text-sm text-muted-foreground pl-2">
        <Clock2 className="inline mr-2 h-4 w-4 text-sm my-2" />
        Recently visited
      </span>
      <Carousel>
        <CarouselContent className="-ml-4 flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/6">
              <Card className="aspect-square relative">
                <div className="absolute top-[20%] left-[10%] p-2 bg-primary-foreground rounded-full">
                  <DynamicIcon name="Folder" className="w-4 h-4" />
                </div>
                <div className="h-[30%] bg-slate-500 rounded-t-md"></div>
                <CardHeader>
                  <CardTitle>
                    <Link
                      to="/42d11768-db8b-4774-b481-b3be01ab7be7/5e4b07fd-063f-4468-981c-ec58a4a7536c"
                      prefetch="intent"
                    >
                      page
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  <CardDescription>Last</CardDescription>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
