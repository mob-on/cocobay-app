export default function Moon(props: Record<string, unknown>) {
  return (
    <svg
      width="123"
      height="123"
      viewBox="0 0 123 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="61.5"
        cy="61.5"
        r="61"
        transform="matrix(-1 0 0 1 123 0)"
        fill="#FFDEAC"
        stroke="black"
      />
      <circle
        cx="5.125"
        cy="5.125"
        r="4.625"
        transform="matrix(-1 0 0 1 34.8496 38.2666)"
        fill="#FFCB7E"
        stroke="black"
      />
      <circle
        cx="10.9333"
        cy="10.9333"
        r="10.4333"
        transform="matrix(-1 0 0 1 35.5332 61.5)"
        fill="#FFCB7E"
        stroke="black"
      />
      <circle
        cx="12.9833"
        cy="12.9833"
        r="12.4833"
        transform="matrix(-1 0 0 1 98.4004 12.2998)"
        fill="#FFCB7E"
        stroke="black"
      />
      <circle
        cx="5.46667"
        cy="5.46667"
        r="4.96667"
        transform="matrix(-1 0 0 1 61.5 83.3667)"
        fill="#FFCB7E"
        stroke="black"
      />
    </svg>
  );
}