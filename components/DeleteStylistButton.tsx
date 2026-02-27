"use client";

import { useRouter } from "next/navigation";

const DeleteStylistButton = ({ id }: { id: string }) => {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Delete stylist?")) return;

        const res = await fetch(`/api/admin/stylist/${id}`, {
        method: "DELETE",
        });

        if (res.ok) {
        alert("Deleted!");
        router.refresh(); // refresh data tanpa reload full page
        } else {
        alert("Failed to delete");
        }
    };
  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:underline"
    >
      Delete
    </button>
  )
}

export default DeleteStylistButton