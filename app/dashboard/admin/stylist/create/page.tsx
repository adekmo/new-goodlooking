

const CreateStylistPage = () => {
  return (
    <div>
      <h1>Add Stylist</h1>

      <form action="/api/admin/stylist" method="POST">
        <div>
          <label>Name</label>
          <input name="name" required />
        </div>

        <div>
          <label>Specialization</label>
          <input name="specialization" required />
        </div>

        <div>
          <label>Experience (years)</label>
          <input name="experience" type="number" required />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateStylistPage