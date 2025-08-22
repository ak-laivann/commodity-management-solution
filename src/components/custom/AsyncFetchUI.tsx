import React from "react";
import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface AsyncUIWrapperProps {
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
  error: Error | null;
}

export const AsyncUIWrapper: React.FC<AsyncUIWrapperProps> = ({
  isLoading,
  isError,
  children,
  error,
}) => {
  if (isLoading) return <Skeleton className="h-8 w-[250px]" />;
  if (isError)
    return (
      <Alert variant="destructive">
        <Terminal />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>{error?.message}</AlertDescription>
      </Alert>
    );
  return <>{children}</>;
};
