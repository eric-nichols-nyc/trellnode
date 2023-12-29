import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
  } from "@/components/ui/popover";

  type FormPopoverProps = {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
  };

  export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
  }: FormPopoverProps) => {  
    
    return (
    <Popover>
     <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
    </Popover>
  )
}