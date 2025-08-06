import RedditChess from "@/components/RedditChess";
import { SidebarInset } from "@/components/ui/sidebar";


export default function Feed() {
    return (
      <SidebarInset className="flex-grow relative">
        <RedditChess/>
      </SidebarInset>
    );
  }