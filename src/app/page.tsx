import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen justify-center items-center flex-col gap-4">
      <h1 className="font-bold">
        <span className="text-2xl text-red-500">Can&apos;t</span> use this page
        directly!{" "}
        <span className="font-semibold text-sm text-green-300">
          How to use? 👇
        </span>
      </h1>
      <div className="size-96 w-[50vw] h-[calc(100vh - 90vh)]">
        <video src="/AskWebsite.mp4" autoPlay muted loop></video>
      </div>
    </main>
  );
}
