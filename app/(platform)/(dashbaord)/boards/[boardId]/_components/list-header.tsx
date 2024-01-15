"use client"

import { TitleForm } from "@/components/form/title-form"

type ListHeaderProps = {
    id: string;
    title: string;
}
export const ListHeader = ({id,title}:ListHeaderProps) => {
    function uptateListTitle(){
        // update list title
    }
  return (
    <div>
        <TitleForm id={id} update={uptateListTitle}/>
    </div>
  )
}