"use client"
import { Card } from '@prisma/client'
import React from 'react'


type ListCardProps = {
  card: Card
}

export const ListCard = ({card}:ListCardProps) => {
  const {title} = card;
  return (
    <li className="truncate cursor-pointer border-2 border-transparent hover:border-black py-2 px-3 mb-2 text-sm bg-white rounded-md shadow-sm">
      {title}
    </li>
  )
}

