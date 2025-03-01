"use client";

import AlertDestructive from "@/components/alert/alert-destructive";
import { AlertDescription } from "@/components/ui/alert";
import { MarkdownText } from "@/components/ui/assistant-ui/markdown-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { MyComposer } from "@/features/chat/components/composer";
import Thread from "@/features/chat/components/thread";
import MyThreadWelcome from "@/features/chat/components/thread-welcome";
import { TaskResultTool } from "@/features/chat/components/tools/task-result-tool";
import { ToolFallback } from "@/features/chat/components/tools/tool-fallback";
import { EdenRuntimeProvider } from "@/features/chat/providers/eden-runtime-provider";
import { useAgentQuery } from "@/hooks/query/use-agent-query";
import { useAuthState } from "@/hooks/use-auth-state";
import { cn } from "@/lib/utils";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useThreadList,
} from "@assistant-ui/react";
import { Agent } from "@edenlabs/eden-sdk";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { EditIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { FC, useEffect } from "react";
import AgentCoEdit from "@/features/agent/agent-co-edit";

const TopLeft: FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
  const threads = useThreadList((m) => m.threads);
  const isLoading = threads && threads[0] === "DEFAULT_THREAD_ID";
  const isNewSelected = useThreadList(
    (t) => t.mainThreadId === "DEFAULT_THREAD_ID"
  );

  return (
    <ThreadListPrimitive.New asChild>
      <Button
        variant="ghost"
        onClick={onItemClick}
        className={cn(
          "flex w-full justify-between px-3 mb-1",
          !isLoading && isNewSelected && "bg-aui-muted"
        )}
      >
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>New Thread</span>
        </div>
        <EditIcon className="size-4" />
      </Button>
    </ThreadListPrimitive.New>
  );
};

// This version of ThreadListItem receives `onItemClick` from props
const ThreadListItem: FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
  return (
    <ThreadListItemPrimitive.Root className="group hover:text-primary data-[active]:bg-muted data-[active]:text-primary font-normal data-[active]:font-medium hover:bg-muted/50 items-center gap-2 rounded-lg transition-all pr-3">
      <ThreadListItemPrimitive.Trigger
        className="flex-grow text-start truncate px-3 py-2 w-full"
        onClick={onItemClick}
      >
        <ThreadListItemPrimitive.Title fallback="Untitled" />
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
};

const MainLeft: FC<{ onItemClick?: () => void }> = React.memo(
  ({ onItemClick }) => {
    const { isSignedIn, verifyAuth } = useAuthState();
    const threads = useThreadList((m) => m.threads);
    const isLoading =
      isSignedIn && threads && threads[0] === "DEFAULT_THREAD_ID";

    return (
      <nav className="flex flex-col items-stretch gap-1 text-sm font-medium overflow-y-auto">
        <div className="mb-1 text-muted-foreground">Recent</div>
        {isLoading ? (
          <>
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
            <Skeleton className="w-full h-9" />
          </>
        ) : (
          <>
            {isSignedIn ? (
              <ThreadListPrimitive.Items
                components={{
                  ThreadListItem: (props) => (
                    <ThreadListItem {...props} onItemClick={onItemClick} />
                  ),
                }}
              />
            ) : (
              <Button
                className="text-muted-foreground text-center"
                variant="link"
                onClick={verifyAuth}
              >
                Not signed in
              </Button>
            )}
          </>
        )}
      </nav>
    );
  }
);

const LeftBarSheet: FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleCloseSheet = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="shrink-0 md:hidden gap-2">
          View Threads
          <ChatBubbleIcon className="size-4" />
          <span className="sr-only">Toggle thread list menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col max-h-full">
        <SheetTitle className="sr-only">Thread List</SheetTitle>
        <div className="mt-6 flex flex-col gap-1 max-h-full">
          <TopLeft onItemClick={handleCloseSheet} />
          <Separator orientation="horizontal" className="my-2" />
          <MainLeft onItemClick={handleCloseSheet} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const AgentLink: FC<{ agent?: Agent; className?: string }> = ({
  agent,
  className,
}) => {
  return (
    <Link
      className="w-fit md:ml-0 flex self-start items-center gap-2 text-sm text-muted-foreground hover:text-accent-foreground"
      title="View Agent profile"
      href={`/agents/${agent?.username}`}
    >
      <Avatar
        className={cn(
          "w-6 h-6 md:w-8 md:h-8 col-start-1 row-span-full row-start-1",
          className
        )}
      >
        <AvatarImage
          className={"object-cover"}
          src={
            "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737522933/mechanical_duck_rqoik0.webp"
          }
        />
        <AvatarFallback
          delayMs={250}
          className={cn(["w-6 h-6 md:w-8 md:h-8", className])}
        >
          Duck
        </AvatarFallback>
      </Avatar>
      Duck
    </Link>
  );
};

const Header: FC = () => {
  return (
    <header className="flex gap-2 md:hidden">
      <LeftBarSheet />
    </header>
  );
};

type Props = {
  agentId: string;
  threadId?: string;
};

const DuckChat: FC<Props> = ({ agentId, threadId }) => {
  const { agent, isError, error } = useAgentQuery({
    key: agentId,
    enabled: !!agentId,
  });

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <EdenRuntimeProvider agentId={agentId} threadId={threadId}>
      <div
        // On mobile: 2 rows (header + content).
        // On md+: 2 columns (sidebar + content).
        className="
        grid
        h-[calc(100dvh_-_64px)]
        w-full
        grid-rows-[auto_1fr]
        md:grid-rows-1
        md:grid-cols-[250px_1fr]
      "
      >
        {/* MOBILE-ONLY HEADER */}
        <div className="bg-muted/40 border-b px-3 py-2 md:hidden flex items-center gap-2">
          <Header />
          <AgentCoEdit
            mode={"update"}
            agent={agent}
            onAction={function (): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
          <div className="ml-auto">
            <AgentLink agent={agent} />
          </div>
        </div>

        {/* DESKTOP-ONLY SIDEBAR */}
        <aside className="hidden bg-muted/40 border-r px-3 py-2 md:flex md:flex-col">
          <div className="flex ml-2">
            <div className="mt-1">
              <AgentLink agent={agent} />
            </div>
            <div className="ml-auto">
              <AgentCoEdit
                mode={"update"}
                agent={agent}
                onAction={function (): Promise<void> {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>
          <Separator orientation="horizontal" className="my-2 mb-1" />

          <div className="border-b mb-2">
            <TopLeft />
          </div>
          <MainLeft />
        </aside>

        {/* MAIN CONTENT (occupies the entire space on mobile, column 2 on md) */}
        <main className="bg-background overflow-hidden">
          <Thread
            components={{
              ThreadWelcome: MyThreadWelcome,
              Composer: MyComposer,
            }}
            welcome={{
              suggestions: [
                {
                  text: "a movie poster about jurassic park",
                  prompt:
                    'Make a dramatic movie poster for "Jurassic Park," featuring a massive, menacing T-Rex looming over a lush, prehistoric jungle with the iconic park gates in the background, and a stormy sky.',
                },
                {
                  text: "a meme about today's news",
                  prompt:
                    'Make an image of a memo titled "Today\'s News" on a desk, with handwritten headlines, a coffee cup, pen, and a laptop in the background, capturing a productive and organized vibe.',
                },
                {
                  text: "an advertisement for a duck party",
                  prompt:
                    'Make an advertisement for a lively "Duck Party" featuring colorful ducks in party hats, balloons, and streamers, with a pond setting and festive decorations.',
                },
              ],
              message: "What do you want to create today?",
            }}
            assistantAvatar={{
              src: "https://res.cloudinary.com/dqnbi6ctf/image/upload/v1737522933/mechanical_duck_rqoik0.webp",
              fallback: "Duck",
              alt: "Duck",
            }}
            assistantMessage={{
              allowReload: false,
              allowSpeak: false,
              components: {
                Text: MarkdownText,
                ToolFallback,
              },
            }}
            userMessage={{
              allowEdit: false,
            }}
            branchPicker={{
              allowBranchPicker: false,
            }}
            composer={{
              allowAttachments: true,
            }}
            tools={[TaskResultTool]}
          />

          {isError ? (
            <div className="p-4">
              <AlertDestructive title={"Error loading agent"}>
                <AlertDescription>{error?.message}</AlertDescription>
              </AlertDestructive>
            </div>
          ) : null}
        </main>
      </div>
    </EdenRuntimeProvider>
  );
};

export default DuckChat;
