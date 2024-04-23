import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";


export default function ChatLoader() {
    return (
        <div className="flex flex-row py-2 space-x-2">
            <Avatar className="bg-gray-100 flex items-center justify-center w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                <AvatarFallback>GX</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
                <Skeleton className="h-3 w-[300px] bg-slate-50"/>
                <Skeleton className="h-3 w-[250px] bg-slate-100"/>
                <Skeleton className="h-3 w-[200px] bg-slate-50"/>
            </div>
        </div>
    );
}