"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Users, Zap } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-16 lg:py-24 max-w-6xl mx-auto">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-4">
            Organize anything,{" "}
            <span className="text-amber-600">together</span>
          </h1>
          <p className="text-lg text-stone-600 mb-8 leading-relaxed">
            Trellnode brings all your tasks, teammates, and tools together in one
            place. Keep work visible, stay in sync, and get more done.
          </p>
          <Button asChild size="lg" className="text-base px-8 h-12 rounded-lg">
            <Link href="/signin">Get started — it&apos;s free</Link>
          </Button>
          <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-stone-500">
            <span className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-amber-500" />
              Boards & lists
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              Collaborate
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Ship faster
            </span>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-stone-200/50 ring-1 ring-stone-200/80">
            <Image
              src="/images/TrelloUICollage_4x.webp"
              width={560}
              height={420}
              alt="Trellnode boards and cards"
              className="object-cover"
              priority
            />
          </div>
          <div
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-amber-200/30 to-stone-200/20 blur-2xl"
            aria-hidden
          />
        </div>
      </section>
    </div>
  );
}
