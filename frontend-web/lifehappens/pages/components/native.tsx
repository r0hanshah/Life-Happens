export default function TouchableOpacity({ style, onClick, children }: {style?: React.CSSProperties | string, onClick?: () => void; children: React.ReactNode }) {
  const isStyleObject = typeof style === 'object' && style !== null;

  return (
    <div
      style={isStyleObject ? style : undefined}
      onClick={onClick}
      className={`cursor-pointer transition-opacity hover:opacity-80 active:opacity-60 ${
        !isStyleObject && typeof style === 'string' ? style : ''
      }`}
    >
      {children}
    </div>
  );
}