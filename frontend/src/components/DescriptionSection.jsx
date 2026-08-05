const DescriptionSection = ({ remark }) => {
  return (
    <section className="mb-4">
      <h2 className="h4 mb-3">About This Property</h2>
      {remark ? (
        <p style={{ whiteSpace: "pre-line" }}>{remark}</p>
      ) : (
        <p className="text-muted">No property description available.</p>
      )}
    </section>
  );
};

export default DescriptionSection;
