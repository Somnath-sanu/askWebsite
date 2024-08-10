import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) =>
    decodeURIComponent(component)
  );

  try {
    new URL(decodedComponents.join("/"));

    return decodedComponents.join("/");
  } catch {
    return false;
  }

  //return decodedComponents.join("/");
}

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl({ url: params.url as string[] });
  if (reconstructedUrl === false) {
    notFound();
  }

  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(
    /\//g,
    ""
  );

  const isAlreadyIndexed = await redis.sismember(
    "indexed-urls",
    reconstructedUrl
  );

  const initialMessages = await ragChat.history.getMessages({
    amount: 30,
    sessionId,
  });

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    });

    await redis.sadd("indexed-urls", reconstructedUrl);
  }

  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  );
};

export default Page;

/**
 * console.log({reconstructedUrl});//'https:/en.wikipedia.org/wiki/Wikipedia:Random'

  console.log(params);

   * {
     url: [ 'https%3A', 'en.wikipedia.org', 'wiki', 'Wikipedia%3ARandom' ]
    } 
   
*/
