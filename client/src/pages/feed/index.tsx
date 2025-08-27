import RedditChess from "@/components/RedditChess";
import TwitchChess from "@/components/TwitchChess";
import { SidebarInset } from "@/components/ui/sidebar";


export default function Feed() {
    return (
      <SidebarInset className="flex-grow relative">
        <RedditChess/>
        <TwitchChess/>
      </SidebarInset>
    );
  }