"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useParams } from "next/navigation";
import { EventContentType } from "./page";


const EditorComp = dynamic(() => import("./EditorComponent"), { ssr: false });

interface Props {
  eventContent : EventContentType[]
}

export default function EventContentClient(prop : Props) {
  const mdxEditorRef = React.useRef<MDXEditorMethods>(null);
  const params = useParams();

  // Ensure eventContent is an array and filter it
  var filteredEventContent = prop.eventContent.filter(
    (item) => item.eventId === params.eventId
  );


  return (
    <>
      <div className="m-4">


        <Suspense fallback={null}>
          <EditorComp
            initMarkdown={filteredEventContent[0]?.content ?? ""}
            editorRef={mdxEditorRef}
          />
        </Suspense>
      </div>
    </>
  );
}
