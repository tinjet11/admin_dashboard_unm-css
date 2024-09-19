"use client";

import {
  BoldItalicUnderlineToggles,
  InsertTable,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  toolbarPlugin,
  tablePlugin,
  BlockTypeSelect,
  InsertImage,
  imagePlugin,
  listsPlugin,
  ListsToggle,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  linkDialogPlugin,
  linkPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  CreateLink,
  type MDXEditorMethods,
  type MDXEditorProps,
  InsertCodeBlock,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import React, { FC, useRef } from "react";
import "@mdxeditor/editor/style.css";
import LoadingScreen from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
interface EditorProps {
  initMarkdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor: FC<EditorProps> = ({ initMarkdown, editorRef }) => {
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("file", image);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      throw new Error("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not defined");
    }
    // Show loading screen
    if (loadingScreenRef.current) {
      loadingScreenRef.current.classList.remove("hidden");
    }

    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      if (response.ok) {
        console.log(json);
        return json.uploadedImageData.secure_url; // Return the URL of the uploaded image
      } else {
        throw new Error(json.error || "Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (loadingScreenRef.current) {
        loadingScreenRef.current.classList.add("hidden");
      }
    }
  }
  const params = useParams();
  const router = useRouter();

  const title = initMarkdown ? "Edit Event Content" : "Add Event Content";
  const description = initMarkdown
    ? "Edit a Event Content"
    : "Add a Event Content";
  const toastMessage = initMarkdown
    ? "Event Content updated"
    : "Event Content created";
  const action = initMarkdown ? "Save Changes" : "Create";

  const onSubmit = async () => {
    try {
      const currentContent = editorRef?.current?.getMarkdown();
      console.log(currentContent);
      if (initMarkdown) {
        await axios.patch(`/api/events/${params.eventId}/content`, {
          content: currentContent,
          eventId: params.eventId,
        });
      } else {
        await axios.post(`/api/events/${params.eventId}/content`, {
          content: currentContent,
          eventId: params.eventId,
        });
      }

      router.refresh();
      router.push(`/events`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
    }
  };

  return (
    <>
      <LoadingScreen ref={loadingScreenRef} />
      <Heading title={title} description={description} />
      <Separator />
      <div className="editor flex-1">
        <Button onClick={onSubmit}>{action}</Button>
        <MDXEditor
          contentEditableClassName="prose"
          markdown={initMarkdown}
          plugins={[
            listsPlugin(),
            quotePlugin(),
            headingsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin({ imageUploadHandler }),
            tablePlugin(),
            thematicBreakPlugin(),
            frontmatterPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                css: "CSS",
                txt: "text",
                tsx: "TypeScript",
              },
            }),
            diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <InsertTable />
                  <BlockTypeSelect />
                  <InsertThematicBreak />
                  <InsertImage />
                  <ListsToggle />
                  <CreateLink />
                  <InsertCodeBlock />
                </>
              ),
            }),
          ]}
          ref={editorRef}
        />
      </div>
    </>
  );
};

export default Editor;
