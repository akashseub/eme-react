const Banner = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="col-span-2 w-3/4 text-center px-auto py-24 space-y-8">
        <h1 className="text-6xl font-bold uppercase text-[#002a3f]">
          Fire Safety Plan
        </h1>
        <p className="text-[#5d6a7d]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa
          possimus voluptatum quae atque error quis quisquam architecto odio
          totam soluta?
        </p>
        <button className="btn btn-primary">Get Quote</button>
        <div className="flex justify-around">
          <div>
            <h4 className="font-extrabold text-4xl text-[#5d6a7d]">32</h4>
            <p>Experience</p>
          </div>
          <div>
            <h4 className="font-extrabold text-4xl text-[#5d6a7d]">50</h4>
            <p>Product</p>
          </div>
          <div>
            <h4 className="font-extrabold text-4xl text-[#5d6a7d]">1000+</h4>
            <p>Project Done</p>
          </div>
        </div>
      </div>
      <div>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeZ5rv0LTwdeyUBwUywY90x49a8zW6Dz4GHmiiOBc686Ys9dA/viewform?embedded=true"
          width="640"
          height="2570"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default Banner;
