function Heading({ heading, subHeading }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-3xl md:text-4xl font-semibold">{heading}</h3>
      <p className="text-lg md:text-xl text-stone-600 mt-2 max-w-2xl">
        {subHeading}
      </p>
    </div>
  );
}

export default Heading;
