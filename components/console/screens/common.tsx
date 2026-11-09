export function Hd({ l, r }: { l: React.ReactNode; r?: React.ReactNode }) {
  return (
    <div className="hd">
      <span>{l}</span>
      <span>{r}</span>
    </div>
  );
}

export function Ft({ l, r }: { l: React.ReactNode; r?: React.ReactNode }) {
  return (
    <div className="ft">
      <span>{l}</span>
      <span>{r}</span>
    </div>
  );
}
