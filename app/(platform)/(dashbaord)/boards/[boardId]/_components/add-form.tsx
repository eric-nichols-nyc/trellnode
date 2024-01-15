"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

const initialState = {
  boardId: "659b4891337d54fd01558629",
  order: 0,
  title: "Title",
};

type CardData = {
  title: string;
  id?: string;
  order: number;
};

type AddFormProps = {
  btnText: string;
  action: (formData: FormData) => void;
};

export const AddForm = ({ action, btnText }: AddFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  function onSubmit(formData: FormData) {
    // create list
    action(formData as unknown as FormData);
  }

  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <div className="shrink-0 w-[272px] rounded-md">
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <Input placeholder="Enter list title..." className="w-full h-10 text-black" id="title" name="title"/>
          <div className="flex gap-2 justify-center items-center">
            <Button className="w-full h-10 bg-[#5aac44] text-white rounded-md">
              Add List
            </Button>
            <X
              className="cursor-pointer"
              color="#5e6c84"
              onClick={() => setIsEditing(false)}
            />
          </div>
        </form>
      </div>
    );
  }
  return (
    <Button
      onClick={() => setIsEditing(true)}
      className="text-black shrink-0 w-[272px] h-[44px] bg-[#f1f2f4] shadow-md rounded-md flex justify-start"
    >
      <Plus className="ml-2" size={16} />
      <span>{btnText}</span>
    </Button>
  );
};
