import React from "react";
import EventContentClient from "./client";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

export type EventContentType = {
  id: string;
  content: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
};


const EventContent = async () => {
  const eventcontent = await prismadb.eventContent.findMany();


  const formattedEventContents: EventContentType[] = eventcontent.map((item) => ({
    id: item.id,
    eventId: item.eventId,
    content: item.content,
    createdAt: format(
      item.createdAt,
      "MMMM do, yyyy 'at' h:mm a"
    ),
    updatedAt: format(
      item.updatedAt,
      "MMMM do, yyyy 'at' h:mm a"
    ),
}))

  return (
    <div>
      <EventContentClient eventContent={formattedEventContents} />
    </div>
  );
};

export default EventContent;
