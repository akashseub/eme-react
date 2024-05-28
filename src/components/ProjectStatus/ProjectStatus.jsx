function ProjectStatus() {
  return (
    <div className="grid grid-cols-6 gap-4 text-center">
      <div className="border rounded-xl bg-cyan-400 text-white">
        <div className="py-4 px-8">
          <h1 className="text-4xl font-bold">04</h1>
          <p className="text-xl font-semibold">On Hand</p>
        </div>
      </div>

      <div className="border rounded-xl bg-red-400 text-white">
        <div className="py-4 px-8">
          <h1 className="text-4xl font-bold">04</h1>
          <p className="text-xl font-semibold">Pending</p>
        </div>
      </div>

      <div className="border rounded-xl bg-yellow-400 text-white">
        <div className="py-4 px-8">
          <h1 className="text-4xl font-bold">04</h1>
          <p className="text-xl font-semibold">On Process</p>
        </div>
      </div>

      <div className="border rounded-xl bg-green-400 text-white">
        <div className="py-4 px-8">
          <h1 className="text-4xl font-bold">04</h1>
          <p className="text-xl font-semibold">Drawing Complete</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectStatus;
