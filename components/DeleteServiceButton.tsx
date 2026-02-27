"use client";

import { useRouter } from "next/navigation";

const DeleteServiceButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/service/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: "red" }}>
      Delete
    </button>
  )
}

export default DeleteServiceButton