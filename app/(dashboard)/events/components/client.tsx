"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { EventColumn, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";

interface EventClientProps {
  data: EventColumn[];
}
const EventClient = ({ data }: EventClientProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Upcoming Event (${data.length})`}
          description="Manage Upcoming Events"
        />
        <Button onClick={() => router.push(`/events/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="title" />

      <div className="flex flex-col gap-y-4 mb-8">
        <Heading
          title="Add Event Content"
          description="Choose an upcoming event and add content for the event"
        />
        <Separator />

        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center gap-y-4 "
          >
            {item.title}

            <Button onClick={() => router.push(`/events/${item.id}/eventContent`)}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default EventClient;
