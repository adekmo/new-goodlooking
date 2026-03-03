"use client";

interface Props {
  userId: string;
  salons: { id: string; name: string }[];
}

const PromoteForm = ({ userId, salons }: Props) => {
  return (
    <form
      action="/api/superadmin/promote-admin"
      method="POST"
      className="flex items-center justify-end gap-2"
    >
      <input type="hidden" name="userId" value={userId} />

      <select
        name="salonId"
        required
        className="border rounded-lg px-2 py-1 text-sm"
      >
        <option value="">Select Salon</option>
        {salons.map((salon) => (
          <option key={salon.id} value={salon.id}>
            {salon.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-black text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-800"
      >
        Promote
      </button>
    </form>
  )
}

export default PromoteForm