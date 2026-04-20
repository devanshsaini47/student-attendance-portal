const SkeletonCard = ({ className = '', width = '100%', height = '120px' }) => {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div
        className="w-full h-full"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }}
      />
    </div>
  );
};

export default SkeletonCard;
