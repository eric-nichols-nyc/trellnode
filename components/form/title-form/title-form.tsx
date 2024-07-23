"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ElementRef, useRef, useState } from "react";
import { updateBoard } from "@/actions/update-board-action";

type TitleFormProps = {
  title: string;
  id: string;
  update: (id:string, title:string) => void
};

/**
 *
 * create refs
 * add state for title change and isEditagle
 * call submit
 * @returns
 */
export const TitleForm = ({ title, id, update }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const onSubmit = async(formData: FormData) => {
    setIsEditing(false);
    const title = formData.get("title") as string;
    update(id, title)
  };
  // focus input
  // submit if name has changes
  const handleOnBlur = () => {
    if (inputRef.current?.value !== title) {
      formRef.current?.requestSubmit();
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef}>
        <Input
        className="text-black"
          ref={inputRef}
          onBlur={handleOnBlur}
          defaultValue={title}
          name="title"
        />
      </form>
    );
  }
  return (
    <Button 
    className="h-[44px] text-sm"
    onClick={enableEditing} variant="secondary">
      {title}
    </Button>
  );
};
