import { Boarding } from "@prisma/client";
import BoardingTableClient from "./BoardingTableClient";


type BoardingTableProps = {
  boardings: Boarding[];
};

export default function BoardingTable({ boardings }: BoardingTableProps) {
  return (
    <BoardingTableClient boardings={boardings}/>
  );
}
