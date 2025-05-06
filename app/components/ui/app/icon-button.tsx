import React from "react";
import { Button, ButtonProps } from "../button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";
import { TooltipContentProps, TooltipProps } from "@radix-ui/react-tooltip";

type IconButtonProps = {
  tooltipContent: string;
  tooltipContentProps?: TooltipContentProps;
  tooltipProps?: TooltipProps;
} & ButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { tooltipContent, tooltipContentProps, tooltipProps, children, ...props },
    ref
  ) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={250} {...tooltipProps}>
          <TooltipTrigger asChild>
            <Button size="sm" variant="ghost" {...props} ref={ref}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent {...tooltipContentProps}>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
