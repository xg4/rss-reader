"use client";

import dayjs from "dayjs";

export default function Time({
  dateTime,
  className,
}: {
  dateTime: string;
  className?: string;
}) {
  const date = dayjs(dateTime);
  return (
    <time className={className} dateTime={date.toISOString()}>
      {date.format("YYYY-MM-DD HH:mm:ss")}
    </time>
  );
}
