"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

export function ToasterProvider({ children }: React.PropsWithChildren) {
  return <SnackbarProvider maxSnack={2}>{children}</SnackbarProvider>;
}
