function SectionHeader({ icon, title }) {
  return (
    <div className="flex gap-3 border-b border-stone-200 p-6">
      <img src={icon} alt={title} />
      <h4>{title}</h4>
    </div>
  );
}

export default SectionHeader;
