"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const StylistToolbar = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`);
  };
  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-4"
    >
      <Input
        placeholder="Search stylist..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        type="submit"
        className="px-4 py-2 border rounded-lg"
      >
        Search
      </button>
    </form>
  )
}

export default StylistToolbar