import dompurify from "dompurify";

export function DemoListItemContent({ content }: { content: string }) {
  return (
    <div
      className="mt-[20px]"
      dangerouslySetInnerHTML={{
        __html: dompurify.sanitize(content),
      }}
    ></div>
  );
}
