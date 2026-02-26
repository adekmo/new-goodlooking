"use client";

import { useRouter } from "next/navigation";

interface Props {
    salonId: string;
}

const DeleteSalonButton = ({ salonId}: Props ) => {

    const router = useRouter();

    const handleDelete = async () => {
        const confirmDelete = confirm("Are you sure?");
        if (!confirmDelete) return;

        await fetch(`/api/superadmin/salons/${salonId}`, {
        method: "DELETE",
        });

        router.refresh(); // refresh server component
    };
  return (
    <button
      onClick={handleDelete}
      className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  )
}

export default DeleteSalonButton