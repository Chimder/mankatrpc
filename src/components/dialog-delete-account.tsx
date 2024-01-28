import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { userControllerDeleteAccount } from "@/shared/Api/generated";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

export function DialogDemo({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();

  console.log(session);
  const {
    mutate: DeleteUser,
    isSuccess,
    isPending,
  } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: () =>
      userControllerDeleteAccount({ email: session?.user?.email as string }),
    onSuccess: () => signOut(),
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="z-1000 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to irrevocably delete the account
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {isSuccess ? (
            <Button className="bg-green-600 text-white" type="submit">
              Success
            </Button>
          ) : (
            <>
              <Button
                onClick={() => DeleteUser()}
                className="text-white"
                type="submit"
              >
                Delete
                {isPending && (
                  <ReloadIcon className="ml-1 h-4 w-4 animate-spin" />
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
