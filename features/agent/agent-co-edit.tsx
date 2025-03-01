"use client";

//import ModelMiniCard from "@/components/card/model-mini-card";
//import FileUploader from "@/components/media/file-uploader";
//import ModelSelectorModal from "@/components/modal/model-selector-modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
//import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { slugifyName } from "@/utils/slug.util";
import { Agent } from "@edenlabs/eden-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Edit2Icon, BrainCircuit, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useDuckTokenGating } from "@/features/chat/hooks/useDuckTokenGating";
import { useAuth } from "@/contexts/auth-context";

export const agentSchema = z.object({
  name: z.string().min(1).max(42),
  key: z
    .string()
    .min(1)
    .max(42)
    .regex(/^[a-z0-9_]+(?:-[a-z0-9_]+)*$/, {
      message:
        "Key must only contain lowercase letters, numbers, underscores and dashes.",
    }),
  image: z.string().optional(),
  description: z.string().min(1).max(10000),
  instructions: z.string().min(1).max(10000),
  discordId: z.string().optional(),
  modelId: z.string().optional(),
});

type AgentFormDto = z.infer<typeof agentSchema>;

type AgentSheetProps = {
  mode: "create" | "update";
  agent?: Agent;
  onAction: () => Promise<void>;
};

function CharacterCount({ current, max }: { current: number; max: number }) {
  return (
    <div className="ml-auto text-xs text-muted-foreground flex-shrink-0 text-right">
      {current}/{max} chars
    </div>
  );
}

const AgentCoEdit = ({ mode, agent, onAction }: AgentSheetProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasEditParam = searchParams.get("edit");
  const [isOpen, setIsOpen] = useState(
    hasEditParam !== null ? hasEditParam === "true" : false
  );
  const [isManualKeyEdit, setIsManualKeyEdit] = useState(false);
  const isUpdateMode = hasEditParam || mode === "update";
  console.log("Agent details from co editor", agent);

  const form = useForm<AgentFormDto>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: agent?.name,
      key: agent?.username || "",
      image: agent?.userImage,
      description: agent?.description || "",
      instructions: agent?.instructions || "",
      discordId: agent?.discordId ?? "",
      modelId: agent?.model,
    },
  });

  useEffect(() => {
    if (isUpdateMode && agent) {
      form.reset({
        key: agent.username ?? "",
        description: agent.description ?? "",
        instructions: agent.instructions ?? "",
      });
    }
  }, [agent, isUpdateMode, form]);

  const oldDescription = agent?.description || "";
  const oldInstructions = agent?.instructions || "";
  const newDescription = form.watch("description");
  const newInstructions = form.watch("instructions");

  //Custom hook to determine how many characters have changed
  const { totalEdits, canEdit, userBalance } = useDuckTokenGating({
    oldDescription,
    newDescription,
    oldInstructions,
    newInstructions,
  });

  const handleSubmit = async (data: AgentFormDto) => {
    // If user does not have enough tokens to cover edits, do not submit.
    if (!canEdit) {
      toast.error("Insufficient Duck Tokens", {
        description:
          "You don’t have enough Duck tokens to cover these edits. Please buy more.",
        dismissible: true,
      });
      return;
    }

    try {
      if (isUpdateMode) {
        await axios.patch(`/api/agents/${agent?._id}`, data);
        toast.success("Agent updated successfully", {
          description: `"${data.name}" has been updated successfully`,
          richColors: true,
          dismissible: true,
        });
      } else {
        await axios.post("/api/agents", data);
        toast.success("Agent created successfully", {
          description: `"${data.name}" has been created successfully`,
          richColors: true,
          dismissible: true,
        });
      }
      onOpenChange(false);
      await onAction();
    } catch (error) {
      toast.error(
        `${isUpdateMode ? "Agent update" : "Agent creation"} failed`,
        {
          description:
            ((error as AxiosError)?.response?.data as { message?: string })
              ?.message || "Unknown Error has occurred",
          richColors: true,
          dismissible: true,
        }
      );
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    // If there's an edit param in the querystring, remove it upon closing
    if (hasEditParam && !open) {
      router.replace(`/agents/${agent?.username}`);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size={isUpdateMode ? "icon" : "default"}
          className={isUpdateMode ? "" : "gap-x-2"}
        >
          {isUpdateMode ? (
            <BrainCircuit className="size-4" />
          ) : (
            <>
              <BrainCircuit className="size-4" />
              <div className="text-sm font-semibold">Duck Logic</div>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto w-96 sm:!max-w-xl">
        <SheetHeader>
          <SheetTitle>
            <div className="flex">
              <BrainCircuit className="size-5 mt-1 mr-1" />
              {isUpdateMode ? "Duck Logic" : "Create an Agent"}
            </div>
          </SheetTitle>
          <SheetDescription>
            {isUpdateMode
              ? "Tinker with the gears! Edit the Duck’s behavior."
              : "Create an agent to help you with your tasks."}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            className="w-full space-y-4 py-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Abraham is a helpful agent"
                      {...field}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <CharacterCount
                    current={field.value?.length || 0}
                    max={10000}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Instructions Field */}
            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem className="p-2 bg-secondary rounded-lg">
                  <FormLabel>Instructions*</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Instruct your agent how to act"
                      className="h-32 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <CharacterCount
                    current={field.value?.length || 0}
                    max={10000}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Show the Duck tokens gating info */}
            <div className="p-1 rounded-lg border  border-white text-sm mb-4">
              <div className="p-2 rounded-lg border border-dashed">
                <p>
                  Your Duck Token Balance: <strong>{userBalance}</strong>
                </p>
                <p>
                  Characters Edited: <strong>{totalEdits}</strong>
                </p>
                {!canEdit && (
                  <div className="mt-2">
                    <p className="text-red-500 mb-2">
                      Not enough tokens to cover these edits.
                    </p>

                    <Button
                      variant="outline"
                      className="w-full border border-white"
                    >
                      Buy More Duck Tokens
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <SheetFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !canEdit}
                className="w-full"
              >
                {isUpdateMode ? "Update Logic" : "Create Agent"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AgentCoEdit;
