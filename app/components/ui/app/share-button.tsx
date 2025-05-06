import { tryCatch } from "~/utils/tryCatch";
import { Button } from "../button";
import { useToast } from "~/hooks/use-toast";

export function ShareButton() {
  const toast = useToast();

  const handleShare = async () => {
    console.log("handle shared");
    const { error } = await tryCatch(
      navigator.clipboard.writeText(window.location.href)
    );
    if (error) {
      toast.toast({
        description: "Couldn't add to clipboard",
        title: "Clipboard",
        variant: "destructive",
      });
      return;
    }
    toast.toast({ description: "Added to clipboard", title: "Clipboard" });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      Shared
    </Button>
  );
}
