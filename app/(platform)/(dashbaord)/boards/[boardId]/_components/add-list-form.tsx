"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createList } from "@/actions/create-list-action";

type AddListProps = {
  boardId: string;
};

export const AddListForm = ({ boardId }: AddListProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(formData: FormData) {
    // create list
    const title = formData.get("title") as string;
    const order = 0;
    try {
      const response = await createList({ title, boardId, order });
      console.log(response);
      formRef.current?.reset();
      // show sonnar if there was an error
    } catch (e) {
      console.log("there was an error...");
    }
  }

  if (isEditing) {
    return (
      <div className="shrink-0 w-[272px] rounded-md">
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <Input
            placeholder="Enter list title..."
            name="title"
            className="w-full h-10 text-black"
          />
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
      className="text-black shrink-0 w-[272px] h-[44px] bg-[#f1f2f4] hover:bg-[#f1f2f4]/70 shadow-md rounded-md flex justify-start"
    >
      <Plus className="ml-2" size={16} />
      <span>Add another list</span>
    </Button>
  );
};
