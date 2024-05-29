const stackStyle = { '--stacks': 3 } as React.CSSProperties;
const spanStyle0 = { '--index': 0 } as React.CSSProperties;
const spanStyle1 = { '--index': 1 } as React.CSSProperties;
const spanStyle2 = { '--index': 2 } as React.CSSProperties;

export default function Home() {
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center">
        <h1 className="text-2xl font-bold font-mono">
          Hello world! From Arweave Philippines! 🇵🇭
        </h1>
      </div>
      <div className="fixed bottom-0 right-0">
        <div className="stack" style={stackStyle}>
          <span style={spanStyle0}>johnshift</span>
          <span style={spanStyle1}>johnshift</span>
          <span style={spanStyle2}>johnshift</span>
        </div>
      </div>
    </>
  );
}
