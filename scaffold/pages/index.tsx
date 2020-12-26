import React from "react";

export const outlet = "@/outlets/default.tsx";

export default function Index(props: any) {
  return (
    <div>
      {props.data.urls.map((url: string, i: number) => (
        <div key={i}>
          <a href={url}>{url}</a>
        </div>
      ))}
    </div>
  );
}
