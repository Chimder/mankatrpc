import Link from "next/link";
import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import { ThemeToggle } from "./ui/themeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { DialogDemo } from "./dialog-delete-account";
import { useMutation } from "@tanstack/react-query";
import { userControllerDeleteAccount } from "@/shared/Api/generated";

function AsideBar() {
  const { data: session, status } = useSession();

  console.log(session);
  const { mutate: DeleteUser } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: () =>
      userControllerDeleteAccount({ email: session?.user?.email as string }),
  });

  return (
    <div className="nav_bar_container">
      <nav className="z-100 flex w-full justify-evenly">
        <Link className="flex items-center justify-center" href="/">
          ❄️
        </Link>

        <div className="w-18 -ml-2 flex justify-between rounded-xl bg-background/10 py-1 pl-0 pr-4 backdrop-blur-sm ">
          <Link className="nav_btn" href="/">
            Manga
          </Link>
          <Link
            className="flex items-center justify-end rounded-xl bg-background/20 px-3.5 py-1 hover:bg-background/40"
            href="/manka/search"
          >
            <MagnifyingGlassIcon className="h-6 w-6 fill-current text-white" />
          </Link>
        </div>
        {session?.user && (
          <Link className=" nav_btn group h-10 w-10" href="/favorite">
            <HeartIcon className="h-10 w-10 fill-current text-primary group-hover:hidden" />
            <HeartFilledIcon className="hidden h-10 w-10 fill-current text-primary group-hover:block" />
            <div></div>
          </Link>
        )}

        <div className="nav_icon">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img className="z-999 w-6" src={session?.user?.image!} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col">
                <Button onClick={() => signOut()} className="my-1 text-white">
                  LogOut
                </Button>
                <DialogDemo>
                  <Button className="my-1 bg-red-600 text-white hover:bg-red-600/80">
                    Delete Account
                  </Button>
                </DialogDemo>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div onClick={() => signIn()}>user</div>
          )}
        </div>
        <ThemeToggle />
      </nav>
    </div>
  );
}

export default AsideBar;
