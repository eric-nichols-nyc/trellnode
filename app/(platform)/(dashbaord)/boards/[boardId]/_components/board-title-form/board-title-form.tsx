import { Button } from "@/components/ui/button";
import { ElementRef, useRef, useState } from "react";
import { updateBoard } from "@/actions/update-board-action";

type BoardTitleFormProps = {
  title: string;
  id: string;
};

/**
 *
 * create refs
 * add state for title change and isEditagle
 * call submit
 * @returns
 */
export const BoardTitleForm = ({ title, id }: BoardTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const onSubmit = async(formData: FormData) => {
    setIsEditing(false);
    const title = formData.get("title") as string;
    try{
        const response = await updateBoard({ title, id });
        // show sonnar if there was an error
    }catch(e){
        console.log('there was an error...')
    }

  };
  // focus input
  // submit if name has changes
  const handleOnBlur = () => {
    if (inputRef.current?.value !== title) {
      formRef.current?.requestSubmit();
    }
  };

  const enableEditing = () => {
    // setIsEditing(true);
    // setTimeout(() => {
    //   inputRef.current?.focus();
    //   inputRef.current?.select();
    // });
  };

  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef}>
        <input
          ref={inputRef}
          onBlur={handleOnBlur}
          defaultValue={title}
          name="title"
        />
      </form>
    );
  }
  return (
    <Button onClick={enableEditing} variant="ghost" className="text-bold text-lg">
      {title}
    </Button>
  );
};
