import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const { userId } = auth();

        const body = await req.json();

        const { content, eventId } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!content) {
            return new NextResponse("Content is required", { status: 400 });
        }

        if (!eventId) {
            return new NextResponse("EventId is required", { status: 400 });
        }

        const eventContent = await prismadb.eventContent.create({
            data: {
              content,
              eventId,
              // Add additional fields if needed, like timestamps
            },
          }).then(async (content)=>
                await prismadb.event.update({
                    where: { id: eventId },
                    data: {
                        eventContentId: content.id, 
                    },
                  })
          );

      
      
          return NextResponse.json(eventContent);

    } catch (error) {
        console.log('[EVENTCONTENT_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
      const { userId } = auth();
     
      const body = await req.json();

      const { content, eventId } = body;
  
      // Validate authentication
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
  
      // Validate eventId
      if (!eventId) {
        return new NextResponse("EventId is required", { status: 400 });
      }
  
      // Fetch the existing event content
      const existingEventContent = await prismadb.eventContent.findUnique({
        where: { eventId },
      });
  
      if (!existingEventContent) {
        return new NextResponse("Event content not found", { status: 404 });
      }
  
      // Update event content
      const updatedEventContent = await prismadb.eventContent.update({
        where: { eventId },
        data: {
          content: content ?? existingEventContent.content, // Update content if provided
          // Add additional fields to update if needed
        },
      }).then(async (content)=>
        await prismadb.event.update({
            where: { id: eventId },
            data: {
                eventContentId: content.id, 
            },
          })
  );

  
      return NextResponse.json(updatedEventContent);
  
    } catch (error) {
      console.log('[EVENTCONTENT_PATCH]', error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }


export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
        return new NextResponse("EventId is required", { status: 400 });
    }

    try {
        const contents = await prismadb.eventContent.findUnique({
            where: {
                id: id, // Ensure this matches your Prisma schema
            }
        });

        if (!contents) {
            return new NextResponse("Content not found", { status: 404 });
        }

        return NextResponse.json(contents, { headers: corsHeaders });

    } catch (error) {
        console.log('[CONTENT_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
