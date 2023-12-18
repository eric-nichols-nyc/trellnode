'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Boardspage = () => {
  const session = useSession();
  if (session && session.status === "unauthenticated") {
    redirect("/");
  }
  console.log("session", session);
  return <div>Boardspage</div>;
};

export default Boardspage;
