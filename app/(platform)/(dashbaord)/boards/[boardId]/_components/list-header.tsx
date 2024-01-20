"use client"

import { TitleForm } from "@/components/form/title-form"
import { updateBoard } from "@/actions/update-board-action";

type ListHeaderProps = {
    id: string;
    title: string;
}
export const ListHeader = ({id,title}:ListHeaderProps) => {
  
    async function uptateListTitle(){
        // update list title
        try{
          const response = await updateBoard({ title, id });
          // show sonnar if there was an error
      }catch(e){
          console.log('there was an error...')
      }
    }
  return (
    <div>
        <TitleForm title={title} id={id} update={uptateListTitle}/>
    </div>
  )
}