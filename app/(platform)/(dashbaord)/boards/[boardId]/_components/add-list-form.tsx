"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, X } from "lucide-react";

export const AddListForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <div className="shrink-0 w-[272px] text-white rounded-md">
        <form className="w-full p-3 rounded-md bg-white space-y-4 shadow-md">
         <Input placeholder="Enter list title..." className="w-full h-10" />
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
      className="text-black shrink-0 w-[272px] h-[30px] bg-[#f1f2f4] shadow-md rounded-md flex justify-start">
            <Plus className="ml-2" size={16} />
            <span>Add another list</span>
      </Button>
  );
};
