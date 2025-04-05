import React from "react";
import { Button, ButtonProps } from "../button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

type IconButtonProps = {
  tooltipContent: string;
} & ButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltipContent, children, ...props }, ref) => {
    return (
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" {...props} ref={ref}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
