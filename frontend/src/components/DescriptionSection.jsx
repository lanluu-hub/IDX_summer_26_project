const DescriptionSection = ({ remark }) => {
  return (
    <section className="container">
      <h2>About This Property</h2>
      {remark && (
        <div>
          <p>{remark}</p>
        </div>
      )}
    </section>
  );
};

export default DescriptionSection;
