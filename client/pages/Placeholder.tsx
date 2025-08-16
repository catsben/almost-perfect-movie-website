interface PlaceholderProps {
  title: string;
}

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">
          This page is under development. Continue prompting to have the content
          built out!
        </p>
        <div className="bg-card border border-border rounded-lg p-4 text-sm text-muted-foreground">
          Ask me to implement the {title.toLowerCase()} functionality and I'll
          build it for you.
        </div>
      </div>
    </div>
  );
}
