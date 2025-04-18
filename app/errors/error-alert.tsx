import { AlertCircle } from "lucide-react";
import { ComponentProps, PropsWithChildren } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export function ErrorAlert({
  children,
  ...props
}: ComponentProps<typeof Alert>) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
