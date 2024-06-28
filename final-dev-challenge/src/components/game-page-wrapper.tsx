export const GamePageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full justify-center pt-28">
      <div className="flex w-full px-4 pb-32 pt-0 lg:max-w-7xl lg:pt-4">
        {children}
      </div>
    </div>
  );
};
