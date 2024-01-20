import { Card, List } from "@prisma/client";

export type ListWithCards = List & { cards: Card[], onCommit?: (list: List) => void };

export type CardWithList = Card & { list: List };