"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Plus, X } from "lucide-react";

type AddFormProps = {
  btnText: string;
  placeholder?: string;
  submitTxt?: string;
  action: (formData: FormData) => void;
};

export const AddForm = ({ action, btnText, placeholder, submitTxt }: AddFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
    formRef.current?.reset();
    setIsEditing(false);
  }

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="shrink-0 w-[272px] rounded-md">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <Input placeholder={placeholder} className="w-full h-10 text-black" id="title" name="title"/>
          <div className="flex gap-2 justify-center items-center">
            <Button className="w-full h-10 bg-[#5aac44] text-white rounded-md">
              {submitTxt}
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
      className="text-black shrink-0 w-[272px] h-[44px] bg-[#f1f2f4] hover:bg-[rgba(0,0,0,.1)] flex justify-start gap-2"
    >
      <Plus className="ml-2" size={16} />
      <span>{btnText}</span>
    </Button>
  );
};
