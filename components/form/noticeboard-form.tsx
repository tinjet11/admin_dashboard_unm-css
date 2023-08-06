"use client"

import AlertModal from "@/components/alert-modal";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { NoticeBoard } from "@prisma/client";
import axios from "axios";
import { Trash, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod"

const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    buttonText: z.string().min(1),
    link: z.string().min(1),
    isArchived: z.boolean().default(false).optional(),
})

type NoticeBoardFormValues = z.infer<typeof formSchema>

interface NoticeBoardFormProps {
    initialData: NoticeBoard | null;
}



const NoticeBoardForm = ({ initialData }: NoticeBoardFormProps) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit NoticeBoard" : "Add NoticeBoard";
    const description = initialData ? "Edit a NoticeBoard" : "Add a NoticeBoard";
    const toastMessage = initialData ? "NoticeBoard updated" : "NoticeBoard created";
    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<NoticeBoardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: '',
            description: '',
            buttonText: '',
            link: '',
            isArchived: false,
        }
    })

    const onSubmit = async (data: NoticeBoardFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                //initial data exists , update
                await axios.patch(`/api/noticeboards/${params.noticeboardId}`, data)
            } else {
                //initial data doesn't exists , create
                await axios.post(`/api/noticeboards`, data)
            }

            router.refresh();
            router.push(`/noticeboards`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something Went Wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/noticeboards/${params.noticeboardId}`);
            router.refresh();
            router.push(`/noticeboards`)
            toast.success("noticeboard Deleted");
        } catch (error) {
            toast.error("Make sure to removed all product using this noticeboard first");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={() => onDelete()}
                loading={loading}
            />
            <div className="flex items-center justify-between">

                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => setOpen(true)}
                        disabled={loading}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}

                {!initialData && (
                    <Button
                        variant='secondary'
                        size='sm'
                        onClick={() => router.push(`/noticeboards`)}
                        disabled={loading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='noticeboard title' {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='noticeboard description' {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="buttonText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Button Text</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='noticeboard button text' {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Button Action Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='noticeboard button link' {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            // @ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This noticeboard will not appear in anywhere of website
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        disabled={loading}
                        className="ml-auto"
                        type="submit">{action}
                    </Button>
                </form>
            </Form>

        </>

    )
}

export default NoticeBoardForm