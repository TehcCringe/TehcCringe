import Flex from "../components/ui/flex";

export default function DiscordRedirect() {
  return (
    <Flex center grow>
      <meta
        httpEquiv="refresh"
        content="0; url=https://discord.gg/vSwdyDAsUn"
      />
      <h1 className="text-4xl">Redirecting...</h1>
    </Flex>
  );
}
